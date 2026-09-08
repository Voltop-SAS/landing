'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useForm, type UseFormRegisterReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { t, type Locale } from '~/core/common/domain/i18n/config'
import { href, routes } from '~/core/common/domain/i18n/routes'
import { leadForm } from '~/core/common/domain/consts/copy'
import { leadRecipients } from '~/core/common/domain/consts/links'
import { Button } from '@ui/common/components/ui/Button'
import { PendingTag } from '@ui/common/components/ui/DataPrimitives'
import { track } from '~/core/common/infrastructure/analytics'
import { cn } from '@ui/common/lib/cn'

/**
 * LEAD FORM · CRM-ready
 * See docs/MASTER-PROJECT-DEFINITION.md §17, §23 and §38.
 *
 * What this form guarantees, and must keep guaranteeing:
 * - EXPLICIT CONSENT is mandatory (Ley 1581 de 2012, habeas data). Without it
 *   the form cannot be published at all.
 * - Errors are actionable and wired to their field via `aria-describedby`.
 * - The error summary is announced, and focus lands on the first invalid
 *   field.
 * - Success is announced with `role="status"` AND takes focus: replacing the
 *   form left keyboard users standing on a button that no longer existed.
 * - Required-ness lives in the DOM (`required` + `aria-required`), not in a
 *   decorative asterisk, and a legend explains what the asterisk means.
 * - Every field declares `autocomplete`.
 *
 * Validation is React Hook Form + Zod. The schema is built inside the
 * component because every message is a translation, so it depends on the
 * active locale. The form keeps `noValidate`: validation is ours, and the
 * native `required` attribute stays for semantics only.
 *
 * The delivery layer is DECOUPLED: `submitLead` is the single function to
 * replace once the CRM is chosen (open decision O3).
 */

type Status = 'idle' | 'success'

/**
 * WHERE THE FORM SENDS.
 *
 * - `'none'`  — nowhere to send. The form SAYS so instead of pretending.
 * - `'email'` — opens the mail client with everything drafted. This is what
 *   ships today (decided 2026-09-02) and needs no server.
 * - `'crm'`   — automatic delivery. Needs a backend or a form service.
 *
 * WHY EMAIL AND NOT A SERVICE: the site is fully static, so there is no server
 * to receive a POST. A `mailto:` is the only thing that works TODAY without
 * signing up for anything. It has two costs worth keeping in mind: it loses
 * anyone without a configured mail client, and it exposes the three addresses
 * in the HTML. A form service fixes both and changes only this function.
 */
const DESTINATION: 'none' | 'email' | 'crm' = 'email'

type LeadPayload = {
  name: string
  email: string
  company: string
  phone?: string
  message?: string
  segment: string
}

async function submitLead(payload: LeadPayload): Promise<void> {
  if (DESTINATION !== 'email') {
    void payload
    await new Promise((r) => setTimeout(r, 900))
    return
  }

  /* Stable field names from the plan: name, email, company, phone, message,
     segment. The subject carries the segment so it can be filtered without
     opening the message. */
  const subject = `Voltop · ${payload.segment || 'Contacto'} · ${payload.company || payload.name}`
  const body = [
    `Nombre: ${payload.name}`,
    `Correo: ${payload.email}`,
    `Empresa: ${payload.company}`,
    payload.phone ? `Teléfono: ${payload.phone}` : null,
    `Segmento: ${payload.segment}`,
    '',
    payload.message || '(sin mensaje)',
    '',
    '— Enviado desde el formulario de voltop.co',
  ]
    .filter(Boolean)
    .join('\n')

  window.location.href =
    `mailto:${leadRecipients.join(',')}` +
    `?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export function LeadForm({
  locale,
  segmentKey,
}: {
  locale: Locale
  segmentKey: string
}) {
  const [status, setStatus] = useState<Status>('idle')
  const [started, setStarted] = useState(false)
  const confirmationRef = useRef<HTMLDivElement>(null)
  const uid = useId()

  /* Messages are translations, so the schema is per-locale. `consent` is
     `literal(true)` and not an optional boolean on purpose: an unchecked box
     has to be a validation failure, not a falsy value that slips through. */
  const schema = useMemo(
    () =>
      z.object({
        name: z.string().trim().min(2, t(leadForm.fields.name.error, locale)),
        email: z.email(t(leadForm.fields.email.error, locale)),
        company: z.string().trim().min(2, t(leadForm.fields.company.error, locale)),
        phone: z.string().trim().optional(),
        message: z.string().trim().optional(),
        consent: z.literal(true, t(leadForm.fields.consent.error, locale)),
      }),
    [locale],
  )

  type FormValues = z.infer<typeof schema>

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  /* Replacing the form with the confirmation sent focus nowhere. It moves to
     the panel so keyboard and screen reader both arrive. */
  useEffect(() => {
    if (status === 'success') confirmationRef.current?.focus()
  }, [status])

  const fieldId = (name: string) => `${uid}-${name}`
  const errorId = (name: string) => `${uid}-${name}-error`

  const onFirstInteraction = () => {
    if (started) return
    setStarted(true)
    track('lead_form_inicio', { segmento: segmentKey })
  }

  const onValid = async (values: FormValues) => {
    track('lead_form_envio', { segmento: segmentKey })
    await submitLead({ ...values, segment: segmentKey })
    setStatus('success')
    track('lead_form_exito', { segmento: segmentKey })
  }

  /* React Hook Form moves focus to the first invalid field on its own
     (`shouldFocusError`), so this only has to report. The event keeps the
     property names of the measurement plan. */
  const onInvalid = (found: typeof errors) => {
    track('lead_form_error', { segmento: segmentKey, campos: Object.keys(found).join(',') })
  }

  if (status === 'success') {
    const confirmation = DESTINATION === 'email' ? leadForm.successEmail : leadForm.successPending

    return (
      <div
        ref={confirmationRef}
        tabIndex={-1}
        role="status"
        className="border border-line bg-surface-1 p-8 md:p-10"
      >
        {DESTINATION !== 'none' ? (
          <div className="grid size-11 place-items-center rounded-(--radius-pill) brand-gradient text-on-brand">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="m5 13 4 4L19 7"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        ) : (
          /* With no real destination the check mark is not drawn: the gradient
             and the tick say "done", and it is not done. */
          <PendingTag>{t(leadForm.successPending.tag, locale)}</PendingTag>
        )}
        <h3 className="mt-6 font-display text-display-m font-semibold text-ink">
          {t(confirmation.title, locale)}
        </h3>
        <p className="mt-3 measure text-body text-ink-2">{t(confirmation.body, locale)}</p>
      </div>
    )
  }

  const hasErrors = Object.keys(errors).length > 0

  return (
    <form
      onSubmit={handleSubmit(onValid, onInvalid)}
      onFocusCapture={onFirstInteraction}
      noValidate
      className="border border-line bg-surface-1 p-6 md:p-10"
    >
      {/* El rótulo "Tu caso: <segmento>" se retiró el 2026-09-08. Repetía en
          12px mono la pestaña que el usuario acaba de pulsar y que sigue
          marcada arriba, y el `segmentKey` viaja igual en el envío: la
          información no se pierde, solo deja de decirse dos veces. */}
      <h3 className="font-display text-display-m font-semibold text-ink">
        {t(leadForm.title, locale)}
      </h3>
      <p className="mt-3 measure text-body-s text-ink-2">{t(leadForm.intro, locale)}</p>

      {/* Demo notice BEFORE asking for the data. It used to sit in 12px mono
          under the button, where nobody reads it before typing their email. */}
      {DESTINATION === 'none' && (
        <p className="mt-6 border-l-2 border-warn/70 bg-warn/8 px-4 py-3 text-body-s text-ink-2">
          {t(leadForm.demoNotice, locale)}
        </p>
      )}

      {hasErrors && (
        <p
          role="alert"
          className="mt-6 border-l-2 border-warn bg-warn/10 px-4 py-3 text-body-s text-ink"
        >
          {t(leadForm.errorSummary, locale)}
        </p>
      )}

      <div className="mt-8 grid gap-6">
        <Field
          id={fieldId('name')}
          errorId={errorId('name')}
          registration={register('name')}
          label={t(leadForm.fields.name.label, locale)}
          autoComplete="name"
          required
          error={errors.name?.message}
        />
        <Field
          id={fieldId('email')}
          errorId={errorId('email')}
          registration={register('email')}
          type="email"
          label={t(leadForm.fields.email.label, locale)}
          hint={t(leadForm.fields.email.hint, locale)}
          autoComplete="email"
          required
          error={errors.email?.message}
        />
        <Field
          id={fieldId('company')}
          errorId={errorId('company')}
          registration={register('company')}
          label={t(leadForm.fields.company.label, locale)}
          autoComplete="organization"
          required
          error={errors.company?.message}
        />
        <Field
          id={fieldId('phone')}
          errorId={errorId('phone')}
          registration={register('phone')}
          type="tel"
          label={t(leadForm.fields.phone.label, locale)}
          optionalLabel={t(leadForm.fields.phone.optional, locale)}
          autoComplete="tel"
        />

        <div>
          <label
            htmlFor={fieldId('message')}
            className="block text-body-s text-ink-2"
          >
            {t(leadForm.fields.message.label, locale)}
          </label>
          <textarea
            id={fieldId('message')}
            rows={4}
            placeholder={t(leadForm.fields.message.placeholder, locale)}
            className="mt-2 w-full resize-none rounded-(--radius-structural) border border-line-control bg-canvas px-4 py-3 text-body text-ink outline-none transition-colors placeholder:text-ink-3 focus:border-brand"
            {...register('message')}
          />
        </div>

        {/* Consent — a legal requirement, not an optional checkbox */}
        <div>
          <div className="flex items-start gap-1">
            {/* 44px touch target around the box (§23) */}
            <span className="grid size-11 shrink-0 place-items-center">
              <input
                id={fieldId('consent')}
                type="checkbox"
                required
                aria-required="true"
                aria-describedby={errors.consent ? errorId('consent') : undefined}
                aria-invalid={errors.consent ? true : undefined}
                /* The pseudo-element widens the activation area to 44px without
                   making the box visually bigger (§23). */
                className="relative size-5 accent-[var(--color-brand)] before:absolute before:-inset-3 before:content-['']"
                {...register('consent')}
              />
            </span>
            <label
              htmlFor={fieldId('consent')}
              className="py-3 text-body-s text-ink-2"
            >
              {/* El enlace va DENTRO de la autorización. Ver la nota de
                  `consent.label`: se parte por `{policy}` y en su hueco entra
                  el nombre completo del documento. Si un idioma perdiera el
                  token, la frase se renderiza entera sin enlace en lugar de
                  romperse — una autorización ilegible es lo único que aquí no
                  puede pasar. */}
              {(() => {
                const [before, after] = t(leadForm.fields.consent.label, locale).split('{policy}')
                return (
                  <>
                    {before}
                    {after !== undefined && (
                      <>
                        <Link
                          href={href(locale, routes.privacy)}
                          className="text-ink underline decoration-line-strong decoration-1 underline-offset-4 transition-colors hover:text-brand hover:decoration-brand"
                        >
                          {t(leadForm.fields.consent.policyLink, locale)}
                        </Link>
                        {after}
                      </>
                    )}
                  </>
                )
              })()}
            </label>
          </div>
          {errors.consent && (
            <p
              id={errorId('consent')}
              className="mt-1 pl-12 text-body-s text-warn"
            >
              {errors.consent.message}
            </p>
          )}
        </div>
      </div>

      <p className="mt-6 text-caption text-ink-3">{t(leadForm.requiredLegend, locale)}</p>

      <div className="mt-6">
        <Button
          type="submit"
          variant="primary"
          size="l"
          arrow
          loading={isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? t(leadForm.submitting, locale) : t(leadForm.submit, locale)}
        </Button>
      </div>
    </form>
  )
}

function Field({
  id,
  errorId,
  registration,
  label,
  type = 'text',
  hint,
  error,
  required,
  optionalLabel,
  autoComplete,
}: {
  id: string
  errorId: string
  registration: UseFormRegisterReturn
  label: string
  type?: string
  hint?: string
  error?: string
  required?: boolean
  optionalLabel?: string
  autoComplete?: string
}) {
  const hintId = `${id}-hint`
  const describedBy =
    [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') || undefined

  return (
    <div>
      <label
        htmlFor={id}
        className="flex items-baseline justify-between gap-3 text-body-s text-ink-2"
      >
        <span>
          {label}
          {/* The asterisk is VISUAL reinforcement. Required-ness is announced by
              the input attribute, so it is hidden from assistive technology to
              avoid reading "asterisk" on every field. */}
          {required && (
            <span
              aria-hidden="true"
              className="ml-1 text-brand"
            >
              *
            </span>
          )}
        </span>
        {optionalLabel && <span className="font-mono text-mono text-ink-3">{optionalLabel}</span>}
      </label>
      <input
        id={id}
        type={type}
        /* `required` was missing from the DOM: the asterisk was the only cue
           and no screen reader announced the field as required (WCAG 3.3.2).
           The form validates in JS with `noValidate`, so this is semantics,
           not a second validation. */
        required={required}
        aria-required={required || undefined}
        autoComplete={autoComplete}
        aria-describedby={describedBy}
        aria-invalid={error ? true : undefined}
        className={cn(
          'mt-2 min-h-12 w-full rounded-(--radius-structural) border bg-canvas px-4 py-3 text-body text-ink outline-none transition-colors',
          error ? 'border-warn' : 'border-line-control focus:border-brand',
        )}
        {...registration}
      />
      {hint && !error && (
        <p
          id={hintId}
          className="mt-2 text-caption text-ink-3"
        >
          {hint}
        </p>
      )}
      {error && (
        <p
          id={errorId}
          className="mt-2 text-body-s text-warn"
        >
          {error}
        </p>
      )}
    </div>
  )
}
