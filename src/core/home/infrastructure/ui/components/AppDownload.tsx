import Image from 'next/image'
import { t, type Locale } from '~/core/common/domain/i18n/config'
import { href, routes } from '~/core/common/domain/i18n/routes'
import { home } from '~/core/home/domain/consts/copy'
import { actions } from '~/core/common/domain/consts/copy'
import { Section, Container, Eyebrow } from '@ui/common/components/ui/LayoutPrimitives'
import { StoreBadges } from '@ui/common/components/ui/StoreBadges'
import { Button } from '@ui/common/components/ui/Button'
import { Reveal } from '@ui/common/components/ui/Reveal'

/**
 * BEAT 8 · HOW CHARGING WORKS — Intensity: STANDARD
 * See docs/MASTER-PROJECT-DEFINITION.md §12 and §15.
 *
 * ── IT STOPPED BEING "THE APP SECTION" ────────────────────────────────────
 * This beat is the site's only answer to the majority audience's question:
 * "how do I charge?". That answer used to be ONE SENTENCE inside a block
 * labelled "La app", with three loose features below it. Labelling by the
 * product instead of by the task leaves the beat invisible to precisely the
 * people who need it, and a feature does not answer what a step answers.
 *
 * It is now four steps in order —find, scan, charge, done— plus a way out to
 * the network for anyone who wants to see where to charge without downloading
 * anything. The intensity stays STANDARD on purpose: it comes after the film's
 * signature moment and before the close. Impact is not what is wanted here;
 * being understood is.
 *
 * ── THE OBJECT CHANGED, AND WITH IT THE COMPOSITION ─────────────────────
 * Until 2026-09-08 this column held a bare QR: a 1.2 KB SVG, dark modules on a
 * white card inside a `.glass` frame. The comment here argued for TWO
 * ASYMMETRIC COLUMNS precisely because of that — "the text carries weight and
 * the QR is a small object; splitting it down the middle would leave the QR
 * floating in a void".
 *
 * That reason is gone. The asset is now a composed graphic: the app running a
 * real charging session on a phone, held in a hand, WITH THE QR INSIDE IT. It
 * is no longer a small object, so 50/50 no longer leaves a void — it gives two
 * blocks of comparable weight. Recorded because the previous decision was
 * argued in this same place and the reversal is not a change of taste.
 *
 * ── THE QR STILL HAS TO SCAN, AND NOW IT IS PIXELS ───────────────────────
 * The old note said it: a QR that does not scan is worse than no QR. The SVG
 * had exact geometry and was served `unoptimized` for that reason. The code now
 * travels inside a raster image that Next resizes and re-encodes to AVIF, where
 * fine detail is the first thing to soften.
 *
 * Hence `quality={92}` and a `sizes` measured against the real box, not
 * guessed: the QR occupies about 38% of the width, so at DPR 2 the served file
 * has to carry enough modules to survive the re-encode.
 *
 * ── AND IT NOW SHOWS ON MOBILE ───────────────────────────────────────────
 * The QR was `hidden md:block`: on a phone the badges already work and a code
 * you cannot scan with the device holding it is dead weight. A product shot is
 * not dead weight — it shows what you are about to install — so it stays,
 * capped with `max-w-sm` so it does not push the section's height.
 *
 * ── THE SPLIT STARTS AT `lg`, NOT AT `md`, AND STARTS FROM THE TOP ───────
 * Both measured, not chosen. At 768px the two halves gave 323px each: the text
 * column ran to 952px tall against an object of 406px, so the image floated
 * with 273px of void above and below it. It stacks there instead.
 *
 * And `items-start`, not `items-center`: with `center` the image began 85px
 * BELOW the eyebrow, so the two columns started on different lines and nothing
 * in the composition lined up. Starting both at the same top edge is what makes
 * the halves read as halves; the object is shorter than the text and the
 * leftover falls at the bottom, next to the badges, where it reads as room
 * rather than as a gap.
 *
 * ── NO BACKGROUND BEHIND IT ──────────────────────────────────────────────
 * The PNG carries its own rounded panel in `#1A2233`, lighter than the
 * `canvas` of `#0A0F1A`, and transparent corners around it. So it reads as an
 * object on the canvas, which is intended — but any `bg-*` or `.glass` behind
 * it would draw a visible box with a seam where the panel ends. That is
 * exactly what happened with the charger render in beat 3.
 */
export function AppDownload({ locale }: { locale: Locale }) {
  const c = home.app

  return (
    <Section
      /* The id is not decoration: `AppFloating` observes it to stay quiet while
         this section is on screen. See rule 7 in that file. */
      id="descarga"
      space="base"
      className="border-t border-line"
      ariaLabelledby="app-title"
    >
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,45fr)_minmax(0,55fr)] lg:items-start lg:gap-16">
          <div>
            <Eyebrow tone="brand">{t(c.eyebrow, locale)}</Eyebrow>
            <h2
              id="app-title"
              className="mt-4 max-w-[16ch] font-display text-display-l font-semibold text-balance text-ink"
            >
              {t(c.title, locale)}
            </h2>
            <p className="measure-narrow mt-5 text-body-l text-ink-2">{t(c.lead, locale)}</p>

            {/* FOUR STEPS, IN ORDER. A numbered list and not bullets: the
                number is information —it says there is a sequence and where in
                it you are— whereas a bullet only says "another item".

                The number is set in mono, in muted ink and with no coloured
                circle: it is a spec-sheet label, not a badge. §12 reserves the
                gradient for ONE action per view, and that action is the store
                badges that come right below. */}
            {/* ── FROM A RULED COLUMN TO A GRID WITHOUT RULES ──────────────
                Review of 2026-09-08. Two changes, both measured.

                TWO COLUMNS instead of one: the text column is 486px wide and
                its content is capped —`max-w-[16ch]` on the headline,
                `measure-narrow` on the lead— so the column was WIDER THAN
                ANYTHING IN IT while the four stacked steps made this the
                tallest section of the page after the pinned beat: 968px
                against 747, 853 and 425 for its neighbours. The steps now use
                the width that was already there, and the section drops to
                861px, in line with the rest.

                AND NO RULES. Each step used to carry `border-t` and the list
                closed with `border-b`: five rules stacked in one column read
                as a spec table, which was the intention. In two columns those
                same rules FRAGMENT — four cut segments with a gap in the
                middle — and read as two separate lists rather than one grid.
                The sequence is carried by the mono numbers, which is what they
                were for; the rules were doing a job the grid now does.

                It also balances the two columns: 706px of text against 716px
                of image, a difference of 10px where there used to be 169. */}
            <ol className="mt-8 grid gap-y-8 sm:grid-cols-2 sm:gap-x-10">
              {c.steps.map((paso, i) => (
                <li
                  key={i}
                  className="grid grid-cols-[1.75rem_1fr] gap-x-4"
                >
                  <span
                    aria-hidden="true"
                    className="pt-0.5 font-mono text-mono tabular-nums text-ink-3"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span>
                    <span className="font-display text-body font-semibold text-ink">
                      {t(paso.label, locale)}
                    </span>
                    <span className="mt-1 block text-body-s text-ink-2">
                      {t(paso.body, locale)}
                    </span>
                  </span>
                </li>
              ))}
            </ol>

            {/* Way out to the network: "where can I charge?" is answered on
                /red and does not require downloading anything first. It is a
                link and not a button so it does not compete with the badges,
                which are this beat's action.

                It reuses `actions.findCharger`, the same label as the Hero and
                the close: all three lead to /red, and having a third key with
                the same text only multiplies the places it can diverge. The
                dedicated `home.app.seeNetwork` key was removed for that
                reason. */}
            <div className="mt-7">
              <Button
                variant="link"
                arrow
                href={href(locale, routes.network)}
              >
                {t(actions.findCharger, locale)}
              </Button>
            </div>

            <StoreBadges
              placement="home_download"
              locale={locale}
              className="mt-9"
            />
          </div>

          {/* The object. See this file's header for why there is no frame and
              no background behind it. */}
          <Reveal className="min-w-0">
            {/* `items-stretch` and a left-aligned label: this section is
                left-aligned end to end and the label was the only centred text
                in it. The image fills the column, so its left edge is already a
                strong vertical line — hanging the microcopy from it costs
                nothing and removes the second axis. */}
            <div className="flex flex-col gap-5">
              <Image
                src="/descarga-app.webp"
                alt={t(c.qrAlt, locale)}
                width={1163}
                height={1331}
                /* Measured in the browser, not guessed: each half is 540px from
                   1280px up, and below `lg` the image stacks under the text
                   capped at `max-w-sm` (384px). Declared slightly over so the
                   QR survives the AVIF re-encode. */
                sizes="(min-width: 1024px) 560px, 384px"
                /* 75 and not 92: `next.config.ts` only declares
                   `qualities: [70, 75]` and any other value errors — the
                   console said so. The worry was the QR inside the raster, and
                   it does not apply: it takes up ~38% of the width, so at a
                   540px box and DPR 2 some 410px of code arrive for ~33
                   modules, 12px per module. AVIF at 75 does not undo a 12px
                   module. */
                quality={75}
                className="h-auto w-full max-w-sm lg:max-w-none"
              />
              <p className="font-mono text-mono text-ink-3">{t(c.qrLabel, locale)}</p>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  )
}
