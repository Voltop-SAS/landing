'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useForm, type UseFormRegisterReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { z } from 'zod'
import { t, type Locale } from '~/core/common/domain/i18n/config'
import { href, routes } from '~/core/common/domain/i18n/routes'
import { TextSlot } from '@ui/common/components/ui/TextSlot'
import { leadForm } from '~/core/common/domain/consts/copy'
import { createLeadSchema, type LeadSubmission } from '~/core/business/domain/entities/Lead'
import { Button } from '@ui/common/components/ui/Button'
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
 * Delivery goes through `POST /api/leads`, which validates the payload again
 * and hands it to Amazon SES. The component knows none of that: it posts, and
 * it reports what came back.
 */

type Status = 'idle' | 'success' | 'error'

/**
 * Sends the lead. Resolves when the server accepted it, throws otherwise.
 *
 * WHAT THIS REPLACED, so the trade is not quietly undone: until 2026-09-09
 * this assigned a `mailto:` to `window.location.href`. That opened the
 * visitor's mail client with the message drafted and required them to press
 * send — a step a large share never took — and it could not report either
 * outcome, so the form declared success unconditionally and `lead_form_exito`
 * counted submissions that never existed. It also published the commercial
 * team's three addresses in the HTML of every page view.
 *
 * The endpoint fixes all three at once. Nothing here inspects the status code
 * beyond ok/not-ok: the server deliberately does not say why it refused, and
 * there is nothing a visitor could do with the reason anyway.
 */
async function submitLead(payload: LeadSubmission): Promise<void> {
  const response = await fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) throw new Error(`Lead submission failed with ${response.status}`)
}

export function LeadForm({ locale, segmentKey }: { locale: Locale; segmentKey: string }) {
  const [status, setStatus] = useState<Status>('idle')
  const [started, setStarted] = useState(false)
  const confirmationRef = useRef<HTMLDivElement>(null)
  const failureRef = useRef<HTMLParagraphElement>(null)
  const uid = useId()

  /* The RULES come from the domain, so the endpoint enforces exactly the same
     ones; only the MESSAGES are per-locale, which is why the schema is still
     built here and memoised on the locale. Writing the shape a second time in
     this file is what would let the browser accept what the server refuses. */
  const schema = useMemo(
    () =>
      createLeadSchema({
        name: t(leadForm.fields.name.error, locale),
        email: t(leadForm.fields.email.error, locale),
        company: t(leadForm.fields.company.error, locale),
        consent: t(leadForm.fields.consent.error, locale),
        tooLong: t(leadForm.tooLong, locale),
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
     the panel so keyboard and screen reader both arrive. The failure notice
     takes focus for the same reason: it appears above a form the person is
     already at the bottom of, and an announcement they have to go looking for
     is one they will miss. */
  useEffect(() => {
    if (status === 'success') confirmationRef.current?.focus()
    if (status === 'error') failureRef.current?.focus()
  }, [status])

  const fieldId = (name: string) => `${uid}-${name}`
  const errorId = (name: string) => `${uid}-${name}-error`

  const onFirstInteraction = () => {
    if (started) return
    setStarted(true)
    track('form_start', { form_id: 'lead_empresas', segment: segmentKey })
  }

  /* The honeypot is read off the submitted form rather than held in a ref: a
     ref would be read during render, which is both what the lint rule forbids
     and a genuine hazard. The field is a plain named input, so the form element
     the submit event carries already has it. */
  const onValid = async (values: FormValues, event?: React.BaseSyntheticEvent) => {
    const form = event?.target as HTMLFormElement | undefined
    const honeypot = form?.elements.namedItem('website')
    const website = honeypot instanceof HTMLInputElement ? honeypot.value : ''

    /* THERE IS NO «submit attempted» EVENT ANY MORE. `lead_form_envio` fired
       here, before the request, and it counted attempts — including the ones
       that failed. Everything a decision needs is already covered: `form_start`
       says somebody began, `generate_lead` says one arrived, and `form_error`
       with `reason: 'send'` says one was lost on the way. */
    try {
      await submitLead({
        ...values,
        segment: segmentKey,
        locale,
        website,
      })
    } catch (error) {
      console.error('[lead-form] submission failed', error)
      setStatus('error')
      track('form_error', { form_id: 'lead_empresas', segment: segmentKey, reason: 'send' })
      return
    }

    setStatus('success')
    /* THE conversion, and it only exists here: after `POST /api/leads` has
       answered ok. Until 2026-09-09 the form opened a `mailto:` and this was
       impossible to know — a mail client opening says nothing about a message
       being sent. */
    track('generate_lead', { form_id: 'lead_empresas', segment: segmentKey })
  }

  /* React Hook Form moves focus to the first invalid field on its own
     (`shouldFocusError`), so this only has to report. */
  const onInvalid = (found: typeof errors) => {
    track('form_error', {
      form_id: 'lead_empresas',
      segment: segmentKey,
      reason: 'validation',
      /* FIELD NAMES, never their values: `name,email` and never what was typed
         into them. */
      fields: Object.keys(found).join(','),
    })
  }

  if (status === 'success') {
    return (
      <div
        ref={confirmationRef}
        tabIndex={-1}
        role="status"
        className="border border-line bg-surface-1 p-8 md:p-10"
      >
        {/* The tick is drawn again. It was conditional while the form only
            drafted a `mailto:` and could not know whether anything had been
            sent; now the panel is reached only after the server confirmed, so
            the check mark states something true. */}
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
        <h3 className="mt-6 font-display text-display-m font-semibold text-ink">
          {t(leadForm.success.title, locale)}
        </h3>
        <p className="mt-3 measure text-body text-ink-2">{t(leadForm.success.body, locale)}</p>
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
      {/* The "Tu caso: <segment>" label was removed on 2026-09-08. It repeated,
          in 12px mono, the tab the user had just pressed and which is still
          marked above, and `segmentKey` travels in the submission either way:
          no information is lost, it just stops being said twice. */}
      <h3 className="font-display text-display-m font-semibold text-ink">
        {t(leadForm.title, locale)}
      </h3>
      <p className="mt-3 measure text-body-s text-ink-2">{t(leadForm.intro, locale)}</p>

      {/* The send failed. The form stays mounted underneath with every field
          still filled in, so retrying is one click and not the whole form
          again — which is the entire reason this is a notice and not a panel
          replacing the form the way success does. */}
      {status === 'error' && (
        <p
          ref={failureRef}
          tabIndex={-1}
          role="alert"
          className="mt-6 border-l-2 border-warn bg-warn/10 px-4 py-3 text-body-s text-ink"
        >
          <span className="font-semibold">{t(leadForm.failure.title, locale)}</span>{' '}
          {t(leadForm.failure.body, locale)}
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
        {/* THE HONEYPOT. Moved off screen rather than `display: none`, because
            the cruder bots skip what is display-none and this is meant to be
            filled. It is out of the tab order and hidden from assistive
            technology, so nobody using the form ever meets it. `autoComplete`
            is off so a browser does not fill it and get a real person
            silently discarded. */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          aria-hidden="true"
          autoComplete="off"
          defaultValue=""
          className="absolute left-[-9999px] size-px opacity-0"
        />
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
              {/* The link goes INSIDE the authorisation. See the note on
                  `consent.label` for why, and `TextSlot` for how — including
                  what happens if a locale ever loses the placeholder. An
                  unreadable authorisation is the one thing that cannot happen
                  here. */}
              <TextSlot
                text={t(leadForm.fields.consent.label, locale)}
                name="policy"
              >
                <Link
                  href={href(locale, routes.privacy)}
                  className="text-ink underline decoration-line-strong decoration-1 underline-offset-4 transition-colors hover:text-brand hover:decoration-brand"
                >
                  {t(leadForm.fields.consent.policyLink, locale)}
                </Link>
              </TextSlot>
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
          {isSubmitting
            ? t(leadForm.submitting, locale)
            : status === 'error'
              ? t(leadForm.failure.retry, locale)
              : t(leadForm.submit, locale)}
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
