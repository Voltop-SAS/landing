/**
 * VOLTOP'S MOTION LANGUAGE
 * See docs/MASTER-PROJECT-DEFINITION.md §21 and the Experience Direction Map.
 *
 * ── WHY IT EXISTS ─────────────────────────────────────────────────────────
 * There were TWO motion systems running in parallel and out of sync. In CSS,
 * `@theme` declared the curves and the durations; the components hand-wrote
 * `[0.22, 1, 0.36, 1]` and `0.6` / `0.7` / `0.32` across three files. Now the
 * components consume from here and there are no loose numbers in the
 * presentation layer.
 *
 * ── THE FOUR PRIMITIVES ───────────────────────────────────────────────────
 * All motion on the site is built by combining four gestures. There is no
 * fifth one: a vocabulary that keeps growing stops being recognisable, and
 * what makes a site feel deliberately built is not the variety of its effects
 * but repeating the same ones with precision.
 *
 * · DEPTH — content arrives from the back: scale + opacity.
 *   WHEN: any entrance into the viewport. It is the base gesture.
 *   WHEN NOT: on figures, specs or station data. Anything that proves a point
 *   is not animated; a number that appears gracefully reads as advertising.
 *
 * · FLOW — the material moves inside a frame that stays put.
 *   WHEN: large photography and video only. This is where depth comes from.
 *   WHEN NOT: never on text. A headline with parallax reads as a template,
 *   which is the exact opposite of what we are after.
 *
 * · FRAME — the framing opens up and uncovers what was already there.
 *   WHEN: signature moments. Two in the whole Home page, no more.
 *   WHEN NOT: on secondary content. Repeated, it stops being a discovery and
 *   becomes an expensive transition.
 *
 * · CONTINUITY — something persists across two states or two pages.
 *   WHEN: there is a real relationship between what is left and what opens.
 *   WHEN NOT: between unrelated views. Faking continuity is disorienting.
 *
 * ── WHY THREE INTENSITIES AND NOT FOUR ────────────────────────────────────
 * A SUBTLE level was discarded. It is not a smaller version of DEPTH:
 * microinteractions are expressed in colour, opacity and two or three pixels,
 * not in scale. Folding them into the same scale would have created a level
 * nobody perceives and that still has to be maintained.
 *
 * And SIGNATURE is not a higher value of DEPTH: it is a composition of several
 * primitives tied to scroll. That is why it is not in this table — it is built
 * in whichever component needs it, and that is why there are two of them and
 * not eight.
 *
 * ── THE LIMITATION, STATED ────────────────────────────────────────────────
 * This is a MIRROR of the tokens in `src/app/globals.css`, not a shared
 * source: Tailwind reads the CSS and Motion needs JS values. They are
 * duplicated on purpose, in two places that reference each other.
 * If you change one, change the other.
 * ──────────────────────────────────────────────────────────────────────────
 */

/** Curves. Mirror of `--ease-*` in globals.css. */
export const ease = {
  /** Entrances and general transitions. Leaves fast, settles slowly. */
  standard: [0.22, 1, 0.36, 1],
  /** "Current": symmetric, for scroll-linked journeys. */
  current: [0.65, 0, 0.35, 1],
  /** Exits. Starts slow, accelerates as it disappears. */
  exit: [0.4, 0, 1, 1],
} as const

/** Durations IN SECONDS, which is what Motion expects. Mirror of `--duration-*`. */
export const duration = {
  fast: 0.2,
  base: 0.32,
  reveal: 0.7,
} as const

/**
 * Duration of the figure COUNT-UP. It deliberately has no CSS mirror: it is
 * not an interface transition but a reading, and that is why it does not share
 * a scale with the rest. It used to be written as `duration.slow * 2.2`, which
 * is a way of saying "1.32 seconds" without saying it and tied a reading to a
 * UI token.
 */
export const COUNT_DURATION = 1.3

/**
 * DEPTH · the two levels of the base gesture.
 *
 * The values are calibrated to be PERCEIVED. A `scale` of 0.99 is
 * indistinguishable from not animating at all, and then the motion work does
 * not exist for whoever is looking. `expressive` is deliberately visible.
 *
 * The vertical offset accompanies the scale instead of replacing it: scale
 * alone reads as a presentation zoom; offset alone is the generic
 * `fade + translateY` we are moving away from. Together they read as depth.
 */
export const depth = {
  standard: { scale: 0.965, y: 10, duration: 0.55 },
  expressive: { scale: 0.9, y: 24, duration: 0.85 },
} as const

export type DepthLevel = keyof typeof depth

/**
 * Delay between siblings in the same list. ONE value for the whole site.
 *
 * There used to be four — 0.05, 0.06, 0.07 and 0.08 — spread across four
 * files. Four values nobody can tell apart are not four decisions: they are
 * the absence of one.
 */
export const STAGGER = 0.07

/**
 * Cap on the stagger. Without it, a twelve-item list makes the last one wait
 * almost a second and the page feels slow instead of choreographed.
 */
const STAGGER_MAX = 5

/**
 * DEPTH applied. Returns the complete Motion props, including the
 * `data-reveal` hook for the CSS safety net (see globals.css): Motion writes
 * the initial state as an inline style, so without that net the content would
 * travel invisible in the served HTML.
 *
 * `reduce` CANCELS it entirely rather than shortening it: half the duration is
 * still motion (§21).
 */
export function depthMotion(level: DepthLevel, reduce: boolean, index = 0) {
  const d = depth[level]
  const delay = Math.min(index, STAGGER_MAX) * STAGGER

  return {
    'data-reveal': '',
    initial: { opacity: 0, scale: d.scale, y: d.y },
    whileInView: { opacity: 1, scale: 1, y: 0 },
    /* `once`: content is revealed once and stays. We never tie content opacity
       to scroll progress — it would go back to 0 on the way up. */
    viewport: { once: true, margin: '-80px' },
    transition: {
      duration: reduce ? 0 : d.duration,
      ease: ease.standard,
      delay: reduce ? 0 : delay,
    },
  } as const
}
