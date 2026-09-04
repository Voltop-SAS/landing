import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { formatDate, yearOf } from './dates'
import { locales } from '~/core/common/domain/i18n/config'

/**
 * THE TIME ZONE OF THE TEST PROCESS IS PART OF THE TEST.
 *
 * `formatDate` pins `timeZone: 'UTC'`, and the bug that decision prevents only
 * appears WEST of Greenwich: a log date is `"2026-06-18"`, which `new Date()`
 * reads as midnight UTC, so anywhere west of Greenwich it formats as the 17th.
 *
 * A suite running under UTC therefore proves nothing: remove the pin from
 * production and every assertion below still passes. That is the failure mode
 * this harness exists to prevent, and it is not hypothetical — the machine
 * these tests were written on runs `America/Bogota`, so they would have caught
 * the regression there and gone quietly vacuous on a CI runner in UTC.
 *
 * `Pacific/Honolulu` (UTC-10) rather than Colombia's own UTC-5 on purpose: it
 * is further west, so the shift also shows for dates whose UTC hour is late,
 * and it observes no daylight saving, so the offset is the same all year.
 */
const TEST_ZONE = 'Pacific/Honolulu'
const ORIGINAL_TZ = process.env.TZ

beforeAll(() => {
  process.env.TZ = TEST_ZONE
})

afterAll(() => {
  /* Restored so this file cannot colour the tests of whoever shares the
     worker. Deleting is not the same as assigning `undefined`, which would
     leave the literal string "undefined" as the zone. */
  if (ORIGINAL_TZ === undefined) delete process.env.TZ
  else process.env.TZ = ORIGINAL_TZ
})

/**
 * The guard. Everything below is only worth something if the process really
 * did move west, so that is asserted before asserting anything about our own
 * code — and asserted by REPRODUCING the bug, not by reading a setting.
 *
 * If a future Node or Vitest stops honouring a runtime `TZ` change, this test
 * goes red and says why. Without it, that same change would silently turn the
 * whole file into a suite that passes without checking anything.
 */
describe('the harness that makes these tests meaningful', () => {
  it('runs west of Greenwich, where dropping the UTC pin would shift the day', () => {
    expect(Intl.DateTimeFormat().resolvedOptions().timeZone).toBe(TEST_ZONE)

    /* The same formatting `formatDate` does, minus the one decision under
       test. It must land on the PREVIOUS day: that is the bug, reproduced. */
    const withoutThePin = new Intl.DateTimeFormat('es-CO', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date('2026-06-18'))

    expect(withoutThePin).toContain('17')
  })
})

/**
 * DECISION 1 · `timeZone: 'UTC'` is not optional.
 *
 * A log entry would change its date depending on where it was rendered: the
 * server, someone's browser, a CI runner. Same content, three dates.
 */
describe('formatDate · keeps the date the content actually declares', () => {
  it('formats the ISO calendar day, not the day it is locally', () => {
    expect(formatDate('2026-06-18', 'es')).toBe('18 jun 2026')
  })

  /**
   * The sharpest case, because it is wrong in three ways at once instead of
   * one: without the pin this returns "31 dic 2025" — wrong day, wrong month
   * and wrong YEAR. The year matters beyond the label, since `yearOf` groups
   * the log by it: an entry would be filed under a year it does not belong to.
   */
  it('does not roll a new year back into the old one', () => {
    expect(formatDate('2026-01-01', 'es')).toBe('1 ene 2026')
    expect(formatDate('2026-01-01', 'es')).not.toContain('2025')
  })

  it('lands on the same calendar day in every language', () => {
    /* A locale is free to bring its own calendar and numbering; what it may
       not bring is a different day. Asserted across `locales` rather than a
       hand-written list so a fourth language is covered the day it is added,
       which is the whole promise of §28. */
    for (const locale of locales) {
      expect(formatDate('2026-06-18', locale)).toContain('18')
      expect(formatDate('2026-06-18', locale)).not.toContain('17')
    }
  })
})

/**
 * DECISION 2 · connectors are dropped BY CATEGORY, never by a word list.
 *
 * The log prints dates in mono and uppercase, where "18 DE JUN DE 2026" reads
 * as three words of noise around the data. What is removed is the alphabetic
 * `literal` part, so no table of words has to grow with each new language.
 *
 * ── WHAT THESE TESTS CANNOT PROVE, SAID OUT LOUD ─────────────────────────
 * They do not distinguish the categorical rule from a word list. They were
 * written believing they did; mutating the module to filter on `/\bde\b`
 * instead of on "is alphabetic" left all ten of them green.
 *
 * The reason is that today's three languages cannot tell the two apart:
 * Spanish and Portuguese both emit the literal `" de "`, and English emits
 * `" "` and `", "`, which carry no letters and therefore no word to list. The
 * categorical rule is insurance against a FOURTH language whose connector is
 * some other word — and insurance is precisely what cannot be tested before
 * the risk exists.
 *
 * So what follows asserts the part that is observable: what comes out for each
 * declared language, and that punctuation survives while filler does not.
 *
 * Note for whoever sees these go red: the exact abbreviations come from the
 * ICU data bundled with Node. If a Node upgrade renames a month, that is what
 * broke, not this module.
 */
describe('formatDate · strips filler without touching punctuation', () => {
  it('drops the Spanish connectors', () => {
    /* "18 de jun de 2026" → "18 jun 2026". */
    expect(formatDate('2026-06-18', 'es')).not.toMatch(/\bde\b/)
  })

  it('keeps the English comma, which is punctuation and not filler', () => {
    /* The case that a word list would have got right by accident and a
       "strip everything that is not alphanumeric" would have got wrong. */
    expect(formatDate('2026-06-18', 'en')).toBe('Jun 18, 2026')
  })

  /**
   * Portuguese is the only language here whose month arrives abbreviated with
   * a period: "18 de jun. de 2026" has to lose both "de" and keep the period,
   * because that period is not a literal — it belongs to the month VALUE.
   *
   * The realistic change this catches is someone tidying the output with a
   * `.replace(/\./g, '')`, reading the period as leftover noise from the same
   * cleanup that removes the connectors. Verified by mutation: that change
   * fails here and nowhere else in the file.
   */
  it('tells an abbreviation apart from a connector in Portuguese', () => {
    expect(formatDate('2026-06-18', 'pt')).toBe('18 jun. 2026')
  })

  it('leaves no double spaces behind after removing a connector', () => {
    for (const locale of locales) {
      expect(formatDate('2026-06-18', locale)).not.toMatch(/\s{2,}/)
      expect(formatDate('2026-06-18', locale).trim()).toBe(formatDate('2026-06-18', locale))
    }
  })
})

/**
 * `yearOf` slices the string instead of parsing a date, and that is the whole
 * point of it: it is what makes it immune to the time zone. The obvious
 * "improvement" — `new Date(iso).getFullYear()` — reintroduces exactly the bug
 * `formatDate` pins UTC to avoid, and it does so where nothing would announce
 * it, because a year looks right until the one day of the year it is not.
 */
describe('yearOf · groups the log by the year the entry declares', () => {
  it('returns the year of the ISO date', () => {
    expect(yearOf('2026-06-18')).toBe('2026')
  })

  it('survives a date that local time would push into the previous year', () => {
    /* Under `Pacific/Honolulu` this instant is 31 Dec 2025. Parsing it as a
       date would file the entry under 2025 and leave it in the wrong section
       of the log. */
    expect(yearOf('2026-01-01')).toBe('2026')
  })
})
