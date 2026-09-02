import Image from "next/image";
import { t, type Locale } from "@/lib/i18n/config";
import { home } from "@/content/copy/home";
import { Section, Container, Eyebrow } from "@/components/ui/layout";
import { StoreBadges } from "@/components/ui/StoreBadges";
import { Reveal } from "@/components/ui/Reveal";

/**
 * HOME · descarga de la app
 * Ver docs/MASTER-PROJECT-DEFINITION.md §12 y §15.
 *
 * ── EL QR NO ES DECORACIÓN, RESUELVE UN PROBLEMA CONCRETO ────────────────
 * Esta sección se lee sobre todo en escritorio, y ahí las insignias de tienda
 * son un callejón: llevan a una ficha que no se puede instalar en el aparato
 * que tienes delante. El QR salta ese hueco — sacas el teléfono y escaneas.
 * En móvil ocurre lo contrario: el QR sobra porque las insignias ya funcionan,
 * así que se OCULTA por debajo de `md` en lugar de encogerse.
 *
 * ── POR QUÉ EL QR VA SOBRE BLANCO ────────────────────────────────────────
 * Un lector de códigos espera módulos oscuros sobre fondo claro. Invertirlo
 * para que "combine" con el lienzo oscuro hace que muchos teléfonos fallen, y
 * un QR que no escanea es peor que ningún QR. El asset incluye además la zona
 * tranquila de 4 módulos que exige la especificación.
 *
 * ── COMPOSICIÓN ──────────────────────────────────────────────────────────
 * Dos columnas asimétricas, no la mitad y la mitad: el texto pesa y el QR es
 * un objeto pequeño. Partirlo por el medio dejaría al QR flotando en un vacío
 * y repetiría el split simétrico que §12 prohíbe.
 */
export function AppDownload({ lang }: { lang: Locale }) {
  const c = home.app;

  return (
    <Section space="base" className="border-t border-line" ariaLabelledby="app-title">
      <Container>
        <div className="grid gap-12 md:grid-cols-[1fr_auto] md:items-center md:gap-16">
          <div>
            <Eyebrow>{t(c.eyebrow, lang)}</Eyebrow>
            <h2
              id="app-title"
              className="mt-4 max-w-[16ch] font-display text-display-l font-semibold text-balance text-ink"
            >
              {t(c.title, lang)}
            </h2>
            <p className="measure-narrow mt-5 text-body-l text-ink-2">{t(c.lead, lang)}</p>

            <ul className="mt-8 space-y-0">
              {c.features.map((f, i) => (
                <li
                  key={i}
                  className="flex gap-3 border-t border-line py-3 text-body-s text-ink-2 last:border-b"
                >
                  {/* El punto es una marca de lista, no un adorno de marca: en
                      tinta apagada, no en el gradiente. §12 reserva el
                      gradiente para UNA acción por vista. */}
                  <span aria-hidden="true" className="mt-2.5 size-1 shrink-0 rounded-full bg-ink-3" />
                  {t(f, lang)}
                </li>
              ))}
            </ul>

            <StoreBadges lang={lang} className="mt-9" />
          </div>

          <Reveal
            y={16}
            className="hidden md:block"
            /* Solo escritorio: ver la cabecera del archivo. */
          >
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-(--radius-structural) bg-white p-4">
                <Image
                  src="/qr-descargar-app.svg"
                  alt={t(c.qrAlt, lang)}
                  width={168}
                  height={168}
                  /* SVG de 1.2 KB con geometría exacta: pasarlo por el
                     optimizador solo añadiría una petición y riesgo de
                     resampleo en un gráfico donde cada módulo cuenta. */
                  unoptimized
                  className="size-[10.5rem]"
                />
              </div>
              <p className="font-mono text-mono text-ink-3">{t(c.qrLabel, lang)}</p>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
