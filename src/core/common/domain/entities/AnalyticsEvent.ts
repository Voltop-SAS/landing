/**
 * THE MEASUREMENT PLAN, AS A TYPE
 * See docs/MASTER-PROJECT-DEFINITION.md §31.
 *
 * `EventName` is not an implementation detail of the analytics tool: it is the
 * closed catalogue of what the product declares it measures, and it survives
 * intact through a move from GA4 to Segment or PostHog. That is why it lives in
 * the domain and not next to the `dispatch` that sends it. Adding an event to
 * the plan means adding a variant here, and the compiler makes sure nobody
 * emits one that is not on the list.
 *
 * ── THE NAMES CHANGED TO ENGLISH ON 2026-09-09 (Tagging Plan v1.1) ────────
 * They used to be Spanish, and `AGENTS.md` declared them a contract for a good
 * reason: renaming one silently splits a metric in two. This rename is not
 * silent — it is the whole catalogue at once, on a dated cut-over, and the rule
 * in `AGENTS.md` was rewritten in the same commit.
 *
 * Why English: anyone opening the property reads the names without a
 * translator, and they sit next to GA4's own vocabulary instead of clashing
 * with it. Only `generate_lead` is a GA4 recommended event, with reports of
 * its own that a custom name never populates. The rest — `station_search`,
 * `select_station` and the others below — are custom names chosen for
 * clarity, not for automatic reports: GA4's `search` and `select_item` were
 * considered and not adopted because their built-in reports expect
 * parameters (`search_term`, an `items` array) that this site deliberately
 * does not send.
 *
 * Why now: the site had been in production for days, so the history being
 * cut is the smallest it will ever be — every week of waiting made this more
 * expensive.
 *
 * ── WHAT IS NOT HERE, ON PURPOSE ─────────────────────────────────────────
 * `contact_click`, `get_directions_click` and `faq_open` are read by GTM from
 * the click itself, not emitted from here, so they are not in this catalogue:
 * nothing in the code emits them and the compiler should say so.
 *
 * Ten events from the previous plan were retired rather than renamed. See the
 * changelog: most of them duplicated `page_view`.
 */

export type EventName =
  // ── Red · finding somewhere to charge
  /** A search ran. Carries the RESULT COUNT, never the term. See `StationFinder`. */
  | 'station_search'
  | 'filter_stations'
  | 'use_my_location'
  /** A station page was opened. */
  | 'view_station'
  /** A station was chosen from a list, before the page opens. */
  | 'select_station'
  // ── B2B · the lead
  | 'form_start'
  | 'form_error'
  /** ONLY on a real successful send — after `POST /api/leads` answers ok. */
  | 'generate_lead'
  // ── App
  /** Carries `placement` so each instance is told apart. */
  | 'app_download_click'
  // ── Idioma
  | 'language_switch'

/**
 * Event properties. Only slugs, enums, counts and booleans travel here.
 *
 * NEVER free text written by a person: no names, e-mail addresses, phone
 * numbers, message bodies or search terms. Once a value reaches the analytics
 * platform it cannot be taken back.
 */
export type EventProps = Record<string, string | number | boolean | null | undefined>
