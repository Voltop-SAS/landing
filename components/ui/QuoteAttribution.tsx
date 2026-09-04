import Image from "next/image";
import { t, type Locale } from "@/lib/i18n/config";
import type { MediaAsset } from "@/content/data/media";
import { cn } from "@/lib/cn";

/**
 * ATRIBUCIÓN DE UNA CITA · retrato + nombre + cargo, como una sola unidad.
 *
 * El sitio tiene DOS secciones de cita —la prueba del cliente en el beat 5 y
 * la visión del fundador en el beat 7— y tenían el mismo problema: una línea
 * de texto atribuyendo unas palabras a un nombre, sin persona.
 *
 * Este componente existe para que las dos pertenezcan al mismo sistema sin ser
 * la misma composición. Lo que comparten es la UNIDAD: retrato cuadrado de
 * 96px, hairline, y el nombre sobre el cargo a su derecha. Lo que cambia es
 * DÓNDE se coloca, y eso lo decide la función de cada beat:
 *
 * · En el beat 5 va DESPUÉS de la cita. Es una prueba: primero habla el
 *   cliente, después se acredita quién lo dijo.
 * · En el beat 7 va ANTES. Es una visión, no un testimonio: saber quién habla
 *   cambia cómo se leen 300 caracteres de primera persona.
 *
 * ── EL HUECO NO LLEVA RÓTULO ──────────────────────────────────────────────
 * `MediaPending` declara qué falta y para qué, y con razón: en un bloque
 * grande esa declaración es lo que permite revisar la composición sin el
 * material. Pero en 96px no cabe —el rótulo mide más que el hueco— así que
 * aquí el hueco es una superficie callada y lo que falta se declara donde
 * corresponde: en el registro de `content/data/media.ts`.
 *
 * ── EL REENCUADRE ESTÁ EN CSS, NO EN EL ARCHIVO ───────────────────────────
 * `focus` amplía y ancla la imagen dentro de su caja. Existe porque los
 * retratos no siempre llegan con el encuadre corto que pide una miniatura: el
 * de Herbert Perico llegó de medio cuerpo, y a 96px eso deja la cara en unos
 * 35px, donde no se reconoce a nadie.
 *
 * Se hace por CSS y no editando el archivo a propósito: el original se
 * conserva intacto —sirve para otros usos y a otros tamaños— y el día que
 * llegue un encuadre corto basta con no pasar `focus`. Recortar el archivo
 * habría hecho lo contrario: una decisión de esta miniatura, irreversible,
 * grabada en el asset.
 *
 * ── POR QUÉ CUADRADO Y NO REDONDO ─────────────────────────────────────────
 * El avatar circular es EL patrón genérico, y §12 pide justificar cualquier
 * radio por defecto. El cuadrado con el radio estructural es el mismo lenguaje
 * de superficie que las tarjetas de ciudad y el marco del QR: lee como
 * editorial y no como red social.
 */
export function QuoteAttribution({
  asset,
  lang,
  name,
  role,
  focus,
  className,
}: {
  asset: MediaAsset;
  lang: Locale;
  name: string;
  /** Ya traducido por quien llama: el cargo vive en la colección, no aquí. */
  role: string;
  /**
   * Reencuadre por CSS para retratos que no llegan cortos. Ver la cabecera.
   * Se pasa como clases de escala y origen para que el valor viva en el
   * componente que conoce el asset, no aquí.
   */
  focus?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-5", className)}>
      <div className="relative size-24 shrink-0 overflow-hidden rounded-(--radius-structural) border border-line bg-surface-1">
        {asset.src && (
          <Image
            src={asset.src}
            alt={t(asset.alt, lang)}
            fill
            sizes="96px"
            className={cn("object-cover", focus)}
          />
        )}
      </div>

      <p className="text-body-s">
        <span className="block font-medium text-ink">{name}</span>
        <span className="block text-ink-3">{role}</span>
      </p>
    </div>
  );
}
