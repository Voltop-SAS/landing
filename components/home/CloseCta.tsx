import { t, type Locale } from "@/lib/i18n/config";
import { href, routes } from "@/lib/i18n/routes";
import { home } from "@/content/copy/home";
import { actions } from "@/content/copy/common";
import { Section, Container, SectionHeading } from "@/components/ui/layout";
import { Button } from "@/components/ui/Button";
import { TrackClick } from "@/components/analytics/TrackClick";

/**
 * BEAT 7 · CIERRE — Intensidad: Alta · Registro: Impacto
 * ESTRUCTURA: asimétrica. Dos audiencias declaradas explícitamente, separadas
 * por una hairline, con jerarquía desigual: B2C es la acción primaria (único
 * gradiente de la vista), B2B es la secundaria.
 *
 * El usuario no elige un carril antes de entender la propuesta; aquí, al final
 * del recorrido, elegir es exactamente lo que toca (§10).
 */
export function CloseCta({ lang }: { lang: Locale }) {
  return (
    <Section
      register="impacto"
      space="base"
      className="overflow-hidden border-t border-line"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-1/2 left-1/2 size-[42rem] -translate-x-1/2 rounded-full opacity-20 blur-[140px]"
        style={{
          background:
            "radial-gradient(circle, var(--color-brand), transparent 70%)",
        }}
      />

      <Container className="relative z-(--z-raised)">
        <SectionHeading>{t(home.close.title, lang)}</SectionHeading>

        <div className="mt-12 grid gap-10 md:grid-cols-[1.15fr_1fr] md:gap-0">
          <div className="md:pr-14">
            <p className="font-mono text-mono uppercase tracking-wider text-brand">
              {t(home.close.b2c.label, lang)}
            </p>
            <p className="mt-4 max-w-[34ch] text-body-l text-ink">
              {t(home.close.b2c.body, lang)}
            </p>
            <div className="mt-7">
              <TrackClick
                event="cta_encontrar_cargador_click"
                props={{ ubicacion: "cierre" }}
              >
                <Button
                  variant="primary"
                  size="l"
                  arrow
                  href={href(lang, routes.red)}
                >
                  {t(actions.findCharger, lang)}
                </Button>
              </TrackClick>
            </div>
          </div>

          <div className="border-t border-line pt-10 md:border-l md:border-t-0 md:pl-14 md:pt-0">
            <p className="font-mono text-mono uppercase tracking-wider text-ink-3">
              {t(home.close.b2b.label, lang)}
            </p>
            <p className="mt-4 max-w-[34ch] text-body text-ink-2">
              {t(home.close.b2b.body, lang)}
            </p>
            <div className="mt-7">
              <Button
                variant="secondary"
                arrow
                href={href(lang, `${routes.empresas}#contacto`)}
              >
                {t(actions.talkToTeam, lang)}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
