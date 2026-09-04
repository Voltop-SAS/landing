import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { assertAllContentRegistered, unregisteredKeys } from './audit'

/**
 * This mechanism exists because it already failed once in production: the
 * registry went out of date, and the audit reported "332/332 complete" over
 * content it had stopped covering. An audit that lies is worse than no audit,
 * because it authorises publishing.
 *
 * So what is tested here is not that it counts correctly — the build already
 * prints that on every run — but that it BREAKS when it should.
 */
describe('language audit · the registry guard', () => {
  const fixtures = join(process.cwd(), 'src', 'test', 'fixtures', 'core')

  it('breaks when a content file is not in the registry', () => {
    expect(unregisteredKeys(['network/consts/copy'], {})).toEqual(['network/consts/copy'])
  })

  it('breaks when a whole unregistered module appears', () => {
    const found = ['invented/consts/copy', 'network/consts/copy']
    const sources = { 'network/consts/copy': {} }
    expect(unregisteredKeys(found, sources)).toEqual(['invented/consts/copy'])
  })

  it('stays quiet when everything is registered', () => {
    expect(unregisteredKeys(['a/consts/copy'], { 'a/consts/copy': {} })).toEqual([])
  })

  /**
   * The regression that motivated the floor: every early return in the scanner
   * yields `[]` when a directory is missing, and `[]` reads as "nothing
   * unregistered", which reads as success. A process started from the wrong
   * working directory would therefore sail past the guard while the audit
   * covered nothing — the same shape as the original failure.
   */
  it('breaks when the scan finds no content at all, instead of reporting success', () => {
    expect(() => assertAllContentRegistered('/tmp/definitely-not-the-project')).toThrow(
      /found no content at all/,
    )
  })

  it('walks domain/consts and infrastructure/content of every module', () => {
    /* The fixture module is deliberately named something the real registry
       does not know, so a scan that reaches both of its directories must
       complain about exactly those two keys. Using a real module name here
       made the first version of this test pass for the wrong reason: the keys
       it produced were genuinely registered, so nothing was reported. */
    expect(() => assertAllContentRegistered(fixtures)).toThrow(/fixturemod\/consts\/copy/)
    expect(() => assertAllContentRegistered(fixtures)).toThrow(/fixturemod\/content\/things/)
  })
})
