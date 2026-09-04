import Link from 'next/link'
import { t, type Locale } from '~/core/common/domain/i18n/config'
import { href, routes } from '~/core/common/domain/i18n/routes'
import { home } from '~/core/home/domain/consts/copy'
import { red } from '~/core/red/domain/consts/copy'
import { actions } from '~/core/common/domain/consts/copy'
import { media } from '~/core/common/infrastructure/content/media'
import { getCitiesWithStations } from '~/core/common/infrastructure/data-access'
import { Section, Container, Eyebrow } from '@/components/ui/layout'
import { Media } from '@/components/ui/Media'
import { Button } from '@/components/ui/Button'
import { TrackClick } from '@/components/analytics/TrackClick'

/**
 * BEAT 1 · HERO — Intensidad: Alta · Registro: Impacto
 * ESTRUCTURA: full-bleed sobre infraestructura real, contenido anclado abajo
 * a la izquierda, columna única, tipografía sobredimensionada.
 *
 * Se eliminó la constelación de nodos: era el cliché visual del sector y
 * contradecía el reencuadre 70% mundo real / 30% comportamiento (§12).
 * El hero ya no lleva métricas: no hay cifras validadas y diez placeholders
 * destruían la credibilidad de la página (§33).
 *
 * Server Component: el titular y el CTA son HTML servido — bueno para LCP.
 */
/**
 * Opacidades del velo de legibilidad, en porcentaje del color `canvas`.
 * Se escriben con `color-mix` sobre el token en lugar de un hex, para que
 * sigan al sistema si el color de fondo cambia (§24: cero literales de color).
 */
const canvas = (pct: number) =>
  pct >= 100
    ? 'var(--color-canvas)'
    : `color-mix(in srgb, var(--color-canvas) ${pct}%, transparent)`

const VEIL = {
  /**
   * En móvil el texto ocupa TODO el ancho, así que el velo tiene que ser
   * vertical. Un degradado izquierda→derecha aquí hace lo contrario de lo que
   * se busca: oscurece el lado donde está el cargador —el sujeto de la foto—
   * y deja más claro el derecho, donde también hay texto. Medido y visto: con
   * lateral el equipo desaparecía; sin él se lee.
   */
  mobile: {
    vertical: `linear-gradient(to top, ${canvas(100)} 0%, ${canvas(96)} 48%, ${canvas(80)} 80%, ${canvas(52)} 100%)`,
  },
  desktop: {
    vertical: `linear-gradient(to top, ${canvas(100)} 0%, ${canvas(90)} 45%, ${canvas(60)} 82%, ${canvas(30)} 100%)`,
    lateral: `linear-gradient(to right, ${canvas(70)} 0%, ${canvas(44)} 48%, transparent 78%)`,
    /**
     * Banda superior, bajo el header.
     *
     * El header es transparente hasta que hay scroll —solo entonces gana
     * `bg-canvas/85` y desenfoque—, así que sobre el hero su texto cae
     * directamente sobre la foto. El velo vertical llega arriba al 22%, que
     * no basta: medido, el 1% más claro detrás de "Nosotros" a 768px daba
     * **1.75:1**. No es un fallo de bloque sino de MANCHAS —las luces azules
     * y los tubos del techo quedan detrás de letras concretas—, y por eso se
     * percibe como que la navegación "se pierde" aunque el promedio pase.
     *
     * Se calibra contra el percentil 99 y no contra la media: bajo un fondo
     * tan irregular, el promedio esconde justo el punto donde el trazo de una
     * letra desaparece.
     *
     * Solo en escritorio. En móvil el velo vertical ya llega al 52% arriba
     * —por eso ahí sí cumplía— y sumarle esta banda lo oscurecería sin motivo.
     */
    superior: `linear-gradient(to bottom, ${canvas(80)} 0%, ${canvas(50)} 12%, transparent 22%)`,
  },
} as const

export function Hero({ lang }: { lang: Locale }) {
  const coverage = getCitiesWithStations()

  return (
    <Section
      register="impacto"
      space="none"
      className="flex min-h-[88dvh] flex-col justify-end overflow-hidden"
    >
      {/* Material real de fondo.
          `object-position` en 30% horizontal: `object-cover` recorta por el eje
          que sobra, y ese eje cambia con el dispositivo. En escritorio el hueco
          es más ancho que la foto (1.82 frente a 1.50), así que conserva TODO
          el ancho y recorta arriba y abajo — ahí el valor horizontal no
          interviene y el vertical centrado deja las estaciones en cuadro. En
          móvil el hueco es mucho más estrecho (0.52), así que conserva todo el
          alto y recorta a los lados: centrado se quedaría con la pared del
          fondo y perdería el cargador con la marca, que está a la izquierda.
          En la fotografía actual el cargador con marca está a la DERECHA del
          centro (~55–68% del ancho), así que el anclaje va al 62%: es el que
          lo deja centrado y legible en el recorte vertical. Se probó contra
          24%, 40% y 52%; por debajo del 50% el equipo queda cortado en el
          borde y el encuadre se reduce al lateral oscuro del vehículo.
          En escritorio el valor no interviene: ahí se conserva todo el ancho. */}
      <div className="absolute inset-0">
        <Media
          asset={media.heroVehiculoCargando}
          lang={lang}
          fill
          priority
          sizes="100vw"
          position="object-[62%_50%]"
          /* Ver `qualities` en next.config.ts: esta foto es el elemento LCP y
             a calidad por defecto se salía del presupuesto de peso. */
          quality={70}
          className="h-full"
        />
      </div>

      {/* ── CAPAS DE LEGIBILIDAD ──────────────────────────────────────────
          Calibradas MIDIENDO sobre la fotografía real, no a ojo. El velo
          anterior (`via-canvas/75`, un solo eje) se diseñó contra fondo plano;
          con la foto puesta dejaba el antetítulo en **1.90:1** a 320px, muy
          lejos del 4.5:1 que exige AA para 12px. Es texto verde de marca sobre
          el panel claro del cargador: el peor caso del hero.

          LA FORMA DEL VELO SIGUE A LA FORMA DEL TEXTO, y por eso cambia con el
          breakpoint:

          · En ESCRITORIO el texto vive en la columna izquierda, así que un
            lateral suave lo protege y deja la mitad derecha del encuadre a la
            vista. Un velo solo vertical obligaría a oscurecer también donde no
            hay texto.
          · En MÓVIL el texto ocupa todo el ancho, así que el velo es vertical.
            El lateral aquí sería contraproducente: oscurece el lado donde está
            el cargador —el sujeto— y deja más claro el derecho, donde también
            hay texto. Se probó y el equipo desaparecía.

          Las intensidades también difieren: en móvil el recorte deja el panel
          claro detrás del texto y hace falta más velo; en escritorio el mismo
          valor llevaba el antetítulo a 8.65:1 cuando basta con ~5, y apagaba la
          fotografía sin necesidad — que es el 70% de la dirección visual (§12).

          RECALIBRADO el 2026-09-01 al cambiar la fotografía del hero. La nueva
          es más clara justo donde va el texto: con el velo anterior el
          antetítulo caía a 3.36:1. Y se recalibró contra el **percentil 99**,
          no contra el 90 —la lección del bloque 17—: bajo un fondo irregular
          el promedio esconde el punto donde el trazo de una letra desaparece.

          Márgenes con el criterio nuevo: +12% en escritorio, +31% en móvil
          (móvil ya cumplía y no se tocó). */}
      <div
        aria-hidden="true"
        className="absolute inset-0 md:hidden"
        style={{ background: VEIL.mobile.vertical }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 hidden md:block"
        style={{ background: VEIL.desktop.vertical }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 hidden md:block"
        style={{ background: VEIL.desktop.lateral }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 hidden md:block"
        style={{ background: VEIL.desktop.superior }}
      />

      {/* Acento de corriente: una sola línea, en el borde. Señal, no textura. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px brand-gradient opacity-70"
      />

      <Container className="relative z-(--z-raised) pb-(--spacing-section-tight) pt-32">
        <Eyebrow tone="brand">{t(home.hero.eyebrow, lang)}</Eyebrow>

        <h1 className="mt-6 max-w-[15ch] font-display text-display-2xl font-semibold text-ink">
          {t(home.hero.title, lang)}
        </h1>

        <p className="mt-7 measure text-body-l text-ink-2">{t(home.hero.lead, lang)}</p>

        <div className="mt-10">
          {/* El evento estaba declarado en §31 y no lo emitía nadie: el header
              pasó a medir la descarga de la app, y ningún CTA de página medía
              la entrada a la red. */}
          <TrackClick
            event="cta_encontrar_cargador_click"
            props={{ ubicacion: 'hero' }}
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

        {/* Señal de scroll. `home.hero.scrollHint` estaba escrito y sin usar, y
            el hero mide 88dvh con un beat de 170vh justo debajo: sin una pista,
            no hay nada que indique que la página continúa. */}
        <p
          aria-hidden="true"
          className="mt-12 flex items-center gap-2 font-mono text-mono uppercase tracking-wider text-ink-3"
        >
          {t(home.hero.scrollHint, lang)}
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            className="animate-bounce motion-reduce:animate-none"
          >
            <path
              d="M12 5v14M6 13l6 6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </p>

        {/* Cobertura real desde la colección de ciudades: contenido útil que
            ancla la composición y abre una segunda entrada al journey B2C.
            No es decoración ni una cifra inventada. */}
        {coverage.length > 0 && (
          <nav
            aria-label={t(red.cities.title, lang)}
            className="mt-8 border-t border-line-strong pt-6"
          >
            <ul className="flex flex-wrap items-center gap-x-8 gap-y-2">
              {/* En móvil la etiqueta ocupa su propia línea. Compartiéndola,
                  "Bogotá" cabía al lado y "Medellín" caía sola a una segunda
                  fila: las dos ciudades quedaban desalineadas entre sí. */}
              <li className="basis-full font-mono text-mono uppercase tracking-wider text-ink-3 sm:basis-auto">
                {t(red.cities.title, lang)}
              </li>
              {coverage.map(({ city }) => (
                <li key={city.slug}>
                  <Link
                    href={href(lang, routes.city(city.slug))}
                    className="inline-flex min-h-11 items-center font-display text-display-s text-ink-2 transition-colors hover:text-brand"
                  >
                    {city.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </Container>
    </Section>
  )
}
