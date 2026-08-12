"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useLang } from "@/lib/i18n";
import { businessSegments } from "@/content/site";
import { Section, Container, Reveal, Eyebrow } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

/**
 * EMPRESAS — hub B2B en una sola página (progressive disclosure).
 * Selector de caso revela contenido a medida; 1 formulario segmentado, CRM-ready.
 */
export function Business() {
  const { t } = useLang();
  const [active, setActive] = useState(businessSegments[0].key);
  const reduce = useReducedMotion();
  const current = businessSegments.find((s) => s.key === active)!;

  return (
    <Section id="empresas" register="silencio">
      <Container>
        <div className="grid gap-14 lg:grid-cols-12">
          {/* Izquierda: propuesta + selector */}
          <div className="lg:col-span-6">
            <Reveal>
              <Eyebrow>{t({ es: "Tu caso", en: "Your case" })}</Eyebrow>
              <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight md:text-5xl">
                {t({ es: "¿Qué describe mejor tu caso?", en: "What best describes your case?" })}
              </h2>
              <p className="mt-4 max-w-md text-ink-2">
                {t({
                  es: "Elige tu caso y verás cómo Voltop resuelve la carga de principio a fin.",
                  en: "Pick your case and see how Voltop handles charging end to end.",
                })}
              </p>
            </Reveal>

            {/* Selector (progressive disclosure) */}
            <Reveal delay={0.08}>
              <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label={t({ es: "Tu caso", en: "Your case" })}>
                {businessSegments.map((s) => (
                  <button
                    key={s.key}
                    role="tab"
                    aria-selected={active === s.key}
                    onClick={() => setActive(s.key)}
                    className={cn(
                      "rounded-full border px-4 py-2 text-sm transition-colors",
                      active === s.key
                        ? "border-transparent brand-gradient font-medium text-on-brand"
                        : "border-line text-ink-2 hover:text-ink"
                    )}
                  >
                    {t(s.label)}
                  </button>
                ))}
              </div>

              <div className="mt-6 min-h-24 rounded-[var(--radius-structural)] border border-line bg-surface-1 p-6">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.p
                    key={current.key}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: reduce ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="text-lg text-ink"
                  >
                    {t(current.value)}
                  </motion.p>
                </AnimatePresence>
              </div>
            </Reveal>
          </div>

          {/* Derecha: formulario segmentado (CRM-ready) */}
          <div className="lg:col-span-6">
            <Reveal delay={0.12}>
              <LeadForm segmentLabel={t(current.label)} segmentKey={current.key} />
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}

function LeadForm({ segmentLabel, segmentKey }: { segmentLabel: string; segmentKey: string }) {
  const { t } = useLang();
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Capa de envío DESACOPLADA (CRM-ready): aquí se mapearía a HubSpot/Salesforce/etc.
    // Instrumentación: emitir lead_form_envio { segmento: segmentKey } (measurement plan).
    setStatus("loading");
    setTimeout(() => setStatus("success"), 1100);
  };

  if (status === "success") {
    return (
      <div className="grid min-h-[22rem] place-items-center rounded-[var(--radius-structural)] border border-line bg-surface-1 p-8 text-center">
        <div>
          <div className="mx-auto grid size-12 place-items-center rounded-full brand-gradient text-on-brand">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m5 13 4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h3 className="mt-5 font-display text-xl font-semibold">{t({ es: "¡Gracias! Te contactaremos pronto.", en: "Thanks! We'll be in touch soon." })}</h3>
          <p className="mt-2 text-sm text-ink-3">{t({ es: "Respuesta típica en 1–2 días hábiles.", en: "Typical reply within 1–2 business days." })}</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-[var(--radius-structural)] border border-line bg-surface-1 p-6 md:p-8">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold">{t({ es: "Hablemos", en: "Let's talk" })}</h3>
        <span className="rounded-full border border-line px-3 py-1 font-mono text-[11px] text-ink-3">
          {t({ es: "Caso", en: "Case" })}: {segmentLabel}
        </span>
      </div>

      <div className="mt-6 grid gap-4">
        <Field label={t({ es: "Nombre", en: "Name" })} name="name" required />
        <Field label={t({ es: "Correo corporativo", en: "Work email" })} name="email" type="email" required />
        <Field label={t({ es: "Empresa", en: "Company" })} name="company" />
        <label className="block">
          <span className="mb-1.5 block text-sm text-ink-2">{t({ es: "¿Qué necesitas?", en: "What do you need?" })}</span>
          <textarea
            name="message"
            rows={3}
            className="w-full resize-none rounded-[10px] border border-line bg-canvas px-3.5 py-2.5 text-ink outline-none transition-colors placeholder:text-ink-3 focus:border-brand/60"
            placeholder={t({ es: "Cuéntanos brevemente…", en: "Tell us briefly…" })}
          />
        </label>
        {/* segmento oculto → mapeo CRM */}
        <input type="hidden" name="segment" value={segmentKey} />
      </div>

      <div className="mt-6">
        <Button type="submit" variant="primary" size="l" arrow loading={status === "loading"} className="w-full">
          {t({ es: "Enviar solicitud", en: "Send request" })}
        </Button>
        <p className="mt-3 text-center text-xs text-ink-3">
          {t({ es: "Formulario demo · listo para integrar con CRM", en: "Demo form · ready for CRM integration" })}
        </p>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-ink-2">
        {label} {required && <span className="text-brand">*</span>}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full rounded-[10px] border border-line bg-canvas px-3.5 py-2.5 text-ink outline-none transition-colors placeholder:text-ink-3 focus:border-brand/60"
      />
    </label>
  );
}
