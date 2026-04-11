export type CoverStyle = 'tech' | 'art' | 'business' | 'nature'

export interface CoverTheme {
  id: CoverStyle
  label: string
  description: string
  palette: string[]
  fontStack: string
  keywords: string[]
}

export interface CoverOptions {
  title: string
  style: CoverStyle
  width?: number
  height?: number
  variant?: number
  seedOverride?: number
}

export interface CoverScene {
  width: number
  height: number
  seed: number
  rng: SeededRandom
  theme: CoverTheme
}

export interface CoverHistoryItem {
  id: string
  title: string
  style: CoverStyle
  seed: number
  createdAt: string
}

export interface StyleRecommendation {
  style: CoverStyle
  score: number
  matchedKeywords: string[]
}

export interface SeededRandom {
  next: () => number
  range: (min: number, max: number) => number
  int: (min: number, max: number) => number
  pick: <T>(items: T[]) => T
}
