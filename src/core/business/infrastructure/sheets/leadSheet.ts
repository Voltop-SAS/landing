import { JWT } from 'google-auth-library'
import type { LeadSubmission } from '~/core/business/domain/entities/Lead'
import { leadSheetTarget } from './leadSheetTarget'

/**
 * THE LEAD, WRITTEN INTO A GOOGLE SHEET.
 *
 * The mail is what reaches a person; this is the record that survives them. It
 * exists so the commercial team has the history in one place instead of
 * scattered across three inboxes, and so a lead is not lost the day SES is
 * having a bad afternoon — which is why the route handler writes here FIRST and
 * sends afterwards.
 *
 * ── WHY NOT THE `googleapis` PACKAGE ──────────────────────────────────────
 * Because it is 213 MB unpacked, roughly five times the entire production
 * image, which is 43 MB and got there on purpose (see the standalone note in
 * `next.config.ts`). The only genuinely hard part of talking to Google is
 * signing the assertion that gets an access token, and `google-auth-library` —
 * 600 KB — does exactly that. The append itself is one ordinary HTTP call.
 *
 * That is the same reasoning the sibling project used to justify the OPPOSITE
 * choice for SES: there, the hard part is SigV4, a signature you cannot verify
 * without credentials and that fails as an opaque 403, so the SDK earns its
 * weight. Here it does not.
 */

const SHEETS_SCOPE = 'https://www.googleapis.com/auth/spreadsheets'

type ServiceAccountKey = {
  client_email: string
  private_key: string
}

/**
 * The key arrives either as the JSON Google hands out, or as that JSON in
 * base64. BOTH ARE ACCEPTED ON PURPOSE.
 *
 * A service account key is multi-line and full of quotes and backslashes, and
 * it reaches the container as a Docker build argument. Multi-line build args
 * survive the trip, but only if every layer between Doppler and `docker build`
 * quotes them correctly, and the failure when one does not is a private key
 * truncated at the first newline — which fails later, at `invalid_grant`, far
 * from the cause. Base64 is one line and cannot be mangled, so it is the
 * recommended form; raw JSON keeps working for a laptop where someone pasted
 * the file straight into `.env.local`.
 */
function decode(raw: string): string {
  const trimmed = raw.trim()
  if (trimmed.startsWith('{')) return trimmed

  return Buffer.from(trimmed, 'base64').toString('utf8')
}

let auth: JWT | null = null

/**
 * The credentials, or nothing.
 *
 * Returning `null` instead of throwing is what makes an unconfigured
 * deployment — a laptop, a preview — behave sensibly: the form still sends its
 * mail, and the row is simply not written. The one thing it must never do is
 * take the whole submission down with it, which is what a missing spreadsheet
 * would deserve least: the lead already arrived.
 */
function getAuth(): JWT | null {
  if (auth) return auth

  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_KEY
  if (!raw) return null

  let key: ServiceAccountKey
  try {
    key = JSON.parse(decode(raw)) as ServiceAccountKey
  } catch {
    console.error('[leads] GOOGLE_SERVICE_ACCOUNT_KEY is set but is not valid JSON')
    return null
  }

  if (!key.client_email || !key.private_key) {
    console.error('[leads] GOOGLE_SERVICE_ACCOUNT_KEY has no client_email or private_key')
    return null
  }

  auth = new JWT({
    email: key.client_email,
    /* A key that travelled through a secret store often arrives with its
       newlines escaped one time too many. Real newlines are what the signer
       needs, and the difference shows up only as an unhelpful `invalid_grant`. */
    key: key.private_key.replace(/\\n/g, '\n'),
    scopes: [SHEETS_SCOPE],
  })

  return auth
}

/** Whether this deployment can write at all. */
export function isSheetConfigured(): boolean {
  return getAuth() !== null
}

/**
 * The row, in the order the columns are declared in `leadSheetTarget.range`.
 *
 * The timestamp is ISO 8601 and in UTC, which sorts correctly as plain text and
 * does not depend on which timezone the server happened to be in.
 */
function buildRow(lead: LeadSubmission): string[] {
  return [
    new Date().toISOString(),
    lead.name,
    lead.email,
    lead.company,
    lead.phone ?? '',
    lead.segment,
    lead.message ?? '',
    lead.locale,
  ]
}

/**
 * Appends the lead. Throws if Google refuses; the caller decides how much that
 * matters, and the answer is "not enough to fail the submission".
 */
export async function recordLead(lead: LeadSubmission): Promise<void> {
  const client = getAuth()
  if (!client) return

  const token = await client.getAccessToken()
  if (!token.token) throw new Error('Google returned no access token')

  const { spreadsheetId, range } = leadSheetTarget
  const url =
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}` +
    `/values/${encodeURIComponent(range)}:append` +
    /* RAW, NOT `USER_ENTERED`, and this is a security choice rather than a
       formatting one. `USER_ENTERED` makes Sheets interpret what it is given the
       way it would interpret typing: a message beginning with `=` becomes a
       formula, and a formula in a spreadsheet a colleague opens is code someone
       on the internet wrote. Everything here is text and is stored as text. */
    `?valueInputOption=RAW&insertDataOption=INSERT_ROWS`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ values: [buildRow(lead)] }),
  })

  if (!response.ok) {
    /* The body is read because Google puts the actual cause there, and the two
       that really happen look identical from the status code: the Sheets API
       not enabled on the project, and the document simply never shared with the
       service account. The second is the one everybody hits. */
    const detail = await response.text().catch(() => '')
    throw new Error(`Sheets append failed with ${response.status}: ${detail.slice(0, 500)}`)
  }
}
