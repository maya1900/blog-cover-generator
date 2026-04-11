import type { CoverScene } from '../types'

function drawFilmGrain(ctx: CanvasRenderingContext2D, width: number, height: number, rng: CoverScene['rng']) {
  for (let index = 0; index < 2600; index += 1) {
    const alpha = rng.range(0.01, 0.06)
    ctx.fillStyle = `rgba(94, 107, 82, ${alpha})`
    ctx.fillRect(rng.range(0, width), rng.range(0, height), rng.range(0.4, 1.8), rng.range(0.4, 1.8))
  }
}

function drawPaperWash(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height, rng } = scene
  for (let index = 0; index < 4; index += 1) {
    const radius = rng.range(width * 0.08, width * 0.18)
    const x = rng.range(width * 0.1, width * 0.9)
    const y = rng.range(height * 0.1, height * 0.9)
    const wash = ctx.createRadialGradient(x, y, 0, x, y, radius)
    wash.addColorStop(0, 'rgba(122, 75, 58, 0.12)')
    wash.addColorStop(1, 'rgba(122, 75, 58, 0)')
    ctx.fillStyle = wash
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()
  }
}

function drawWindowShadow(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height } = scene
  const shadow = ctx.createLinearGradient(width * 0.2, 0, width * 0.72, height)
  shadow.addColorStop(0, 'rgba(255,255,255,0)')
  shadow.addColorStop(0.5, 'rgba(255,255,255,0.26)')
  shadow.addColorStop(1, 'rgba(94,107,82,0.14)')
  ctx.fillStyle = shadow
  ctx.fillRect(width * 0.16, 0, width * 0.44, height)

  ctx.strokeStyle = 'rgba(94,107,82,0.08)'
  ctx.lineWidth = 5
  ctx.beginPath()
  ctx.moveTo(width * 0.32, 0)
  ctx.lineTo(width * 0.32, height)
  ctx.moveTo(width * 0.48, 0)
  ctx.lineTo(width * 0.48, height)
  ctx.moveTo(width * 0.16, height * 0.36)
  ctx.lineTo(width * 0.72, height * 0.36)
  ctx.stroke()
}

function drawBookPages(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height } = scene
  for (let page = 0; page < 3; page += 1) {
    const x = width * 0.08 + page * 40
    const y = height * 0.16 + page * 26
    const pageWidth = width * 0.26
    const pageHeight = height * 0.56
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate((-8 + page * 4) * Math.PI / 180)
    ctx.fillStyle = page === 2 ? 'rgba(252,248,242,0.96)' : 'rgba(240,232,220,0.92)'
    ctx.strokeStyle = 'rgba(122, 75, 58, 0.16)'
    ctx.lineWidth = 1.5
    ctx.fillRect(0, 0, pageWidth, pageHeight)
    ctx.strokeRect(0, 0, pageWidth, pageHeight)

    for (let line = 0; line < 12; line += 1) {
      ctx.strokeStyle = 'rgba(122, 75, 58, 0.09)'
      ctx.beginPath()
      ctx.moveTo(28, 38 + line * 34)
      ctx.lineTo(pageWidth - 28, 38 + line * 34)
      ctx.stroke()
    }
    ctx.restore()
  }
}

function drawCoffeeCup(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height } = scene
  const cupX = width * 0.78
  const cupY = height * 0.66
  ctx.fillStyle = 'rgba(122, 75, 58, 0.12)'
  ctx.beginPath()
  ctx.ellipse(cupX, cupY + 26, 120, 36, 0, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#f6f0e6'
  ctx.strokeStyle = '#7a4b3a'
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.ellipse(cupX, cupY, 96, 54, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()

  ctx.fillStyle = '#8b5e3c'
  ctx.beginPath()
  ctx.ellipse(cupX, cupY + 4, 74, 36, 0, 0, Math.PI * 2)
  ctx.fill()

  ctx.beginPath()
  ctx.arc(cupX + 96, cupY + 4, 28, -Math.PI / 2, Math.PI / 2)
  ctx.stroke()

  for (let steam = 0; steam < 3; steam += 1) {
    const startX = cupX - 28 + steam * 28
    ctx.strokeStyle = 'rgba(114, 47, 55, 0.18)'
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(startX, cupY - 20)
    ctx.bezierCurveTo(startX - 16, cupY - 66, startX + 20, cupY - 88, startX - 6, cupY - 132)
    ctx.stroke()
  }
}

function drawStickyNotes(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height, rng } = scene
  for (let index = 0; index < 3; index += 1) {
    const x = rng.range(width * 0.62, width * 0.84)
    const y = rng.range(height * 0.14, height * 0.46)
    const w = rng.range(110, 160)
    const h = rng.range(90, 120)
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(rng.range(-0.2, 0.2))
    ctx.fillStyle = index % 2 === 0 ? 'rgba(245, 230, 170, 0.82)' : 'rgba(243, 214, 195, 0.84)'
    ctx.fillRect(0, 0, w, h)
    ctx.strokeStyle = 'rgba(122, 75, 58, 0.18)'
    ctx.strokeRect(0, 0, w, h)
    ctx.restore()
  }
}

function drawStampMarks(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height, rng } = scene
  for (let index = 0; index < 2; index += 1) {
    const x = rng.range(width * 0.64, width * 0.88)
    const y = rng.range(height * 0.18, height * 0.78)
    const r = rng.range(34, 54)
    ctx.strokeStyle = 'rgba(114, 47, 55, 0.2)'
    ctx.lineWidth = 5
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(x, y, r * 0.7, 0, Math.PI * 2)
    ctx.stroke()
  }
}

function drawLedgerLines(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height } = scene
  ctx.strokeStyle = 'rgba(122, 75, 58, 0.08)'
  ctx.lineWidth = 1.2
  for (let index = 0; index < 9; index += 1) {
    const y = height * 0.18 + index * 60
    ctx.beginPath()
    ctx.moveTo(width * 0.56, y)
    ctx.lineTo(width * 0.92, y)
    ctx.stroke()
  }
}

function drawTapePieces(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height, rng } = scene
  for (let index = 0; index < 3; index += 1) {
    const x = rng.pick([width * 0.14, width * 0.78, width * 0.84])
    const y = rng.range(height * 0.04, height * 0.2)
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(rng.range(-0.35, 0.35))
    ctx.fillStyle = 'rgba(244, 224, 176, 0.45)'
    ctx.fillRect(-50, -16, 100, 32)
    ctx.strokeStyle = 'rgba(181, 138, 84, 0.18)'
    ctx.strokeRect(-50, -16, 100, 32)
    ctx.restore()
  }
}

function drawTornPaperEdges(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height, rng } = scene
  ctx.fillStyle = 'rgba(250, 245, 238, 0.88)'
  for (const anchorY of [height * 0.08, height * 0.86]) {
    ctx.beginPath()
    ctx.moveTo(0, anchorY)
    for (let step = 0; step <= 20; step += 1) {
      const x = (width / 20) * step
      const y = anchorY + rng.range(-12, 12)
      ctx.lineTo(x, y)
    }
    ctx.lineTo(width, anchorY + (anchorY < height * 0.2 ? -50 : 50))
    ctx.lineTo(0, anchorY + (anchorY < height * 0.2 ? -50 : 50))
    ctx.closePath()
    ctx.fill()
  }
}

function drawBookmarksOrTickets(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height, rng } = scene
  for (let index = 0; index < 2; index += 1) {
    const x = rng.range(width * 0.72, width * 0.9)
    const y = rng.range(height * 0.22, height * 0.72)
    const w = rng.range(86, 118)
    const h = rng.range(180, 240)
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(rng.range(-0.15, 0.12))
    ctx.fillStyle = index % 2 === 0 ? 'rgba(238, 222, 201, 0.92)' : 'rgba(227, 213, 191, 0.9)'
    ctx.fillRect(0, 0, w, h)
    ctx.strokeStyle = 'rgba(122, 75, 58, 0.2)'
    ctx.strokeRect(0, 0, w, h)
    ctx.clearRect(w * 0.5 - 9, 18, 18, 18)
    ctx.restore()
  }
}

function drawHandwrittenMarks(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height, rng } = scene
  ctx.strokeStyle = 'rgba(114, 47, 55, 0.24)'
  ctx.lineWidth = 3
  for (let index = 0; index < 4; index += 1) {
    const x = rng.range(width * 0.12, width * 0.84)
    const y = rng.range(height * 0.18, height * 0.78)
    ctx.beginPath()
    ctx.ellipse(x, y, rng.range(46, 84), rng.range(18, 34), rng.range(-0.8, 0.8), 0, Math.PI * 2)
    ctx.stroke()
  }
}

function drawTypewriterNotes(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height, rng } = scene
  ctx.font = '500 18px "Courier New", monospace'
  ctx.fillStyle = 'rgba(64, 38, 31, 0.48)'
  const words = ['draft', 'memo', 'story', 'chapter', 'coffee', 'note']
  for (let index = 0; index < 8; index += 1) {
    ctx.fillText(rng.pick(words), rng.range(width * 0.1, width * 0.82), rng.range(height * 0.16, height * 0.88))
  }
}

function drawCreases(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height } = scene
  ctx.strokeStyle = 'rgba(122, 75, 58, 0.08)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(width * 0.28, 0)
  ctx.lineTo(width * 0.4, height)
  ctx.moveTo(width * 0.78, 0)
  ctx.lineTo(width * 0.66, height)
  ctx.stroke()
}

export function renderArtStyle(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height, rng, theme } = scene

  const paper = ctx.createLinearGradient(0, 0, width, height)
  paper.addColorStop(0, '#f8f3ea')
  paper.addColorStop(0.5, theme.palette[0])
  paper.addColorStop(1, '#e9dfd1')
  ctx.fillStyle = paper
  ctx.fillRect(0, 0, width, height)

  drawPaperWash(ctx, scene)
  drawFilmGrain(ctx, width, height, rng)
  drawTornPaperEdges(ctx, scene)
  drawCreases(ctx, scene)

  const pool = [
    () => drawWindowShadow(ctx, scene),
    () => drawBookPages(ctx, scene),
    () => drawCoffeeCup(ctx, scene),
    () => drawStickyNotes(ctx, scene),
    () => drawStampMarks(ctx, scene),
    () => drawLedgerLines(ctx, scene),
    () => drawTapePieces(ctx, scene),
    () => drawBookmarksOrTickets(ctx, scene),
    () => drawHandwrittenMarks(ctx, scene),
    () => drawTypewriterNotes(ctx, scene),
  ]

  const count = rng.int(4, 6)
  const picked = new Set<number>()
  while (picked.size < count) {
    picked.add(rng.int(0, pool.length - 1))
  }

  Array.from(picked).forEach((index) => pool[index]?.())

  const vignette = ctx.createRadialGradient(width * 0.5, height * 0.5, width * 0.18, width * 0.5, height * 0.5, width * 0.65)
  vignette.addColorStop(0, 'rgba(255,255,255,0)')
  vignette.addColorStop(1, 'rgba(114,47,55,0.18)')
  ctx.fillStyle = vignette
  ctx.fillRect(0, 0, width, height)
}
