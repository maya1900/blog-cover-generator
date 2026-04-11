import { describe, expect, it } from 'vitest'
import { createSeed } from '../lib/cover/seed'

describe('createSeed', () => {
  it('returns stable seed for same title and style', () => {
    const first = createSeed({ title: 'AI Agent 如何重塑工作流', style: 'tech', variant: 0 })
    const second = createSeed({ title: 'AI Agent 如何重塑工作流', style: 'tech', variant: 0 })

    expect(first).toBe(second)
  })

  it('changes when variant changes', () => {
    const first = createSeed({ title: 'AI Agent 如何重塑工作流', style: 'tech', variant: 0 })
    const second = createSeed({ title: 'AI Agent 如何重塑工作流', style: 'tech', variant: 1 })

    expect(first).not.toBe(second)
  })

  it('uses explicit seed override first', () => {
    const seed = createSeed({ title: '任意标题', style: 'art', variant: 99, seedOverride: 20260411 })
    expect(seed).toBe(20260411)
  })
})
