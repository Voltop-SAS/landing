import Image from "next/image";
import { cn } from "@/lib/cn";
import { t, type Locale } from "@/lib/i18n/config";
import type { MediaAsset } from "@/content/data/media";
import { a11y } from "@/content/copy/common";

/**
 * MEDIA · punto único de render para fotografía y video narrativo.
 * Ver docs/MASTER-PROJECT-DEFINITION.md §20 y §33.
 *
 * Si el asset tiene `src`, se renderiza el material real.
 * Si no, se renderiza un hueco HONESTO que declara qué falta y para qué sirve
 * — no un rectángulo anónimo. Cuando el archivo llegue, basta con rellenar
 * `src` en content/data/media.ts: ningún componente cambia.
 */

const aspects: Record<MediaAsset["aspect"], string> = {
  "16/9": "aspect-[16/9]",
  "4/3": "aspect-[4/3]",
  "3/2": "aspect-[3/2]",
  "1/1": "aspect-square",
  "21/9": "aspect-[21/9]",
  "9/16": "aspect-[9/16]",
};

export function Media({
  asset,
  lang,
  className,
  sizes = "100vw",
  priority = false,
  fill = false,
}: {
  asset: MediaAsset;
  lang: Locale;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** `true` cuando el contenedor padre define la altura (full-bleed, sticky). */
  fill?: boolean;
}) {
  const shape = fill ? "" : aspects[asset.aspect];

  if (asset.src) {
    if (asset.kind === "photo") {
      return (
        <div className={cn("relative overflow-hidden bg-surface-1", shape, className)}>
          <Image
            src={asset.src}
            alt={t(asset.alt, lang)}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover"
          />
        </div>
      );
    }
    return (
      <div className={cn("relative overflow-hidden bg-surface-1", shape, className)}>
        <video
          className="absolute inset-0 h-full w-full object-cover"
          poster={asset.poster ?? undefined}
          preload="none"
          muted
          loop
          playsInline
          autoPlay
          aria-label={t(asset.alt, lang)}
        >
          <source src={asset.src} type="video/mp4" />
        </video>
      </div>
    );
  }

  return <MediaPending asset={asset} lang={lang} fill={fill} className={cn(shape, className)} />;
}

/**
 * Hueco declarado. Comunica QUÉ asset falta y QUÉ función cumple, para que la
 * revisión de diseño pueda evaluar la composición sin el material definitivo.
 * Cumple contraste AA como cualquier otro texto (§33).
 */
export function MediaPending({
  asset,
  lang,
  className,
  fill = false,
}: {
  asset: MediaAsset;
  lang: Locale;
  className?: string;
  /** En composiciones a sangre el contenido se centra y despeja el header. */
  fill?: boolean;
}) {
  return (
    <div
      role="img"
      aria-label={`${t(a11y.placeholderMedia, lang)}. ${t(asset.alt, lang)}`}
      className={cn(
        "relative flex overflow-hidden bg-surface-1",
        /* En composiciones a sangre el rótulo se ancla arriba: el contenido
           narrativo vive abajo y no deben solaparse. */
        fill ? "items-start justify-center p-8 pt-28" : "items-end p-5",
        className
      )}
    >
      {/* Textura estructural discreta: no imita una foto, declara un hueco. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, var(--color-ink-3) 0 1px, transparent 1px 18px)",
        }}
      />

      {/* Declara QUÉ falta y QUÉ función cumple, para poder evaluar la
          composición sin el material definitivo. */}
      <div className={cn("relative flex max-w-md flex-col gap-3", fill && "items-center text-center")}>
        <span className="inline-flex w-fit items-center border border-line-strong px-2 py-1 font-mono text-[0.6875rem] uppercase tracking-wider text-ink-3">
          {asset.kind === "video" ? "Video" : "Foto"}
          {asset.duration ? ` · ${asset.duration}` : ""}
          {" · pendiente"}
        </span>
        <span className="font-mono text-caption text-ink-3">{t(asset.alt, lang)}</span>
      </div>
    </div>
  );
}
