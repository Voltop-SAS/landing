'use client'

import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useInView,
  useReducedMotion,
} from 'motion/react'
import { duration, ease } from '@ui/common/lib/motion'
import { t, type Locale } from '~/core/common/domain/i18n/config'
import { href, routes } from '~/core/common/domain/i18n/routes'
import { home } from '~/core/home/domain/consts/copy'
import { actions } from '~/core/common/domain/consts/copy'
import { media } from '~/core/common/infrastructure/content/media'
import { Section, Container, Eyebrow } from '@ui/common/components/ui/LayoutPrimitives'
import { Media } from '@ui/common/components/ui/Media'
import { Button } from '@ui/common/components/ui/Button'

/**
 * BEAT 2 · SIGNATURE MOMENT — Intensity: VERY HIGH · Register: Impact
 * STRUCTURE: tall container with a STICKY panel and real scroll-scrub.
 *
 * ── WHAT WAS WRONG, MEASURED ──────────────────────────────────────────────
 * The section measured 240vh —2160px at 1440×900— and the full reveal was a
 * 12% crop that finished at 45% of the journey, that is at 567px. After that
 * came ~700px of scrolling with the screen ABSOLUTELY MOTIONLESS. On a home
 * page of 9 viewports, 26% of the scroll was consumed by a beat that stays
 * still longer than it moves. And the comment promised that "the text enters
 * in phases": it did not, it was a single `Reveal`.
 *
 * ── WHAT WAS DONE ─────────────────────────────────────────────────────────
 * - 240vh → 170vh. The journey is matched to how long the reveal lasts.
 * - The crop goes from 12% to 28% and finishes at 70%, not at 45%: it is
 *   perceived as an opening and occupies almost the whole pinned stretch.
 * - The text enters in two phases: eyebrow and headline first, body and
 *   actions after.
 * - With `prefers-reduced-motion` the section COLLAPSES to normal height. It
 *   used to leave 2160px of dead scroll with no equivalent: whoever asks for
 *   less motion was paying the effect's cost without the effect.
 *
 * ── WHY THE PHASES ARE TIME-BASED AND NOT SCROLL-BASED ────────────────────
 * Tying the text's opacity to `scrollYProgress` was tried, so the phases would
 * happen along the journey. It is what this file's original comment already
 * warned about and it needs writing down: an opacity tied to progress RETURNS
 * TO 0 on the way back, so the text would disappear when scrolling up, and
 * anyone arriving via `#infraestructura` without scrolling would see an empty
 * screen.
 *
 * The phases are solved with a time offset on top of a one-time
 * `whileInView`: once visible, the text never hides again (§21). The long
 * scroll no longer needs filler — it was shortened to how long the reveal
 * lasts.
 */
export function InfrastructureSignature({
  locale,
  postSlug,
}: {
  locale: Locale
  /**
   * The log entry that tells the story of THIS station's opening. The page
   * resolves it from `~/core/common/infrastructure/data-access`, because this
   * is a client component and cannot query data.
   *
   * It arrives optional on purpose: with no entry, the CTA is not rendered.
   * The previous link wrote the slug by hand —`san-fernando-plaza`, a station
   * that was withdrawn from the dataset— and had been leading to a 404 ever
   * since without anyone noticing. A button that disappears gets noticed; one
   * that goes nowhere does not.
   */
  postSlug?: string
}) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  /* The MATERIAL is revealed with scroll-scrub: it starts cropped and opens
     to full bleed. The hooks are always called, with no conditionals. */
  /**
   * ── OPENING AND TEXT, CHAINED ────────────────────────────────────────────
   * The text used to enter via `whileInView` —as the section came into view—
   * while the crop was still only half open. The frame's edge then passed
   * behind the headline and a vertical line cut through the words.
   *
   * A percentage crop CANNOT avoid that by tuning the number: the crop is a
   * percentage of the width and the text starts after a fixed margin, so the
   * distance from the text to the edge changes with the viewport. Measured:
   * the headline starts at 3.8% of the width at 1024px and at 20.6% at
   * 1920px. A 10% crop crossed it at 9 of the 12 widths tested.
   *
   * The solution is not a value but an ORDER: the frame settles first, the
   * text enters after. That way the edge never coincides with the words at any
   * width, and the opening gets its travel back —18% instead of 10%— because
   * it no longer has to fit underneath a piece of text.
   */
  /**
   * ── THE FRAME ANCHORS AT THE TOP, IT DOES NOT FLOAT ──────────────────────
   * The crop was symmetric —`inset(18%)` on all four sides— and that did two
   * bad things at once. Measured at 1440×900 with the page at 500px:
   *
   * 1. It left a DEAD BAND of 143px between the end of the hero and the
   *    material's top edge. Beat 1 finished on a line and a dark nothing began
   *    before anything appeared.
   * 2. The material read as a RECTANGLE STUCK onto the page: four hard edges
   *    floating in the void, which is what an inserted image looks like, not
   *    what a frame that opens looks like.
   *
   * The crop is now asymmetric and the top edge is ALWAYS 0: the material
   * touches the end of the hero from the first frame, so there is no band to
   * cross. It opens at the sides and at the bottom.
   *
   * The gesture changes direction and improves: before, a card grew in the
   * centre; now the installation enters from above and unfolds. That is the
   * concept —journey, descent— and not a literal depiction of anything
   * electrical.
   *
   * The two materials are still two: the hero is a photograph and this is a
   * video. No attempt is made to pretend they are one. The continuity comes
   * from the composition —the shared edge and the background that stitches
   * them together— not from the material.
   */
  const opening = useTransform(scrollYProgress, [0, 0.25], reduce ? [0, 0] : [1, 0])
  const clipPath = useTransform(
    opening,
    (v) => `inset(0% ${(v * 13).toFixed(2)}% ${(v * 30).toFixed(2)}% ${(v * 13).toFixed(2)}%)`,
  )
  const scale = useTransform(scrollYProgress, [0, 0.25], reduce ? [1, 1] : [1.06, 1])

  /**
   * The text unlatches once the opening has finished (30% of the journey) and
   * NEVER hides again: it is a one-way latch.
   *
   * This is what this file's header already warned not to do with an opacity
   * tied to progress —it would return to 0 on the way back and the text would
   * disappear when scrolling up—. A latch keeps the synchronisation with the
   * scroll without that side effect.
   *
   * The initial check covers anyone arriving straight in via
   * `#infraestructura` or reloading mid-section: if progress has already
   * passed the threshold, the text is visible from the first frame.
   */
  const [abierto, setAbierto] = useState(false)
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (v > 0.3) setAbierto(true)
  })
  /* Deferred by one frame: `useScroll` has no measurement until after layout,
     and updating state inside the effect without deferring conflicts with the
     React rule and would cause an extra render during hydration. */
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      if (scrollYProgress.get() > 0.3) setAbierto(true)
    })
    return () => cancelAnimationFrame(id)
  }, [scrollYProgress])

  /**
   * EMERGENCY EXIT for anyone who arrives via `#infraestructura` and does not
   * scroll.
   *
   * Tying the text to the journey reintroduced the failure this file's header
   * already warned about: on landing at the anchor, progress is 0, so the
   * latch never trips and the section is seen **without a single word**.
   * Measured: opacity 0 at both 390 and 1440 px.
   *
   * If the section has been on screen for a moment and progress still has not
   * advanced, it opens by itself. And it opens IN FULL —frame and text—:
   * showing the text while leaving the crop half open would bring back the
   * edge crossing the words, which is exactly what was being fixed.
   *
   * No route on the site links to this anchor today, but the URL is public.
   */
  const inView = useInView(ref, { amount: 0.5 })
  const [forced, setForced] = useState(false)
  useEffect(() => {
    if (!inView) return
    const id = setTimeout(() => {
      if (scrollYProgress.get() < 0.15) setForced(true)
    }, 1200)
    return () => clearTimeout(id)
  }, [inView, scrollYProgress])

  const visible = reduce || abierto || forced
  /**
   * RECALIBRATED when the real photograph arrived (2026-09-01).
   *
   * The previous values —0.15 to 0.85— were set against the placeholder's FLAT
   * slot, where the background was a uniform dark surface. With a real photo
   * the paragraph and the label land on the lit charger and stop being
   * readable: at 0.15 opacity no veil is worth anything.
   *
   * The floor rises to 0.55 and the ceiling to 1. The intent is preserved —the
   * veil GROWS with the journey, accompanying the crop's opening— but it
   * starts from a point where the text is already legible, which is when it
   * begins to appear (`whileInView` with a 20% margin).
   */
  const scrimOpacity = useTransform(scrollYProgress, [0.1, 0.45], reduce ? [1, 1] : [0.8, 1])

  /** The text's entrance phase. Triggered by the latch, not by coming into view. */
  const phase = (delay: number) => ({
    'data-reveal': '',
    initial: { opacity: 0, y: 32 },
    animate: visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 },
    transition: {
      duration: reduce ? 0 : duration.reveal,
      ease: ease.standard,
      delay: reduce ? 0 : delay,
    },
  })

  return (
    <Section
      ref={ref}
      id="infraestructura"
      register="impact"
      space="none"
      /* `motion-reduce:h-auto` collapses the journey when there is no motion
         to justify it. The panel stops being pinned and the section measures
         whatever its content measures. */
      className="h-[170vh] motion-reduce:h-auto"
    >
      <div className="sticky top-0 flex h-dvh flex-col justify-end overflow-hidden motion-reduce:static motion-reduce:h-auto">
        <motion.div
          style={{ scale, clipPath: forced ? 'inset(0% 0% 0% 0%)' : clipPath }}
          /* The transition only acts in the forced case; during scrolling the
             value is written by motion on every frame and there is nothing to
             animate. */
          className="absolute inset-0 transition-[clip-path] duration-500 ease-out"
        >
          <Media
            asset={media.stationMedellin}
            locale={locale}
            fill
            sizes="100vw"
            className="h-full"
          />
        </motion.div>

        <motion.div
          aria-hidden="true"
          style={{ opacity: scrimOpacity }}
          className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/88 to-canvas/45"
        />

        {/* BRIDGE. The hero ends in solid `canvas` and the material starts
            right below it: without this, the meeting point is a clean
            horizontal cut between a photo and a video, and the eye reads it as
            two pages glued together. This band brings the canvas back over the
            panel's first 14% and dissolves it, so the material EMERGES from
            the end of the previous beat rather than starting at it.

            It goes after the veil and before the text: it tints the material,
            never the words. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[22%] bg-gradient-to-b from-canvas via-canvas/55 to-transparent"
        />

        {/* `pb-28` below `lg`: that is where the download floater's mobile
            bar lives, and this beat anchors its content to the bottom of a
            panel PINNED to the full screen. Without reserving the space, the
            bar landed on top of the CTA and the caption —measured: up to 84%
            and 100% respectively— and, because the content is pinned for the
            whole journey, THERE WAS NO SCROLL POSITION THAT WOULD FREE IT.
            This used to be solved by hiding the floater here; now that it
            stays visible across the whole page, the beat reserves the
            space. */}
        <Container className="relative z-(--z-raised) py-(--spacing-section-tight) pb-28 lg:pb-(--spacing-section-tight)">
          <motion.div {...phase(0)}>
            <Eyebrow tone="brand">{t(home.infrastructure.eyebrow, locale)}</Eyebrow>
            {/* `text-balance` distributes the length of the lines. What keeps
                the pronoun from being orphaned after the full stop is the
                NON-BREAKING SPACE in the copy itself —see the note on `title`
                in the home copy—: balancing does not know where a sentence
                ends. The two complement each other and neither replaces the
                other. */}
            <h2 className="mt-5 max-w-[18ch] font-display text-display-xl font-semibold text-balance text-ink">
              {t(home.infrastructure.title, locale)}
            </h2>
          </motion.div>

          <motion.div {...phase(0.18)}>
            <p className="mt-6 measure text-body-l text-ink-2">
              {t(home.infrastructure.lead, locale)}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
              {postSlug && (
                <Button
                  variant="ghost"
                  arrow
                  href={href(locale, routes.post(postSlug))}
                >
                  {t(actions.seeStation, locale)}
                </Button>
              )}
              <span className="font-mono text-mono uppercase tracking-wider text-ink-3">
                {t(home.infrastructure.caption, locale)}
              </span>
            </div>
          </motion.div>
        </Container>
      </div>
    </Section>
  )
}
