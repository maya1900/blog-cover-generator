import { createCoverId } from '../cover/seed'
import type { CoverHistoryItem, CoverStyle } from '../cover/types'

const HISTORY_KEY = 'blog-cover-history-v1'
const LIMIT = 12

interface SaveHistoryInput {
  title: string
  style: CoverStyle
  seed: number
  variant?: number
}

export function readHistory(): CoverHistoryItem[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    if (!raw) return []

    const parsed = JSON.parse(raw) as CoverHistoryItem[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveHistory(input: SaveHistoryInput): CoverHistoryItem[] {
  const nextItem: CoverHistoryItem = {
    id: createCoverId(input.style, input.title, input.seed),
    title: input.title,
    style: input.style,
    seed: input.seed,
    variant: input.variant,
    createdAt: new Date().toISOString(),
  }

  const current = readHistory().filter((item) => item.id !== nextItem.id)
  const nextHistory = [nextItem, ...current].slice(0, LIMIT)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory))
  return nextHistory
}

export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY)
}
