import { renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useSettledUrl } from './useSettledUrl'

/**
 * What is protected here is the measurement, not the URL: every
 * `replaceState` is a `page_view` for GA4, so the number of calls IS the
 * number of phantom visits. The assertions count calls first and look at the
 * value second.
 */
describe('useSettledUrl', () => {
  const replaceState = vi.fn()

  beforeEach(() => {
    vi.useFakeTimers()
    vi.spyOn(window.history, 'replaceState').mockImplementation(replaceState)
  })

  afterEach(() => {
    replaceState.mockReset()
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('does not touch the URL before the settle time has passed', () => {
    const { result } = renderHook(() => useSettledUrl(700))

    result.current('/red?ciudad=bogota')
    vi.advanceTimersByTime(699)

    expect(replaceState).not.toHaveBeenCalled()
  })

  it('collapses a burst of writes into one, with the last value', () => {
    const { result } = renderHook(() => useSettledUrl(700))

    result.current('/red?ciudad=bogota')
    vi.advanceTimersByTime(200)
    result.current('/red?ciudad=bogota&conector=ccs2')
    vi.advanceTimersByTime(200)
    result.current('/red?ciudad=medellin&conector=ccs2')
    vi.advanceTimersByTime(700)

    expect(replaceState).toHaveBeenCalledTimes(1)
    expect(replaceState).toHaveBeenCalledWith(null, '', '/red?ciudad=medellin&conector=ccs2')
  })

  it('writes again once a new change arrives after settling', () => {
    const { result } = renderHook(() => useSettledUrl(700))

    result.current('/red?ciudad=bogota')
    vi.advanceTimersByTime(700)
    result.current('/red')
    vi.advanceTimersByTime(700)

    expect(replaceState).toHaveBeenCalledTimes(2)
    expect(replaceState).toHaveBeenLastCalledWith(null, '', '/red')
  })

  it('cancels a pending write when the component unmounts', () => {
    const { result, unmount } = renderHook(() => useSettledUrl(700))

    result.current('/red?ciudad=bogota')
    unmount()
    vi.advanceTimersByTime(1000)

    expect(replaceState).not.toHaveBeenCalled()
  })
})
