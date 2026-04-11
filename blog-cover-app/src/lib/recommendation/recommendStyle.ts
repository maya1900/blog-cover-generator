import { THEMES } from '../cover/themes'
import type { CoverStyle, StyleRecommendation } from '../cover/types'

export function recommendStyle(title: string): StyleRecommendation[] {
  const normalized = title.trim().toLowerCase()

  if (!normalized) {
    return []
  }

  return (Object.entries(THEMES) as [CoverStyle, (typeof THEMES)[CoverStyle]][])
    .map(([style, theme]) => {
      const matchedKeywords = theme.keywords.filter((keyword) => normalized.includes(keyword.toLowerCase()))
      return {
        style,
        matchedKeywords,
        score: matchedKeywords.length,
      }
    })
    .filter((item) => item.score > 0)
    .sort((left, right) => right.score - left.score)
}
