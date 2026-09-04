/**
 * LANGUAGE COVERAGE AUDIT
 * See docs/MASTER-PROJECT-DEFINITION.md §28 and §30.
 *
 * ── THE PROBLEM IT SOLVES ─────────────────────────────────────────────────
 * The earlier model required every language in the type, so an untranslated
 * text was a compile error. That guarantee is lost the moment the non-base
 * languages become optional (see `Localized` in `../../domain/i18n/config`),
 * and with nothing to replace it the result would be the exact failure this
 * project has been avoiding from the start: a language served half done, in
 * silence.
 *
 * This module replaces it with something more useful than a type error: a
 * MEASUREMENT. It walks all the real content, counts how many texts each
 * language has and which ones it lacks, with their exact path.
 *
 * ── WHERE IT RUNS, AND WHY THERE ──────────────────────────────────────────
 * `src/app/sitemap.ts` invokes it, so it runs on every `npm run build` with no
 * new tool and no new dependency — which matters for a team that is not a
 * development team (§38): a check somebody has to remember to run is a check
 * that does not get run.
 *
 * The sitemap is not an arbitrary host either: the sitemap is precisely the
 * piece that DECLARES which languages exist publicly. Verifying that a
 * language is complete before announcing it is its own job.
 *
 * A DRAFT language is allowed to have gaps — that is what the status is for.
 * A PUBLISHED language with gaps breaks the build.
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

/* The site's real content. Adding a content module = adding it here, and
   `assertAllContentRegistered()` makes sure nobody forgets. */
import * as copyCommon from '~/core/common/domain/consts/copy'
import * as copyHome from '~/core/home/domain/consts/copy'
import * as copyRed from '~/core/network/domain/consts/copy'
import * as copyEmpresas from '~/core/business/domain/consts/copy'
import * as copyNosotros from '~/core/about/domain/consts/copy'
import * as copyLegal from '~/core/legal/domain/consts/copy'
import * as copyNovedades from '~/core/news/domain/consts/copy'
import * as dataStations from '~/core/network/infrastructure/content/stations'
import * as dataCities from '~/core/network/infrastructure/content/cities'
import * as dataCompanyEmpresas from '~/core/business/infrastructure/content/company'
import * as dataCompanyNosotros from '~/core/about/infrastructure/content/company'
import * as dataMedia from '~/core/common/infrastructure/content/media'
import * as dataPosts from '~/core/news/infrastructure/content/posts'
import * as dataFaq from '~/core/network/infrastructure/content/faq'
import * as dataLinks from '~/core/common/domain/consts/links'
import * as dataLegalDocs from '~/core/legal/infrastructure/content/legalDocs'

const SOURCES: Record<string, unknown> = {
  'common/consts/copy': copyCommon,
  'home/consts/copy': copyHome,
  'network/consts/copy': copyRed,
  'business/consts/copy': copyEmpresas,
  'about/consts/copy': copyNosotros,
  'legal/consts/copy': copyLegal,
  'news/consts/copy': copyNovedades,
  'network/content/stations': dataStations,
  'network/content/cities': dataCities,
  'business/content/company': dataCompanyEmpresas,
  'about/content/company': dataCompanyNosotros,
  'common/content/media': dataMedia,
  'news/content/posts': dataPosts,
  'network/content/faq': dataFaq,
  'common/consts/links': dataLinks,
  /* Plain Spanish on purpose — it is legal prose. It contributes 0 `Localized`
     nodes and therefore does not move the coverage count, which also means the
     count does not protect this file: only its comments are translated. */
  'legal/content/legalDocs': dataLegalDocs,
}

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v)

/**
 * A multi-language text is recognised by having the BASE language, which is the
 * only required one. The heuristic is reliable here because `Localized` always
 * carries it and no other object in the content uses `es` as a key.
 */
const isLocalized = (v: unknown): v is Record<string, unknown> =>
  isPlainObject(v) && Object.prototype.hasOwnProperty.call(v, defaultLocale)

export type LocaleAudit = {
  /** Multi-language texts found across all the content. */
  total: number
  present: Record<Locale, number>
  /** Exact paths of what is missing, so it can be fixed without hunting. */
  missing: Record<Locale, string[]>
}

/**
 * The root, with ALL its segments literal.
 *
 * This is not cosmetic: `join(process.cwd(), ...variableSegments)` leaves
 * Turbopack unable to analyse the path, and it responds by tracing the whole
 * project ("Dynamic filesystem access causes tracing of the whole project").
 * With the root fixed and only the rest variable, the warning goes away.
 */
const CORE_DIR = join(process.cwd(), 'src', 'core')

/** The `.ts` files in a directory, without extension. Absent = empty list. */
function contentFilesIn(dir: string): string[] {
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter((file) => file.endsWith('.ts'))
    .map((file) => file.slice(0, -3))
}

/**
 * Content in its place: `src/core/{module}/domain/consts/` for the texts and
 * `src/core/{module}/infrastructure/content/` for the data.
 *
 * Walking the MODULES rather than two fixed folders widens the guarantee: a
 * whole new module that nobody registered also trips it, not just a stray file
 * inside a module already known.
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
 * NOBODY REMEMBERS TO UPDATE A LIST BY HAND.
 *
 * The module list above is exactly the kind of manual registry this project
 * avoids everywhere else, and the risk is not hypothetical: when
 * `news/consts/copy` and `news/content/posts` were created they were forgotten
 * here, and the audit went on reporting "332/332 complete" over content it no
 * longer covered. An audit that lies is worse than no audit, because it
 * authorises publishing.
 *
 * So the list is checked against disk. An unregistered content file breaks the
 * build instead of vanishing from the count in silence. `fs` is available:
 * this runs in Node during the build, not in the browser.
 */
function assertAllContentRegistered(): void {
  const found = registrableModuleContent()
  const unregistered = found.filter((key) => !(key in SOURCES))
  if (unregistered.length === 0) return

  throw new Error(
    `\n[i18n] Content modules the language audit is not checking:\n` +
      unregistered.map((k) => `      · ${k}`).join('\n') +
      `\n\n  Add them to SOURCES in core/common/infrastructure/i18n/audit.ts.\n`,
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
      /* Do not descend: its values ARE the translations. */
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

/**
 * One column per language, readable in the build output.
 *
 * The status is printed as the stored literal (`publicado` / `borrador`) and
 * not translated on purpose: what this line reports is the actual value in
 * `localeStatus`, and showing a different word than the one in the data would
 * make the log harder to match against the source, not easier.
 */
export function formatAudit(audit: LocaleAudit): string {
  const cols = locales.map((l) => {
    const status = localeStatus[l] === 'publicado' ? 'publicado' : 'BORRADOR'
    return `${localeMeta[l].label} ${audit.present[l]}/${audit.total} (${status})`
  })
  return `[i18n] ${cols.join(' · ')}`
}

/**
 * Breaks the build if a PUBLISHED language has gaps.
 * This is the line that stops a half-translated language from shipping.
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
      /* Only the first few are listed, so the message stays actionable
         without becoming unreadable; the count says how many remain. */
      const sample = list
        .slice(0, 12)
        .map((p) => `      · ${p}`)
        .join('\n')
      const rest = list.length > 12 ? `\n      … and ${list.length - 12} more` : ''
      return `  ${localeMeta[l].name} (${localeMeta[l].hreflang}) — ${list.length} missing:\n${sample}${rest}`
    })
    .join('\n\n')

  throw new Error(
    `\n[i18n] A language declared PUBLISHED has untranslated texts.\n\n${detail}\n\n` +
      `  Translate what is missing, or mark the language as "borrador" in core/common/domain/i18n/config.ts.\n`,
  )
}
