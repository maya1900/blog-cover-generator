import type { CoverScene } from '../types'

function drawGrid(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.strokeStyle = 'rgba(103, 232, 249, 0.12)'
  ctx.lineWidth = 1

  for (let x = 0; x <= width; x += 56) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
    ctx.stroke()
  }

  for (let y = 0; y <= height; y += 56) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
    ctx.stroke()
  }
}

function drawBeams(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height, rng } = scene
  for (let index = 0; index < 6; index += 1) {
    const beamX = rng.range(-width * 0.15, width * 0.85)
    const beam = ctx.createLinearGradient(beamX, 0, beamX + width * 0.28, height)
    beam.addColorStop(0, 'rgba(14, 165, 233, 0)')
    beam.addColorStop(0.5, 'rgba(103, 232, 249, 0.16)')
    beam.addColorStop(1, 'rgba(139, 92, 246, 0)')
    ctx.strokeStyle = beam
    ctx.lineWidth = rng.range(2, 6)
    ctx.beginPath()
    ctx.moveTo(beamX, 0)
    ctx.lineTo(beamX + width * 0.32, height)
    ctx.stroke()
  }
}

function drawParticles(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height, rng } = scene
  const particles = Array.from({ length: 120 }, () => ({
    x: rng.range(0, width),
    y: rng.range(0, height),
    r: rng.range(1, 3.2),
  }))

  particles.forEach((particle, index) => {
    ctx.fillStyle =
      index % 3 === 0
        ? 'rgba(103, 232, 249, 0.9)'
        : index % 3 === 1
          ? 'rgba(14, 165, 233, 0.8)'
          : 'rgba(139, 92, 246, 0.8)'
    ctx.beginPath()
    ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2)
    ctx.fill()

    for (let offset = index + 1; offset < particles.length; offset += 1) {
      const other = particles[offset]
      const distance = Math.hypot(particle.x - other.x, particle.y - other.y)
      if (distance < 110) {
        ctx.strokeStyle = `rgba(103, 232, 249, ${0.08 * (1 - distance / 110)})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(particle.x, particle.y)
        ctx.lineTo(other.x, other.y)
        ctx.stroke()
      }
    }
  })
}

function drawChipPanels(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height, rng } = scene
  for (let index = 0; index < 4; index += 1) {
    const x = rng.range(width * 0.08, width * 0.7)
    const y = rng.range(height * 0.1, height * 0.68)
    const size = rng.range(110, 180)
    const depth = rng.range(18, 40)

    ctx.fillStyle = 'rgba(15, 23, 42, 0.25)'
    ctx.strokeStyle = 'rgba(103, 232, 249, 0.4)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.rect(x, y, size, size)
    ctx.fill()
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(x + size, y)
    ctx.lineTo(x + size + depth, y - depth)
    ctx.lineTo(x + size + depth, y + size - depth)
    ctx.lineTo(x + size, y + size)
    ctx.closePath()
    ctx.fillStyle = 'rgba(14, 165, 233, 0.08)'
    ctx.fill()
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + depth, y - depth)
    ctx.lineTo(x + size + depth, y - depth)
    ctx.lineTo(x + size, y)
    ctx.closePath()
    ctx.fillStyle = 'rgba(139, 92, 246, 0.08)'
    ctx.fill()
    ctx.stroke()

    for (let pin = 0; pin < 8; pin += 1) {
      const pinY = y + 16 + pin * ((size - 32) / 7)
      ctx.strokeStyle = 'rgba(103, 232, 249, 0.85)'
      ctx.beginPath()
      ctx.moveTo(x - 16, pinY)
      ctx.lineTo(x, pinY)
      ctx.moveTo(x + size, pinY)
      ctx.lineTo(x + size + 16, pinY)
      ctx.stroke()
    }
  }
}

function drawDataTags(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height, rng } = scene
  ctx.font = '600 22px "JetBrains Mono", monospace'
  ctx.fillStyle = 'rgba(125, 211, 252, 0.5)'
  const labels = ['0101', 'AI', 'DATA', 'NODE', 'SYNC', 'GRID', 'FLOW', 'SYS', 'ML']
  for (let index = 0; index < 16; index += 1) {
    ctx.fillText(rng.pick(labels), rng.range(width * 0.05, width * 0.94), rng.range(height * 0.08, height * 0.92))
  }
}

function drawCircuitLines(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height, rng } = scene
  for (let index = 0; index < 7; index += 1) {
    const startX = rng.range(width * 0.04, width * 0.8)
    const startY = rng.range(height * 0.08, height * 0.84)
    const midX = startX + rng.range(80, 220)
    const midY = startY + rng.range(-100, 100)
    const endX = midX + rng.range(80, 180)
    const endY = midY + rng.range(-80, 120)

    ctx.strokeStyle = 'rgba(103, 232, 249, 0.24)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.lineTo(midX, startY)
    ctx.lineTo(midX, midY)
    ctx.lineTo(endX, midY)
    ctx.lineTo(endX, endY)
    ctx.stroke()

    ;[
      [startX, startY],
      [midX, startY],
      [midX, midY],
      [endX, midY],
      [endX, endY],
    ].forEach(([x, y]) => {
      ctx.fillStyle = 'rgba(125, 211, 252, 0.9)'
      ctx.beginPath()
      ctx.arc(x, y, 3.2, 0, Math.PI * 2)
      ctx.fill()
    })
  }
}

function drawScanLines(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height } = scene
  for (let y = 0; y < height; y += 8) {
    ctx.fillStyle = 'rgba(15, 23, 42, 0.04)'
    ctx.fillRect(0, y, width, 3)
  }
}

function drawGeoPanels(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height, rng } = scene
  for (let index = 0; index < 8; index += 1) {
    const x = rng.range(0, width)
    const y = rng.range(0, height)
    const w = rng.range(60, 180)
    const h = rng.range(20, 90)
    ctx.fillStyle = index % 2 === 0 ? 'rgba(14, 165, 233, 0.08)' : 'rgba(139, 92, 246, 0.08)'
    ctx.fillRect(x, y, w, h)
  }
}

function drawHudPanels(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height, rng } = scene
  for (let index = 0; index < 3; index += 1) {
    const panelWidth = rng.range(width * 0.16, width * 0.24)
    const panelHeight = rng.range(height * 0.12, height * 0.18)
    const x = index % 2 === 0 ? rng.range(width * 0.04, width * 0.22) : rng.range(width * 0.74, width * 0.82)
    const y = rng.range(height * 0.08, height * 0.68)

    ctx.fillStyle = 'rgba(8, 15, 32, 0.26)'
    ctx.strokeStyle = 'rgba(103, 232, 249, 0.42)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.rect(x, y, panelWidth, panelHeight)
    ctx.fill()
    ctx.stroke()

    ctx.strokeStyle = 'rgba(125, 211, 252, 0.8)'
    ctx.beginPath()
    ctx.moveTo(x + 16, y + 18)
    ctx.lineTo(x + 52, y + 18)
    ctx.moveTo(x + panelWidth - 16, y + panelHeight - 18)
    ctx.lineTo(x + panelWidth - 52, y + panelHeight - 18)
    ctx.stroke()

    for (let row = 0; row < 4; row += 1) {
      const lineY = y + 30 + row * 22
      ctx.strokeStyle = `rgba(148, 226, 255, ${0.24 - row * 0.03})`
      ctx.beginPath()
      ctx.moveTo(x + 20, lineY)
      ctx.lineTo(x + panelWidth - 20, lineY)
      ctx.stroke()
    }
  }
}

function drawHexHoneycomb(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height } = scene
  const size = 28
  const rowHeight = size * 1.6
  ctx.strokeStyle = 'rgba(125, 211, 252, 0.1)'
  ctx.lineWidth = 1.2

  for (let row = 0; row < 7; row += 1) {
    for (let col = 0; col < 12; col += 1) {
      const x = width * 0.58 + col * (size * 1.7) + (row % 2 === 0 ? 0 : size * 0.85)
      const y = height * 0.08 + row * rowHeight
      if (x > width * 0.96 || y > height * 0.62) continue
      ctx.beginPath()
      for (let side = 0; side < 6; side += 1) {
        const angle = Math.PI / 3 * side + Math.PI / 6
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

function drawSignalWaves(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height, rng } = scene
  for (let line = 0; line < 3; line += 1) {
    const baseY = height * (0.22 + line * 0.08)
    ctx.strokeStyle = `rgba(103, 232, 249, ${0.22 + line * 0.08})`
    ctx.lineWidth = 2 + line
    ctx.beginPath()
    for (let step = 0; step <= 28; step += 1) {
      const x = width * 0.08 + (width * 0.84 * step) / 28
      const y = baseY + Math.sin(step * 0.72 + rng.range(-0.6, 0.6)) * (12 + line * 7)
      if (step === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
  }
}

function drawNeonGlow(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height, rng } = scene
  for (let index = 0; index < 3; index += 1) {
    const x = index === 1 ? width * 0.5 : rng.range(width * 0.08, width * 0.92)
    const y = index === 1 ? height * 0.5 : rng.range(height * 0.08, height * 0.92)
    const radius = rng.range(width * 0.08, width * 0.18)
    const glow = ctx.createRadialGradient(x, y, 0, x, y, radius)
    glow.addColorStop(0, index % 2 === 0 ? 'rgba(103, 232, 249, 0.22)' : 'rgba(139, 92, 246, 0.2)')
    glow.addColorStop(1, 'rgba(15, 23, 42, 0)')
    ctx.fillStyle = glow
    ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2)
  }
}

function drawDataBands(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height, rng } = scene
  for (let index = 0; index < 5; index += 1) {
    const y = height * 0.62 + index * 32
    const bandWidth = rng.range(width * 0.18, width * 0.42)
    const x = rng.range(width * 0.06, width * 0.76)
    const gradient = ctx.createLinearGradient(x, y, x + bandWidth, y)
    gradient.addColorStop(0, 'rgba(14, 165, 233, 0)')
    gradient.addColorStop(0.5, 'rgba(103, 232, 249, 0.26)')
    gradient.addColorStop(1, 'rgba(139, 92, 246, 0)')
    ctx.fillStyle = gradient
    ctx.fillRect(x, y, bandWidth, 10)
  }
}

export function renderTechStyle(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height, rng, theme } = scene

  const background = ctx.createLinearGradient(0, 0, width, height)
  background.addColorStop(0, theme.palette[0])
  background.addColorStop(0.4, theme.palette[1])
  background.addColorStop(0.75, theme.palette[2])
  background.addColorStop(1, theme.palette[3])
  ctx.fillStyle = background
  ctx.fillRect(0, 0, width, height)

  drawGrid(ctx, width, height)
  drawHexHoneycomb(ctx, scene)
  drawNeonGlow(ctx, scene)

  const pool = [
    () => drawBeams(ctx, scene),
    () => drawParticles(ctx, scene),
    () => drawChipPanels(ctx, scene),
    () => drawDataTags(ctx, scene),
    () => drawCircuitLines(ctx, scene),
    () => drawScanLines(ctx, scene),
    () => drawGeoPanels(ctx, scene),
    () => drawHudPanels(ctx, scene),
    () => drawSignalWaves(ctx, scene),
    () => drawDataBands(ctx, scene),
  ]

  const count = rng.int(5, 7)
  const picked = new Set<number>()
  while (picked.size < count) {
    picked.add(rng.int(0, pool.length - 1))
  }

  Array.from(picked).forEach((index) => pool[index]?.())
}
