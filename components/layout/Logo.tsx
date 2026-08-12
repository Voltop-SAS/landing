/**
 * LOGO · PLACEHOLDER
 *
 * El SVG oficial de marca está pendiente de entrega (§32, decisión abierta O1).
 * Este isotipo provisional existe para no bloquear la composición y se sustituye
 * cambiando ÚNICAMENTE este archivo.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={className ?? "grid size-8 shrink-0 place-items-center rounded-[8px] brand-gradient text-on-brand"}
      aria-hidden="true"
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
        <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" fill="currentColor" />
      </svg>
    </span>
  );
}
