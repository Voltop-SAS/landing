"use client";

import { useId, useRef, useState } from "react";
import Link from "next/link";
import { t, type Locale } from "@/lib/i18n/config";
import { href, routes } from "@/lib/i18n/routes";
import { leadForm } from "@/content/copy/common";
import { Button } from "@/components/ui/Button";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";

/**
 * FORMULARIO DE LEADS · CRM-ready
 * Ver docs/MASTER-PROJECT-DEFINITION.md §17, §23 y §38.
 *
 * Correcciones respecto de la versión anterior:
 * - CONSENTIMIENTO EXPLÍCITO obligatorio (Ley 1581 de 2012, habeas data).
 *   Sin él, el formulario no puede publicarse.
 * - Validación con errores accionables asociados por `aria-describedby`.
 * - Resumen de errores anunciado y foco gestionado al primer campo inválido.
 * - Estado de éxito anunciado con `role="status"`.
 * - `autocomplete` en todos los campos.
 * - Instrumentación completa del plan de medición.
 *
 * La capa de envío está DESACOPLADA: `submitLead` es el único punto a
 * reemplazar cuando se defina el CRM (decisión abierta O3).
 */

type Status = "idle" | "loading" | "success";
type Errors = Partial<Record<"name" | "email" | "company" | "consent", string>>;

async function submitLead(payload: Record<string, FormDataEntryValue>): Promise<void> {
  // PUNTO DE INTEGRACIÓN CRM. Nombres de campo estables: name, email,
  // company, phone, message, segment, consent.
  // Mientras no exista destino, se simula la latencia de red.
  void payload;
  await new Promise((r) => setTimeout(r, 900));
}

export function LeadForm({ lang, segmentKey, segmentLabel }: { lang: Locale; segmentKey: string; segmentLabel: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [started, setStarted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const uid = useId();

  const fieldId = (name: string) => `${uid}-${name}`;
  const errorId = (name: string) => `${uid}-${name}-error`;

  const onFirstInteraction = () => {
    if (started) return;
    setStarted(true);
    track("lead_form_inicio", { segmento: segmentKey });
  };

  const validate = (data: FormData): Errors => {
    const next: Errors = {};
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const company = String(data.get("company") ?? "").trim();

    if (name.length < 2) next.name = t(leadForm.fields.name.error, lang);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) next.email = t(leadForm.fields.email.error, lang);
    if (company.length < 2) next.company = t(leadForm.fields.company.error, lang);
    if (!data.get("consent")) next.consent = t(leadForm.fields.consent.error, lang);
    return next;
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const found = validate(data);
    setErrors(found);

    if (Object.keys(found).length > 0) {
      track("lead_form_error", { segmento: segmentKey, campos: Object.keys(found).join(",") });
      const first = Object.keys(found)[0];
      formRef.current?.querySelector<HTMLElement>(`#${CSS.escape(fieldId(first))}`)?.focus();
      return;
    }

    setStatus("loading");
    track("lead_form_envio", { segmento: segmentKey });
    await submitLead(Object.fromEntries(data));
    setStatus("success");
    track("lead_form_exito", { segmento: segmentKey });
  };

  if (status === "success") {
    return (
      <div role="status" className="border border-line bg-surface-1 p-8 md:p-10">
        <div className="grid size-11 place-items-center rounded-(--radius-pill) brand-gradient text-on-brand">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="m5 13 4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="mt-6 font-display text-display-m font-semibold text-ink">{t(leadForm.success.title, lang)}</h3>
        <p className="mt-3 measure text-body text-ink-2">{t(leadForm.success.body, lang)}</p>
      </div>
    );
  }

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      onFocusCapture={onFirstInteraction}
      noValidate
      className="border border-line bg-surface-1 p-6 md:p-10"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="font-display text-display-m font-semibold text-ink">{t(leadForm.title, lang)}</h3>
        <p className="font-mono text-mono text-ink-3">
          {t(leadForm.caseLabel, lang)}: <span className="text-ink-2">{segmentLabel}</span>
        </p>
      </div>
      <p className="mt-3 measure text-body-s text-ink-2">{t(leadForm.intro, lang)}</p>

      {hasErrors && (
        <p role="alert" className="mt-6 border-l-2 border-warn bg-warn/10 px-4 py-3 text-body-s text-ink">
          {t(leadForm.errorSummary, lang)}
        </p>
      )}

      <div className="mt-8 grid gap-6">
        <Field
          id={fieldId("name")}
          errorId={errorId("name")}
          name="name"
          label={t(leadForm.fields.name.label, lang)}
          autoComplete="name"
          required
          error={errors.name}
        />
        <Field
          id={fieldId("email")}
          errorId={errorId("email")}
          name="email"
          type="email"
          label={t(leadForm.fields.email.label, lang)}
          hint={t(leadForm.fields.email.hint, lang)}
          autoComplete="email"
          required
          error={errors.email}
        />
        <Field
          id={fieldId("company")}
          errorId={errorId("company")}
          name="company"
          label={t(leadForm.fields.company.label, lang)}
          autoComplete="organization"
          required
          error={errors.company}
        />
        <Field
          id={fieldId("phone")}
          errorId={errorId("phone")}
          name="phone"
          type="tel"
          label={t(leadForm.fields.phone.label, lang)}
          optionalLabel={t(leadForm.fields.phone.optional, lang)}
          autoComplete="tel"
        />

        <div>
          <label htmlFor={fieldId("message")} className="block text-body-s text-ink-2">
            {t(leadForm.fields.message.label, lang)}
          </label>
          <textarea
            id={fieldId("message")}
            name="message"
            rows={4}
            placeholder={t(leadForm.fields.message.placeholder, lang)}
            className="mt-2 w-full resize-none rounded-(--radius-structural) border border-line bg-canvas px-4 py-3 text-body text-ink outline-none transition-colors placeholder:text-ink-3 focus:border-brand"
          />
        </div>

        {/* Consentimiento — requisito legal, no una casilla opcional */}
        <div>
          <div className="flex items-start gap-1">
            {/* Área táctil de 44px alrededor de la casilla (§23) */}
            <span className="grid size-11 shrink-0 place-items-center">
              <input
                id={fieldId("consent")}
                name="consent"
                type="checkbox"
                aria-describedby={errors.consent ? errorId("consent") : undefined}
                aria-invalid={errors.consent ? true : undefined}
                /* El pseudo-elemento amplía el área de activación a 44px sin
                   agrandar la casilla visualmente (§23). */
                className="relative size-5 accent-[var(--color-brand)] before:absolute before:-inset-3 before:content-['']"
              />
            </span>
            <label htmlFor={fieldId("consent")} className="py-3 text-body-s text-ink-2">
              {t(leadForm.fields.consent.label, lang)}{" "}
              <Link
                href={href(lang, routes.privacy)}
                className="text-ink underline underline-offset-4 transition-colors hover:text-brand"
              >
                {t(leadForm.fields.consent.policyLink, lang)}
              </Link>
            </label>
          </div>
          {errors.consent && (
            <p id={errorId("consent")} className="mt-1 pl-12 text-body-s text-warn">
              {errors.consent}
            </p>
          )}
        </div>

        <input type="hidden" name="segment" value={segmentKey} />
      </div>

      <div className="mt-8">
        <Button type="submit" variant="primary" size="l" arrow loading={status === "loading"} className="w-full sm:w-auto">
          {status === "loading" ? t(leadForm.submitting, lang) : t(leadForm.submit, lang)}
        </Button>
        <p className="mt-4 font-mono text-mono text-ink-3">{t(leadForm.demoNotice, lang)}</p>
      </div>
    </form>
  );
}

function Field({
  id,
  errorId,
  name,
  label,
  type = "text",
  hint,
  error,
  required,
  optionalLabel,
  autoComplete,
}: {
  id: string;
  errorId: string;
  name: string;
  label: string;
  type?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  optionalLabel?: string;
  autoComplete?: string;
}) {
  const hintId = `${id}-hint`;
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") || undefined;

  return (
    <div>
      <label htmlFor={id} className="flex items-baseline justify-between gap-3 text-body-s text-ink-2">
        <span>
          {label}
          {required && <span className="ml-1 text-brand">*</span>}
        </span>
        {optionalLabel && <span className="font-mono text-mono text-ink-3">{optionalLabel}</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        aria-describedby={describedBy}
        aria-invalid={error ? true : undefined}
        className={cn(
          "mt-2 min-h-12 w-full rounded-(--radius-structural) border bg-canvas px-4 py-3 text-body text-ink outline-none transition-colors",
          error ? "border-warn" : "border-line focus:border-brand"
        )}
      />
      {hint && !error && (
        <p id={hintId} className="mt-2 text-caption text-ink-3">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-2 text-body-s text-warn">
          {error}
        </p>
      )}
    </div>
  );
}
