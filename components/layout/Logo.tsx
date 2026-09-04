import Image from 'next/image'

/**
 * LOGO OFICIAL DE VOLTOP
 *
 * Sustituye al isotipo provisional que ocupaba este archivo (§32, decisión
 * abierta O1: entregado el 2026-09-01). Sirve el archivo oficial tal cual,
 * desde `public/Logo_voltop.svg`, sin redibujarlo ni recomponerlo.
 *
 * ── EL ARCHIVO ES EL LOCKUP COMPLETO ──────────────────────────────────────
 * `Logo_voltop.svg` contiene símbolo Y logotipo ("Voltop"), 529×124. El
 * placeholder anterior era SOLO el símbolo, y la palabra la ponía un `<span>`
 * al lado, en Header y en Footer. Con el archivo oficial ese `<span>` pasaría
 * a duplicar la marca —"Voltop Voltop"—, así que se retira de ambos: no es un
 * cambio de contenido, es la palabra que ahora aporta el propio asset.
 *
 * ── POR QUÉ 32px DE ALTO ──────────────────────────────────────────────────
 * El símbolo ocupa 123.107 de los 124 de alto del archivo, así que a `h-8`
 * (32px) el símbolo mide 31.8px: exactamente el tamaño que tenía el
 * placeholder (`size-8`). El logotipo cae donde estaba el `<span>` y con un
 * peso óptico equivalente. La instancia conserva su tamaño, su sitio y su
 * espaciado; lo único que cambia es el asset.
 *
 * ── DECORATIVO, COMO ANTES ────────────────────────────────────────────────
 * `alt=""` y `aria-hidden`: el nombre accesible lo da el `aria-label` del
 * enlace que lo envuelve, igual que hacía el placeholder. Anunciarlo aquí
 * duplicaría el rótulo del enlace.
 *
 * `object-contain` protege la proporción. El reset de Tailwind aplica
 * `max-width: 100%` a toda imagen; entre ~770 y ~810px de viewport el header
 * va justo de sitio —ahí conviven nav, selector de idioma y CTA— y el enlace
 * que envuelve la marca se comprime unos píxeles. Con la altura fijada en
 * `h-8` y el ancho topado por el padre, el logo se ESTIRABA: medía 3.96 de
 * proporción en lugar de 4.27. Con `object-contain` mantiene la proporción y,
 * en esa franja estrecha, se ajusta un ~5% en lugar de deformarse.
 *
 * `unoptimized` porque un SVG es vectorial: no hay nada que redimensionar ni
 * recomprimir, y el optimizador de Next rechaza SVG salvo que se habilite
 * `dangerouslyAllowSVG`. `priority` conserva el comportamiento anterior —el
 * SVG estaba en línea y se pintaba con el documento—; sin él, `next/image`
 * cargaría en diferido y la marca aparecería con retraso.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/Logo_voltop.svg"
      alt=""
      aria-hidden="true"
      width={529}
      height={124}
      priority
      unoptimized
      className={className ?? 'h-8 w-auto shrink-0 object-contain'}
    />
  )
}
