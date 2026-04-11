import { buildTitleLayout } from './layout'
import { createSeed, createSeededRandom } from './seed'
import { renderArtStyle } from './styles/art'
import { renderBusinessStyle } from './styles/business'
import { renderNatureStyle } from './styles/nature'
import { renderTechStyle } from './styles/tech'
import { COVER_SIZE, THEMES } from './themes'
import type { CoverOptions, CoverScene, CoverStyle } from './types'

function drawTitle(
  ctx: CanvasRenderingContext2D,
  title: string,
  style: CoverStyle,
  width: number,
  height: number,
) {
  const theme = THEMES[style]
  const layout = buildTitleLayout(ctx, title, width, height, theme.fontStack)

  ctx.textAlign = style === 'business' ? 'left' : 'center'
  ctx.textBaseline = 'middle'
  ctx.font = `700 ${layout.fontSize}px ${theme.fontStack}`
  ctx.lineWidth = style === 'tech' ? 1.2 : 0

  switch (style) {
    case 'tech':
      ctx.fillStyle = '#f8fafc'
      ctx.shadowColor = 'rgba(103, 232, 249, 0.32)'
      ctx.shadowBlur = 24
      break
    case 'art':
      ctx.fillStyle = '#40261f'
      ctx.shadowColor = 'rgba(255,255,255,0.3)'
      ctx.shadowBlur = 14
      break
    case 'business':
      ctx.fillStyle = '#f8fafc'
      ctx.shadowColor = 'rgba(15,23,42,0.28)'
      ctx.shadowBlur = 18
      break
    case 'nature':
      ctx.fillStyle = '#16331f'
      ctx.shadowColor = 'rgba(255,255,255,0.24)'
      ctx.shadowBlur = 16
      break
  }

  layout.lines.forEach((line, index) => {
    const x = style === 'business' ? width * 0.1 : layout.centerX
    const y = layout.startY + index * layout.lineHeight
    ctx.fillText(line, x, y)
  })

  ctx.shadowBlur = 0

  const accent = {
    tech: 'FUTURE / SYSTEM / DIGITAL SIGNAL',
    art: 'BOOK / LIGHT / COFFEE / STORY',
    business: 'STRATEGY · EXECUTION · RESULTS',
    nature: 'LIGHT · AIR · WATER · GROWTH',
  }[style]

  ctx.font = `600 ${Math.max(20, layout.fontSize * 0.24)}px ${theme.fontStack}`
  ctx.letterSpacing = '1px'
  ctx.fillStyle = style === 'business' ? 'rgba(248,250,252,0.76)' : 'rgba(32,32,32,0.5)'
  ctx.fillText(
    accent,
    style === 'business' ? width * 0.1 : layout.centerX,
    layout.startY + layout.lines.length * layout.lineHeight + 54,
  )
}

function renderStyle(ctx: CanvasRenderingContext2D, style: CoverStyle, scene: CoverScene) {
  switch (style) {
    case 'tech':
      renderTechStyle(ctx, scene)
      break
    case 'art':
      renderArtStyle(ctx, scene)
      break
    case 'business':
      renderBusinessStyle(ctx, scene)
      break
    case 'nature':
      renderNatureStyle(ctx, scene)
      break
  }
}

export function renderCoverToCanvas(canvas: HTMLCanvasElement, options: CoverOptions) {
  const width = options.width ?? COVER_SIZE.width
  const height = options.height ?? COVER_SIZE.height
  const seed = createSeed(options)
  const rng = createSeededRandom(seed)
  const theme = THEMES[options.style]

  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('浏览器不支持 Canvas 2D 上下文')
  }

  ctx.clearRect(0, 0, width, height)

  const scene: CoverScene = {
    width,
    height,
    seed,
    rng,
    theme,
  }

  renderStyle(ctx, options.style, scene)
  drawTitle(ctx, options.title.trim(), options.style, width, height)

  return { seed, width, height }
}

export function exportCanvasAsPng(canvas: HTMLCanvasElement, fileName: string) {
  const link = document.createElement('a')
  link.href = canvas.toDataURL('image/png')
  link.download = fileName
  link.click()
}
