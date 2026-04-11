import { beforeEach, describe, expect, it } from 'vitest'
import { clearHistory, readHistory, saveHistory } from '../lib/storage/history'

describe('history storage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('saves and reads history', () => {
    saveHistory({ title: '商务增长复盘', style: 'business', seed: 123 })
    const history = readHistory()

    expect(history).toHaveLength(1)
    expect(history[0]?.title).toBe('商务增长复盘')
    expect(history[0]?.style).toBe('business')
    expect(history[0]?.seed).toBe(123)
  })

  it('keeps different generated seeds for same title', () => {
    saveHistory({ title: '商务增长复盘', style: 'business', seed: 123 })
    saveHistory({ title: '商务增长复盘', style: 'business', seed: 456 })

    const history = readHistory()
    expect(history).toHaveLength(2)
    expect(history[0]?.seed).toBe(456)
    expect(history[1]?.seed).toBe(123)
  })

  it('clears history', () => {
    saveHistory({ title: '自然写作', style: 'nature', seed: 456 })
    clearHistory()

    expect(readHistory()).toEqual([])
  })
})
