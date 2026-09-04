/**
 * AUDITORÍA DE COBERTURA DE IDIOMAS
 * Ver docs/MASTER-PROJECT-DEFINITION.md §28 y §30.
 *
 * ── QUÉ PROBLEMA RESUELVE ─────────────────────────────────────────────────
 * El modelo anterior exigía todos los idiomas en el tipo, así que un texto sin
 * traducir era un error de compilación. Esa garantía se pierde al hacer
 * opcionales los idiomas distintos del base (ver `Localized` en `config.ts`), y
 * sin nada que la sustituya el resultado sería el fallo que el proyecto lleva
 * evitando desde el principio: un idioma servido a medias, en silencio.
 *
 * Este módulo la sustituye por algo más útil que un error de tipos: una
 * MEDIDA. Recorre todo el contenido real, cuenta cuántos textos tiene cada
 * idioma y de cuáles carece, con su ruta exacta.
 *
 * ── DÓNDE SE EJECUTA Y POR QUÉ AHÍ ────────────────────────────────────────
 * Lo invoca `app/sitemap.ts`, así que corre en cada `npm run build` sin
 * herramienta nueva ni dependencia nueva — importa para un equipo que no es de
 * desarrollo (§38): una comprobación que hay que acordarse de lanzar es una
 * comprobación que no se lanza.
 *
 * El sitio del sitemap no es arbitrario: el sitemap es exactamente la pieza que
 * DECLARA qué idiomas existen de cara al público. Verificar que un idioma está
 * completo antes de anunciarlo es su propio trabajo.
 *
 * Un idioma en BORRADOR puede tener huecos: para eso está el estado.
 * Un idioma PUBLICADO con huecos rompe el build.
 */

import { existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

import {
  locales,
  defaultLocale,
  localeStatus,
  localeMeta,
  type Locale,
} from '~/core/common/domain/i18n/config'

/* El contenido real del sitio. Añadir un módulo de contenido = añadirlo aquí,
   y `assertAllContentRegistered()` se encarga de que no se olvide. */
import * as copyCommon from '~/core/common/domain/consts/copy'
import * as copyHome from '@/content/copy/home'
import * as copyRed from '@/content/copy/red'
import * as copyEmpresas from '@/content/copy/empresas'
import * as copyNosotros from '@/content/copy/nosotros'
import * as copyLegal from '@/content/copy/legal'
import * as copyNovedades from '@/content/copy/novedades'
import * as dataStations from '@/content/data/stations'
import * as dataCities from '@/content/data/cities'
import * as dataCompany from '@/content/data/company'
import * as dataMedia from '~/core/common/infrastructure/content/media'
import * as dataPosts from '@/content/data/posts'
import * as dataFaq from '@/content/data/faq'
import * as dataLinks from '~/core/common/domain/consts/links'
import * as dataLegalDocs from '@/content/data/legal-docs'

const SOURCES: Record<string, unknown> = {
  'common/consts/copy': copyCommon,
  'copy/home': copyHome,
  'copy/red': copyRed,
  'copy/empresas': copyEmpresas,
  'copy/nosotros': copyNosotros,
  'copy/legal': copyLegal,
  'copy/novedades': copyNovedades,
  'data/stations': dataStations,
  'data/cities': dataCities,
  'data/company': dataCompany,
  'common/content/media': dataMedia,
  'data/posts': dataPosts,
  'data/faq': dataFaq,
  'common/consts/links': dataLinks,
  /* Español plano a propósito: ver la cabecera del archivo. Aporta 0 nodos
     `Localized` y por eso no altera el recuento de cobertura. */
  'data/legal-docs': dataLegalDocs,
}

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v)

/**
 * Un texto multiidioma se reconoce por tener el idioma BASE, que es el único
 * obligatorio. La heurística es fiable aquí porque `Localized` siempre lo
 * lleva y ningún otro objeto del contenido usa `es` como clave.
 */
const isLocalized = (v: unknown): v is Record<string, unknown> =>
  isPlainObject(v) && Object.prototype.hasOwnProperty.call(v, defaultLocale)

export type LocaleAudit = {
  /** Textos multiidioma encontrados en todo el contenido. */
  total: number
  present: Record<Locale, number>
  /** Rutas exactas de lo que falta, para poder repararlo sin buscarlo. */
  missing: Record<Locale, string[]>
}

/**
 * NADIE SE ACUERDA DE ACTUALIZAR UNA LISTA A MANO.
 *
 * La lista de módulos de arriba es exactamente el tipo de registro manual que
 * el proyecto evita en todas partes, y no es hipotético: al crear
 * `copy/novedades` y `data/posts` se olvidaron aquí, y la auditoría siguió
 * dando "332/332 completo" sobre un contenido que ya no cubría. Una auditoría
 * que miente es peor que no tenerla, porque autoriza a publicar.
 *
 * Así que la lista se contrasta contra el disco. Un archivo de contenido sin
 * registrar rompe el build en lugar de desaparecer del conteo en silencio.
 * `fs` está disponible: esto corre en Node durante el build, no en el navegador.
 */
/**
 * Las dos raíces, con TODOS sus segmentos literales.
 *
 * No es cosmético: `join(process.cwd(), ...segmentosVariables)` deja a
 * Turbopack sin poder analizar la ruta, y responde trazando el proyecto entero
 * ("Dynamic filesystem access causes tracing of the whole project"). Con la
 * raíz fija y solo el resto variable, el aviso desaparece.
 */
const CORE_DIR = join(process.cwd(), 'src', 'core')
const LEGACY_CONTENT_DIR = join(process.cwd(), 'content')

/** Los `.ts` de un directorio, sin extensión. Ausente = lista vacía. */
function contentFilesIn(dir: string): string[] {
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter((file) => file.endsWith('.ts'))
    .map((file) => file.slice(0, -3))
}

/**
 * El contenido en su sitio: `src/core/{módulo}/domain/consts/` para los textos
 * y `src/core/{módulo}/infrastructure/content/` para los datos.
 *
 * Recorrer los MÓDULOS en lugar de dos carpetas fijas amplía la garantía: un
 * módulo nuevo entero que nadie registró también salta, no solo un archivo
 * suelto dentro de uno ya conocido.
 */
function registrableModuleContent(): string[] {
  if (!existsSync(CORE_DIR)) return []

  const keys: string[] = []
  for (const entry of readdirSync(CORE_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    const mod = entry.name
    for (const file of contentFilesIn(join(CORE_DIR, mod, 'domain', 'consts'))) {
      keys.push(`${mod}/consts/${file}`)
    }
    for (const file of contentFilesIn(join(CORE_DIR, mod, 'infrastructure', 'content'))) {
      keys.push(`${mod}/content/${file}`)
    }
  }
  return keys
}

/**
 * TRANSITORIO. La ubicación heredada, mientras queden módulos por mudar a
 * `src/core/`. Devuelve vacío en cuanto `content/` no exista, así que el día
 * que se mude el último módulo esta función deja de aportar nada y se borra
 * junto con esta nota.
 */
function legacyContent(): string[] {
  return (['copy', 'data'] as const).flatMap((dir) =>
    contentFilesIn(join(LEGACY_CONTENT_DIR, dir)).map((file) => `${dir}/${file}`),
  )
}

function assertAllContentRegistered(): void {
  const found = [...registrableModuleContent(), ...legacyContent()]
  const unregistered = found.filter((key) => !(key in SOURCES))
  if (unregistered.length === 0) return

  throw new Error(
    `\n[i18n] Hay módulos de contenido que la auditoría de idiomas no está revisando:\n` +
      unregistered.map((k) => `      · ${k}`).join('\n') +
      `\n\n  Añádelos a SOURCES en core/common/infrastructure/i18n/audit.ts.\n`,
  )
}

export function auditLocales(): LocaleAudit {
  assertAllContentRegistered()

  const present = Object.fromEntries(locales.map((l) => [l, 0])) as Record<Locale, number>
  const missing = Object.fromEntries(locales.map((l) => [l, [] as string[]])) as Record<
    Locale,
    string[]
  >
  const seen = new WeakSet<object>()
  let total = 0

  const walk = (node: unknown, path: string): void => {
    if (typeof node !== 'object' || node === null) return
    if (seen.has(node)) return
    seen.add(node)

    if (isLocalized(node)) {
      total += 1
      for (const l of locales) {
        if (node[l] !== undefined) present[l] += 1
        else missing[l].push(path)
      }
      /* No se desciende: sus valores SON las traducciones. */
      return
    }

    if (Array.isArray(node)) {
      node.forEach((child, i) => walk(child, `${path}[${i}]`))
      return
    }

    for (const [key, value] of Object.entries(node)) {
      walk(value, path ? `${path}.${key}` : key)
    }
  }

  for (const [name, mod] of Object.entries(SOURCES)) walk(mod, name)

  return { total, present, missing }
}

/** Una línea por idioma, legible en la salida del build. */
export function formatAudit(audit: LocaleAudit): string {
  const cols = locales.map((l) => {
    const status = localeStatus[l] === 'publicado' ? 'publicado' : 'BORRADOR'
    return `${localeMeta[l].label} ${audit.present[l]}/${audit.total} (${status})`
  })
  return `[i18n] ${cols.join(' · ')}`
}

/**
 * Rompe el build si un idioma PUBLICADO tiene huecos.
 * Es la línea que impide publicar un idioma a medias.
 */
export function assertPublishedLocalesComplete(): LocaleAudit {
  const audit = auditLocales()
  console.log(formatAudit(audit))

  const incomplete = locales.filter(
    (l) => localeStatus[l] === 'publicado' && audit.missing[l].length > 0,
  )
  if (incomplete.length === 0) return audit

  const detail = incomplete
    .map((l) => {
      const list = audit.missing[l]
      /* Se muestran las primeras para que el mensaje sea accionable sin
         volverse ilegible; el conteo dice cuántas quedan. */
      const sample = list
        .slice(0, 12)
        .map((p) => `      · ${p}`)
        .join('\n')
      const rest = list.length > 12 ? `\n      … y ${list.length - 12} más` : ''
      return `  ${localeMeta[l].name} (${localeMeta[l].hreflang}) — faltan ${list.length}:\n${sample}${rest}`
    })
    .join('\n\n')

  throw new Error(
    `\n[i18n] Un idioma declarado como PUBLICADO tiene textos sin traducir.\n\n${detail}\n\n` +
      `  Traduce lo que falta, o marca el idioma como "borrador" en lib/i18n/config.ts.\n`,
  )
}
