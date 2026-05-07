import { describe, expect, it } from 'vitest'
import { recommendStyle } from '../lib/recommendation/recommendStyle'

describe('recommendStyle', () => {
  it('recommends tech style for technical title', () => {
    const result = recommendStyle('AI 编程系统与数据工程实践')
    expect(result[0]?.style).toBe('tech')
  })

  it('returns empty for empty title', () => {
    expect(recommendStyle('   ')).toEqual([])
  })
})
