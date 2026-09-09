// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest'

/**
 * THE ENDPOINT, TESTED WITHOUT AMAZON.
 *
 * The mailer is mocked, so nothing here talks to SES, spends quota or needs a
 * credential. What is being protected is the endpoint's own judgement: what it
 * accepts, what it refuses, and — the part that is easy to get wrong later —
 * how little it says while refusing. A form endpoint that explains its
 * rejections is a form endpoint teaching a script how to write an accepted
 * payload.
 *
 * The node environment is declared per file: the rest of the suite runs in
 * jsdom for the components, and `Request`/`Response` belong to the runtime the
 * route actually runs in.
 */
vi.mock('~/core/business/infrastructure/email/leadMailer', () => ({
  sendLead: vi.fn(),
}))
vi.mock('~/core/business/infrastructure/sheets/leadSheet', () => ({
  recordLead: vi.fn(),
}))

const { sendLead } = await import('~/core/business/infrastructure/email/leadMailer')
const { recordLead } = await import('~/core/business/infrastructure/sheets/leadSheet')
const { POST } = await import('./route')

const validLead = {
  name: 'Ana Torres',
  email: 'ana@empresa.co',
  company: 'Transportes del Norte SAS',
  phone: '3001234567',
  message: 'Queremos instalar puntos de carga para la flota.',
  consent: true,
  segment: 'flotas',
  locale: 'es',
}

/* Each test gets its own client address. The throttle is module state shared by
   every test in the file, so a single address would start answering 429 partway
   through the suite for reasons that have nothing to do with what is asserted. */
let seq = 0
const post = (body: unknown) =>
  POST(
    new Request('http://localhost/api/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': `203.0.113.${++seq}`,
      },
      body: typeof body === 'string' ? body : JSON.stringify(body),
    }),
  )

describe('POST /api/leads', () => {
  beforeEach(() => {
    vi.mocked(sendLead).mockReset()
    vi.mocked(recordLead).mockReset()
  })

  it('accepts a complete lead and hands it to both destinations', async () => {
    const response = await post(validLead)

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ ok: true })
    expect(recordLead).toHaveBeenCalledWith(expect.objectContaining(validLead))
    expect(sendLead).toHaveBeenCalledWith(expect.objectContaining(validLead))
  })

  it('never lets the honeypot reach either destination', async () => {
    await post({ ...validLead, website: 'http://spam.example' })

    expect(recordLead).not.toHaveBeenCalled()
    expect(sendLead).not.toHaveBeenCalled()
  })

  it('writes the row BEFORE sending, so an SES outage still leaves a record', async () => {
    const order: string[] = []
    vi.mocked(recordLead).mockImplementation(async () => void order.push('sheet'))
    vi.mocked(sendLead).mockImplementation(async () => void order.push('mail'))

    await post(validLead)

    expect(order).toEqual(['sheet', 'mail'])
  })

  it('still sends, and still succeeds, when the spreadsheet refuses', async () => {
    vi.mocked(recordLead).mockRejectedValueOnce(new Error('sheet not shared'))
    const logged = vi.spyOn(console, 'error').mockImplementation(() => {})

    const response = await post(validLead)

    /* A missing row is invisible to the person and nothing they could act on.
       The mail is what decides. */
    expect(response.status).toBe(200)
    expect(sendLead).toHaveBeenCalled()
    expect(logged).toHaveBeenCalled()

    logged.mockRestore()
  })

  it('refuses a lead without consent, because consent is what makes it lawful', async () => {
    const response = await post({ ...validLead, consent: false })

    expect(response.status).toBe(400)
    expect(sendLead).not.toHaveBeenCalled()
  })

  it.each([
    ['a malformed email', { ...validLead, email: 'no-es-un-correo' }],
    ['a missing company', { ...validLead, company: '' }],
    ['a message past the cap', { ...validLead, message: 'x'.repeat(4001) }],
    ['no segment', { ...validLead, segment: '' }],
    ['a language that is not one of ours', { ...validLead, locale: 'fr' }],
  ])('refuses %s without saying why', async (_case, body) => {
    const response = await post(body)

    expect(response.status).toBe(400)
    /* The body is bare on purpose: no field names, no reasons. */
    await expect(response.json()).resolves.toEqual({ ok: false })
    expect(sendLead).not.toHaveBeenCalled()
  })

  it('refuses a body that is not JSON at all', async () => {
    const response = await post('{ not json')

    expect(response.status).toBe(400)
    expect(sendLead).not.toHaveBeenCalled()
  })

  it('swallows a filled honeypot and answers as if it had worked', async () => {
    const response = await post({ ...validLead, website: 'http://spam.example' })

    /* 200, deliberately. Telling a bot it was caught is telling it what to
       change; nothing was sent. */
    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ ok: true })
    expect(sendLead).not.toHaveBeenCalled()
  })

  it('reports a delivery failure instead of claiming success', async () => {
    vi.mocked(sendLead).mockRejectedValueOnce(new Error('SES is down'))
    const logged = vi.spyOn(console, 'error').mockImplementation(() => {})

    const response = await post(validLead)

    expect(response.status).toBe(502)
    await expect(response.json()).resolves.toEqual({ ok: false })
    /* The reason stays out of the response and goes to the log, where it is
       the only way to tell a missing variable from a rejected SES identity. */
    expect(logged).toHaveBeenCalled()

    logged.mockRestore()
  })

  it('throttles a client that floods it', async () => {
    const flood = () =>
      POST(
        new Request('http://localhost/api/leads', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-forwarded-for': '198.51.100.7',
          },
          body: JSON.stringify(validLead),
        }),
      )

    const statuses: number[] = []
    for (let i = 0; i < 7; i++) statuses.push((await flood()).status)

    expect(statuses.filter((s) => s === 200)).toHaveLength(5)
    expect(statuses.filter((s) => s === 429)).toHaveLength(2)
  })
})
