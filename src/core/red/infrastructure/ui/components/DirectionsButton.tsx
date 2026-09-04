'use client'

import { t, type Locale } from '~/core/common/domain/i18n/config'
import { actions } from '~/core/common/domain/consts/copy'
import { Button } from '@ui/common/components/ui/Button'
import { track } from '~/core/common/infrastructure/analytics'

/**
 * "GET DIRECTIONS" · minimal client island
 *
 * It exists for one reason only: `estacion_como_llegar` is the FINAL
 * CONVERSION of the B2C journey and it was declared in the measurement plan
 * without ever being emitted (§31). The station page is a Server Component, so
 * the only way to instrument the click is to isolate it here.
 *
 * It stays deliberately small: just the event. The external-link warning and
 * the exit icon are handled by `Button` through `external` + `locale`, so that
 * every link leaving the site behaves the same way (WCAG 3.2.5).
 */
export function DirectionsButton({
  locale,
  href,
  slug,
}: {
  locale: Locale
  href: string
  slug: string
}) {
  return (
    <Button
      variant="primary"
      arrow
      external
      locale={locale}
      href={href}
      className="w-full"
      onClick={() => track('estacion_como_llegar', { slug, destino: 'google-maps' })}
    >
      {t(actions.getDirections, locale)}
    </Button>
  )
}
