import { buildTitleLayout } from './layout'
import { createSeed, createSeededRandom } from './seed'
import { renderArtStyle, renderArtStyleAnimated } from './styles/art'
import { renderBusinessStyle, renderBusinessStyleAnimated } from './styles/business'
import { renderNatureStyle, renderNatureStyleAnimated } from './styles/nature'
import { renderTechStyle, renderTechStyleAnimated } from './styles/tech'
import { COVER_SIZE, THEMES, TITLE_FONT_PRESETS } from './themes'
import type { CoverOptions, CoverScene, CoverStyle, RenderResult, TitleFontPreset } from './types'

function resolveTitleFont(fontPreset?: TitleFontPreset, style?: CoverStyle) {
  if (fontPreset) {
    return TITLE_FONT_PRESETS[fontPreset].fontStack
  }

  return style ? THEMES[style].fontStack : TITLE_FONT_PRESETS.yahei.fontStack
}

function drawTitle(
  ctx: CanvasRenderingContext2D,
  title: string,
  style: CoverStyle,
  width: number,
  height: number,
  titleFont?: TitleFontPreset,
  titleScale = 1,
) {
  const fontStack = resolveTitleFont(titleFont, style)
  const layout = buildTitleLayout(ctx, title, width, height, fontStack)
  const scaledFontSize = Math.max(36, layout.fontSize * titleScale)
  const scaledLineHeight = layout.lineHeight * titleScale

  ctx.textAlign = style === 'business' ? 'left' : 'center'
  ctx.textBaseline = 'middle'
  ctx.font = `700 ${scaledFontSize}px ${fontStack}`
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
    const y = layout.startY + index * scaledLineHeight
    ctx.fillText(line, x, y)
  })

  ctx.shadowBlur = 0

  const accent = {
    tech: 'FUTURE / SYSTEM / DIGITAL SIGNAL',
    art: 'BOOK / LIGHT / COFFEE / STORY',
    business: 'STRATEGY · EXECUTION · RESULTS',
    nature: 'LIGHT · AIR · WATER · GROWTH',
  }[style]

  ctx.font = `600 ${Math.max(16, scaledFontSize * 0.22)}px ${fontStack}`
  ctx.letterSpacing = '1px'
  ctx.fillStyle = style === 'business' ? 'rgba(248,250,252,0.76)' : 'rgba(32,32,32,0.5)'
  ctx.fillText(
    accent,
    style === 'business' ? width * 0.1 : layout.centerX,
    layout.startY + layout.lines.length * scaledLineHeight + 38,
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

function renderStyleAnimated(ctx: CanvasRenderingContext2D, style: CoverStyle, scene: CoverScene) {
  switch (style) {
    case 'tech':
      renderTechStyleAnimated(ctx, scene)
      break
    case 'art':
      renderArtStyleAnimated(ctx, scene)
      break
    case 'business':
      renderBusinessStyleAnimated(ctx, scene)
      break
    case 'nature':
      renderNatureStyleAnimated(ctx, scene)
      break
  }
}

export function renderCoverToCanvas(canvas: HTMLCanvasElement, options: CoverOptions): RenderResult {
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

  // 开发模式打印基本信息
  if (import.meta.env.DEV) {
    console.log(
      `%c🎨 ${theme.label} - ${options.title}`,
      'background: linear-gradient(135deg, #0ea5e9, #8b5cf6); color: white; padding: 4px 12px; border-radius: 4px; font-weight: bold;',
    )
  }

  renderStyle(ctx, options.style, scene)
  drawTitle(ctx, options.title.trim(), options.style, width, height, options.titleFont, options.titleScale)

  return {
    seed,
    width,
    height,
    variant: options.variant ?? 0,
  }
}

export async function exportCanvasAsPng(canvas: HTMLCanvasElement, fileName: string) {
  let format: string
  let quality: number | undefined

  if (fileName.endsWith('.png')) {
    format = 'image/png'
    quality = undefined
  } else if (fileName.endsWith('.webp')) {
    format = 'image/webp'
    quality = 0.92
  } else {
    format = 'image/jpeg'
    quality = 0.92
  }

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, format, quality))
  if (!blob) return

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)
}

// 动态预览渲染（支持时间参数）
export function renderCoverToCanvasAnimated(canvas: HTMLCanvasElement, options: CoverOptions): void {
  const width = options.width ?? COVER_SIZE.width
  const height = options.height ?? COVER_SIZE.height
  const seed = createSeed(options)
  const rng = createSeededRandom(seed)
  const theme = THEMES[options.style]

  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // 清除画布，避免帧叠加
  ctx.clearRect(0, 0, width, height)

  const time = Date.now() * 0.001

  const scene: CoverScene = {
    width,
    height,
    seed,
    rng,
    theme,
    time, // 传入时间用于动画
  }

  renderStyleAnimated(ctx, options.style, scene)
  drawTitle(ctx, options.title.trim(), options.style, width, height, options.titleFont, options.titleScale)
}
