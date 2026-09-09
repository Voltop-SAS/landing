import { z } from 'zod'
import type { Locale } from '~/core/common/domain/i18n/config'

/**
 * THE LEAD, AND THE ONE PLACE ITS RULES ARE WRITTEN.
 *
 * The form validated in the browser and nothing validated on the server,
 * because until the SES route handler landed there was no server to validate
 * on. Now there are two validators, and two validators that drift are worse
 * than one: the browser would accept what the endpoint rejects, and the person
 * would watch a valid-looking form fail for no stated reason.
 *
 * So the RULES live here once and the MESSAGES are injected. The form passes
 * the translated copy for the active locale; the route handler passes neutral
 * text nobody reads, because by the time the server rejects something the
 * browser has already said what is wrong in the visitor's language. A server
 * rejection is therefore either a bot or a tampered request, and both deserve
 * a terse answer rather than a good one.
 *
 * The length caps exist for the server's sake, not the form's: a text field
 * with no upper bound is an open invitation to post a megabyte of body into an
 * email. They are declared here, and not only on the endpoint, precisely so
 * the browser refuses first and the visitor learns about it before submitting.
 */
export type LeadMessages = {
  name: string
  email: string
  company: string
  consent: string
  tooLong: string
}

/** Upper bounds. Generous for a human, hostile to a script. */
export const leadLimits = {
  name: 120,
  email: 254,
  company: 160,
  phone: 40,
  message: 4000,
} as const

export function createLeadSchema(messages: LeadMessages) {
  return z.object({
    name: z.string().trim().min(2, messages.name).max(leadLimits.name, messages.tooLong),
    email: z.email(messages.email).max(leadLimits.email, messages.tooLong),
    company: z.string().trim().min(2, messages.company).max(leadLimits.company, messages.tooLong),
    phone: z.string().trim().max(leadLimits.phone, messages.tooLong).optional(),
    message: z.string().trim().max(leadLimits.message, messages.tooLong).optional(),
    /* `literal(true)` and not an optional boolean: an unticked box has to be a
       validation failure, not a falsy value that slips through. Consent is a
       legal requirement (Ley 1581 de 2012), so the server checks it too — the
       authorisation is what makes processing the data lawful, and trusting the
       client for it would mean trusting the one party with a reason to lie. */
    consent: z.literal(true, messages.consent),
  })
}

/** The shape the form produces. */
export type LeadValues = z.infer<ReturnType<typeof createLeadSchema>>

/**
 * What actually travels to the endpoint: the form, its context, and the trap.
 *
 * `website` is a HONEYPOT — an input the stylesheet keeps off screen and that
 * no person ever sees, let alone fills. A bot walking the DOM and filling every
 * field it finds fills this one, and the endpoint uses that to tell the two
 * apart. It is declared here rather than hidden inside the component because it
 * is part of the request contract: the server rejects a payload whose `website`
 * is non-empty, so anything that posts to this endpoint has to know it exists.
 */
export type LeadSubmission = LeadValues & {
  segment: string
  /**
   * The language the form was filled in.
   *
   * It is recorded because it is the one thing the commercial team cannot infer
   * from the lead itself: which language to answer in. Someone who wrote to us
   * through the Portuguese site should not get a reply in Spanish.
   */
  locale: Locale
  website?: string
}
