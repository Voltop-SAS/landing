import { createLeadSchema } from '~/core/business/domain/entities/Lead'
import { sendLead } from '~/core/business/infrastructure/email/leadMailer'
import { recordLead } from '~/core/business/infrastructure/sheets/leadSheet'
import { z } from 'zod'
import { locales } from '~/core/common/domain/i18n/config'

/**
 * THE LEAD FORM'S ENDPOINT.
 *
 * The site was built to be fully static, and for a while that was taken to
 * mean there was no server to post to. There is: `next.config.ts` sets
 * `output: 'standalone'` and the container runs `node server.js`, so a route
 * handler works in production exactly as it does in development. Every page
 * stays statically rendered; this is the one dynamic thing in the deployment.
 *
 * A lead has TWO destinations: a row in the commercial spreadsheet, and mail to
 * the three people who answer it. Only the second decides whether the visitor is
 * told it worked — a row nobody is watching is not a request that reached
 * anyone — but the row is written first, so that a provider outage costs at most
 * one of the two.
 *
 * It answers with a bare `{ ok }` and never with the reason. A form endpoint
 * that explains why it rejected a payload is a form endpoint teaching a script
 * how to write an accepted one, and there is nothing for a person to read here:
 * the browser validated first, with the same rules and in their language.
 */

/* Nobody reads these. The browser rejects bad input first and says why, in the
   visitor's language, so anything failing HERE is a bot or a tampered request. */
const serverMessages = {
  name: 'invalid name',
  email: 'invalid email',
  company: 'invalid company',
  consent: 'consent required',
  tooLong: 'too long',
}

const submissionSchema = createLeadSchema(serverMessages).extend({
  segment: z.string().trim().min(1).max(60),
  /* Checked against the real list rather than accepted as a string: it is
     written into a column the commercial team reads, and a typo there is a
     reply in the wrong language. */
  locale: z.enum(locales),
  /* HONEYPOT. The form renders a field no human ever sees, and a bot that
     fills every input it finds fills this one too. Cheap, silent, and it costs
     a real visitor nothing. The name is deliberately boring so it looks worth
     filling in.
     
     IT MUST PARSE, and the cap here is only a bound on the length. Rejecting a
     non-empty value in the schema was the first version and it was wrong: a
     filled honeypot came back 400, which is a machine-readable "caught you"
     that tells the bot precisely which field to leave alone next time. Whether
     it was filled is a decision for the handler, which answers 200 and sends
     nothing. */
  website: z.string().max(200).optional(),
})

/**
 * Throttle, per process and in memory.
 *
 * BE CLEAR ABOUT WHAT THIS IS NOT: the deployment runs several replicas and
 * each one keeps its own map, so the real ceiling is this number times the
 * number of pods, and a restart forgets everything. It exists to stop the
 * trivial loop, not a distributed one. A real limit belongs at the ingress or
 * in shared storage, and this comment is here so the next person does not
 * mistake this for one.
 */
const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 5
const hits = new Map<string, number[]>()

function isRateLimited(key: string): boolean {
  const now = Date.now()
  const recent = (hits.get(key) ?? []).filter((at) => now - at < WINDOW_MS)
  recent.push(now)
  hits.set(key, recent)

  /* The map would otherwise grow with every distinct address the process ever
     saw, which in a long-lived pod is a slow leak. */
  if (hits.size > 5000) {
    for (const [ip, times] of hits) {
      if (times.every((at) => now - at >= WINDOW_MS)) hits.delete(ip)
    }
  }

  return recent.length > MAX_PER_WINDOW
}

function clientKey(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  return forwarded?.split(',')[0]?.trim() || 'unknown'
}

export async function POST(request: Request): Promise<Response> {
  if (isRateLimited(clientKey(request))) {
    return Response.json({ ok: false }, { status: 429 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ ok: false }, { status: 400 })
  }

  const parsed = submissionSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ ok: false }, { status: 400 })
  }

  /* The honeypot answers 200. Telling a bot it was caught is telling it what to
     change; as far as it can see, the submission worked. */
  if (parsed.data.website) {
    return Response.json({ ok: true })
  }

  const lead = { ...parsed.data }
  delete lead.website

  /**
   * THE SPREADSHEET FIRST, AND ITS FAILURE IS NOT THE VISITOR'S PROBLEM.
   *
   * The order is the whole point. If Google is unavailable the lead still
   * reaches three inboxes, and if SES is unavailable the lead is still written
   * down and recoverable — one bad afternoon at one provider stops costing a
   * lead. Reversing this would mean an SES outage loses the submission
   * entirely, which is the failure that actually costs money.
   *
   * A missing row is invisible to the person who submitted it and nothing they
   * could act on, so it is logged and swallowed. It is deliberately NOT part of
   * what the endpoint reports as success.
   */
  try {
    await recordLead(lead)
  } catch (error) {
    console.error('[leads] spreadsheet append failed; the lead was not recorded', error)
  }

  try {
    await sendLead(lead)
  } catch (error) {
    /* This is the one failure a person needs to hear about, because their
       request did not reach anyone. It is logged in full — a missing variable
       and a rejected SES identity look identical from the browser — and the
       response stays bare. */
    console.error('[leads] SES delivery failed', error)
    return Response.json({ ok: false }, { status: 502 })
  }

  return Response.json({ ok: true })
}
