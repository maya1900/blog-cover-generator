const TITLE_SAFE_WIDTH_RATIO = 0.82

export interface TitleLayout {
  lines: string[]
  fontSize: number
  lineHeight: number
  centerX: number
  startY: number
  maxTextWidth: number
}

function segmentTitle(title: string): string[] {
  const normalized = title.trim()
  if (!normalized) return []

  const wordSegments = normalized.match(/[A-Za-z0-9][A-Za-z0-9'’:/&.-]*|[\u4e00-\u9fa5]|[^\s]/g)
  return wordSegments?.filter(Boolean) ?? normalized.split('')
}

export function buildTitleLayout(
  ctx: CanvasRenderingContext2D,
  title: string,
  width: number,
  height: number,
  fontFamily: string,
): TitleLayout {
  const maxTextWidth = width * TITLE_SAFE_WIDTH_RATIO
  const segments = segmentTitle(title)
  const effectiveLength = Math.max(title.trim().length, 8)
  let fontSize = Math.max(58, Math.min(104, (width / effectiveLength) * 2.15))
  let lines: string[] = []

  while (fontSize >= 38) {
    ctx.font = `700 ${fontSize}px ${fontFamily}`
    lines = []
    let currentLine = segments[0] ?? ''

    for (let index = 1; index < segments.length; index += 1) {
      const current = segments[index] ?? ''
      const separator = /[A-Za-z0-9]/.test(currentLine.slice(-1)) && /[A-Za-z0-9]/.test(current[0] ?? '') ? ' ' : ''
      const candidate = `${currentLine}${separator}${current}`

      if (ctx.measureText(candidate).width <= maxTextWidth) {
        currentLine = candidate
      } else {
        lines.push(currentLine)
        currentLine = current
      }
    }

    if (currentLine) {
      lines.push(currentLine)
    }

    const widest = Math.max(...lines.map((line) => ctx.measureText(line).width), 0)
    if (lines.length <= 3 && widest <= maxTextWidth) {
      break
    }

    fontSize -= 4
  }

  if (lines.length === 3 && lines[2] && lines[2].length <= 2) {
    lines[1] = `${lines[1]}${lines[2]}`
    lines.pop()
  }

  const lineHeight = fontSize * (lines.length === 1 ? 1.1 : 1.16)
  const blockHeight = lineHeight * lines.length

  return {
    lines,
    fontSize,
    lineHeight,
    centerX: width / 2,
    startY: height / 2 - blockHeight / 2 + lineHeight / 2 - (lines.length === 1 ? 10 : 0),
    maxTextWidth,
  }
}
