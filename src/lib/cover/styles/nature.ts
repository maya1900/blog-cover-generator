import type { CoverScene } from '../types'

function drawMountains(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height, rng } = scene
  const mountainLayers = [
    { color: 'rgba(148, 163, 184, 0.28)', base: 0.56, amp: 0.08 },
    { color: 'rgba(34, 197, 94, 0.22)', base: 0.66, amp: 0.07 },
    { color: 'rgba(21, 128, 61, 0.85)', base: 0.76, amp: 0.08 },
  ]

  mountainLayers.forEach((layer, layerIndex) => {
    ctx.fillStyle = layer.color
    ctx.beginPath()
    ctx.moveTo(0, height)
    ctx.lineTo(0, height * layer.base)

    for (let step = 0; step <= 12; step += 1) {
      const x = (width / 12) * step
      const y = height * layer.base - Math.sin(step * 0.8 + layerIndex) * height * layer.amp - rng.range(0, height * 0.03)
      ctx.lineTo(x, y)
    }

    ctx.lineTo(width, height)
    ctx.closePath()
    ctx.fill()
  })
}

function drawLeaves(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height, rng } = scene
  for (let leaf = 0; leaf < 18; leaf += 1) {
    const x = rng.range(width * 0.06, width * 0.94)
    const y = rng.range(height * 0.1, height * 0.92)
    const size = rng.range(16, 40)
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(rng.range(-0.8, 0.8))
    ctx.fillStyle = leaf % 2 === 0 ? 'rgba(101, 163, 13, 0.18)' : 'rgba(21, 128, 61, 0.16)'
    ctx.beginPath()
    ctx.ellipse(0, 0, size, size * 0.42, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
}

function drawWaterWaves(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height, rng } = scene
  // 随机位置的水波
  const waveX = rng.range(width * 0.4, width * 0.6)
  const waveY = rng.range(height * 0.7, height * 0.86)
  const waveWidth = rng.range(width * 0.38, width * 0.54)
  const waveHeight = rng.range(height * 0.06, height * 0.1)
  
  ctx.fillStyle = 'rgba(125, 211, 252, 0.24)'
  ctx.beginPath()
  ctx.ellipse(waveX, waveY, waveWidth, waveHeight, 0, 0, Math.PI * 2)
  ctx.fill()

  for (let wave = 0; wave < 4; wave += 1) {
    ctx.strokeStyle = `rgba(255,255,255,${0.2 - wave * 0.03})`
    ctx.lineWidth = 2
    ctx.beginPath()
    for (let step = 0; step <= 24; step += 1) {
      const x = waveX - waveWidth + (waveWidth * 2 / 24) * step
      const y = waveY + waveHeight + wave * 12 + Math.sin(step * 0.85 + wave) * 8
      if (step === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
  }
}

function drawClouds(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height, rng } = scene
  for (let index = 0; index < 4; index += 1) {
    const x = rng.range(width * 0.08, width * 0.82)
    const y = rng.range(height * 0.08, height * 0.24)
    const size = rng.range(70, 130)
    ctx.fillStyle = 'rgba(255,255,255,0.3)'
    for (let puff = 0; puff < 4; puff += 1) {
      ctx.beginPath()
      ctx.arc(x + puff * (size * 0.28), y + rng.range(-8, 8), size * rng.range(0.22, 0.32), 0, Math.PI * 2)
      ctx.fill()
    }
  }
}

function drawFlowers(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height, rng } = scene
  const colors = ['rgba(244, 114, 182, 0.55)', 'rgba(251, 191, 36, 0.55)', 'rgba(34, 197, 94, 0.45)']
  for (let index = 0; index < 20; index += 1) {
    const x = rng.range(width * 0.04, width * 0.96)
    const y = rng.range(height * 0.72, height * 0.95)
    const r = rng.range(4, 8)
    ctx.fillStyle = rng.pick(colors)
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }
}

function drawMist(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height, rng } = scene
  // 随机位置的雾气
  const mistY = rng.range(height * 0.38, height * 0.58)
  const mistH = rng.range(height * 0.32, height * 0.46)
  const mist = ctx.createLinearGradient(0, mistY, 0, mistY + mistH)
  mist.addColorStop(0, 'rgba(255,255,255,0)')
  mist.addColorStop(0.5, 'rgba(255,255,255,0.14)')
  mist.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = mist
  ctx.fillRect(0, mistY, width, mistH)
}

function drawSunAndLight(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height, rng } = scene
  // 随机位置的太阳
  const sunX = rng.range(width * 0.1, width * 0.3)
  const sunY = rng.range(height * 0.1, height * 0.3)
  const sunRadius = rng.range(width * 0.1, width * 0.16)
  const sun = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, sunRadius)
  sun.addColorStop(0, 'rgba(255, 248, 200, 0.95)')
  sun.addColorStop(1, 'rgba(255, 248, 200, 0)')
  ctx.fillStyle = sun
  ctx.fillRect(0, 0, width, height)
}

function drawBranchForeground(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height, rng } = scene
  ctx.strokeStyle = 'rgba(72, 54, 34, 0.46)'
  ctx.lineWidth = rng.range(4, 8)
  // 随机从左边或右边伸出
  if (rng.next() > 0.5) {
    ctx.beginPath()
    ctx.moveTo(0, rng.range(height * 0.1, height * 0.25))
    ctx.bezierCurveTo(
      width * rng.range(0.1, 0.2), height * rng.range(0.12, 0.28),
      width * rng.range(0.2, 0.3), height * rng.range(0.2, 0.36),
      width * rng.range(0.25, 0.4), height * rng.range(0.25, 0.42)
    )
    ctx.stroke()
  }
  if (rng.next() > 0.5) {
    ctx.beginPath()
    ctx.moveTo(width, rng.range(height * 0.15, height * 0.3))
    ctx.bezierCurveTo(
      width * rng.range(0.7, 0.85), height * rng.range(0.18, 0.32),
      width * rng.range(0.6, 0.75), height * rng.range(0.25, 0.38),
      width * rng.range(0.55, 0.7), height * rng.range(0.3, 0.45)
    )
    ctx.stroke()
  }
}

function drawBirds(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height, rng } = scene
  ctx.strokeStyle = 'rgba(31, 41, 55, 0.36)'
  ctx.lineWidth = 2.5
  for (let index = 0; index < 6; index += 1) {
    const x = rng.range(width * 0.18, width * 0.82)
    const y = rng.range(height * 0.08, height * 0.28)
    const span = rng.range(12, 24)
    ctx.beginPath()
    ctx.moveTo(x - span, y)
    ctx.quadraticCurveTo(x - span * 0.4, y - span * 0.7, x, y)
    ctx.quadraticCurveTo(x + span * 0.4, y - span * 0.7, x + span, y)
    ctx.stroke()
  }
}

function drawGrassForeground(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height, rng } = scene
  for (let blade = 0; blade < 90; blade += 1) {
    const x = rng.range(0, width)
    const baseY = rng.range(height * 0.84, height * 0.98)
    const tipY = baseY - rng.range(18, 60)
    ctx.strokeStyle = blade % 3 === 0 ? 'rgba(21, 128, 61, 0.4)' : 'rgba(101, 163, 13, 0.32)'
    ctx.lineWidth = rng.range(1.2, 2.8)
    ctx.beginPath()
    ctx.moveTo(x, baseY)
    ctx.quadraticCurveTo(x + rng.range(-12, 12), (baseY + tipY) / 2, x + rng.range(-18, 18), tipY)
    ctx.stroke()
  }
}

function drawLightRays(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height, rng } = scene
  // 随机位置的光线
  const rayCount = rng.int(3, 6)
  for (let index = 0; index < rayCount; index += 1) {
    const startX = rng.range(width * 0.05, width * 0.35)
    const rayWidth = rng.range(width * 0.04, width * 0.08)
    const rayLength = rng.range(height * 0.5, height * 0.8)
    const gradient = ctx.createLinearGradient(startX, 0, startX + rayWidth, rayLength)
    gradient.addColorStop(0, 'rgba(255, 250, 210, 0.18)')
    gradient.addColorStop(1, 'rgba(255, 250, 210, 0)')
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.moveTo(startX, 0)
    ctx.lineTo(startX + rayWidth, 0)
    ctx.lineTo(startX + rayWidth * 3, rayLength)
    ctx.lineTo(startX + rayWidth * 2, rayLength)
    ctx.closePath()
    ctx.fill()
  }
}

function drawNaturalGrain(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height, rng } = scene
  for (let index = 0; index < 1800; index += 1) {
    const alpha = rng.range(0.008, 0.03)
    ctx.fillStyle = `rgba(74, 222, 128, ${alpha})`
    ctx.fillRect(rng.range(0, width), rng.range(0, height), rng.range(0.5, 1.6), rng.range(0.5, 1.6))
  }
}

function drawCloudShadowLayers(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height, rng } = scene
  for (let index = 0; index < 3; index += 1) {
    const x = rng.range(width * 0.04, width * 0.72)
    const y = rng.range(height * 0.1, height * 0.28)
    const shadow = ctx.createRadialGradient(x, y, 0, x, y, width * 0.16)
    shadow.addColorStop(0, 'rgba(100, 116, 139, 0.1)')
    shadow.addColorStop(1, 'rgba(100, 116, 139, 0)')
    ctx.fillStyle = shadow
    ctx.fillRect(x - width * 0.16, y - width * 0.08, width * 0.32, width * 0.16)
  }
}

// ============================================================
// 自然风层次化渲染
// ============================================================

function renderNatureBase(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  const { width, height, rng, theme } = scene

  // ===== Layer 0: 背景层 =====
  const sky = ctx.createLinearGradient(0, 0, 0, height)
  sky.addColorStop(0, '#dff4ff')
  sky.addColorStop(0.48, theme.palette[1])
  sky.addColorStop(1, '#eff6e6')
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, width, height)

  drawCloudShadowLayers(ctx, scene)
  drawNaturalGrain(ctx, scene)

  // ===== Layer 1: 中景层 =====
  const midPool = [
    () => drawSunAndLight(ctx, scene),
    () => drawClouds(ctx, scene),
    () => drawMountains(ctx, scene),
    () => drawMist(ctx, scene),
    () => drawLightRays(ctx, scene),
  ]
  const midCount = rng.int(3, 4)
  const midPicked = new Set<number>()
  while (midPicked.size < midCount) {
    midPicked.add(rng.int(0, midPool.length - 1))
  }
  Array.from(midPicked).forEach((i) => midPool[i]?.())

  // ===== Layer 2: 点缀层 =====
  const accentPool = [
    () => drawWaterWaves(ctx, scene),
    () => drawLeaves(ctx, scene),
    () => drawFlowers(ctx, scene),
    () => drawBirds(ctx, scene),
    () => drawGrassForeground(ctx, scene),
    () => drawBranchForeground(ctx, scene),
  ]
  const accentCount = rng.int(3, 4)
  const accentPicked = new Set<number>()
  while (accentPicked.size < accentCount) {
    accentPicked.add(rng.int(0, accentPool.length - 1))
  }
  Array.from(accentPicked).forEach((i) => accentPool[i]?.())
}

// 静态渲染（用于下载）
export function renderNatureStyle(ctx: CanvasRenderingContext2D, scene: CoverScene) {
  renderNatureBase(ctx, scene)
}
