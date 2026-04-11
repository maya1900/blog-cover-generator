import type { CoverScene } from '../types'

function drawSkyline(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { height, rng } = scene
  const skylineBase = height * 0.64
  for (let index = 0; index < 12; index += 1) {
    const buildingWidth = rng.range(60, 140)
    const buildingHeight = rng.range(height * 0.12, height * 0.36)
    const x = 40 + index * 128
    ctx.fillStyle = index % 3 === 0 ? 'rgba(148, 163, 184, 0.16)' : 'rgba(255, 255, 255, 0.1)'
    ctx.fillRect(x, skylineBase - buildingHeight, buildingWidth, buildingHeight)

    for (let row = 0; row < 8; row += 1) {
      for (let column = 0; column < 3; column += 1) {
        ctx.fillStyle = rng.next() > 0.4 ? 'rgba(212, 175, 55, 0.28)' : 'rgba(255,255,255,0.06)'
        ctx.fillRect(x + 14 + column * 24, skylineBase - buildingHeight + 16 + row * 24, 10, 12)
      }
    }
  }
}

function drawChartPanel(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height, rng } = scene
  ctx.fillStyle = 'rgba(15, 23, 42, 0.55)'
  ctx.fillRect(width * 0.58, height * 0.12, width * 0.3, height * 0.34)
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)'
  ctx.lineWidth = 2
  ctx.strokeRect(width * 0.58, height * 0.12, width * 0.3, height * 0.34)

  const chartX = width * 0.61
  const chartY = height * 0.38
  const chartWidth = width * 0.22
  const chartHeight = height * 0.16
  ctx.strokeStyle = 'rgba(255,255,255,0.18)'
  ctx.beginPath()
  ctx.moveTo(chartX, chartY)
  ctx.lineTo(chartX, chartY - chartHeight)
  ctx.lineTo(chartX + chartWidth, chartY - chartHeight)
  ctx.stroke()

  let lastX = chartX
  let lastY = chartY - rng.range(chartHeight * 0.15, chartHeight * 0.4)
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.95)'
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.moveTo(lastX, lastY)
  for (let point = 1; point < 6; point += 1) {
    const nextX = chartX + (chartWidth / 5) * point
    const nextY = chartY - rng.range(chartHeight * 0.2, chartHeight * 0.95)
    ctx.lineTo(nextX, nextY)
    lastX = nextX
    lastY = nextY
  }
  ctx.stroke()
}

function drawInfoBullets(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height } = scene
  for (let bullet = 0; bullet < 4; bullet += 1) {
    const y = height * 0.18 + bullet * 46
    ctx.fillStyle = 'rgba(248, 250, 252, 0.82)'
    ctx.fillRect(width * 0.14, y, width * 0.26, 8)
    ctx.fillStyle = 'rgba(212, 175, 55, 0.9)'
    ctx.fillRect(width * 0.11, y - 1, 14, 14)
  }
}

function drawMetricCards(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height, rng } = scene
  for (let index = 0; index < 3; index += 1) {
    const x = width * 0.56 + index * 150
    const y = height * 0.52 + (index % 2) * 24
    ctx.fillStyle = 'rgba(255,255,255,0.08)'
    ctx.fillRect(x, y, 132, 92)
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.28)'
    ctx.strokeRect(x, y, 132, 92)
    ctx.fillStyle = 'rgba(248,250,252,0.9)'
    ctx.font = '700 28px "Microsoft YaHei"'
    ctx.fillText(`${rng.int(12, 98)}%`, x + 18, y + 42)
    ctx.fillStyle = 'rgba(226,232,240,0.72)'
    ctx.font = '500 16px "Microsoft YaHei"'
    ctx.fillText('KPI', x + 18, y + 72)
  }
}

function drawArrows(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height, rng } = scene
  for (let index = 0; index < 4; index += 1) {
    const startX = rng.range(width * 0.1, width * 0.4)
    const startY = rng.range(height * 0.6, height * 0.9)
    const endX = startX + rng.range(140, 280)
    const endY = startY - rng.range(30, 120)
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.38)'
    ctx.lineWidth = 5
    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.lineTo(endX, endY)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(endX, endY)
    ctx.lineTo(endX - 18, endY + 10)
    ctx.lineTo(endX - 10, endY + 26)
    ctx.stroke()
  }
}

function drawTimeline(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height } = scene
  const y = height * 0.8
  ctx.strokeStyle = 'rgba(255,255,255,0.18)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(width * 0.12, y)
  ctx.lineTo(width * 0.88, y)
  ctx.stroke()
  for (let i = 0; i < 5; i += 1) {
    const x = width * 0.18 + i * width * 0.14
    ctx.fillStyle = 'rgba(212, 175, 55, 0.9)'
    ctx.beginPath()
    ctx.arc(x, y, 7, 0, Math.PI * 2)
    ctx.fill()
  }
}

function drawColumnCards(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height } = scene
  const baseX = width * 0.54
  const cardWidth = width * 0.11
  for (let index = 0; index < 3; index += 1) {
    const x = baseX + index * (cardWidth + 18)
    const y = height * 0.16
    const cardHeight = height * 0.28 + index * 18
    ctx.fillStyle = 'rgba(255,255,255,0.06)'
    ctx.fillRect(x, y, cardWidth, cardHeight)
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.22)'
    ctx.strokeRect(x, y, cardWidth, cardHeight)
  }
}

function drawDividers(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height } = scene
  ctx.strokeStyle = 'rgba(255,255,255,0.08)'
  ctx.lineWidth = 1.5
  for (let index = 0; index < 5; index += 1) {
    const y = height * 0.14 + index * height * 0.12
    ctx.beginPath()
    ctx.moveTo(width * 0.1, y)
    ctx.lineTo(width * 0.9, y)
    ctx.stroke()
  }
}

function drawTargetFocus(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height, rng } = scene
  const x = rng.range(width * 0.72, width * 0.88)
  const y = rng.range(height * 0.68, height * 0.82)
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.38)'
  for (const r of [18, 38, 62]) {
    ctx.lineWidth = r === 62 ? 2 : 1.4
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.stroke()
  }
  ctx.beginPath()
  ctx.moveTo(x - 72, y)
  ctx.lineTo(x + 72, y)
  ctx.moveTo(x, y - 72)
  ctx.lineTo(x, y + 72)
  ctx.stroke()
}

function drawTableLines(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height } = scene
  const x = width * 0.58
  const y = height * 0.18
  const w = width * 0.24
  const h = height * 0.22
  ctx.strokeStyle = 'rgba(255,255,255,0.12)'
  ctx.lineWidth = 1
  for (let row = 0; row <= 5; row += 1) {
    const currentY = y + (h / 5) * row
    ctx.beginPath()
    ctx.moveTo(x, currentY)
    ctx.lineTo(x + w, currentY)
    ctx.stroke()
  }
  for (let col = 0; col <= 4; col += 1) {
    const currentX = x + (w / 4) * col
    ctx.beginPath()
    ctx.moveTo(currentX, y)
    ctx.lineTo(currentX, y + h)
    ctx.stroke()
  }
}

function drawCornerTitleTags(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width } = scene
  ctx.fillStyle = 'rgba(212, 175, 55, 0.92)'
  ctx.fillRect(width * 0.08, 72, 168, 42)
  ctx.fillStyle = '#0f172a'
  ctx.font = '700 18px "Microsoft YaHei"'
  ctx.fillText('EXECUTIVE', width * 0.08 + 18, 100)
}

function drawSectionBlocks(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height } = scene
  const sections = [
    [width * 0.08, height * 0.12, width * 0.34, height * 0.22],
    [width * 0.08, height * 0.56, width * 0.28, height * 0.2],
    [width * 0.72, height * 0.14, width * 0.18, height * 0.16],
  ]
  sections.forEach(([x, y, w, h]) => {
    ctx.fillStyle = 'rgba(255,255,255,0.04)'
    ctx.fillRect(x, y, w, h)
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'
    ctx.strokeRect(x, y, w, h)
  })
}

export function renderBusinessStyle(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height, rng, theme } = scene

  const bg = ctx.createLinearGradient(0, 0, width, height)
  bg.addColorStop(0, theme.palette[0])
  bg.addColorStop(0.5, theme.palette[1])
  bg.addColorStop(1, '#1f2937')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, width, height)

  ctx.strokeStyle = 'rgba(255,255,255,0.06)'
  for (let x = 0; x < width; x += 90) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
    ctx.stroke()
  }

  drawDividers(ctx, scene)
  drawSectionBlocks(ctx, scene)

  const pool = [
    () => drawSkyline(ctx, scene),
    () => drawChartPanel(ctx, scene),
    () => drawInfoBullets(ctx, scene),
    () => drawMetricCards(ctx, scene),
    () => drawArrows(ctx, scene),
    () => drawTimeline(ctx, scene),
    () => drawColumnCards(ctx, scene),
    () => drawTargetFocus(ctx, scene),
    () => drawTableLines(ctx, scene),
    () => drawCornerTitleTags(ctx, scene),
  ]

  const count = rng.int(4, 6)
  const picked = new Set<number>()
  while (picked.size < count) {
    picked.add(rng.int(0, pool.length - 1))
  }

  Array.from(picked).forEach((index) => pool[index]?.())
}
