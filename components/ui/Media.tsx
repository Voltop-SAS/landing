import Image from 'next/image'
import { cn } from '@/lib/cn'
import { t, type Locale } from '@/lib/i18n/config'
import type { MediaAsset } from '@/content/data/media'
import { a11y, mediaPlaceholder } from '@/content/copy/common'
import { VideoMedia } from '@/components/ui/VideoMedia'

/**
 * MEDIA · punto único de render para fotografía y video narrativo.
 * Ver docs/MASTER-PROJECT-DEFINITION.md §20 y §33.
 *
 * Si el asset tiene `src`, se renderiza el material real.
 * Si no, se renderiza un hueco HONESTO que declara qué falta y para qué sirve
 * — no un rectángulo anónimo. Cuando el archivo llegue, basta con rellenar
 * `src` en content/data/media.ts: ningún componente cambia.
 */

const aspects: Record<MediaAsset['aspect'], string> = {
  '16/9': 'aspect-[16/9]',
  '4/3': 'aspect-[4/3]',
  '3/2': 'aspect-[3/2]',
  '2/3': 'aspect-[2/3]',
  '1/1': 'aspect-square',
  '21/9': 'aspect-[21/9]',
  '9/16': 'aspect-[9/16]',
}

export function Media({
  asset,
  lang,
  className,
  sizes = '100vw',
  priority = false,
  fill = false,
  aspect,
  position,
  fit = 'cover',
  quality,
  controls,
  corner = false,
}: {
  asset: MediaAsset
  lang: Locale
  className?: string
  sizes?: string
  priority?: boolean
  /** `true` cuando el contenedor padre define la altura (full-bleed, sticky). */
  fill?: boolean
  /**
   * Recorte de la composición cuando difiere del nativo del asset.
   *
   * Antes esto se hacía pasando `className="aspect-[21/9]"`, que NO sustituía
   * la clase nativa sino que la acompañaba: `/empresas` servía
   * `aspect-[4/3] aspect-[21/9]` en el mismo elemento y cuál ganaba dependía
   * del orden de emisión del CSS, no de la intención. Con una prop, el recorte
   * es una decisión declarada y solo hay una clase.
   */
  aspect?: MediaAsset['aspect']
  /**
   * Punto de anclaje del recorte (`object-position`).
   *
   * `object-cover` decide POR QUÉ EJE recorta según la forma del hueco, y en un
   * hero a sangre esa forma cambia por completo entre dispositivos: en
   * escritorio el hueco es más ancho que la foto, así que se conserva todo el
   * ancho y se recorta arriba y abajo; en móvil es mucho más estrecho, así que
   * se conserva todo el alto y se recorta a izquierda y derecha.
   *
   * Por eso los dos valores no compiten: cada uno solo actúa en el régimen
   * donde su eje es el que se recorta. Sin esta prop el anclaje es el centro,
   * que es lo correcto para el resto de composiciones del sitio y por eso
   * sigue siendo el valor por defecto.
   */
  position?: string
  /**
   * `cover` recorta para llenar; `contain` cabe entero dejando aire.
   *
   * Por defecto `cover`, que es lo correcto para todo el material de sitio:
   * una fotografía de una estación o de una ciudad ES un fondo y se recorta
   * sin perder nada.
   *
   * `contain` existe para el material que es un OBJETO AISLADO —el render del
   * cargador— donde el recorte destruye el sujeto: un equipo cortado por
   * arriba o por los lados deja de ser el retrato de un equipo.
   *
   * `position` SIGUE ACTUANDO con `contain`, y conviene saberlo: la imagen se
   * ajusta por un eje y sobra espacio en el otro, y `object-position` decide
   * dónde se apoya dentro de ese sobrante. Es lo que permite pegar el render
   * del beat 3 al bloque de texto en lugar de dejarlo flotando en el centro de
   * su caja.
   */
  fit?: 'cover' | 'contain'
  /**
   * Calidad de codificación. Solo se pasa cuando el peso del asset lo exige:
   * una fotografía muy detallada puede superar el presupuesto de §29 a la
   * calidad por defecto. Los valores admitidos se declaran en `next.config.ts`.
   */
  quality?: number
  /** Ver `VideoMedia`: convierte el vídeo de fondo en pieza con controles. */
  controls?: boolean
  /**
   * Esquina de firma (`--radius-signature`) en la superior derecha.
   *
   * Se activa por bloque y no por defecto: un fondo a sangre no tiene esquinas
   * que redondear, y aplicarlo a todo lo convertiría en textura en lugar de
   * firma. Va en los bloques que viven DENTRO de un contenedor.
   */
  corner?: boolean
}) {
  const shape = fill ? '' : aspects[aspect ?? asset.aspect]
  /**
   * `bg-surface-1` es el fondo que sostiene el hueco mientras la imagen carga,
   * y con `cover` nunca se ve: la foto lo tapa entero.
   *
   * Con `contain` sí se ve, y se convierte en una CAJA. Medido en el beat 3:
   * el render del cargador viene con fondo transparente y este relleno pintaba
   * un rectángulo más claro de 662px con una costura vertical visible contra
   * el fondo de la sección — exactamente la caja que la composición evitaba.
   * Un objeto aislado se apoya sobre el fondo que le toque, sin superficie
   * propia detrás.
   */
  const fondo = fit === 'contain' ? '' : 'bg-surface-1'
  /* `overflow-hidden` ya está en los tres envoltorios, así que el recorte de
     la esquina se aplica también al contenido —foto, vídeo o hueco—. */
  const esquina = corner ? 'rounded-tr-(--radius-signature)' : ''

  if (asset.src) {
    if (asset.kind === 'photo') {
      return (
        <div className={cn('relative overflow-hidden', fondo, shape, esquina, className)}>
          <Image
            src={asset.src}
            alt={t(asset.alt, lang)}
            fill
            sizes={sizes}
            priority={priority}
            quality={quality}
            className={cn(fit === 'contain' ? 'object-contain' : 'object-cover', position)}
          />
        </div>
      )
    }
    /* El video vive en un componente de cliente porque tiene que leer
       `prefers-reduced-motion`, que no es consultable desde el servidor.
       La fotografía —la rama de arriba— sigue siendo servidor puro. */
    return (
      <div className={cn('relative overflow-hidden', fondo, shape, esquina, className)}>
        <VideoMedia
          asset={asset}
          lang={lang}
          controls={controls}
          className={cn(
            'absolute inset-0 h-full w-full',
            fit === 'contain' ? 'object-contain' : 'object-cover',
            position,
          )}
        />
      </div>
    )
  }

  return (
    <MediaPending
      asset={asset}
      lang={lang}
      fill={fill}
      className={cn(shape, esquina, className)}
    />
  )
}

/**
 * Hueco declarado. Comunica QUÉ asset falta y QUÉ función cumple, para que la
 * revisión de diseño pueda evaluar la composición sin el material definitivo.
 * Cumple contraste AA como cualquier otro texto (§33).
 *
 * DOS COLOCACIONES, no una:
 *
 * - Sin `fill` (el hueco ocupa su propio bloque) el rótulo va abajo a la
 *   izquierda con su descripción completa: nada más compite por ese espacio.
 *
 * - Con `fill` (el hueco es el FONDO de una composición) el rótulo se reduce a
 *   la insignia y se ancla a una esquina. Antes iba centrado arriba con la
 *   descripción en dos líneas y, a 390px, se pintaba literalmente encima del
 *   eyebrow y del titular del hero — texto sobre texto en la primera pantalla
 *   del sitio, que es justo lo que §22 prohíbe ("los gráficos de fondo nunca se
 *   superponen al contenido"). En móvil desaparece del todo: el hueco ya se
 *   anuncia por `aria-label` y la descripción vive en el registro de media.
 */
export function MediaPending({
  asset,
  lang,
  className,
  fill = false,
}: {
  asset: MediaAsset
  lang: Locale
  className?: string
  /** `true` cuando el hueco es el fondo de una composición con contenido encima. */
  fill?: boolean
}) {
  const kind = asset.kind === 'video' ? mediaPlaceholder.video : mediaPlaceholder.photo
  const badge = `${t(kind, lang)}${asset.duration ? ` · ${asset.duration}` : ''} · ${t(
    mediaPlaceholder.pending,
    lang,
  )}`

  return (
    <div
      role="img"
      aria-label={`${t(a11y.placeholderMedia, lang)}. ${t(asset.alt, lang)}`}
      className={cn(
        'relative flex overflow-hidden bg-surface-1',
        fill ? 'items-start justify-end p-4 md:p-6' : 'items-end p-5',
        className,
      )}
    >
      {/* Textura estructural discreta: no imita una foto, declara un hueco. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(135deg, var(--color-ink-3) 0 1px, transparent 1px 18px)',
        }}
      />

      {fill ? (
        <span className="relative hidden w-fit items-center border border-line-strong px-2 py-1 font-mono text-[0.6875rem] uppercase tracking-wider text-ink-3 sm:inline-flex">
          {badge}
        </span>
      ) : (
        <div className="relative flex max-w-md flex-col gap-3">
          <span className="inline-flex w-fit items-center border border-line-strong px-2 py-1 font-mono text-[0.6875rem] uppercase tracking-wider text-ink-3">
            {badge}
          </span>
          <span className="font-mono text-caption text-ink-3">{t(asset.alt, lang)}</span>
        </div>
      )}
    </div>
  )
}
