import type { CoverScene } from '../types'

function drawFilmGrain(ctx: CanvasRenderingContext2D, width: number, height: number, rng: CoverScene['rng']) {
  for (let index = 0; index < 3200; index += 1) {
    const alpha = rng.range(0.05, 0.15)
    ctx.fillStyle = `rgba(94, 107, 82, ${alpha})`
    ctx.fillRect(rng.range(0, width), rng.range(0, height), rng.range(0.5, 2), rng.range(0.5, 2))
  }
}

function drawPaperWash(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height, rng } = scene
  for (let index = 0; index < 6; index += 1) {
    const radius = rng.range(width * 0.12, width * 0.28)
    const x = rng.range(width * 0.05, width * 0.95)
    const y = rng.range(height * 0.05, height * 0.95)
    const wash = ctx.createRadialGradient(x, y, 0, x, y, radius)
    wash.addColorStop(0, 'rgba(122, 75, 58, 0.25)')
    wash.addColorStop(1, 'rgba(122, 75, 58, 0)')
    ctx.fillStyle = wash
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()
  }
}

function drawWindowShadow(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height, rng } = scene
  // 随机位置的窗影
  const startX = rng.range(width * 0.1, width * 0.25)
  const shadowWidth = rng.range(width * 0.35, width * 0.5)
  const shadow = ctx.createLinearGradient(startX, 0, startX + shadowWidth, height)
  shadow.addColorStop(0, 'rgba(255,255,255,0)')
  shadow.addColorStop(0.5, 'rgba(255,255,255,0.45)')
  shadow.addColorStop(1, 'rgba(94,107,82,0.32)')
  ctx.fillStyle = shadow
  ctx.fillRect(startX, 0, shadowWidth, height)

  // 窗框线
  const lineX = startX + shadowWidth * rng.range(0.3, 0.7)
  ctx.strokeStyle = 'rgba(94,107,82,0.28)'
  ctx.lineWidth = 7
  ctx.beginPath()
  ctx.moveTo(lineX, 0)
  ctx.lineTo(lineX, height)
  ctx.moveTo(width * 0.48, 0)
  ctx.lineTo(width * 0.48, height)
  ctx.moveTo(width * 0.16, height * 0.36)
  ctx.lineTo(width * 0.72, height * 0.36)
  ctx.stroke()
}

function drawBookPages(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height, rng } = scene
  // 随机书堆位置
  const baseX = rng.range(width * 0.04, width * 0.12)
  const baseY = rng.range(height * 0.12, height * 0.24)
  for (let page = 0; page < 3; page += 1) {
    const x = baseX + page * rng.range(30, 50)
    const y = baseY + page * rng.range(18, 34)
    const pageWidth = width * rng.range(0.22, 0.30)
    const pageHeight = height * rng.range(0.48, 0.62)
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(rng.range(-12, 8) * Math.PI / 180)
    ctx.fillStyle = page === 2 ? 'rgba(252,248,242,0.98)' : 'rgba(240,232,220,0.95)'
    ctx.strokeStyle = 'rgba(122, 75, 58, 0.25)'
    ctx.lineWidth = 2
    ctx.fillRect(0, 0, pageWidth, pageHeight)
    ctx.strokeRect(0, 0, pageWidth, pageHeight)

    for (let line = 0; line < 12; line += 1) {
      ctx.strokeStyle = 'rgba(122, 75, 58, 0.15)'
      ctx.beginPath()
      ctx.moveTo(28, 38 + line * 34)
      ctx.lineTo(pageWidth - 28, 38 + line * 34)
      ctx.stroke()
    }
    ctx.restore()
  }
}

// 羽毛笔
function drawFeatherPen(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height, rng } = scene
  const x = rng.range(width * 0.08, width * 0.25)
  const y = rng.range(height * 0.4, height * 0.65)
  const angle = rng.range(-0.4, 0.2)

  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(angle)

  // 笔杆
  ctx.strokeStyle = '#5c4033'
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.moveTo(0, 60)
  ctx.lineTo(0, -60)
  ctx.stroke()

  // 笔尖
  ctx.fillStyle = '#3a3a3a'
  ctx.beginPath()
  ctx.moveTo(0, 60)
  ctx.lineTo(-4, 55)
  ctx.lineTo(4, 55)
  ctx.closePath()
  ctx.fill()

  // 羽毛
  ctx.fillStyle = 'rgba(180, 160, 140, 0.7)'
  ctx.beginPath()
  ctx.moveTo(0, -50)
  ctx.bezierCurveTo(-40, -30, -50, 10, 0, 20)
  ctx.bezierCurveTo(50, 10, 40, -30, 0, -50)
  ctx.fill()

  // 羽翼纹理
  ctx.strokeStyle = 'rgba(140, 120, 100, 0.4)'
  ctx.lineWidth = 1
  for (let i = 0; i < 5; i++) {
    ctx.beginPath()
    ctx.moveTo(0, -40 + i * 12)
    ctx.quadraticCurveTo(-25 + i * 3, -30 + i * 10, -8, -20 + i * 12)
    ctx.stroke()
  }

  ctx.restore()
}

// 枫叶
function drawMapleLeaf(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height, rng } = scene
  const x = rng.range(width * 0.65, width * 0.88)
  const y = rng.range(height * 0.45, height * 0.75)
  const scale = rng.range(0.7, 1.2)
  const rotation = rng.range(-0.4, 0.4)

  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rotation)
  ctx.scale(scale, scale)

  // 树叶主色 - 绿/黄/橙/红系
  const leafColor = rng.pick([
    '#6b8e23', // 橄榄绿
    '#8fbc8f', // 暗绿
    '#cd853f', // 秘鲁色(褐绿)
    '#d2691e', // 巧克力色
    '#daa520', // 金色
    '#b8860b', // 暗金
  ])

  // 简单椭圆形树叶
  ctx.fillStyle = leafColor
  ctx.beginPath()
  ctx.ellipse(0, 0, 22, 40, 0, 0, Math.PI * 2)
  ctx.fill()

  // 叶柄
  ctx.strokeStyle = '#5d4037'
  ctx.lineWidth = 3
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(0, 38)
  ctx.lineTo(2, 55)
  ctx.stroke()

  // 叶脉
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)'
  ctx.lineWidth = 1.5

  // 主叶脉
  ctx.beginPath()
  ctx.moveTo(0, -35)
  ctx.lineTo(0, 35)
  ctx.stroke()

  // 侧叶脉 - 左侧
  ctx.beginPath()
  ctx.moveTo(0, -15)
  ctx.lineTo(-12, -5)
  ctx.moveTo(0, -15)
  ctx.lineTo(12, -5)
  ctx.moveTo(0, 5)
  ctx.lineTo(-14, 15)
  ctx.moveTo(0, 5)
  ctx.lineTo(14, 15)
  ctx.stroke()

  ctx.restore()
}

// 旧信封
function drawOldEnvelope(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height, rng } = scene
  const x = rng.range(width * 0.1, width * 0.35)
  const y = rng.range(height * 0.6, height * 0.8)
  const w = rng.range(120, 180)
  const h = w * 0.7

  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rng.range(-0.15, 0.15))

  // 信封底
  ctx.fillStyle = '#f5e6d0'
  ctx.fillRect(0, 0, w, h)

  // 信封折痕
  ctx.strokeStyle = 'rgba(122, 75, 58, 0.25)'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(w * 0.5, h * 0.45)
  ctx.lineTo(w, 0)
  ctx.stroke()

  // 封口折痕
  ctx.beginPath()
  ctx.moveTo(0, h)
  ctx.lineTo(w * 0.5, h * 0.55)
  ctx.lineTo(w, h)
  ctx.stroke()

  // 蜡封
  ctx.fillStyle = 'rgba(180, 60, 60, 0.8)'
  ctx.beginPath()
  ctx.arc(w * 0.5, h * 0.45, 14, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = 'rgba(140, 40, 40, 0.6)'
  ctx.lineWidth = 2
  ctx.stroke()

  ctx.restore()
}

function drawStampMarks(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height, rng } = scene
  // 分散到不同区域
  const positions = [
    { x: rng.range(width * 0.1, width * 0.35), y: rng.range(height * 0.15, height * 0.45) },
    { x: rng.range(width * 0.6, width * 0.88), y: rng.range(height * 0.4, height * 0.8) },
  ]
  for (let index = 0; index < 2; index += 1) {
    const pos = positions[index]
    const r = rng.range(35, 50)
    ctx.strokeStyle = 'rgba(180, 60, 60, 0.3)'
    ctx.lineWidth = 5
    ctx.beginPath()
    ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(pos.x, pos.y, r * 0.7, 0, Math.PI * 2)
    ctx.stroke()
  }
}

function drawLedgerLines(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height, rng } = scene
  // 随机位置的账本线
  const startX = rng.range(width * 0.5, width * 0.65)
  const lineWidth = rng.range(width * 0.25, width * 0.4)
  const startY = rng.range(height * 0.15, height * 0.25)
  const lineSpacing = rng.range(50, 70)
  const lineCount = rng.int(6, 10)

  ctx.strokeStyle = 'rgba(122, 75, 58, 0.28)'
  ctx.lineWidth = 2
  for (let index = 0; index < lineCount; index += 1) {
    const y = startY + index * lineSpacing
    if (y < height * 0.85) {
      ctx.beginPath()
      ctx.moveTo(startX, y)
      ctx.lineTo(startX + lineWidth, y)
      ctx.stroke()
    }
  }
}

function drawTapePieces(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height, rng } = scene
  // 分散到顶部边缘
  const positions = [
    { x: rng.range(width * 0.1, width * 0.25), y: rng.range(height * 0.02, height * 0.12) },
    { x: rng.range(width * 0.6, width * 0.8), y: rng.range(height * 0.02, height * 0.12) },
  ]
  for (let index = 0; index < 2; index += 1) {
    const pos = positions[index]
    ctx.save()
    ctx.translate(pos.x, pos.y)
    ctx.rotate(rng.range(-0.25, 0.25))
    ctx.fillStyle = 'rgba(244, 224, 176, 0.55)'
    ctx.fillRect(-45, -14, 90, 28)
    ctx.strokeStyle = 'rgba(181, 138, 84, 0.25)'
    ctx.lineWidth = 1.5
    ctx.strokeRect(-45, -14, 90, 28)
    ctx.restore()
  }
}

function drawTornPaperEdges(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height, rng } = scene
  ctx.fillStyle = 'rgba(252, 248, 240, 0.95)'
  for (const anchorY of [height * 0.1, height * 0.84]) {
    ctx.beginPath()
    ctx.moveTo(0, anchorY)
    for (let step = 0; step <= 20; step += 1) {
      const x = (width / 20) * step
      const y = anchorY + rng.range(-14, 14)
      ctx.lineTo(x, y)
    }
    ctx.lineTo(width, anchorY + (anchorY < height * 0.2 ? -55 : 55))
    ctx.lineTo(0, anchorY + (anchorY < height * 0.2 ? -55 : 55))
    ctx.closePath()
    ctx.fill()
  }
}

function drawHandwrittenMarks(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height, rng } = scene
  // 分散到全图
  const positions = [
    { x: rng.range(width * 0.05, width * 0.25), y: rng.range(height * 0.15, height * 0.4) },
    { x: rng.range(width * 0.4, width * 0.65), y: rng.range(height * 0.3, height * 0.6) },
    { x: rng.range(width * 0.7, width * 0.95), y: rng.range(height * 0.5, height * 0.8) },
  ]
  ctx.strokeStyle = 'rgba(180, 60, 60, 0.35)'
  ctx.lineWidth = 3
  for (const pos of positions) {
    ctx.beginPath()
    ctx.ellipse(pos.x, pos.y, rng.range(40, 70), rng.range(15, 28), rng.range(-0.6, 0.6), 0, Math.PI * 2)
    ctx.stroke()
  }
}

function drawTypewriterNotes(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height, rng } = scene
  ctx.font = '500 18px "Courier New", monospace'
  ctx.fillStyle = 'rgba(64, 38, 31, 0.48)'
  const words = ['draft', 'memo', 'story', 'chapter', 'coffee', 'note']
  for (let index = 0; index < rng.int(3, 5); index += 1) {
    ctx.fillText(rng.pick(words), rng.range(width * 0.1, width * 0.82), rng.range(height * 0.16, height * 0.88))
  }
}

function drawCreases(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height } = scene
  ctx.strokeStyle = 'rgba(122, 75, 58, 0.15)'
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.moveTo(width * 0.28, 0)
  ctx.lineTo(width * 0.4, height)
  ctx.moveTo(width * 0.78, 0)
  ctx.lineTo(width * 0.66, height)
  ctx.stroke()
}

// ============================================================
// 文艺风层次化渲染
// ============================================================

function renderArtBase(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height, rng, theme } = scene

  // ===== Layer 0: 背景层 =====
  const paper = ctx.createLinearGradient(0, 0, width, height)
  paper.addColorStop(0, '#f8f3ea')
  paper.addColorStop(0.5, theme.palette[0])
  paper.addColorStop(1, '#e9dfd1')
  ctx.fillStyle = paper
  ctx.fillRect(0, 0, width, height)

  drawPaperWash(ctx, scene)
  drawFilmGrain(ctx, width, height, rng)

  // ===== Layer 1: 中景层 - 固定选3个 =====

  // 撕纸边缘和褶皱 - 固定渲染
  drawTornPaperEdges(ctx, scene)
  drawCreases(ctx, scene)

  // 中景随机池 - 固定选3个
  const midPool = [
    () => drawWindowShadow(ctx, scene),
    () => drawBookPages(ctx, scene),
    () => drawFeatherPen(ctx, scene),
    () => drawMapleLeaf(ctx, scene),
    () => drawLedgerLines(ctx, scene),
    () => drawOldEnvelope(ctx, scene),
  ]
  const midCount = 3 // 固定3个
  const midPicked = new Set<number>()
  while (midPicked.size < midCount) {
    midPicked.add(rng.int(0, midPool.length - 1))
  }
  Array.from(midPicked).forEach((i) => midPool[i]?.())

  // ===== Layer 2: 点缀层 =====

  // 印章 - 随机1-2个（每次drawStampMarks会画2个印章）
  if (rng.next() > 0.5) {
    drawStampMarks(ctx, scene)
  }

  // 点缀随机池 - 固定选1-2个
  const accentPool = [
    () => drawTapePieces(ctx, scene),
    () => drawHandwrittenMarks(ctx, scene),
    () => drawTypewriterNotes(ctx, scene),
  ]
  const accentCount = rng.int(1, 2) // 随机1-2个
  const accentPicked = new Set<number>()
  while (accentPicked.size < accentCount) {
    accentPicked.add(rng.int(0, accentPool.length - 1))
  }
  Array.from(accentPicked).forEach((i) => accentPool[i]?.())

  // ===== 顶层装饰 =====
  const vignette = ctx.createRadialGradient(width * 0.5, height * 0.5, width * 0.18, width * 0.5, height * 0.5, width * 0.65)
  vignette.addColorStop(0, 'rgba(255,255,255,0)')
  vignette.addColorStop(1, 'rgba(114,47,55,0.18)')
  ctx.fillStyle = vignette
  ctx.fillRect(0, 0, width, height)
}

// 静态渲染（用于下载）
export function renderArtStyle(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  renderArtBase(ctx, scene)
}
