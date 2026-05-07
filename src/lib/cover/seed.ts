import type { CoverOptions, CoverStyle, SeededRandom } from './types'

function hashString(value: string): number {
  let hash = 2166136261

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }

  return hash >>> 0
}

function mulberry32(seed: number): () => number {
  return () => {
    let state = (seed += 0x6d2b79f5)
    state = Math.imul(state ^ (state >>> 15), state | 1)
    state ^= state + Math.imul(state ^ (state >>> 7), state | 61)

    return ((state ^ (state >>> 14)) >>> 0) / 4294967296
  }
}

export function createSeed(options: Pick<CoverOptions, 'title' | 'style' | 'variant' | 'seedOverride'>): number {
  if (typeof options.seedOverride === 'number') {
    return options.seedOverride
  }

  return hashString(`${options.style}::${options.title.trim()}::${options.variant ?? 0}`)
}

export function createSeededRandom(seed: number): SeededRandom {
  const nextValue = mulberry32(seed)

  return {
    next: () => nextValue(),
    range: (min, max) => min + (max - min) * nextValue(),
    int: (min, max) => Math.floor(min + (max - min + 1) * nextValue()),
    pick: <T,>(items: T[]) => items[Math.floor(nextValue() * items.length)] ?? items[0],
  }
}

export function createCoverId(style: CoverStyle, title: string, seed: number): string {
  return `${style}-${hashString(`${title}-${seed}`)}`
}
