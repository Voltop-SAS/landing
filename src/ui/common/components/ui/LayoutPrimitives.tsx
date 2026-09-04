import { cn } from '@ui/common/lib/cn'

/**
 * PRIMITIVAS DE ESTRUCTURA
 * Ver docs/MASTER-PROJECT-DEFINITION.md §12 y §24.
 *
 * El ritmo de página se construye combinando `width` y `space`.
 * REGLA: dos secciones consecutivas no pueden compartir la misma combinación.
 */

type Width = 'content' | 'narrow' | 'wide' | 'full'

/**
 * ── EL RIEL ───────────────────────────────────────────────────────────────
 *
 * Antes cada ancho se centraba de forma INDEPENDIENTE, así que el borde
 * izquierdo del contenido saltaba según el contenedor. Medido a 1440px:
 *
 *   header y `content` → 148px
 *   `wide`             →  48px
 *   `narrow`           → 380px
 *
 * En `/nosotros` el riel iba 380 → 148 → 380 → 148 al bajar, y en la ficha de
 * estación el bloque de foto sobresalía 100px a la izquierda del titular. §13
 * pide "alineación óptica revisada"; no había ni alineación estructural.
 *
 * Ahora hay UN riel, el de `content`, y los demás anchos se relacionan con él:
 *
 * - `content` — el riel. Todo se alinea aquí por defecto.
 * - `narrow`  — MISMO borde izquierdo, medida más corta. Es una columna de
 *               lectura colgada del riel, no un bloque flotando en el centro.
 * - `wide`    — el ÚNICO que rompe el riel, y lo hace a los dos lados por
 *               igual: es un sangrado deliberado. Reservado a MEDIA. Un bloque
 *               de texto o de datos en `wide` es el bug que teníamos, no una
 *               decisión (ver `NetworkIndex`, que pasó a `content`).
 *
 * `align="center"` es la excepción declarada: composiciones centradas a
 * propósito (`BusinessIntro`, `VisionQuote`). Al ser explícita, se distingue de
 * un descuadre accidental.
 * ──────────────────────────────────────────────────────────────────────────
 */
type Align = 'rail' | 'center'

const widths: Record<Width, string> = {
  narrow: 'max-w-(--container-narrow)',
  content: 'max-w-(--container-content)',
  wide: 'max-w-(--container-wide)',
  full: 'max-w-none',
}

export function Container({
  children,
  width = 'content',
  align = 'rail',
  className,
}: {
  children: React.ReactNode
  width?: Width
  /** `rail` cuelga del borde izquierdo de `content`. `center` centra a propósito. */
  align?: Align
  className?: string
}) {
  const frame = 'mx-auto w-full px-(--spacing-gutter)'

  /* `narrow` sobre el riel: marco de `content` + medida corta dentro. Es la
     única combinación que necesita dos nodos; el resto es un solo div. */
  if (width === 'narrow' && align === 'rail') {
    return (
      <div className={cn(frame, widths.content, className)}>
        <div className={widths.narrow}>{children}</div>
      </div>
    )
  }

  return <div className={cn(frame, widths[width], className)}>{children}</div>
}

type Space = 'tight' | 'base' | 'loose' | 'none'
type Register = 'silencio' | 'impacto'

/**
 * Cada sección aporta la MITAD de la distancia declarada, así que el hueco
 * entre dos secciones ES el token y no su suma. Ver el comentario de
 * `--spacing-section-*` en globals.css: antes `base` seguido de `base` dejaba
 * 288px de vacío en cada par de secciones de cada página interna.
 */
const spaces: Record<Space, string> = {
  none: '',
  tight: 'py-(--spacing-block-tight)',
  base: 'py-(--spacing-block)',
  loose: 'py-(--spacing-block-loose)',
}

/**
 * Sección con registro visual e intensidad de ritmo explícitos.
 * - `silencio`: estructural, plano, editorial. Deja respirar la información.
 * - `impacto`: energía y textura. Reservado a los puntos narrativos clave.
 *
 * `register` es la decisión visual nº8 confirmada del proyecto y hasta ahora
 * NO SE USABA en ningún componente: `CloseCta` era el único con textura y se la
 * aplicaba a mano. Los beats de impacto de la Home (`Hero`,
 * `InfrastructureSignature`, `ProofCase`, `CloseCta`) ya pasan por aquí, así que
 * el concepto existe en el código y no solo en la documentación.
 *
 * Acepta `ref` porque el signature moment necesita medir su propio scroll.
 *
 * `impacto` aplica SOLO la textura. No añade `overflow-hidden`: un `overflow`
 * distinto de `visible` crea un contenedor de scroll y rompería el
 * `position: sticky` del signature moment — el mismo motivo por el que
 * globals.css usa `overflow-x: clip` en `body` y no `hidden`. Cada sección
 * declara su recorte donde lo necesita.
 */
export function Section({
  id,
  children,
  register = 'silencio',
  space = 'base',
  className,
  as: Tag = 'section',
  ariaLabelledby,
  ref,
}: {
  id?: string
  children: React.ReactNode
  register?: Register
  space?: Space
  className?: string
  as?: 'section' | 'div' | 'article'
  ariaLabelledby?: string
  ref?: React.Ref<HTMLElement>
}) {
  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement>}
      id={id}
      aria-labelledby={ariaLabelledby}
      className={cn(
        'relative scroll-mt-24',
        spaces[space],
        register === 'impacto' && 'grain',
        className,
      )}
    >
      {children}
    </Tag>
  )
}

/**
 * Antetítulo. Sin punto de gradiente: el gradiente es señal, no decoración
 * repetida en cada sección (§12, disciplina del gradiente).
 */
export function Eyebrow({
  children,
  className,
  tone = 'muted',
}: {
  children: React.ReactNode
  className?: string
  tone?: 'muted' | 'brand'
}) {
  return (
    <p
      className={cn(
        'font-mono text-eyebrow uppercase',
        tone === 'brand' ? 'text-brand' : 'text-ink-3',
        className,
      )}
    >
      {children}
    </p>
  )
}

/**
 * ── EL REGISTRO MEDIO ─────────────────────────────────────────────────────
 *
 * Las páginas internas saltaban de un `h1` de 72px a `h2` de 12px: el
 * encabezado de sección era MÁS PEQUEÑO que el párrafo que introducía. Medido
 * en el DOM renderizado:
 *
 *   /red/estacion/…   h1 72px · h2 12px · h2 12px · h2 12px
 *   /red/medellin     h1 72px · h2 12px · h2 12px
 *   /legal/privacidad h1 72px · h2 12px
 *
 * Sin registro intermedio no hay jerarquía, solo un título gigante y una lista
 * plana. §13: "el ojo sabe siempre dónde mirar primero" — no lo sabía.
 *
 * Este componente da los dos niveles que faltaban y, de paso, consolida el
 * `<Eyebrow>` + `<h2 className="mt-4 font-display text-display-l …">` que se
 * repetía a mano once veces con clases ligeramente distintas.
 *
 * Tamaños, y para qué es cada uno:
 * - `l` (52px) — apertura de sección con peso narrativo propio.
 * - `m` (36px) — encabezado de sección dentro de una página. El registro que
 *                faltaba. Es el que sustituye a los `h2` de mono.
 * - `s` (24px) — subsección o bloque de datos.
 *
 * El mono de 12px sigue existiendo, pero vuelve a su sitio: `kicker` y
 * etiquetas de dato. Deja de ser un encabezado.
 * ──────────────────────────────────────────────────────────────────────────
 */
const headingSizes = {
  l: 'text-display-l',
  m: 'text-display-m',
  s: 'text-display-s',
} as const

/**
 * ── EL TONO DEL ANTETÍTULO ES UNA REGLA, NO UN VALOR POR DEFECTO ──────────
 * `muted` es el valor por omisión, y eso había producido una incoherencia
 * visible: en la Home cuatro beats declaraban `brand` y tres se habían quedado
 * en gris sin que nadie lo decidiera.
 *
 * La regla, fijada el 2026-09-04:
 *
 * · En la HOME el antetítulo va en `brand`. Es el registro narrativo: los ocho
 *   beats son una secuencia y el acento verde es lo que los encadena.
 * · En las páginas INTERNAS va en `muted`. Ahí el antetítulo rotula secciones
 *   de documentación —capacidades, criterios, FAQ— y un acento de marca por
 *   sección lo convertiría en textura.
 *
 * La única excepción es la evidencia de `/empresas`, que es narrativa dentro de
 * una interna y lo declara explícitamente.
 */
export function SectionHeading({
  children,
  id,
  kicker,
  kickerTone = 'muted',
  size = 'l',
  as: Tag = 'h2',
  className,
  measure,
}: {
  children: React.ReactNode
  id?: string
  /** Antetítulo. Va ANTES del título en la lectura y en el DOM. */
  kicker?: React.ReactNode
  kickerTone?: 'muted' | 'brand'
  size?: keyof typeof headingSizes
  as?: 'h2' | 'h3'
  className?: string
  /** Limita la medida del titular en caracteres, para titulares largos. */
  measure?: string
}) {
  return (
    <div className={className}>
      {kicker && <Eyebrow tone={kickerTone}>{kicker}</Eyebrow>}
      <Tag
        id={id}
        className={cn(
          'font-display font-semibold text-balance text-ink',
          headingSizes[size],
          kicker ? 'mt-4' : null,
          measure,
        )}
      >
        {children}
      </Tag>
    </div>
  )
}

/** Línea divisoria estructural — el lenguaje de "ficha técnica" de Voltop. */
export function Rule({ className }: { className?: string }) {
  return <hr className={cn('border-0 border-t border-line', className)} />
}

/**
 * ── LISTA DE PROCESO ──────────────────────────────────────────────────────
 *
 * El mismo tratamiento —hairline superior + número mono `01/02/03` + título
 * `display-s` + cuerpo— se repetía SEIS veces: los segmentos de la Home, los
 * pasos de "cómo cargar", las capacidades de /empresas, los beneficios del
 * selector, los pilares de /nosotros y los contenidos legales. Todas las listas
 * del sitio eran la misma lista, y eso —más que la repetición de layouts— es
 * por lo que todas las páginas se sentían iguales.
 *
 * La regla que las separa: EL NÚMERO SOLO DONDE EL ORDEN SIGNIFICA ALGO.
 *
 * - Un proceso ("evaluamos → instalamos → operamos → reportamos") es una
 *   secuencia: el número informa y aquí se agranda hasta ser el ancla visual.
 * - Unos pilares o unos beneficios NO son una secuencia. Numerarlos era una
 *   señal falsa: sugería un orden que no existe. Ahí el número desaparece y el
 *   ancla pasa a ser el título (ver los llamadores).
 *
 * Este componente se queda con el primer caso, que es el único con reuso real.
 */
export function ProcessList({
  items,
  className,
}: {
  items: { step: string; title: string; body: string }[]
  className?: string
}) {
  return (
    <ol className={cn('grid gap-x-10 gap-y-12', className)}>
      {items.map((item) => (
        <li
          key={item.step}
          className="relative border-t border-line-strong pt-6"
        >
          <span
            aria-hidden="true"
            className="block font-display text-display-l font-semibold leading-none text-transparent [-webkit-text-stroke:1px_var(--color-line-control)]"
          >
            {item.step}
          </span>
          <h3 className="mt-5 font-display text-display-s font-semibold text-ink">{item.title}</h3>
          <p className="mt-2 text-body-s text-ink-2">{item.body}</p>
        </li>
      ))}
    </ol>
  )
}
