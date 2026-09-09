// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { LeadSubmission } from '~/core/business/domain/entities/Lead'

/**
 * WHAT A FAILURE SAYS, which is the only thing tested here.
 *
 * Sending is not: that needs Amazon, and it was verified against the real
 * account by hand. What a test can protect is the message, and the message is
 * worth protecting because the one the SDK produces —
 * `Could not load credentials from any providers` — says nothing about which
 * knob is missing. Whoever reads that log at 9pm needs the variable names, not
 * an account of the SDK's search.
 */
const credentialsError = () => {
  const error = new Error('Could not load credentials from any providers')
  error.name = 'CredentialsProviderError'
  return error
}

let thrown: Error = credentialsError()

vi.mock('@aws-sdk/client-sesv2', () => ({
  SESv2Client: class {
    async send(): Promise<never> {
      throw thrown
    }
  },
  SendEmailCommand: class {
    constructor(public readonly input: unknown) {}
  },
}))

const lead: LeadSubmission = {
  name: 'Ana Torres',
  email: 'ana@empresa.co',
  company: 'Transportes del Norte SAS',
  consent: true,
  segment: 'flotas',
  locale: 'es',
}

/**
 * Runs the send and hands back the error.
 *
 * It throws if the call RESOLVES, which is not ceremony: a `.catch()` that
 * returns the error types as `Error | void`, and a test that silently receives
 * `undefined` would assert nothing at all while still passing.
 */
async function failureOf(run: () => Promise<void>): Promise<Error> {
  try {
    await run()
  } catch (error) {
    return error as Error
  }

  throw new Error('sendLead resolved, but this test needs it to fail')
}

const ORIGINAL = { ...process.env }

beforeEach(() => {
  vi.resetModules()
  thrown = credentialsError()
})

afterEach(() => {
  process.env = { ...ORIGINAL }
})

describe('sendLead · what it says when it fails', () => {
  it('names the missing variables when there are no credentials at all', async () => {
    delete process.env.AWS_ACCESS_KEY_ID_SES
    delete process.env.AWS_SECRET_ACCESS_KEY_SES

    const { sendLead } = await import('./leadMailer')
    const error = await failureOf(() => sendLead(lead))

    expect(error.message).toContain('AWS_ACCESS_KEY_ID_SES')
    expect(error.message).toContain('AWS_SECRET_ACCESS_KEY_SES')
    /* And it says where this is normal, so the reader does not have to already
       know that both deployed environments are wired the same way. */
    expect(error.message).toMatch(/misconfiguration/i)
    /* The original is kept as the cause rather than discarded. */
    expect((error.cause as Error)?.name).toBe('CredentialsProviderError')
  })

  it('does not blame the variables when they ARE set', async () => {
    process.env.AWS_ACCESS_KEY_ID_SES = 'AKIAEXAMPLE'
    process.env.AWS_SECRET_ACCESS_KEY_SES = 'secret'

    const { sendLead } = await import('./leadMailer')
    const error = await failureOf(() => sendLead(lead))

    /* Credentials that exist and are refused are a different problem — a
       revoked key, a clock skew — and pointing at the variables would send the
       reader to the one place that is fine. */
    expect(error.message).not.toContain('AWS_ACCESS_KEY_ID_SES')
    expect(error.name).toBe('CredentialsProviderError')
  })

  it('passes an unrelated SES rejection through untouched', async () => {
    delete process.env.AWS_ACCESS_KEY_ID_SES
    thrown = Object.assign(new Error('Email address is not verified'), {
      name: 'MessageRejected',
    })

    const { sendLead } = await import('./leadMailer')
    const error = await failureOf(() => sendLead(lead))

    expect(error.message).toBe('Email address is not verified')
  })
})
