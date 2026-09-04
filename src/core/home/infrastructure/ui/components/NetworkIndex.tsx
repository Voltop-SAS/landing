import Link from 'next/link'
import { t, type Locale } from '~/core/common/domain/i18n/config'
import { href, routes } from '~/core/common/domain/i18n/routes'
import { home } from '~/core/home/domain/consts/copy'
import { actions, units } from '~/core/common/domain/consts/copy'
import { media } from '~/core/common/infrastructure/content/media'
import { getCitiesWithStations, getNetworkSummary } from '~/core/common/infrastructure/data-access'
import { Section, Container, SectionHeading } from '@ui/common/components/ui/LayoutPrimitives'
import { Media } from '@ui/common/components/ui/Media'
import { Button } from '@ui/common/components/ui/Button'
import { Reveal } from '@ui/common/components/ui/Reveal'
import { CountUp } from '@ui/common/components/ui/CountUp'

/**
 * BEAT 3 · OUR NETWORK
 * See docs/MASTER-PROJECT-DEFINITION.md §12, §14 and §33.
 *
 * ── THE COMPOSITION COMES FROM A REFERENCE, AND THAT CHANGES THE RULES ───
 * This beat was redesigned against a specific visual reference (2026-09-04)
 * that is the source of truth for its composition: hierarchy, proportions,
 * vertical rhythm, card treatment, metrics block and CTA.
 *
 * Before deciding anything the mockup was SAMPLED rather than estimated by
 * eye, and that avoided two mistakes:
 *
 * · The headline LOOKED like it had two tones —the second line appeared grey—.
 *   Measured, the lightest pixel of both lines is identical (253,253,253): it
 *   was the mockup's antialiasing at that size. One tone, not two.
 * · Medellín's counter appears in cyan and Bogotá's in grey. They are not two
 *   styles: it is the SAME card in its hover state. It is implemented as
 *   hover.
 *
 * Every other colour in the mockup maps to tokens that already existed —the
 * eyebrow to `brand`, the paragraph to `ink-2`, the labels to `ink-3`, the
 * borders to `line`— so there was no need to invent a single one.
 *
 * ── TWO AREAS, ONE SINGLE COMPOSITION ────────────────────────────────────
 * Left 52% for the content, right 48% reserved for the charger render. The
 * right side is NOT an image container: it has no background, border or
 * label, so the section reads as an editorial composition with air on the
 * right and not as "text block | photo box". When the render arrives, it will
 * occupy that air without moving a single pixel on the left.
 *
 * ── SOLID BACKGROUND: WHAT WENT AWAY ─────────────────────────────────────
 * This beat used to have a heavily dimmed floor photograph with two veils and
 * FLOW —contained parallax— applied in block 47. The reference calls for a
 * solid `canvas` background with no gradients or textures, so the photograph
 * and the FLOW are out. The cards' stagger (DEPTH expressive) is kept.
 *
 * When the charger render arrives, IT is the piece that should carry FLOW: a
 * large vertical object inside a fixed frame is exactly the case that
 * primitive exists for.
 *
 * ── THE FIGURES ARE NOT WRITTEN ──────────────────────────────────────────
 * Points, power ratings and connectors are COMPUTED from the dataset in
 * `getNetworkSummary()`. A hand-written figure stops being true the moment a
 * station is added, and §33 forbids inventing figures: the safest way not to
 * invent them is to be unable to write them.
 */
export function NetworkIndex({ locale }: { locale: Locale }) {
  const summary = getNetworkSummary()
  const cobertura = getCitiesWithStations()

  const cifras: { label: string; value: React.ReactNode }[] = [
    /* The only one that counts up is the one that IS a number. "22–80 kW"
       and the connector list are not quantities: animating them would be
       motion for motion's sake. */
    { label: t(home.network.stats.points, locale), value: <CountUp value={summary.points} /> },
    {
      label: t(home.network.stats.power, locale),
      value:
        summary.minPowerKw && summary.maxPowerKw
          ? `${summary.minPowerKw}–${summary.maxPowerKw} kW`
          : '—',
    },
    { label: t(home.network.stats.connectors, locale), value: summary.connectors.join(' · ') },
  ]

  /** Each city's asset, by slug. See the CITIES block in the media registry. */
  const cityPhoto: Record<string, typeof media.cityBogota | undefined> = {
    bogota: media.cityBogota,
    medellin: media.cityMedellin,
  }

  return (
    <Section
      id="red"
      space="base"
      /* Solid background, no layers. See the note above. */
      className="bg-canvas"
      ariaLabelledby="red-title"
    >
      <Container>
        {/* ── THE TWO HALVES, ON THE RAIL ─────────────────────────────────
            The 56/44 split is not aesthetic: it is CALCULATED so the render
            fills its column with nothing left over.

            The render is a 2:3 object served with `contain`, so its width is
            decided by the available height. With the column at 48% there were
            70px left over that had to go somewhere, and both options were bad:
            towards the text it separated it from it, towards the edge it left
            a gap on the right. At 44% —486px at 1440— the object occupies its
            column EXACTLY and there is nothing left to place.

            And it returns to the rail. It used to run out to the window's
            edge, and that fixed one thing by creating another: it was the only
            section on the site whose content escaped the container, so it read
            as a foreign block. Measured at 1440, the margins are now 148px on
            the left and 162 on the right: the composition is centred in the
            layout like every other section.

            NO FORCED HEIGHT. There was a version with `min-h` on the grid so
            the object would fill 486px of width, and the price was that the
            section measured 874px with 575 of content: **300px of air no other
            section on the site has**, and that was what pulled it out of the
            page's rhythm. The object's scale is not worth that price.

            The row now measures what the text measures, and the object
            —served with `contain`— measures exactly the same height. That is
            the link that was missing: the equipment and the content block
            share their vertical span to the pixel, top and bottom, instead of
            one overhanging the other. Two elements that start and end together
            read as a composition; one floating beside the other does not.

            The 65/35 split comes from that: with wider content the text wraps
            less, the row drops in height and the object narrows in proportion.
            The column is dimensioned to the resulting object so no air is left
            over, just as before. */}
        <div className="grid items-stretch gap-14 lg:grid-cols-[minmax(0,65fr)_minmax(0,35fr)] lg:gap-10">
          <div>
            {/* `SectionHeading` and not an eyebrow plus a hand-rolled `h2`:
                it is the system's primitive, and with it the eyebrow/title
                relationship —the `mt-4`, the `text-balance`, the kicker's
                tone— is the same as in every other section of the site.

                `size="m"` is measured, not estimated: in the mockup the
                headline's cap height corresponds to ~38px for its column, and
                `display-l` gives 52px at 1440. At 52px it broke into THREE
                lines and the reference has TWO. The size is not a preference:
                it is what produces that rhythm. */}
            <SectionHeading
              id="red-title"
              kicker={t(home.network.eyebrow, locale)}
              kickerTone="brand"
              size="m"
            >
              {t(home.network.title, locale)}
            </SectionHeading>

            <p className="measure mt-6 text-body-l text-ink-2">{t(home.network.lead, locale)}</p>

            {/* ── COVERAGE CARDS ──────────────────────────────────────────
                The photograph is the dominant element and the text lives
                INSIDE it, over the image. These are not system cards with an
                image on top: they are a frame with content anchored at the
                bottom, which is what the reference calls for.

                Side by side from `sm` up, stacked below that. Two columns on
                mobile were tried —the reference has them that way— and at
                390px each card comes out at 164px: the counter breaks onto two
                lines ("2 estaciones / en operación") and the circular button
                eats a third of the width. Stacked, each one gets 341px and
                becomes a card again; the relationship between the two cities
                is preserved by adjacency, just vertically. */}
            <ul className="mt-9 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {cobertura.map(({ city, count, operational }, i) => (
                <Reveal
                  as="li"
                  key={city.slug}
                  index={i}
                  level="expressive"
                >
                  <Link
                    href={href(locale, routes.city(city.slug))}
                    className="press group relative block overflow-hidden rounded-(--radius-structural) border border-line transition-[transform,border-color] duration-(--duration-fast) ease-(--ease-standard) hover:-translate-y-1 hover:border-line-strong motion-reduce:hover:translate-y-0"
                  >
                    {/* THE FRAME. The card fixes the aspect ratio and the
                        material fills it with `fill`, not the other way round.

                        `fill` is not a technical detail: without it, the
                        declared placeholder prints its label AND its full
                        description inside the card, and that description
                        landed right on top of the city's name. With `fill`,
                        the placeholder shrinks to a badge in one corner and
                        the card's content reads. When the photo arrives, the
                        badge disappears on its own. */}
                    <div className="relative aspect-[16/9] w-full">
                      <Media
                        asset={cityPhoto[city.slug] ?? media.cityBogota}
                        locale={locale}
                        fill
                        /* The three ranges follow the grid above
                           (`grid-cols-1 sm:grid-cols-2`) inside the 65fr
                           column, measured in the browser:

                           · <640px  → one column, the card occupies ~87vw
                           · 640px+  → two columns of the rail, ~45vw
                           · 1024px+ → two columns inside the 65fr; the box
                                       hits its maximum of 353px at 1280px

                           Declaring it too small does not break anything
                           visible: the browser serves a smaller file and
                           SCALES IT UP. With the previous `45vw`, at 390px the
                           real box measured 339px and 384px of image arrived
                           for 678px of physical pixels —0.57×, a photo
                           upscaled to 175%— the same defect seen in Helbert's
                           portrait. */
                        sizes="(min-width: 1024px) 23rem, (min-width: 640px) 45vw, 90vw"
                        className="h-full w-full"
                      />
                    </div>

                    {/* Legibility veil: it is not decoration, it is what
                        guarantees the name reads over any photograph. Bottom
                        to top, because the text is anchored at the bottom. */}
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/55 to-transparent"
                    />

                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
                      <div className="min-w-0">
                        {/* The hover accent goes on the NAME, as on the city
                            cards on /red. In the reference it appears on the
                            counter, but the site has already decided where a
                            city card responds, and one thing per card: two
                            competing accents are what make a hover read as a
                            flicker. */}
                        <h3 className="font-display text-display-s font-semibold text-ink transition-colors duration-(--duration-fast) group-hover:text-brand">
                          {city.name}
                        </h3>
                        {/* `font-mono text-mono`: it is the register the
                            whole site uses to write a station count —see the
                            cards on /red—. A technical figure in running text
                            breaks that language. */}
                        <p className="mt-1.5 font-mono text-mono text-ink-2">
                          <CountUp value={operational} />{' '}
                          {t(operational === 1 ? units.station : units.stations, locale)}{' '}
                          {t(home.network.live, locale)}
                          {operational !== count ? (
                            <span className="text-ink-3"> · {count} total</span>
                          ) : null}
                        </p>
                      </div>

                      {/* Circular button with an arrow. It is the card's
                          affordance, so it is marked as decorative: the link
                          already wraps everything and announcing it again
                          would duplicate the target for a screen reader. */}
                      <span
                        aria-hidden="true"
                        className="grid size-10 shrink-0 place-items-center rounded-(--radius-pill) border border-line-control text-ink transition-[transform,background-color,border-color] duration-(--duration-fast) ease-(--ease-overshoot) group-hover:translate-x-0.5 group-hover:border-brand group-hover:text-brand motion-reduce:group-hover:translate-x-0"
                      >
                        →
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </ul>

            {/* ── METRICS ─────────────────────────────────────────────────
                A single horizontal container with hairlines: spec-sheet
                register, not slogan register. With no fill of its own
                —sampling the mockup gives the same tone as the background— so
                only the border defines it.

                The widths are NATURAL and not three equal columns: in the
                reference the connectors cell is visibly wider because its
                content is. `flex` with `divide-x` gives that for free. Below
                `sm` it stacks with horizontal hairlines, which at 390px is the
                only way "GB/T · CCS1 · CCS2" does not break. */}
            <dl className="mt-3 flex flex-col gap-px overflow-hidden rounded-(--radius-structural) border border-line bg-line sm:flex-row sm:flex-wrap">
              {cifras.map((c) => (
                <div
                  key={c.label}
                  className="grow bg-canvas px-4 py-4"
                >
                  {/* `gap-px` over `bg-line` instead of `divide-x`: it is the
                      technique the site uses to draw a hairline grid —see the
                      city list on /red— and it also behaves well when a cell
                      moves to another row.

                      `grow` shares the surplus between the three: without it
                      the cells measured whatever their content did and left an
                      empty ~20px strip against the right border, with the
                      background hairline showing through. The natural
                      proportions are kept —connectors is still the widest—
                      only now they fill the container.

                      `tracking-wider` and not a loose value: the label was the
                      element forcing the distribution, and a literal 0.14em
                      was outside the tokens as well. */}
                  <dt className="font-mono text-mono uppercase tracking-wider text-ink-3">
                    {c.label}
                  </dt>
                  {/* The VALUE never breaks: "22–80 / kW" and
                      "GB/T · CCS1 · / CCS2" are the two ways a figure stops
                      reading as a figure. The label may drop to two lines at
                      the tightest widths —it is description, not figure— and
                      `flex-wrap` lets a whole cell move to a second row rather
                      than overflow. */}
                  <dd className="mt-1.5 whitespace-nowrap font-display text-display-s font-semibold text-ink">
                    {c.value}
                  </dd>
                </div>
              ))}
            </dl>

            {/* ── CTA AND MICROCOPY ───────────────────────────────────────
                On a single row, like the reference. The microcopy is NOT a
                second CTA: it links to nothing and its brand dot is the row's
                only colour accent, so it does not compete. */}
            {/* `ghost`, the same variant as beat 2's CTA. The reference brings
                a light filled button, but that would have meant adding a fifth
                variant to the system for a single button, and a button
                language with one exception stops being a language. */}
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Button
                variant="ghost"
                arrow
                href={href(locale, routes.network)}
              >
                {t(actions.seeNetwork, locale)}
              </Button>
              {/* Mono in caps: it is how the site writes a note beside a CTA
                  —see beat 2's caption, "NUEVA ESTACIÓN · MEDELLÍN"—. The
                  reference has it in running text, but that slot already has a
                  decided register, and two neighbouring sections speaking
                  differently in the same place is what gets noticed.

                  NO COLOUR DOT. The reference has a green one in front and it
                  was removed: it exists nowhere else on the site, so it was an
                  ornament with a single appearance — exactly what §12 calls a
                  decorative chip with no function. Beat 2's caption says its
                  piece without one. */}
              <p className="font-mono text-mono uppercase tracking-wider text-ink-3">
                {t(home.network.moreCities, locale)}
              </p>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              THE CHARGER RENDER
              ══════════════════════════════════════════════════════════════
              Delivered on 2026-09-04 and placed in the slot this section had
              already reserved: not a single pixel of the left column had to
              move, which was exactly the point of reserving it.

              NO BOX. The PNG comes with a transparent background (verified:
              alpha 0 at the edges), so the equipment sits directly on the
              section's `canvas`. No background of its own, no border, no
              shadow: the right half is still air with an object in it, which
              is what makes the two halves read as ONE composition and not as
              "text | photo".

              `object-contain` and not `cover`: a charger cropped at the top or
              at the sides stops being the portrait of a piece of equipment.

              NO FLOW, AND THAT WAS TESTED. It looked like the ideal place for
              parallax —a large vertical object, and this beat had been left
              without a depth moment after losing its background photograph—
              but FLOW CROPS BY DESIGN: its frame clips an interior 24% taller,
              and with `object-contain` that cut the charger off top and
              bottom. Measured: 135px of equipment gone. A cropped object stops
              being the portrait of an object, so the render stays still and
              whole. The general rule was written down in `Flow`, so nobody
              tries it again.

              IT RETURNS TO THE RAIL, AND THAT IS THE DEFINITIVE FIX. For a
              while it ran out to the window's edge: that fixed the two-boxes
              problem but created another — it was the only section on the site
              whose content escaped the container, so it read as a foreign
              block, and on top of that it left a ~200px gap against the edge
              because a 2:3 object never fills a column that wide.

              It now lives in its cell on the rail, and the cell is dimensioned
              to the object: at 44% of the usable width the render occupies its
              column EXACTLY and there is no surplus to distribute. It neither
              separates from the text nor leaves a gap on the right, which were
              the two complaints and they were in tension.

              On mobile it moves BELOW the content with its own height: `Media
              fill` needs a parent with a measured size. */}
          <div
            data-charger-visual=""
            aria-hidden="true"
            className="mx-auto h-[26rem] w-full max-w-sm sm:h-[32rem] lg:mx-0 lg:h-full lg:max-w-none"
          >
            <Media
              asset={media.renderCargador}
              locale={locale}
              fill
              sizes="(min-width: 1024px) 44vw, 90vw"
              className="h-full w-full"
              fit="contain"
            />
          </div>
        </div>
      </Container>
    </Section>
  )
}
