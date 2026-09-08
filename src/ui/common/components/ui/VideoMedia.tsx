'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { t, type Locale } from '~/core/common/domain/i18n/config'
import type { MediaAsset } from '~/core/common/domain/entities/Media'
import { requestPlayOnArrival, consumePlayOnArrival } from '@ui/common/lib/play-intent'

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
   * ── EL VÍDEO NO EXISTE HASTA QUE TE ACERCAS ───────────────────────────────
   * Optimización del 2026-09-08. `preload="none"` estaba puesto y NO bastaba:
   * el navegador se lo salta cuando hay `autoPlay` y el elemento entra en
   * pantalla. Medido en móvil a 4G: **677 KB de vídeo descargándose sin mover
   * el scroll**, compitiendo con la foto de portada, que es lo que decide la
   * sensación de rapidez. En escritorio son 3 MB, el 76% del peso de la página.
   *
   * La causa es que el beat 2 queda justo al borde del viewport nada más
   * abrir: el hero mide 800px y una pantalla de móvil 844.
   *
   * Lo que se hace: los `<source>` no se renderizan hasta que el vídeo se
   * acerca. Sin fuentes no hay nada que descargar, ni siquiera con `autoPlay`.
   *
   * QUÉ NO CAMBIA, que es el punto: el `poster` se pinta desde el primer
   * momento —es el fotograma 0 del propio bucle—, así que visualmente la
   * sección es idéntica desde que carga. Cuando llegas, el vídeo ya está
   * cargado y arranca. Ni el momento signature ni su animación se tocan.
   *
   * ── LA CONDICIÓN NO ES «¿ESTÁ CERCA?», ES «¿YA PINTÓ LO IMPORTANTE?» ─────
   * Primer intento: solo un `IntersectionObserver` con 400px de margen. No
   * sirvió de nada, y la razón está en la composición de la página: **el beat 2
   * empieza a 880px y una pantalla de escritorio mide 900**, así que el vídeo
   * cae dentro de la primera pantalla desde que cargas y cualquier margen se
   * dispara al instante. Medido: 1.555 KB descargándose sin mover el scroll.
   *
   * Así que hacen falta DOS condiciones, y las dos:
   *
   * 1. Que la página haya terminado de cargar y el hilo esté libre. Esto es lo
   *    que de verdad protege el arranque: el vídeo deja de competir con la
   *    fotografía de portada, que es el elemento que marca la sensación de
   *    rapidez.
   * 2. Que el vídeo esté a la vista o cerca. Quien nunca baja no gasta esos
   *    datos.
   *
   * El `timeout` de 3s del idle es el seguro: en un navegador ocupado el hueco
   * libre puede no llegar nunca, y el vídeo tiene que acabar cargando.
   */
  const [enVista, setEnVista] = useState(false)
  const [pintado, setPintado] = useState(false)

  /**
   * ── LLEGAR YA REPRODUCIENDO ───────────────────────────────────────────────
   * Si alguien hizo clic en la previsualización silenciosa de esta misma pieza,
   * llega aquí para verla. Empieza sola, con sonido. El porqué de que el
   * navegador lo permita está en `play-intent`: la navegación es de cliente y
   * el documento no se descarga, así que la activación del clic sigue viva.
   *
   * Solo la versión CON CONTROLES la recoge, y eso importa por dos razones: es
   * la única que tiene sentido escuchar, y es la que cumple WCAG 1.4.2 —hay un
   * mecanismo para pararla, que es la condición para que un audio pueda sonar
   * solo más de tres segundos—.
   *
   * `prefers-reduced-motion` no frena esto: la preferencia protege de
   * movimiento que empieza sin pedirlo, y aquí se pidió con un clic.
   *
   * Si no hay intención —se llegó por el titular, por un enlace de fuera o
   * recargando— no pasa nada de esto y queda el póster con sus controles.
   */
  const [intencion, setIntencion] = useState(false)
  /* La intención se consume UNA vez y se recuerda aquí. En desarrollo React
     monta cada efecto dos veces, y sin este apunte el segundo pase encontraría
     el buzón ya vacío y la reproducción solo fallaría en local — el peor sitio
     donde puede fallar algo, porque es donde se revisa. */
  const consumida = useRef(false)

  useEffect(() => {
    if (!controls || !src) return
    if (!consumida.current) consumida.current = consumePlayOnArrival(src)
    if (!consumida.current) return
    /* Diferido un fotograma por lo mismo que en el observador de abajo: un
       `setState` síncrono dentro de un efecto encadena renders. */
    const id = requestAnimationFrame(() => setIntencion(true))
    return () => cancelAnimationFrame(id)
  }, [controls, src])

  /* Quien acaba de hacer clic está esperando, así que la intención SALTA la
     espera al hueco libre del hilo. Esa espera existe para que un vídeo no
     compita con el arranque de la página; aquí el vídeo ES lo que se ha venido
     a ver, y hacerle esperar hasta 3 s sería el fallo, no la protección. */
  const cerca = (enVista && pintado) || intencion

  useEffect(() => {
    const arranca = () => {
      const ric = (window as unknown as { requestIdleCallback?: typeof requestIdleCallback })
        .requestIdleCallback
      if (ric) ric(() => setPintado(true), { timeout: 3000 })
      else setTimeout(() => setPintado(true), 400)
    }
    if (document.readyState === 'complete') {
      const id = setTimeout(arranca, 0)
      return () => clearTimeout(id)
    }
    window.addEventListener('load', arranca, { once: true })
    return () => window.removeEventListener('load', arranca)
  }, [])

  useEffect(() => {
    const v = ref.current
    if (!v) return
    /* Sin IntersectionObserver —navegador antiguo— se da por visto: es mejor
       gastar datos que dejar un hueco donde debería haber vídeo. Diferido un
       fotograma porque un `setState` síncrono dentro de un efecto encadena
       renders y React lo señala; mismo recurso que usa `AppFloating`. */
    if (typeof IntersectionObserver === 'undefined') {
      const id = requestAnimationFrame(() => setEnVista(true))
      return () => cancelAnimationFrame(id)
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setEnVista(true)
        io.disconnect()
      },
      { rootMargin: '200px' },
    )
    io.observe(v)
    return () => io.disconnect()
  }, [])

  /* `autoPlay` is not enough: if the preference changes on the fly, or if the
     browser started playback before hydration, it has to be stopped.

     Depende también de `cerca`: los `<source>` acaban de aparecer y un
     `<video>` no mira a sus hijos nuevos por su cuenta — hace falta `load()`
     antes de poder reproducir. */
  useEffect(() => {
    const v = ref.current
    if (!v || controls || !cerca) return
    v.load()
    if (reduce) v.pause()
    else void v.play().catch(() => {})
  }, [reduce, controls, cerca])

  /* La reproducción al llegar. Va aparte de la de fondo porque son opuestas:
     aquella es silenciosa y en bucle, esta suena y se puede parar.

     El `catch` no es defensivo por si acaso: es la ruta normal cuando NO hay
     activación —una recarga, un enlace desde fuera— y ahí lo correcto es que
     no pase nada y se quede el póster. Un rechazo aquí no es un error. */
  useEffect(() => {
    const v = ref.current
    if (!v || !intencion || !cerca) return
    v.load()
    v.muted = false
    void v.play().catch(() => {})
  }, [intencion, cerca])

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
      /* Solo cuenta como intención si esta previsualización ES un enlace. Sin
         la comprobación, hacer clic en el fondo del beat 5 de la Home —que es
         este mismo fichero— dejaría armado el vídeo de la entrada de la EAN
         para cuando alguien llegara allí por otro camino. */
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
      {cerca && asset.srcMobile ? (
        <source
          src={asset.srcMobile}
          media="(max-width: 767px)"
          type="video/mp4"
        />
      ) : null}
      {cerca ? (
        <source
          src={asset.src ?? undefined}
          type="video/mp4"
        />
      ) : null}
    </video>
  )
}
