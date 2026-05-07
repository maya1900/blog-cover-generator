import { buildTitleLayout } from './layout'
import { createSeed, createSeededRandom } from './seed'
import { renderArtStyle } from './styles/art'
import { renderBusinessStyle } from './styles/business'
import { renderNatureStyle } from './styles/nature'
import { renderTechStyle } from './styles/tech'
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
  if (!title.trim()) {
    return
  }

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

export async function exportCanvasAsImage(canvas: HTMLCanvasElement, fileName: string) {
  const blob = await createCanvasImageBlob(canvas, fileName)
  if (!blob) return

  downloadBlob(blob, fileName)
}

export async function createCanvasImageBlob(canvas: HTMLCanvasElement, fileName: string) {
  const { format, quality } = resolveExportFormat(fileName)
  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, format, quality))
}

interface CompressedBlobOptions {
  maxBytes: number
  format?: 'image/png' | 'image/webp' | 'image/jpeg'
}

export async function createCompressedCanvasImageBlob(
  sourceCanvas: HTMLCanvasElement,
  { maxBytes, format = 'image/png' }: CompressedBlobOptions,
) {
  let bestBlob: Blob | null = null
  const scaleCandidates = [1, 0.92, 0.84, 0.76, 0.68, 0.6, 0.52, 0.44]

  if (format === 'image/png') {
    for (const scale of scaleCandidates) {
      const canvas = createScaledCanvas(sourceCanvas, scale)
      const blob = await canvasToBlob(canvas, format)
      if (!blob) {
        continue
      }

      if (!bestBlob || blob.size < bestBlob.size) {
        bestBlob = blob
      }

      if (blob.size <= maxBytes) {
        return blob
      }
    }
    return bestBlob
  }

  const qualityCandidates = [0.86, 0.78, 0.7, 0.62, 0.54, 0.46]

  for (const scale of scaleCandidates) {
    const canvas = createScaledCanvas(sourceCanvas, scale)
    for (const quality of qualityCandidates) {
      const blob = await canvasToBlob(canvas, format, quality)
      if (!blob) {
        continue
      }

      if (!bestBlob || blob.size < bestBlob.size) {
        bestBlob = blob
      }

      if (blob.size <= maxBytes) {
        return blob
      }
    }
  }

  return bestBlob
}

function resolveExportFormat(fileName: string) {
  if (fileName.endsWith('.png')) {
    return { format: 'image/png', quality: undefined }
  }

  if (fileName.endsWith('.webp')) {
    return { format: 'image/webp', quality: 0.88 }
  }

  return { format: 'image/jpeg', quality: 0.86 }
}

function createScaledCanvas(sourceCanvas: HTMLCanvasElement, scale: number) {
  if (scale === 1) {
    return sourceCanvas
  }

  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(sourceCanvas.width * scale))
  canvas.height = Math.max(1, Math.round(sourceCanvas.height * scale))

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('浏览器不支持 Canvas 2D 上下文')
  }

  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(sourceCanvas, 0, 0, canvas.width, canvas.height)
  return canvas
}

function canvasToBlob(canvas: HTMLCanvasElement, format: string, quality?: number) {
  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, format, quality))
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)
}
