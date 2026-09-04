"use client";

import { track, type EventName, type EventProps } from "@/lib/analytics";

/**
 * Emite un evento cuando se hace clic en lo que envuelve.
 *
 * Existe por la misma razón que `TrackView`: el plan de medición (§31) declara
 * eventos que solo pueden dispararse en cliente, pero casi todas las páginas
 * son Server Components y `Button` también lo es — pasarle un `onClick` desde
 * el servidor no es posible.
 *
 * Envolver en lugar de convertir mantiene `Button` en el servidor: la isla de
 * cliente es este `<span>`, no el botón ni la página. El clic del enlace de
 * dentro burbujea hasta aquí, así que no hace falta tocar el componente
 * envuelto ni duplicar su marcado.
 *
 * `display: contents` — el envoltorio NO existe para el layout. Sin eso, meter
 * un `<span>` alrededor de un botón rompería cualquier `flex` o `grid` del
 * padre, que es un precio absurdo por una métrica.
 */
export function TrackClick({
  event,
  props,
  children,
}: {
  event: EventName;
  props?: EventProps;
  children: React.ReactNode;
}) {
  return (
    <span className="contents" onClick={() => track(event, props)}>
      {children}
    </span>
  );
}
