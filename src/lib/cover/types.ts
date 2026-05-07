export type CoverStyle = 'tech' | 'art' | 'business' | 'nature'

export type TitleFontPreset = 'yahei' | 'songti' | 'kaiti' | 'hei' | 'serif'

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
  titleFont?: TitleFontPreset
  titleScale?: number
}

export interface RenderResult {
  seed: number
  width: number
  height: number
  variant: number
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
  variant?: number
  createdAt: string
}

export interface StyleRecommendation {
  style: CoverStyle
  score: number
  matchedKeywords: string[]
  reasons: string[]
  confidence: 'high' | 'medium' | 'low'
}

export interface SeededRandom {
  next: () => number
  range: (min: number, max: number) => number
  int: (min: number, max: number) => number
  pick: <T>(items: T[]) => T
}
