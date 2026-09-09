import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2'
import type { LeadSubmission } from '~/core/business/domain/entities/Lead'
import { leadDelivery } from './leadDelivery'

/**
 * DELIVERY OF A LEAD, OVER AMAZON SES.
 *
 * This module is the whole of what "sending" means, and it is the only file
 * that knows Amazon exists. It replaced a `mailto:` that opened the visitor's
 * mail client and hoped they would press send — a step a good share of them
 * never took, and one nobody could measure, because assigning `location.href`
 * to a `mailto:` reports neither success nor failure.
 *
 * THE CREDENTIALS ARE IAM, NOT SMTP, so this talks to the SES v2 API rather
 * than to an SMTP server. That is not interchangeable: SMTP would need a
 * different pair of credentials generated specifically for it. The pair is
 * scoped to SES alone rather than being a general-purpose AWS user, which is
 * what keeps the blast radius small given that it ships inside the image.
 *
 * WHY THE RECIPIENTS NO LONGER LIVE IN `domain/consts/links.ts`: they used to,
 * because the browser had to build the `mailto:`, which meant the three
 * commercial addresses were published in the HTML of every visit for any
 * harvester to collect. They live in `./leadDelivery` now, which nothing on
 * the client imports.
 */

let client: SESv2Client | null = null

/**
 * Built lazily and kept: the SDK client holds the connection pool, and a new
 * one per request would negotiate TLS to SES on every submission.
 *
 * THE VARIABLES CARRY A `_SES` SUFFIX and are not the SDK's standard
 * `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY`. That is the point: the pair is
 * scoped to an IAM identity that can send mail and nothing else, and giving it
 * the standard names would put it in the SDK's ambient credential chain, where
 * any other AWS client in this process would silently pick it up. Naming it for
 * what it is keeps it usable by this file alone. In CI the environment is
 * appended too (`..._SES_PRD` / `..._SES_STG`), because GitHub secrets are one
 * flat namespace with no config per environment.
 *
 * WITHOUT EXPLICIT KEYS THE SDK IS LEFT TO FIND ITS OWN — IAM role, shared
 * profile — rather than being handed `undefined`. That is what makes this keep
 * working the day it runs under a workload identity instead of a static pair.
 */
function getClient(): SESv2Client {
  if (client) return client

  const accessKeyId = process.env.AWS_ACCESS_KEY_ID_SES
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY_SES

  /* An unset secret does not arrive as `undefined`, it arrives as the empty
     string — a build argument that was never given a value still becomes an
     ENV. So emptiness has to count as absence, or `??` would hand the SDK a
     blank region and the failure would surface far from here. */
  const region = process.env.AWS_REGION?.trim() || leadDelivery.region

  client = new SESv2Client({
    region,
    ...(accessKeyId && secretAccessKey ? { credentials: { accessKeyId, secretAccessKey } } : {}),
  })

  return client
}

/* The mail is read by the commercial team, so it is written in Spanish: it is
   content a person reads, not code. */
function buildSubject(lead: LeadSubmission): string {
  return `Voltop · ${lead.segment} · ${lead.company}`
}

function buildText(lead: LeadSubmission): string {
  return [
    `Nombre:    ${lead.name}`,
    `Correo:    ${lead.email}`,
    `Empresa:   ${lead.company}`,
    lead.phone ? `Teléfono:  ${lead.phone}` : null,
    `Segmento:  ${lead.segment}`,
    `Idioma:    ${lead.locale}`,
    '',
    lead.message || '(sin mensaje)',
    '',
    '— Enviado desde el formulario de voltop.co',
  ]
    .filter(Boolean)
    .join('\n')
}

/* Everything interpolated into the HTML comes from a stranger. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function buildHtml(lead: LeadSubmission): string {
  const row = (label: string, value: string) =>
    `<tr><td style="padding:4px 16px 4px 0;color:#666;">${label}</td><td style="padding:4px 0;">${escapeHtml(value)}</td></tr>`

  return [
    '<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.5;">',
    '<table style="border-collapse:collapse;">',
    row('Nombre', lead.name),
    row('Correo', lead.email),
    row('Empresa', lead.company),
    lead.phone ? row('Teléfono', lead.phone) : '',
    row('Segmento', lead.segment),
    row('Idioma', lead.locale),
    '</table>',
    `<p style="white-space:pre-wrap;margin-top:16px;">${escapeHtml(lead.message || '(sin mensaje)')}</p>`,
    '<p style="color:#888;font-size:13px;margin-top:24px;">Enviado desde el formulario de voltop.co</p>',
    '</div>',
  ].join('')
}

/**
 * Sends the lead. Resolves on delivery to SES, throws on anything else — the
 * route handler is what decides what the visitor is told.
 *
 * `ReplyToAddresses` carries the lead's own address, which is what makes
 * hitting reply in Gmail work without anyone copying the address by hand. The
 * `From` stays a verified Voltop identity: putting the stranger's address there
 * is what gets a domain marked as a spoofer.
 */
export async function sendLead(lead: LeadSubmission): Promise<void> {
  const { sender, recipients, configurationSet } = leadDelivery

  await getClient().send(
    new SendEmailCommand({
      FromEmailAddress: sender,
      Destination: { ToAddresses: [...recipients] },
      ReplyToAddresses: [lead.email],
      ...(configurationSet ? { ConfigurationSetName: configurationSet } : {}),
      Content: {
        Simple: {
          Subject: { Data: buildSubject(lead), Charset: 'UTF-8' },
          Body: {
            Text: { Data: buildText(lead), Charset: 'UTF-8' },
            Html: { Data: buildHtml(lead), Charset: 'UTF-8' },
          },
        },
      },
    }),
  )
}
