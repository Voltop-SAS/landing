'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import { t, type Locale } from '~/core/common/domain/i18n/config'
import type { MediaAsset } from '~/core/common/domain/entities/Media'

/**
 * BACKGROUND VIDEO · respects the reduced-motion preference.
 *
 * ── WHY IT IS A SEPARATE COMPONENT ────────────────────────────────────────
 * `Media` is a Server Component and cannot read a media query. The video
 * played ALWAYS, including under `prefers-reduced-motion: reduce`. With the
 * placeholder gap that went unnoticed — there was no video — and it surfaced
 * when the real material arrived.
 *
 * It is not a detail: it is an infinite loop of moving content next to the
 * text being read. §21 requires this and WCAG 2.2.2 asks for a mechanism to
 * stop motion that starts on its own and lasts more than five seconds.
 *
 * With the preference active it does not play and the **poster** is shown,
 * which is frame 0 of the loop itself: the same image, still.
 *
 * Only this branch is client-side. Photography is still rendered on the
 * server.
 */
export function VideoMedia({
  asset,
  locale,
  className,
  controls = false,
}: {
  asset: MediaAsset
  locale: Locale
  className?: string
  /**
   * `true` when the material is a PIECE THAT IS WATCHED, not a background.
   *
   * It changes the whole behaviour: with controls there is no autoplay, no
   * loop and no muting. A background is looked at without meaning to; a piece
   * with narration is watched by choice, and for that you need to be able to
   * play, pause, seek and hear it.
   *
   * `prefers-reduced-motion` stops applying here: nothing starts on its own,
   * so there is no motion for the preference to hold back.
   */
  controls?: boolean
}) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLVideoElement>(null)

  /* `autoPlay` is not enough: if the preference changes on the fly, or if the
     browser started playback before hydration, it has to be stopped. */
  useEffect(() => {
    const v = ref.current
    if (!v || controls) return
    if (reduce) v.pause()
    else void v.play().catch(() => {})
  }, [reduce, controls])

  return (
    <video
      ref={ref}
      className={className}
      poster={asset.poster ?? undefined}
      /* `none` in both modes: a background must not compete with the LCP, and
         a piece with controls must not download 27 MB for someone who never
         pressed play. Only the poster travels until somebody asks. */
      preload="none"
      controls={controls || undefined}
      muted={!controls}
      loop={!controls}
      playsInline
      autoPlay={controls ? undefined : !reduce}
      aria-label={t(asset.alt, locale)}
    >
      {/* ORDER matters: the browser takes the FIRST source whose `media`
          matches, so the light variant goes first. With no `media` on the
          second one, any larger screen gets the master.

          `<source media>` is evaluated once on load, not on resize: that is
          correct here — nobody switches from phone to monitor mid-page — and
          it avoids reloading the video on every resize. */}
      {asset.srcMobile ? (
        <source
          src={asset.srcMobile}
          media="(max-width: 767px)"
          type="video/mp4"
        />
      ) : null}
      <source
        src={asset.src ?? undefined}
        type="video/mp4"
      />
    </video>
  )
}
