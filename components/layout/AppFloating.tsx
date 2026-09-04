'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { t, type Locale } from '~/core/common/domain/i18n/config'
import { home } from '@/content/copy/home'
import { a11y } from '@/content/copy/common'
import { externalLinks } from '@/content/data/links'
import { stripLocale, routes } from '~/core/common/domain/i18n/routes'
import { track } from '@/lib/analytics'
import { cn } from '@ui/common/lib/cn'

/**
 * COMPONENTE FLOTANTE · descarga de la app
 * Ver docs/MASTER-PROJECT-DEFINITION.md §12 (restar antes que sumar) y §23.
 *
 * Un elemento fijo compite con TODO el contenido durante todo el recorrido, así
 * que no basta con que se vea bien: tiene que justificar cada segundo que ocupa
 * la pantalla. Las reglas son restricciones, no adornos:
 *
 * 1. APARECE AL PASAR LA PRIMERA SECCIÓN Y SE QUEDA. Se observa la primera
 *    sección de la página: mientras esté a la vista, el flotante no existe
 *    —ahí ya hay un CTA grande—; en cuanto sale, aparece y NO vuelve a
 *    esconderse hasta que se regresa a ella.
 *
 *    Antes el umbral era "el 90% de la altura del viewport", que es una
 *    aproximación a la primera sección y no la primera sección: en una página
 *    cuya cabecera mide menos que la pantalla aparecía tarde, y en una que
 *    mide más, temprano. Observar el elemento real funciona igual en las seis
 *    plantillas del sitio sin un número por página.
 *
 *    Y antes DESAPARECÍA en tres zonas del recorrido (`#infraestructura`,
 *    `#vision`, la sección de descarga). Eso se retiró por decisión de
 *    producto: un elemento que se va y vuelve tres veces mientras bajas se
 *    percibe como un fallo, no como delicadeza. Las dos colisiones REALES que
 *    esas zonas tapaban se resolvieron donde tocaba —ver las reglas 2 y 3—, en
 *    lugar de ocultando el componente.
 *
 * 2. NO ROBA LOS CONTROLES DE UN REPRODUCTOR. La tarjeta de escritorio se
 *    solapaba con la barra de reproducción de la película del beat 7, y un
 *    clic en silenciar o en pantalla completa ABRÍA LA TIENDA DE APPS. Un
 *    flotante que secuestra un control ajeno no es intrusivo: es un fallo.
 *
 *    La película salió de la Home el 2026-09-04, así que hoy no hay colisión
 *    —y el mecanismo que la resolvía, `FilmStage`, se fue con ella—. Queda
 *    escrito porque el fallo volverá el día que se ponga un vídeo con
 *    controles en cualquier beat: lo que lo resolvió fue elevar el reproductor
 *    por encima de esta tarjeta mientras el puntero está sobre él o mientras
 *    se reproduce, no esconder el flotante.
 *
 * 3. NO TAPA EL CTA DEL BEAT 2. Ese beat ancla su contenido al fondo de un
 *    panel FIJADO a pantalla completa, así que la barra móvil le caía encima y
 *    no había ninguna posición de scroll que lo liberara. Lo resuelve el propio
 *    beat reservando el hueco de la barra por debajo de `lg`.
 *
 * 4. NO SE PUEDE CERRAR, y eso hay que decirlo con su precio. Decisión de
 *    producto del 2026-09-04: la descarga de la app es la conversión primaria
 *    del negocio B2C y el componente ya se calla donde estorba —la primera
 *    sección, /empresas, los legales—, así que la salida no es un botón sino
 *    el propio recorrido.
 *
 *    El precio: quien no quiera la app la tiene delante todo el recorrido, y
 *    en móvil eso son 126px de pantalla que no se recuperan. Lo que lo hace
 *    aceptable es que el hueco esté RESERVADO donde importa —el pie y el CTA
 *    del beat 2 lo reservan— y que la barra no tape nada de forma permanente.
 *    Si alguna vez se decide devolver el cierre, el sitio donde vivía era una
 *    X de 44px en la fila superior de cada pieza.
 *
 * 5. ESPERA A QUE SE DECIDA LO DE LAS COOKIES. Los dos son elementos fijos
 *    abajo, así que se taparían. Y el orden no es negociable: primero se
 *    responde una pregunta legal, después se ofrece una descarga.
 *
 * 6. SE CALLA EN /empresas Y EN LOS LEGALES. En B2B la conversión es el
 *    formulario y §15 prohíbe que los CTA compitan; en un texto legal, tapar
 *    contenido durante una lectura larga estorba.
 *
 * ── DOS PIEZAS, NO UNA ENCOGIDA ──────────────────────────────────────────
 * En escritorio muestra un QR: las insignias de tienda son inútiles ahí porque
 * llevan a una ficha que no se puede instalar en el aparato que tienes
 * delante, y el código salta ese hueco.
 *
 * En móvil el QR es absurdo —un teléfono no se escanea a sí mismo— así que la
 * pieza es OTRA: una barra baja y compacta con la acción directa.
 *
 * ── EL ICONO DE LA APP ───────────────────────────────────────────────────
 * Se integra en las dos piezas porque responde una pregunta que el texto no
 * puede: *cuál* app. Quien ve un QR flotante no sabe qué le van a instalar
 * hasta que lo escanea; con el icono lo reconoce antes de sacar el teléfono.
 *
 * Va en la fila superior, ocupando el lado que el botón de cerrar dejaba
 * vacío: no añade una fila ni empuja nada. Y NO compite con el CTA porque no
 * es interactivo —es identidad, no acción— y porque el gradiente que lleva es
 * el del propio archivo de marca, no un segundo gradiente añadido a la vista
 * (§12: una acción con gradiente por vista, y aquí sigue siendo el botón).
 *
 * En móvil va a la izquierda del texto, que es el orden en que se lee: qué es
 * → qué hace → qué hago. El icono queda fuera del área táctil del botón para
 * que nadie lo pulse buscando abrir la app.
 *
 * ── VIDRIO MÁS OPACO QUE EL DEL SISTEMA ──────────────────────────────────
 * Usa `.glass-strong` y no `.glass`. Medido sobre el píxel compuesto a
 * percentil 99, el contraste del texto secundario ya cumplía AA con holgura
 * —7.79:1 en escritorio, 8.45:1 en móvil— así que el problema no era el
 * contraste: era que el TEXTO DE DETRÁS seguía siendo legible a través del
 * panel, y dos textos legibles en el mismo sitio compiten aunque los dos
 * tengan contraste. Ver la nota de `.glass-strong` en globals.css.
 *
 * ── ACCESIBILIDAD ────────────────────────────────────────────────────────
 * No atrapa el foco ni bloquea el scroll: NO es un diálogo modal, es contenido
 * complementario. Sí responde a Escape, y mientras está oculto va `inert` para
 * que no queden enlaces alcanzables con Tab dentro de una tarjeta invisible.
 * Solo se animan `opacity` y `transform` (§29).
 */

/** La misma clave que usa `CookieConsent`. Ver la regla 5. */
const CLAVE_COOKIES = 'voltop:cookies'

export function AppFloating({ lang }: { lang: Locale }) {
  const c = home.appFloating
  /* `true` de partida: al cargar, la primera sección está a la vista. */
  const [primeraALaVista, setPrimeraALaVista] = useState(true)
  /* `false` de partida: mientras no se sepa, el flotante no aparece. */
  const [cookiesDecididas, setCookiesDecididas] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const ruta = stripLocale(usePathname()) || '/'

  /* Regla 1 — se observa la PRIMERA SECCIÓN, no una fracción del viewport.
     Se vuelve a observar al cambiar de ruta: el componente vive en el layout y
     la navegación de cliente no lo remonta, así que sin la dependencia
     seguiría vigilando la sección de la página anterior, ya desmontada. */
  useEffect(() => {
    const primera = document.querySelector('main section')
    if (!primera) {
      /* Sin sección de referencia no hay nada que esperar: se muestra.
         Diferido a un fotograma porque un `setState` síncrono dentro de un
         efecto encadena renders y React lo señala. Aquí no urge: es la rama
         que no ocurre en ninguna de las plantillas del sitio. */
      const id = requestAnimationFrame(() => setPrimeraALaVista(false))
      return () => cancelAnimationFrame(id)
    }
    const io = new IntersectionObserver(([entrada]) => setPrimeraALaVista(entrada.isIntersecting), {
      threshold: 0,
    })
    io.observe(primera)
    return () => io.disconnect()
  }, [ruta])

  /* Regla 5 — se consulta al montar y se vuelve a consultar, porque la
     decisión puede tomarse con esta misma página abierta y `localStorage` no
     emite eventos dentro de la propia pestaña. */
  useEffect(() => {
    const leer = () => {
      try {
        setCookiesDecididas(localStorage.getItem(CLAVE_COOKIES) !== null)
      } catch {
        /* Sin almacenamiento no hay aviso que esperar. */
        setCookiesDecididas(true)
      }
    }
    const id = requestAnimationFrame(leer)
    const intervalo = window.setInterval(leer, 1000)
    return () => {
      cancelAnimationFrame(id)
      window.clearInterval(intervalo)
    }
  }, [])

  const rutaLoPermite = !ruta.startsWith(routes.empresas) && !ruta.startsWith('/legal')
  const mostrar = !primeraALaVista && rutaLoPermite && cookiesDecididas

  const transicion =
    'transition-[opacity,transform] duration-(--duration-base) ease-(--ease-out) motion-reduce:transition-none'

  /**
   * Icono de la app. `aria-hidden` y `alt` vacío: no aporta información que el
   * título no diga ya —"Descarga la app Voltop"— y anunciarlo dos veces solo
   * alarga el recorrido de un lector de pantalla.
   *
   * `rounded-[22.37%]` es la proporción del squircle del propio archivo, no un
   * radio del sistema: el PNG ya trae sus esquinas redondeadas y transparentes,
   * y el borde de vidrio se recorta para acompañarlas sin doblarlas.
   */
  const icono = (tamano: string) => (
    <span
      aria-hidden="true"
      className={cn(
        'relative shrink-0 overflow-hidden rounded-[22.37%] ring-1 ring-white/10',
        tamano,
      )}
    >
      <Image
        src="/logo-app.png"
        alt=""
        fill
        sizes="56px"
        className="object-cover"
      />
    </span>
  )

  return (
    <div
      ref={ref}
      aria-hidden={!mostrar}
      inert={!mostrar}
    >
      {/* ESCRITORIO — tarjeta con QR */}
      <div
        className={cn(
          'glass glass-strong fixed bottom-6 right-6 z-(--z-header) hidden w-[17.5rem] rounded-(--radius-structural) p-5 lg:block',
          transicion,
          mostrar ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0',
        )}
      >
        {/* CENTRADO, no alineado a la izquierda.
            Con el botón de cerrar fuera, la fila superior se quedó con el
            icono solo en una esquina y el QR centrado abajo: dos ejes
            distintos en una tarjeta de 280px, que es lo que la hacía sentir
            descuadrada. Ahora los cuatro elementos comparten el mismo eje
            —icono, título, texto y código— y la pieza se lee como una unidad.

            El centrado es la excepción declarada que el sistema ya admite
            (§ el `align="center"` de las primitivas de layout): aquí lo
            justifica el QR, que es un objeto simétrico y el ancla visual de
            la tarjeta. Sin él, esta pieza iría alineada al riel como el resto. */}
        <div className="flex flex-col items-center text-center">
          {icono('size-12')}

          <p className="mt-4 font-display text-display-s font-semibold text-balance text-ink">
            {t(c.title, lang)}
          </p>
          <p className="mt-2 text-body-s text-ink-2">{t(c.body, lang)}</p>
        </div>

        <a
          href={externalLinks.app}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            track('app_store_click', { tienda: 'dinamico', ubicacion: 'flotante_escritorio' })
          }
          /* El código se queda SOBRE BLANCO aunque el marco sea de vidrio: un
             lector espera módulos oscuros sobre fondo claro, y teñirlo para que
             "combine" hace fallar a muchos teléfonos. El vidrio es el marco; el
             código es un instrumento y no se decora. */
          className="press mx-auto mt-5 block w-fit rounded-[1.125rem] bg-white p-3 shadow-[0_8px_24px_-8px_rgb(0_0_0/0.7)]"
        >
          <Image
            src="/qr-descargar-app.svg"
            alt=""
            aria-hidden="true"
            width={112}
            height={112}
            unoptimized
            className="block size-28"
          />
          <span className="sr-only">
            {t(home.app.qrLabel, lang)} · {t(a11y.opensInNewTab, lang)}
          </span>
        </a>
      </div>

      {/* MÓVIL — barra baja con la acción directa */}
      <div
        className={cn(
          'glass glass-strong fixed inset-x-3 bottom-3 z-(--z-header) rounded-(--radius-structural) lg:hidden',
          'pb-[env(safe-area-inset-bottom)]',
          transicion,
          mostrar ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0',
        )}
      >
        {/* El icono va PRIMERO: qué es → qué hace → qué hago. Y queda fuera del
            área táctil del botón, para que nadie lo pulse buscando abrir.

            ── DOS FILAS POR DEBAJO DE 480px ─────────────────────────────────
            En una sola fila compiten icono, dos líneas de texto y botón.
            Medido cuando aún existía el cerrar: a 390px al texto le quedaban
            158px y la segunda línea necesita 227; a 320px le quedaban 88 y
            hasta el título se cortaba. Sin el cerrar sobran 56px, pero el
            reparto en dos filas se conserva: da al texto los 234px que la
            frase necesita y al CTA un objetivo táctil de ancho completo. No
            es un problema de copy —acortarlo hasta caber en 88px lo dejaría
            sin mensaje— sino de estructura.

            Por debajo de `xs` el botón se lleva su propia fila a ancho
            completo: el texto pasa a disponer de ~246px, cabe entero, y el CTA
            gana un objetivo táctil mucho mayor, que en un teléfono es mejor y
            no peor. La barra pasa de 70 a ~118px de alto, y ese es el precio
            aceptado a cambio de que el mensaje se lea.

            Un solo `<a>` para las dos disposiciones, no dos ocultándose: se
            reordena con `order` y envuelve con `flex-wrap`. Duplicar el enlace
            duplicaría también el emisor del evento de medición. */}
        <div className="flex flex-wrap items-center gap-3 p-3">
          {icono('size-10')}
          <div className="order-1 min-w-0 flex-1">
            <p className="truncate font-display text-body font-semibold text-ink">
              {t(c.titleMobile, lang)}
            </p>
            {/* `line-clamp-2` y no `truncate`: a 320px al texto le quedan
                164px y esta línea necesita 227, así que cortarla dejaría
                "Encuentra estaciones e ini…". Envolver a dos líneas conserva
                el mensaje entero y solo cuesta alto en el ancho más estrecho
                —de 390px arriba sigue siendo una línea—. El tope de dos evita
                que un idioma más largo estire la barra sin control. */}
            <p className="line-clamp-2 text-caption text-ink-2">{t(c.bodyMobile, lang)}</p>
          </div>
          <a
            href={externalLinks.app}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              track('app_store_click', { tienda: 'dinamico', ubicacion: 'flotante_movil' })
            }
            className="brand-gradient press order-3 inline-flex h-11 w-full shrink-0 items-center justify-center rounded-(--radius-pill) px-4 text-body-s font-semibold text-on-brand transition-[filter] duration-(--duration-fast) hover:brightness-105 xs:order-2 xs:w-auto"
          >
            {t(c.open, lang)}
            <span className="sr-only"> · {t(a11y.opensInNewTab, lang)}</span>
          </a>
        </div>
      </div>
    </div>
  )
}
