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
import { t, type Locale } from '@/lib/i18n/config'
import { href, routes } from '@/lib/i18n/routes'
import { home } from '@/content/copy/home'
import { actions } from '@/content/copy/common'
import { media } from '@/content/data/media'
import { Section, Container, Eyebrow } from '@/components/ui/layout'
import { Media } from '@/components/ui/Media'
import { Button } from '@/components/ui/Button'

/**
 * BEAT 2 · SIGNATURE MOMENT — Intensidad: MUY ALTA · Registro: Impacto
 * ESTRUCTURA: contenedor alto con panel STICKY y scroll-scrub real.
 *
 * ── QUÉ ESTABA MAL, MEDIDO ────────────────────────────────────────────────
 * La sección medía 240vh —2160px a 1440×900— y la revelación completa era un
 * recorte del 12% que terminaba al 45% del recorrido, es decir a los 567px.
 * Después venían ~700px de scroll con la pantalla ABSOLUTAMENTE INMÓVIL. En una
 * Home de 9 viewports, el 26% del scroll lo consumía un beat que se queda
 * quieto más tiempo del que se mueve. Y el comentario prometía que "el texto
 * entra por fases": no lo hacía, era un único `Reveal`.
 *
 * ── QUÉ SE HIZO ───────────────────────────────────────────────────────────
 * - 240vh → 170vh. El recorrido se ajusta a lo que dura la revelación.
 * - El recorte pasa de 12% a 28% y termina al 70%, no al 45%: se percibe como
 *   apertura y ocupa casi todo el trayecto pegado.
 * - El texto entra en dos fases: antetítulo y titular primero, cuerpo y
 *   acciones después.
 * - Con `prefers-reduced-motion` la sección COLAPSA a altura normal. Antes
 *   dejaba 2160px de scroll muerto sin equivalente: quien pide menos movimiento
 *   recibía el coste del efecto sin el efecto.
 *
 * ── POR QUÉ LAS FASES SON TEMPORALES Y NO DE SCROLL ───────────────────────
 * Se intentó ligar la opacidad del texto a `scrollYProgress` para que las fases
 * ocurrieran a lo largo del recorrido. Es lo que el comentario original de este
 * archivo ya advertía y hay que dejarlo escrito: una opacidad ligada al
 * progreso VUELVE A 0 al retroceder, así que el texto desaparecería al subir, y
 * quien llegue por `#infraestructura` sin desplazarse vería una pantalla vacía.
 *
 * Las fases se resuelven con un desfase temporal sobre un `whileInView` de una
 * sola vez: una vez visible, el texto no vuelve a ocultarse (§21). El scroll
 * largo ya no necesita relleno — se acortó a lo que dura la revelación.
 */
export function InfrastructureSignature({
  lang,
  entradaSlug,
}: {
  lang: Locale
  /**
   * Entrada del registro que cuenta la apertura de ESTA estación. La resuelve
   * la página desde `lib/data`, porque este componente es de cliente y no
   * puede consultar datos.
   *
   * Llega opcional a propósito: sin entrada, el CTA no se pinta. El enlace
   * anterior escribía el slug a mano —`san-fernando-plaza`, una estación que
   * se retiró del dataset— y llevaba a un 404 desde entonces sin que nadie se
   * enterara. Un botón que desaparece se nota; uno que va a ninguna parte, no.
   */
  entradaSlug?: string
}) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  /* El MATERIAL se revela con scroll-scrub: arranca recortado y se abre a
     sangre completa. Los hooks se llaman siempre, sin condicionales. */
  /**
   * ── APERTURA Y TEXTO, ENCADENADOS ────────────────────────────────────────
   * El texto entraba por `whileInView` —al asomar la sección— mientras el
   * recorte seguía abierto a medias. El borde del cuadro pasaba entonces por
   * detrás del titular y una línea vertical partía las palabras.
   *
   * Un recorte porcentual NO puede evitarlo ajustando el número: el recorte es
   * un porcentaje del ancho y el texto arranca tras un margen fijo, así que la
   * distancia del texto al borde cambia con el viewport. Medido: el titular
   * empieza al 3.8% del ancho a 1024px y al 20.6% a 1920px. Un 10% de recorte
   * cruzaba en 9 de 12 anchos probados.
   *
   * La solución no es un valor sino un ORDEN: primero se asienta el cuadro,
   * después entra el texto. Así el borde nunca coincide con las palabras, sea
   * cual sea el ancho, y la apertura recupera recorrido —18% en vez de 10%—
   * porque ya no tiene que caber por debajo de un texto.
   */
  /**
   * ── EL ENCUADRE SE ANCLA ARRIBA, NO FLOTA ────────────────────────────────
   * El recorte era simétrico —`inset(18%)` por los cuatro lados— y eso hacía
   * dos cosas malas a la vez. Medido a 1440×900 con la página a 500px:
   *
   * 1. Dejaba una BANDA MUERTA de 143px entre el final del hero y el borde
   *    superior del material. El beat 1 terminaba en una línea y empezaba una
   *    nada oscura antes de que apareciera nada.
   * 2. El material se leía como un RECTÁNGULO PEGADO sobre la página: cuatro
   *    bordes duros flotando en el vacío, que es el aspecto de una imagen
   *    insertada, no el de un encuadre que se abre.
   *
   * Ahora el recorte es asimétrico y el borde superior vale SIEMPRE 0: el
   * material toca el final del hero desde el primer fotograma, así que no hay
   * banda que cruzar. Se abre por los lados y por abajo.
   *
   * El gesto cambia de sentido y mejora: antes una tarjeta crecía en el centro;
   * ahora la instalación entra desde arriba y se despliega. Eso es el concepto
   * —recorrido, descenso— y no una representación literal de nada eléctrico.
   *
   * Los dos materiales siguen siendo dos: el hero es una fotografía y esto un
   * vídeo. No se intenta fingir que son uno. La continuidad la da la
   * composición —el borde compartido y el fondo que los cose— no el material.
   */
  const apertura = useTransform(scrollYProgress, [0, 0.25], reduce ? [0, 0] : [1, 0])
  const clipPath = useTransform(
    apertura,
    (v) => `inset(0% ${(v * 13).toFixed(2)}% ${(v * 30).toFixed(2)}% ${(v * 13).toFixed(2)}%)`,
  )
  const scale = useTransform(scrollYProgress, [0, 0.25], reduce ? [1, 1] : [1.06, 1])

  /**
   * El texto se destraba cuando la apertura ya terminó (30% del recorrido) y
   * NO vuelve a ocultarse: es un pestillo de un solo sentido.
   *
   * Esto es lo que la cabecera de este archivo ya advertía que no se hiciera
   * con una opacidad ligada al progreso —volvería a 0 al retroceder y el texto
   * desaparecería al subir—. Un pestillo conserva la sincronización con el
   * scroll sin ese efecto.
   *
   * La comprobación inicial cubre a quien llega directo por `#infraestructura`
   * o recarga a media sección: si el progreso ya pasó el umbral, el texto está
   * visible desde el primer fotograma.
   */
  const [abierto, setAbierto] = useState(false)
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (v > 0.3) setAbierto(true)
  })
  /* Diferido un fotograma: `useScroll` no tiene medida hasta después del
     layout, y actualizar el estado dentro del efecto sin diferir choca con
     la regla de React y provocaría un renderizado extra en la hidratación. */
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      if (scrollYProgress.get() > 0.3) setAbierto(true)
    })
    return () => cancelAnimationFrame(id)
  }, [scrollYProgress])

  /**
   * SALIDA DE EMERGENCIA para quien llega por `#infraestructura` y no se mueve.
   *
   * Atar el texto al recorrido reintroducía el fallo que la cabecera de este
   * archivo ya advertía: al aterrizar en el ancla el progreso es 0, así que el
   * pestillo no salta y la sección se ve **sin una palabra**. Medido: opacidad
   * 0 a 390 y a 1440 px.
   *
   * Si la sección lleva un momento en pantalla y el progreso sigue sin avanzar,
   * se abre sola. Y se abre ENTERA —cuadro y texto—: mostrar el texto dejando
   * el recorte a medias traería de vuelta el borde cruzando las palabras, que
   * es justo lo que se estaba arreglando.
   *
   * Ninguna ruta del sitio enlaza hoy a esta ancla, pero la URL es pública.
   */
  const enVista = useInView(ref, { amount: 0.5 })
  const [forzado, setForzado] = useState(false)
  useEffect(() => {
    if (!enVista) return
    const id = setTimeout(() => {
      if (scrollYProgress.get() < 0.15) setForzado(true)
    }, 1200)
    return () => clearTimeout(id)
  }, [enVista, scrollYProgress])

  const visible = reduce || abierto || forzado
  /**
   * RECALIBRADO al entrar la fotografía real (2026-09-01).
   *
   * Los valores anteriores —de 0.15 a 0.85— se fijaron contra el hueco
   * PLANO del placeholder, donde el fondo era una superficie uniforme y
   * oscura. Con foto real el párrafo y el rótulo caen sobre el cargador
   * iluminado y dejan de leerse: a 0.15 de opacidad no hay velo que valga.
   *
   * El suelo sube a 0.55 y el techo a 1. Se conserva la intención —el velo
   * CRECE con el recorrido, acompañando la apertura del recorte— pero parte
   * de un punto en el que el texto ya es legible, que es cuando empieza a
   * aparecer (`whileInView` con margen del 20%).
   */
  const scrimOpacity = useTransform(scrollYProgress, [0.1, 0.45], reduce ? [1, 1] : [0.8, 1])

  /** Fase de entrada del texto. Se dispara con el pestillo, no al asomar. */
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
      register="impacto"
      space="none"
      /* `motion-reduce:h-auto` colapsa el recorrido cuando no hay movimiento que
         justificarlo. El panel deja de estar pegado y la sección mide lo que
         mide su contenido. */
      className="h-[170vh] motion-reduce:h-auto"
    >
      <div className="sticky top-0 flex h-dvh flex-col justify-end overflow-hidden motion-reduce:static motion-reduce:h-auto">
        <motion.div
          style={{ scale, clipPath: forzado ? 'inset(0% 0% 0% 0%)' : clipPath }}
          /* La transición solo actúa en el caso forzado; durante el scroll el
             valor lo escribe motion en cada fotograma y no hay nada que animar. */
          className="absolute inset-0 transition-[clip-path] duration-500 ease-out"
        >
          <Media
            asset={media.estacionMedellin}
            lang={lang}
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

        {/* PUENTE. El hero termina en `canvas` sólido y el material empieza
            justo debajo: sin esto, el encuentro es un corte horizontal limpio
            entre una foto y un vídeo, y el ojo lo lee como dos páginas pegadas.
            Esta banda devuelve el canvas sobre el primer 14% del panel y lo
            disuelve, de modo que el material EMERGE del final del beat
            anterior en lugar de empezar en él.

            Va después del velo y antes del texto: tiñe el material, nunca las
            palabras. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[22%] bg-gradient-to-b from-canvas via-canvas/55 to-transparent"
        />

        {/* `pb-28` por debajo de `lg`: es donde vive la barra móvil del
            flotante de descarga, y este beat ancla su contenido al fondo de un
            panel FIJADO a pantalla completa. Sin reservar el hueco, la barra le
            caía encima al CTA y al pie de foto —medido: hasta el 84% y el 100%
            respectivamente— y, como el contenido está pinneado durante todo el
            recorrido, NO HABÍA NINGUNA POSICIÓN DE SCROLL QUE LO LIBERARA.
            Antes se resolvía escondiendo el flotante aquí; ahora que se queda
            visible en toda la página, el hueco lo reserva el beat. */}
        <Container className="relative z-(--z-raised) py-(--spacing-section-tight) pb-28 lg:pb-(--spacing-section-tight)">
          <motion.div {...phase(0)}>
            <Eyebrow tone="brand">{t(home.infrastructure.eyebrow, lang)}</Eyebrow>
            {/* `text-balance` reparte el largo de las líneas. Lo que evita
                que el pronombre quede huérfano tras el punto es el ESPACIO
                DURO del propio copy —ver la nota de `title` en home.ts—:
                equilibrar no sabe dónde acaba una frase. Las dos cosas se
                complementan y ninguna sustituye a la otra. */}
            <h2 className="mt-5 max-w-[18ch] font-display text-display-xl font-semibold text-balance text-ink">
              {t(home.infrastructure.title, lang)}
            </h2>
          </motion.div>

          <motion.div {...phase(0.18)}>
            <p className="mt-6 measure text-body-l text-ink-2">
              {t(home.infrastructure.lead, lang)}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
              {entradaSlug && (
                <Button
                  variant="ghost"
                  arrow
                  href={href(lang, routes.post(entradaSlug))}
                >
                  {t(actions.seeStation, lang)}
                </Button>
              )}
              <span className="font-mono text-mono uppercase tracking-wider text-ink-3">
                {t(home.infrastructure.caption, lang)}
              </span>
            </div>
          </motion.div>
        </Container>
      </div>
    </Section>
  )
}
