import type { CoverScene } from '../types'

// ============================================================
// 层次化设计：背景层 (Layer 0) - 大面积、朦胧感
// ============================================================

function drawGrid(ctx: CanvasRenderingContext2D, width: number, height: number, scene: CoverScene) {
  const { rng } = scene
  const spacing = rng.int(48, 64) // 网格间距随机
  const alpha = rng.range(0.06, 0.14) // 透明度随机

  ctx.strokeStyle = `rgba(103, 232, 249, ${alpha})`
  ctx.lineWidth = rng.range(0.8, 1.2)

  for (let x = 0; x <= width; x += spacing) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
    ctx.stroke()
  }

  for (let y = 0; y <= height; y += spacing) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
    ctx.stroke()
  }
}

function drawStaticScanLines(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height, rng } = scene
  const spacing = rng.int(8, 14)
  const stripeHeight = rng.int(2, 5)
  const alpha = rng.range(0.02, 0.05)

  for (let y = 0; y < height; y += spacing) {
    ctx.fillStyle = `rgba(15, 23, 42, ${alpha})`
    ctx.fillRect(0, y, width, stripeHeight)
  }
}

function drawBackgroundGlow(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height, rng } = scene
  // 随机位置的大光晕
  const glowCount = rng.int(2, 4)
  for (let i = 0; i < glowCount; i++) {
    const x = rng.range(0, width)
    const y = rng.range(0, height)
    const radius = rng.range(width * 0.15, width * 0.3)
    const glow = ctx.createRadialGradient(x, y, 0, x, y, radius)
    glow.addColorStop(0, i % 2 === 0 ? 'rgba(103, 232, 249, 0.12)' : 'rgba(139, 92, 246, 0.1)')
    glow.addColorStop(1, 'rgba(15, 23, 42, 0)')
    ctx.fillStyle = glow
    ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2)
  }
}

// ============================================================
// 层次化设计：中景层 (Layer 1) - 主体元素
// ============================================================

function drawBeams(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height, rng } = scene
  const count = rng.int(4, 8)
  for (let i = 0; i < count; i += 1) {
    const angle = rng.range(-0.3, 0.3) // 斜角范围随机
    const beamX = rng.range(-width * 0.2, width * 0.8)
    const endX = beamX + Math.cos(angle) * width * 1.4
    const endY = Math.sin(angle) * height + height

    const gradient = ctx.createLinearGradient(beamX, 0, endX, endY)
    gradient.addColorStop(0, 'rgba(14, 165, 233, 0)')
    gradient.addColorStop(0.5, `rgba(103, 232, 249, ${rng.range(0.1, 0.2)})`)
    gradient.addColorStop(1, 'rgba(139, 92, 246, 0)')
    ctx.strokeStyle = gradient
    ctx.lineWidth = rng.range(2, 8)
    ctx.beginPath()
    ctx.moveTo(beamX, 0)
    ctx.lineTo(endX, endY)
    ctx.stroke()
  }
}

function drawGeoPanels(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height, rng } = scene
  const count = rng.int(6, 12)
  for (let i = 0; i < count; i += 1) {
    const x = rng.range(0, width)
    const y = rng.range(0, height)
    const w = rng.range(40, 200)
    const h = rng.range(15, 100)
    const alpha = rng.range(0.04, 0.1)
    ctx.fillStyle = i % 2 === 0 ? `rgba(14, 165, 233, ${alpha})` : `rgba(139, 92, 246, ${alpha})`
    ctx.fillRect(x, y, w, h)
  }
}

function drawCircuitLines(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height, rng } = scene
  const count = rng.int(5, 9)
  for (let i = 0; i < count; i += 1) {
    const startX = rng.range(width * 0.02, width * 0.85)
    const startY = rng.range(height * 0.05, height * 0.85)
    const segments = rng.int(2, 4)
    let currentX = startX
    let currentY = startY

    ctx.strokeStyle = `rgba(103, 232, 249, ${rng.range(0.15, 0.28)})`
    ctx.lineWidth = rng.range(1.5, 2.5)
    ctx.beginPath()
    ctx.moveTo(currentX, currentY)

    for (let s = 0; s < segments; s += 1) {
      const isHorizontal = rng.int(0, 1) === 0
      const length = rng.range(60, 200)
      if (isHorizontal) {
        currentX += length
      } else {
        currentY += rng.range(-120, 120)
        currentX += length * rng.range(0.6, 1.2)
      }
      ctx.lineTo(currentX, currentY)
    }
    ctx.stroke()

    // 节点
    const nodeCount = rng.int(2, 5)
    for (let n = 0; n < nodeCount; n += 1) {
      ctx.fillStyle = `rgba(125, 211, 252, ${rng.range(0.6, 0.95)})`
      ctx.beginPath()
      ctx.arc(rng.range(startX, currentX), rng.range(startY, currentY), rng.range(2, 4), 0, Math.PI * 2)
      ctx.fill()
    }
  }
}

function drawSignalWaves(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height, rng } = scene
  const count = rng.int(2, 5)
  const baseY = rng.range(height * 0.15, height * 0.5)

  for (let i = 0; i < count; i += 1) {
    const y = baseY + i * rng.range(30, 50)
    ctx.strokeStyle = `rgba(103, 232, 249, ${rng.range(0.15, 0.3)})`
    ctx.lineWidth = rng.range(1.5, 3)
    ctx.beginPath()
    for (let step = 0; step <= 30; step += 1) {
      const x = width * 0.1 + (width * 0.8 * step) / 30
      const waveY = y + Math.sin(step * rng.range(0.5, 0.9)) * rng.range(15, 35)
      if (step === 0) ctx.moveTo(x, waveY)
      else ctx.lineTo(x, waveY)
    }
    ctx.stroke()
  }
}

// ============================================================
// 层次化设计：点缀层 (Layer 2) - 小型精细元素
// ============================================================

function drawParticles(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height, rng } = scene
  const count = rng.int(80, 150)
  const particles = Array.from({ length: count }, () => ({
    x: rng.range(0, width),
    y: rng.range(0, height),
    r: rng.range(1, 3.5),
    alpha: rng.range(0.5, 1),
  }))

  particles.forEach((p, i) => {
    ctx.fillStyle = i % 3 === 0 ? `rgba(103, 232, 249, ${p.alpha})` : i % 3 === 1 ? `rgba(14, 165, 233, ${p.alpha * 0.9})` : `rgba(139, 92, 246, ${p.alpha * 0.85})`
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
    ctx.fill()
  })

  // 连接线
  const connectDistance = rng.range(80, 130)
  for (let i = 0; i < particles.length; i += 1) {
    for (let j = i + 1; j < Math.min(i + 6, particles.length); j += 1) {
      const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y)
      if (dist < connectDistance) {
        ctx.strokeStyle = `rgba(103, 232, 249, ${0.06 * (1 - dist / connectDistance)})`
        ctx.lineWidth = 0.8
        ctx.beginPath()
        ctx.moveTo(particles[i].x, particles[i].y)
        ctx.lineTo(particles[j].x, particles[j].y)
        ctx.stroke()
      }
    }
  }
}

function drawDataTags(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height, rng } = scene
  const labels = ['0101', 'AI', 'DATA', 'NODE', 'SYNC', 'GRID', 'FLOW', 'SYS', 'ML', 'API', 'DEV', 'LOG']
  const count = rng.int(10, 20)
  const fontSize = rng.int(16, 26)

  ctx.font = `600 ${fontSize}px "JetBrains Mono", monospace`

  for (let i = 0; i < count; i += 1) {
    const x = rng.range(width * 0.03, width * 0.95)
    const y = rng.range(height * 0.06, height * 0.94)
    ctx.fillStyle = `rgba(125, 211, 252, ${rng.range(0.2, 0.55)})`
    ctx.fillText(rng.pick(labels), x, y)
  }
}

function drawChipPanels(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height, rng } = scene
  const count = rng.int(2, 5)
  for (let i = 0; i < count; i += 1) {
    const x = rng.range(width * 0.05, width * 0.65)
    const y = rng.range(height * 0.08, height * 0.7)
    const size = rng.range(80, 160)
    const depth = rng.range(15, 45)

    ctx.fillStyle = `rgba(15, 23, 42, ${rng.range(0.2, 0.35)})`
    ctx.strokeStyle = `rgba(103, 232, 249, ${rng.range(0.3, 0.5)})`
    ctx.lineWidth = rng.range(1.5, 2.5)
    ctx.beginPath()
    ctx.rect(x, y, size, size)
    ctx.fill()
    ctx.stroke()

    // 3D 效果
    ctx.fillStyle = `rgba(14, 165, 233, ${rng.range(0.05, 0.12)})`
    ctx.beginPath()
    ctx.moveTo(x + size, y)
    ctx.lineTo(x + size + depth, y - depth)
    ctx.lineTo(x + size + depth, y + size - depth)
    ctx.lineTo(x + size, y + size)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    // 引脚
    const pinCount = rng.int(6, 10)
    for (let pin = 0; pin < pinCount; pin += 1) {
      const pinY = y + 12 + pin * ((size - 24) / (pinCount - 1))
      ctx.strokeStyle = `rgba(103, 232, 249, ${rng.range(0.7, 0.95)})`
      ctx.beginPath()
      ctx.moveTo(x - 12, pinY)
      ctx.lineTo(x, pinY)
      ctx.moveTo(x + size, pinY)
      ctx.lineTo(x + size + 12, pinY)
      ctx.stroke()
    }
  }
}

function drawHudPanels(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height, rng } = scene
  const count = rng.int(2, 4)
  for (let i = 0; i < count; i += 1) {
    const panelWidth = rng.range(width * 0.12, width * 0.22)
    const panelHeight = rng.range(height * 0.1, height * 0.18)
    const x = i % 2 === 0 ? rng.range(width * 0.02, width * 0.2) : rng.range(width * 0.78, width * 0.9)
    const y = rng.range(height * 0.05, height * 0.65)

    ctx.fillStyle = `rgba(8, 15, 32, ${rng.range(0.2, 0.35)})`
    ctx.strokeStyle = `rgba(103, 232, 249, ${rng.range(0.3, 0.5)})`
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.rect(x, y, panelWidth, panelHeight)
    ctx.fill()
    ctx.stroke()

    // 内部横线
    const lineCount = rng.int(2, 5)
    for (let row = 0; row < lineCount; row += 1) {
      const lineY = y + 20 + row * 18
      ctx.strokeStyle = `rgba(148, 226, 255, ${rng.range(0.15, 0.28)})`
      ctx.beginPath()
      ctx.moveTo(x + 12, lineY)
      ctx.lineTo(x + panelWidth - 12, lineY)
      ctx.stroke()
    }
  }
}

function drawDataBands(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height, rng } = scene
  const count = rng.int(3, 7)
  for (let i = 0; i < count; i += 1) {
    const y = height * rng.range(0.55, 0.85) + i * 25
    const bandWidth = rng.range(width * 0.15, width * 0.45)
    const x = rng.range(width * 0.03, width * 0.7)
    const gradient = ctx.createLinearGradient(x, y, x + bandWidth, y)
    gradient.addColorStop(0, 'rgba(14, 165, 233, 0)')
    gradient.addColorStop(0.5, `rgba(103, 232, 249, ${rng.range(0.15, 0.3)})`)
    gradient.addColorStop(1, 'rgba(139, 92, 246, 0)')
    ctx.fillStyle = gradient
    ctx.fillRect(x, y, bandWidth, rng.range(6, 14))
  }
}

// ============================================================
// 层次化设计：动态层 (Layer 3) - 带动画效果
// ============================================================

function drawFlowingLines(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height } = scene
  const time = Date.now() * 0.0003

  for (let i = 0; i < 8; i += 1) {
    const progress = ((time + i * 0.125) % 1)
    const startX = -width * 0.3 + progress * width * 1.6
    const startY = -height * 0.1 + (i % 3) * height * 0.35

    const gradient = ctx.createLinearGradient(startX, startY, startX + width * 0.4, startY + height * 0.8)
    gradient.addColorStop(0, 'rgba(14, 165, 233, 0)')
    gradient.addColorStop(0.4 + Math.sin(progress * Math.PI) * 0.2, `rgba(103, 232, 249, ${0.25 + Math.sin(progress * Math.PI) * 0.15})`)
    gradient.addColorStop(0.6 + Math.cos(progress * Math.PI) * 0.2, 'rgba(139, 92, 246, 0.2)')
    gradient.addColorStop(1, 'rgba(14, 165, 233, 0)')

    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.lineTo(startX + width * 0.15, startY)
    ctx.lineTo(startX + width * 0.35, startY + height * 0.8)
    ctx.lineTo(startX + width * 0.2, startY + height * 0.8)
    ctx.closePath()
    ctx.fill()
  }
}

function drawBreathingParticles(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height } = scene
  const time = Date.now() * 0.001
  const count = 80

  for (let i = 0; i < count; i += 1) {
    const baseX = (i * 137.5) % width
    const baseY = (i * 97.3 + Math.sin(i) * 50) % height
    const size = 1.5 + (i % 3) * 0.8

    const breathPhase = (time * 0.8 + i * 0.3) % (Math.PI * 2)
    const alpha = 0.3 + Math.sin(breathPhase) * 0.25
    const floatY = Math.sin(breathPhase * 0.7 + i) * 3

    const colorIndex = i % 3
    ctx.fillStyle = colorIndex === 0 ? `rgba(103, 232, 249, ${alpha})` : colorIndex === 1 ? `rgba(14, 165, 233, ${alpha * 0.9})` : `rgba(139, 92, 246, ${alpha * 0.85})`

    ctx.beginPath()
    ctx.arc(baseX, baseY + floatY, size, 0, Math.PI * 2)
    ctx.fill()

    // 连接线
    for (let j = i + 1; j < Math.min(i + 4, count); j += 1) {
      const otherX = (j * 137.5) % width
      const otherY = (j * 97.3 + Math.sin(j) * 50) % height
      const dist = Math.hypot(baseX - otherX, baseY + floatY - otherY)
      if (dist < 80) {
        ctx.strokeStyle = `rgba(103, 232, 249, ${0.06 * (1 - dist / 80) * (0.5 + Math.sin(breathPhase) * 0.5)})`
        ctx.lineWidth = 0.8
        ctx.beginPath()
        ctx.moveTo(baseX, baseY + floatY)
        ctx.lineTo(otherX, otherY)
        ctx.stroke()
      }
    }
  }
}

function drawAnimatedScanLines(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height } = scene
  const time = Date.now() * 0.002
  const scanY = (time % (height * 1.2)) - height * 0.1

  const scanGradient = ctx.createLinearGradient(0, scanY - 50, 0, scanY + 50)
  scanGradient.addColorStop(0, 'rgba(103, 232, 249, 0)')
  scanGradient.addColorStop(0.5, 'rgba(103, 232, 249, 0.08)')
  scanGradient.addColorStop(1, 'rgba(103, 232, 249, 0)')
  ctx.fillStyle = scanGradient
  ctx.fillRect(0, scanY - 50, width, 100)
}

function drawMatrixRain(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height, rng } = scene
  const columns = Math.floor(width / 18)
  const chars = '01アイウエオカキクケコ'
  const time = Date.now() * 0.001

  for (let col = 0; col < columns; col += 1) {
    const x = col * 18 + 8
    const speed = rng.range(0.5, 1.5)
    const offset = (time * speed * 60 + col * 47) % (height + 200)
    const y = -100 + offset

    if (y < -20 || y > height) continue

    ctx.fillStyle = 'rgba(103, 232, 249, 0.7)'
    ctx.font = '14px monospace'
    ctx.fillText(chars[col % chars.length], x, y)

    for (let tail = 1; tail < 8; tail += 1) {
      const tailY = y - tail * 20
      if (tailY < 0) break
      ctx.fillStyle = `rgba(14, 165, 233, ${0.3 - tail * 0.035})`
      ctx.fillText(chars[(col + tail) % chars.length], x, tailY)
    }
  }
}

function drawHexGrid(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height, rng } = scene
  const time = Date.now() * 0.001
  const size = rng.int(24, 38)
  const rowHeight = size * 1.75
  const offsetX = rng.range(width * 0.45, width * 0.65)

  for (let row = 0; row < 7; row += 1) {
    for (let col = 0; col < 14; col += 1) {
      const x = offsetX + col * (size * 1.8) + (row % 2 === 0 ? 0 : size * 0.9)
      const y = height * 0.08 + row * rowHeight

      if (x > width * 0.98 || y > height * 0.68) continue

      const pulse = Math.sin(time * 1.5 + col * 0.3 + row * 0.5) * 0.5 + 0.5
      ctx.strokeStyle = `rgba(125, 211, 252, ${0.05 + pulse * 0.1})`
      ctx.lineWidth = 1

      ctx.beginPath()
      for (let side = 0; side < 6; side += 1) {
        const angle = (Math.PI / 3) * side + Math.PI / 6
        const px = x + Math.cos(angle) * size
        const py = y + Math.sin(angle) * size
        if (side === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.closePath()
      ctx.stroke()
    }
  }
}

function drawCornerFrames(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height, rng } = scene
  const time = Date.now() * 0.001
  const frameSize = rng.int(25, 40)
  const offset = rng.int(30, 50)

  const corners = [
    { x: offset, y: offset, dx: 1, dy: 1 },
    { x: width - offset, y: offset, dx: -1, dy: 1 },
    { x: offset, y: height - offset, dx: 1, dy: -1 },
    { x: width - offset, y: height - offset, dx: -1, dy: -1 },
  ]

  corners.forEach((c, i) => {
    const pulse = 0.5 + Math.sin(time * 2 + i) * 0.3
    ctx.strokeStyle = `rgba(103, 232, 249, ${0.35 + pulse * 0.35})`
    ctx.lineWidth = rng.range(1.5, 2.5)

    ctx.beginPath()
    ctx.moveTo(c.x + c.dx * frameSize, c.y)
    ctx.lineTo(c.x, c.y)
    ctx.lineTo(c.x, c.y + c.dy * frameSize)
    ctx.stroke()
  })
}

// ============================================================
// 主渲染入口
// ============================================================

function renderTechBase(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, theme } = scene

  const background = ctx.createLinearGradient(0, 0, width, scene.height)
  background.addColorStop(0, theme.palette[0])
  background.addColorStop(0.4, theme.palette[1])
  background.addColorStop(0.75, theme.palette[2])
  background.addColorStop(1, theme.palette[3])
  ctx.fillStyle = background
  ctx.fillRect(0, 0, scene.width, scene.height)

  // ===== Layer 0: 背景层 =====
  drawBackgroundGlow(ctx, scene)
  drawGrid(ctx, scene.width, scene.height, scene)
  drawStaticScanLines(ctx, scene)

  // ===== Layer 1: 中景层 =====
  drawBeams(ctx, scene)
  drawGeoPanels(ctx, scene)
  drawCircuitLines(ctx, scene)
  drawSignalWaves(ctx, scene)

  // ===== Layer 2: 点缀层 =====
  drawParticles(ctx, scene)
  drawDataTags(ctx, scene)
  drawChipPanels(ctx, scene)
  drawHudPanels(ctx, scene)
  drawDataBands(ctx, scene)

  // 角落装饰框
  drawCornerFrames(ctx, scene)
}

// 静态渲染（用于下载）
export function renderTechStyle(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  renderTechBase(ctx, scene)
}

// 动态渲染（用于预览）
export function renderTechStyleAnimated(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { rng } = scene

  renderTechBase(ctx, scene)

  // ===== Layer 3: 动态层（随机选 1-2 个）=====
  const dynamicEffects = [
    drawFlowingLines,
    drawBreathingParticles,
    drawAnimatedScanLines,
    drawMatrixRain,
    drawHexGrid,
  ]

  const dynamicCount = rng.int(1, 2)
  const pickedDynamics = new Set<number>()
  while (pickedDynamics.size < dynamicCount) {
    pickedDynamics.add(rng.int(0, dynamicEffects.length - 1))
  }

  Array.from(pickedDynamics).forEach((i) => dynamicEffects[i]?.(ctx, scene))
}
