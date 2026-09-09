import { fill, t, type Locale } from '~/core/common/domain/i18n/config'
import { city as cityCopy } from '~/core/network/domain/consts/copy'
import type { CityCoverage } from '~/core/common/infrastructure/data-access'

/**
 * The sentence that describes a city, composed from the dataset's own figures.
 *
 * It lives here and not in the page because a page is a wrapper: this is the
 * copy rule of `cityCopy.lead` turned into code, and the same sentence is used
 * twice — as the page's lead and as its meta description — so it cannot be an
 * expression inside the markup.
 *
 * ── IT TAKES THE COVERAGE, IT DOES NOT LOOK IT UP ─────────────────────────
 * So it is total: given a city that is in the network, there is always a
 * sentence. The earlier version searched the dataset itself and returned `''`
 * when it found nothing, which is how a city with no stations ended up with an
 * EMPTY meta description. Deciding whether the city exists is the route's job,
 * and `getCityCoverage` is where that decision now lives.
 *
 * The singular variant is not politeness: in Spanish and in Portuguese one
 * station is "una potencia" and several are "potencias". A generic pluraliser
 * would write "1 estaciones", which is the seam that gives a generated site
 * away.
 */
export function cityLead(coverage: CityCoverage, locale: Locale): string {
  const template = coverage.count === 1 ? cityCopy.lead.one : cityCopy.lead.many
  return fill(t(template, locale), {
    city: coverage.city.name,
    points: coverage.points,
    kw: coverage.maxKw,
  })
}
