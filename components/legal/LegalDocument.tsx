import { t, defaultLocale, type Locale } from '@/lib/i18n/config'
import { legalDoc } from '@/content/copy/legal'
import type { LegalDoc } from '@/content/data/legal-docs'
import { formatDate } from '@ui/common/lib/dates'
import { Section, Container } from '@/components/ui/layout'

/**
 * DOCUMENTO LEGAL
 * Ver docs/MASTER-PROJECT-DEFINITION.md §38.
 *
 * Un solo componente para términos y política: la diferencia entre los dos es
 * el contenido, no la forma, y tener dos plantillas casi iguales garantiza que
 * un día diverjan.
 *
 * ── EL ÍNDICE NO ES DECORACIÓN ───────────────────────────────────────────
 * Los términos tienen 38 secciones. Sin índice, encontrar "cancelación" exige
 * recorrer el documento entero con la rueda del ratón; §16 dice que ningún
 * control es decorativo, y el corolario es que un documento así SÍ necesita
 * uno. En pantallas anchas queda fijo a la izquierda mientras se lee; en
 * estrechas va arriba, plegado dentro de un `<details>` nativo —sin JS, sin
 * ARIA a medias— para no empujar el texto media pantalla hacia abajo.
 *
 * ── LA MEDIDA MANDA SOBRE EL ANCHO ───────────────────────────────────────
 * El cuerpo se limita por medida de línea, no por el ancho del contenedor.
 * Usa `measure` (~62 caracteres) y no `measure-narrow` (~48): en un documento
 * de 38 secciones, la columna estrecha multiplica el alto y obliga a un scroll
 * interminable. 62 sigue dentro del rango de §22 y es lo cómodo para una
 * lectura de minutos.
 */
export function LegalDocument({
  doc,
  titulo,
  lang,
}: {
  doc: LegalDoc
  titulo: string
  lang: Locale
}) {
  /* El aviso solo aplica donde el documento NO está en el idioma de la página. */
  const avisoIdioma = lang === defaultLocale ? null : t(legalDoc.spanishOnly, lang)

  const indice = (
    <ol className="space-y-0">
      {doc.secciones.map((s, i) => (
        <li key={s.id}>
          <a
            href={`#${s.id}`}
            className="flex gap-3 border-t border-line py-2.5 text-body-s text-ink-2 transition-colors hover:text-brand"
          >
            <span
              aria-hidden="true"
              className="shrink-0 font-mono text-mono text-ink-3"
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            {/* El heading ya trae su número ("1. Quiénes somos"); se retira
                para no leer "01 1. Quiénes somos". */}
            <span>{s.heading.replace(/^\d+\.\s*/, '')}</span>
          </a>
        </li>
      ))}
    </ol>
  )

  return (
    <Section
      space="none"
      className="pb-(--spacing-section) pt-32 md:pt-40"
    >
      {/* `content` y no `wide`: el cuerpo está limitado por la medida de
          línea, así que en un contenedor ancho el texto no crece —solo aparece
          un tercio de pantalla vacío a la derecha del índice. */}
      <Container>
        <header className="border-b border-line pb-10">
          <p className="font-mono text-mono uppercase tracking-[0.14em] text-ink-3">
            {t(legalDoc.eyebrow, lang)}
          </p>
          <h1 className="mt-5 max-w-[18ch] font-display text-display-xl font-semibold text-balance text-ink">
            {titulo}
          </h1>
          {/* La fecha se FORMATEA por idioma, como el resto del sitio. Antes
              se pintaba la cadena literal del documento y se leía "Last
              updated: 29 de mayo de 2026" en inglés. El texto legal se queda
              en español a propósito; su metadato, no. */}
          <p className="mt-6 font-mono text-mono text-ink-3">
            {t(legalDoc.updatedLabel, lang)}:{' '}
            <time dateTime={doc.actualizadoISO}>{formatDate(doc.actualizadoISO, lang)}</time>
          </p>

          {avisoIdioma ? (
            /* `lang` en el aviso y `lang="es"` en el cuerpo: sin eso un lector
               de pantalla leería el documento entero con la fonética del
               idioma equivocado (§23). */
            <p
              lang={lang}
              className="measure mt-6 border-l-2 border-warn/50 py-1 pl-5 text-body-s text-ink-2"
            >
              {avisoIdioma}
            </p>
          ) : null}
        </header>

        <div className="lg:flex lg:items-start lg:gap-16">
          {/* Índice — plegado en estrecho */}
          <details className="group mt-8 border-b border-line pb-6 lg:hidden">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between font-display text-display-s font-semibold text-ink">
              {t(legalDoc.tocTitle, lang)}
              <span
                aria-hidden="true"
                className="relative grid size-6 place-items-center text-ink-3"
              >
                <span className="absolute h-px w-4 bg-current" />
                <span className="absolute h-px w-4 rotate-90 bg-current transition-transform duration-(--duration-base) group-open:rotate-0 motion-reduce:transition-none" />
              </span>
            </summary>
            <nav
              className="mt-5"
              aria-label={t(legalDoc.tocTitle, lang)}
            >
              {indice}
            </nav>
          </details>

          {/* Índice — fijo en ancho */}
          <nav
            aria-label={t(legalDoc.tocTitle, lang)}
            className="hidden lg:sticky lg:top-28 lg:block lg:max-h-[calc(100dvh-9rem)] lg:w-72 lg:shrink-0 lg:overflow-y-auto lg:pt-12"
          >
            <p className="font-mono text-mono uppercase tracking-[0.14em] text-ink-3">
              {t(legalDoc.tocTitle, lang)}
            </p>
            <div className="mt-4">{indice}</div>
          </nav>

          <div
            lang={defaultLocale}
            className="min-w-0 flex-1 pt-10 lg:pt-12"
          >
            {doc.secciones.map((s) => (
              <section
                key={s.id}
                id={s.id}
                /* `scroll-mt`: sin esto el header fijo tapa el título al que
                   acabas de saltar desde el índice. */
                className="scroll-mt-28 border-t border-line py-9 first:border-t-0 first:pt-0"
              >
                <h2 className="font-display text-display-m font-semibold text-ink">{s.heading}</h2>
                <div className="mt-5 space-y-4">
                  {s.body.map((b, i) =>
                    b.tipo === 'parrafo' ? (
                      <p
                        key={i}
                        className="measure text-body text-ink-2"
                      >
                        {b.texto}
                      </p>
                    ) : (
                      <ul
                        key={i}
                        className="measure space-y-2.5"
                      >
                        {b.items.map((item, j) => (
                          <li
                            key={j}
                            className="flex gap-3 text-body text-ink-2"
                          >
                            <span
                              aria-hidden="true"
                              className="mt-2.5 size-1 shrink-0 rounded-full bg-ink-3"
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ),
                  )}
                </div>
              </section>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}
