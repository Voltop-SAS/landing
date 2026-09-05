'use client'

import { motion, useReducedMotion } from 'motion/react'
import { duration, ease } from '@ui/common/lib/motion'

/**
 * PAGE-TO-PAGE TRANSITION.
 *
 * `template.tsx` remounts on every navigation, unlike `layout.tsx`. Now that
 * navigation happens on the client (every click used to reload the document),
 * continuity between pages is possible: a brief, restrained entrance that
 * avoids the hard cut.
 *
 * Deliberately minimal — `transform` only, and cancelled under
 * `prefers-reduced-motion` (§21). It is not an effect: it is spatial
 * continuity.
 *
 * NO `opacity`, ON PURPOSE. Motion serialises the initial state as an inline
 * style, so an `initial={{ opacity: 0 }}` here meant serving the ENTIRE PAGE
 * invisible: if the JS failed there was no site, and the LCP element (the hero
 * headline) started at opacity 0 and hurt the metric. Animating only the
 * displacement keeps the continuity without that risk.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      initial={{ y: reduce ? 0 : 8 }}
      animate={{ y: 0 }}
      transition={{ duration: reduce ? 0 : duration.base, ease: ease.standard }}
    >
      {children}
    </motion.div>
  )
}
