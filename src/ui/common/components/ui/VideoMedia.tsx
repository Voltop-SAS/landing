'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { t, type Locale } from '~/core/common/domain/i18n/config'
import type { MediaAsset } from '~/core/common/domain/entities/Media'
import { requestPlayOnArrival, consumePlayOnArrival } from '@ui/common/lib/playIntent'

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
  const src = asset.src

  /**
   * ── THE VIDEO DOES NOT EXIST UNTIL YOU GET CLOSE ─────────────────────────
   * Optimisation from 2026-09-08. `preload="none"` was already there and was
   * NOT enough: the browser skips it when there is `autoPlay` and the element
   * comes on screen. Measured on mobile over 4G: **677 KB of video downloading
   * without scrolling**, competing with the cover photograph, which is what
   * decides the sense of speed. On desktop it is 3 MB, 76% of the page weight.
   *
   * The cause is that beat 2 sits right at the edge of the viewport as soon as
   * the page opens: the hero is 800px and a phone screen is 844.
   *
   * What is done: the `<source>` elements are not rendered until the video gets
   * close. With no sources there is nothing to download, not even with
   * `autoPlay`.
   *
   * WHAT DOES NOT CHANGE, which is the point: the `poster` is painted from the
   * first moment — it is frame 0 of the loop itself — so visually the section
   * is identical from load. By the time you arrive the video is loaded and
   * starts. Neither the signature moment nor its animation is touched.
   *
   * ── THE CONDITION IS NOT "IS IT CLOSE?", IT IS "HAS THE IMPORTANT PART
   *    PAINTED?" ──────────────────────────────────────────────────────────
   * First attempt: an `IntersectionObserver` alone with a 400px margin. It did
   * nothing, and the reason is the page composition: **beat 2 starts at 880px
   * and a desktop screen is 900**, so the video falls inside the first screen
   * from load and any margin fires instantly. Measured: 1,555 KB downloading
   * without scrolling.
   *
   * So TWO conditions are needed, and both of them:
   *
   * 1. That the page has finished loading and the thread is free. This is what
   *    really protects the start: the video stops competing with the cover
   *    photograph, which is the element that sets the sense of speed.
   * 2. That the video is in view or near it. Someone who never scrolls does not
   *    spend that data.
   *
   * The idle `timeout` of 3s is the safety net: on a busy browser the free slot
   * may never come, and the video has to load eventually.
   */
  const [inView, setInView] = useState(false)
  const [painted, setPainted] = useState(false)

  /**
   * ── ARRIVING ALREADY PLAYING ─────────────────────────────────────────────
   * If someone clicked the silent preview of this very piece, they came here to
   * watch it. It starts on its own, with sound. Why the browser allows that is
   * explained in `playIntent`: the navigation is client-side and the document
   * never unloads, so the activation the click granted is still alive.
   *
   * Only the version WITH CONTROLS picks it up, and that matters for two
   * reasons: it is the only one worth listening to, and it is the one that
   * satisfies WCAG 1.4.2 — there is a mechanism to stop it, which is the
   * condition for audio to be allowed to play on its own for more than three
   * seconds.
   *
   * `prefers-reduced-motion` does not hold this back: the preference protects
   * against motion that starts unasked, and here it was asked for with a click.
   *
   * With no intent — arriving via the headline, an external link or a reload —
   * none of this happens and the poster stays, with its controls.
   */
  const [intent, setIntent] = useState(false)
  /* The intent is consumed ONCE and remembered here. In development React
     mounts every effect twice, and without this note the second pass would find
     the mailbox already empty and playback would fail ONLY in local — the worst
     place for something to fail, because it is where the work gets reviewed. */
  const consumed = useRef(false)

  useEffect(() => {
    if (!controls || !src) return
    if (!consumed.current) consumed.current = consumePlayOnArrival(src)
    if (!consumed.current) return
    /* Deferred a frame for the same reason as the observer below: a synchronous
       `setState` inside an effect chains renders. */
    const id = requestAnimationFrame(() => setIntent(true))
    return () => cancelAnimationFrame(id)
  }, [controls, src])

  /* Someone who just clicked is waiting, so the intent SKIPS the wait for the
     thread's free slot. That wait exists so a video does not compete with the
     page start; here the video IS what they came to see, and making them wait
     up to 3 s would be the failure, not the protection. */
  const near = (inView && painted) || intent

  useEffect(() => {
    const start = () => {
      const ric = (window as unknown as { requestIdleCallback?: typeof requestIdleCallback })
        .requestIdleCallback
      if (ric) ric(() => setPainted(true), { timeout: 3000 })
      else setTimeout(() => setPainted(true), 400)
    }
    if (document.readyState === 'complete') {
      const id = setTimeout(start, 0)
      return () => clearTimeout(id)
    }
    window.addEventListener('load', start, { once: true })
    return () => window.removeEventListener('load', start)
  }, [])

  useEffect(() => {
    const v = ref.current
    if (!v) return
    /* With no IntersectionObserver — an old browser — it counts as seen: better
       to spend data than to leave a hole where a video should be. Deferred a
       frame because a synchronous `setState` inside an effect chains renders and
       React flags it; the same device `AppFloating` uses. */
    if (typeof IntersectionObserver === 'undefined') {
      const id = requestAnimationFrame(() => setInView(true))
      return () => cancelAnimationFrame(id)
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setInView(true)
        io.disconnect()
      },
      { rootMargin: '200px' },
    )
    io.observe(v)
    return () => io.disconnect()
  }, [])

  /* `autoPlay` is not enough: if the preference changes on the fly, or if the
     browser started playback before hydration, it has to be stopped.

     It also depends on `near`: the `<source>` elements have just appeared and a
     `<video>` does not look at its new children on its own — `load()` is needed
     before it can play. */
  useEffect(() => {
    const v = ref.current
    if (!v || controls || !near) return
    v.load()
    if (reduce) v.pause()
    else void v.play().catch(() => {})
  }, [reduce, controls, near])

  /* Playback on arrival. It lives apart from the background one because they
     are opposites: that one is silent and looped, this one has sound and can be
     stopped.

     The `catch` is not defensive just in case: it is the normal path when there
     is NO activation — a reload, a link from outside — and there the right
     outcome is that nothing happens and the poster stays. A rejection here is
     not an error. */
  useEffect(() => {
    const v = ref.current
    if (!v || !intent || !near) return
    v.load()
    v.muted = false
    void v.play().catch(() => {})
  }, [intent, near])

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
      /* It only counts as intent if this preview IS a link. Without the check,
         clicking the background of the home page's beat 5 — which is this very
         file — would leave the EAN entry's video armed for whoever arrived
         there by another route. */
      onClick={
        controls || !src
          ? undefined
          : (e) => {
              if (e.currentTarget.closest('a')) requestPlayOnArrival(src)
            }
      }
    >
      {/* ORDER matters: the browser takes the FIRST source whose `media`
          matches, so the light variant goes first. With no `media` on the
          second one, any larger screen gets the master.

          `<source media>` is evaluated once on load, not on resize: that is
          correct here — nobody switches from phone to monitor mid-page — and
          it avoids reloading the video on every resize. */}
      {near && asset.srcMobile ? (
        <source
          src={asset.srcMobile}
          media="(max-width: 767px)"
          type="video/mp4"
        />
      ) : null}
      {near ? (
        <source
          src={asset.src ?? undefined}
          type="video/mp4"
        />
      ) : null}
    </video>
  )
}
