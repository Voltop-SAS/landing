'use client'

import { t, type Locale } from '~/core/common/domain/i18n/config'
import { actions } from '@/content/copy/common'
import { Button } from '@/components/ui/Button'
import { track } from '@/lib/analytics'

/**
 * "CÓMO LLEGAR" · isla de cliente mínima
 *
 * Existe por una sola razón: `estacion_como_llegar` es la CONVERSIÓN FINAL del
 * journey B2C y estaba declarada en el plan de medición sin emitirse nunca
 * (§31). La ficha de estación es un Server Component, así que el único modo de
 * instrumentar el clic es aislarlo aquí.
 *
 * Se queda deliberadamente pequeño: solo el evento. El aviso de enlace externo
 * y el icono de salida los resuelve `Button` con `external` + `lang`, para que
 * todo enlace que salga del sitio se comporte igual (WCAG 3.2.5).
 */
export function DirectionsButton({
  lang,
  href,
  slug,
}: {
  lang: Locale
  href: string
  slug: string
}) {
  return (
    <Button
      variant="primary"
      arrow
      external
      lang={lang}
      href={href}
      className="w-full"
      onClick={() => track('estacion_como_llegar', { slug, destino: 'google-maps' })}
    >
      {t(actions.getDirections, lang)}
    </Button>
  )
}
