'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react'
import { cn } from '@ui/common/lib/cn'

/**
 * FLOW · the material moves inside a frame that stays put.
 *
 * ── NOBODY USES IT TODAY, AND THAT IS NOT AN OVERSIGHT ────────────────────
 * It is one of the four primitives of the motion language (see
 * `@ui/common/lib/motion`) and as of 2026-09-04 it has not a single consumer.
 * The two pieces that carried it left for product reasons, not because the
 * primitive failed:
 *
 * · Beat 3 had a floor photograph with FLOW. The visual reference called for a
 *   solid background and the photograph left with it.
 * · The charger render that replaced it CANNOT carry it: it is served as
 *   `contain`, and this primitive crops by design. See the note below.
 *
 * That is why it is kept: the vocabulary declares it, the decision still
 * stands, and the day a full-bleed background photograph arrives — in any beat
 * — this is the piece that gives it depth. Deleting it would be deleting an
 * approved decision just because there is no material to apply it to today.
 *
 * It is the primitive DEPTH comes from (see `@ui/common/lib/motion`). Without
 * it, a background photograph is wallpaper: it is behind, but nothing says it
 * is *further away*. With it, the frame belongs to the page and the image
 * belongs to another plane.
 *
 * ── WHY THE IMAGE IS TALLER THAN ITS FRAME ────────────────────────────────
 * The inner wrapper measures 124% of the frame and is absolutely positioned.
 * That excess is what allows it to be moved without the background showing at
 * the top or bottom: the travel is ±6% of its own height — 7.4% of the frame —
 * against 12% of slack on each side. Without that margin the effect ends up
 * showing the edge, which is the classic failure of parallax done by eye.
 *
 * ── ONLY MATERIAL THAT CROPS (`cover`), NEVER AN ISOLATED OBJECT ──────────
 * This primitive CROPS by definition: the frame clips a taller interior. With
 * background material that is exactly what you want. With an isolated object
 * served as `contain` — a product render, a logo — it is the opposite: it was
 * tried with the beat 3 charger render and ate 135px of equipment top and
 * bottom. A cropped object stops being the portrait of an object. If the
 * material is served as `contain`, this primitive does not apply.
 *
 * ── ONLY MATERIAL, NEVER TEXT ─────────────────────────────────────────────
 * This is a system rule, not a preference of this component. A headline doing
 * parallax reads as a template; and a piece of data that moves while you are
 * trying to read it stops being data and becomes an effect.
 *
 * ── WHAT IS ANIMATED ──────────────────────────────────────────────────────
 * Only `transform`. The offset is written as a percentage so the travel is
 * proportional to the piece rather than a pixel count that falls short on
 * large screens and runs long on small ones.
 *
 * Under `prefers-reduced-motion` the travel is 0: the material stays still and
 * the composition does not change — the frame, the crop and the framing are
 * the same, so there is no "degraded" version to look at.
 */
export function Flow({
  children,
  className,
  /** Travel as a percentage of the material's height. See the maths above. */
  amount = 6,
}: {
  children: React.ReactNode
  className?: string
  amount?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  /* `start end` → `end start`: the travel spans from the piece appearing at
     the bottom to it leaving at the top. Measuring against the viewport rather
     than against the section itself is what keeps the offset constant whether
     the section is taller or shorter than the screen. */
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? ['0%', '0%'] : [`-${amount}%`, `${amount}%`],
  )

  return (
    <div
      ref={ref}
      className={cn('relative overflow-hidden', className)}
    >
      <motion.div
        style={{ y }}
        className="absolute inset-x-0 -inset-y-[12%]"
      >
        {children}
      </motion.div>
    </div>
  )
}
