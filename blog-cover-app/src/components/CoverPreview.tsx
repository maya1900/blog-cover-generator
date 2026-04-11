import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { exportCanvasAsPng, renderCoverToCanvas, renderCoverToCanvasAnimated } from '../lib/cover/renderCover'
import { THEMES, TITLE_FONT_PRESETS } from '../lib/cover/themes'
import type { CoverOptions, RenderResult } from '../lib/cover/types'

interface CoverPreviewProps {
  options: CoverOptions | null
  renderInfo: RenderResult | null
  onRendered: (result: RenderResult) => void
}

const PREVIEW_SCALE = 0.58

export type ExportFormat = 'jpg' | 'png' | 'webp'

export function CoverPreview({ options, renderInfo, onRendered }: CoverPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationRef = useRef<number | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showAnimation, setShowAnimation] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [exportFormat, setExportFormat] = useState<ExportFormat>('webp')
  const prevOptionsRef = useRef<CoverOptions | null>(null)

  // 动态预览循环（所有风格）
  useEffect(() => {
    if (!options || !canvasRef.current) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
      return
    }

    const animate = () => {
      if (canvasRef.current) {
        renderCoverToCanvasAnimated(canvasRef.current, options)
      }
      animationRef.current = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
    }
  }, [options])

  useEffect(() => {
    if (!options || !canvasRef.current) {
      return
    }

    // 检测是否是新的生成
    const isNewGenerate = prevOptionsRef.current?.title !== options.title ||
                          prevOptionsRef.current?.variant !== options.variant

    if (isNewGenerate) {
      setShowAnimation(false)
      setIsGenerating(true)
    }

    prevOptionsRef.current = options

    const result = renderCoverToCanvas(canvasRef.current, options)

    // 渲染完成后触发动画
    setTimeout(() => {
      setIsGenerating(false)
      setShowAnimation(true)
      onRendered(result)
    }, isNewGenerate ? 100 : 0)
  }, [options, onRendered])

  const handleDownload = async () => {
    if (!options) {
      return
    }

    setIsDownloading(true)

    // 创建新的 canvas 用于下载，避免与预览 canvas 冲突
    const exportCanvas = document.createElement('canvas')
    renderCoverToCanvas(exportCanvas, options)
    const fileName = `${THEMES[options.style].label}-${options.title.slice(0, 12) || 'cover'}`
    await exportCanvasAsPng(exportCanvas, `${fileName}.${exportFormat}`)
    setIsDownloading(false)
  }

  return (
    <section className="panel preview-panel">
      <div className="panel__header preview-panel__header">
        <div>
          <p className="eyebrow">Preview</p>
          <h2>头图预览</h2>
        </div>
        <div className="export-controls">
          <div className="format-selector">
            <button
              type="button"
              className={`format-btn ${exportFormat === 'jpg' ? 'active' : ''}`}
              onClick={() => setExportFormat('jpg')}
            >
              JPG
            </button>
            <button
              type="button"
              className={`format-btn ${exportFormat === 'png' ? 'active' : ''}`}
              onClick={() => setExportFormat('png')}
            >
              PNG
            </button>
            <button
              type="button"
              className={`format-btn ${exportFormat === 'webp' ? 'active' : ''}`}
              data-format="webp"
              onClick={() => setExportFormat('webp')}
            >
              WebP
            </button>
          </div>
          <button
            type="button"
            className={`secondary-button ${isDownloading ? 'is-loading' : ''}`}
            onClick={handleDownload}
            disabled={!options || isDownloading}
          >
            <span className="button-text">{isDownloading ? '生成中...' : `下载 ${exportFormat.toUpperCase()}`}</span>
            <span className="button-loader" />
          </button>
        </div>
      </div>

      {renderInfo ? (
        <div className="preview-meta">
          <span>风格：{THEMES[options?.style ?? 'tech'].label}</span>
          <span>字体：{TITLE_FONT_PRESETS[options?.titleFont ?? 'yahei'].label}</span>
          <span>字号：{Math.round((options?.titleScale ?? 1) * 100)}%</span>
          <span>版本：第 {renderInfo.variant || 1} 版</span>
          <span>尺寸：{renderInfo.width} × {renderInfo.height}</span>
        </div>
      ) : null}

      <div className="canvas-shell canvas-shell--preview" style={{ '--preview-scale': PREVIEW_SCALE } as CSSProperties}>
        {/* 装饰光效 */}
        <div className="canvas-glow canvas-glow--left" />
        <div className="canvas-glow canvas-glow--right" />
        <div className="canvas-glow canvas-glow--bottom" />

        {/* 加载骨架屏 */}
        {isGenerating && !renderInfo && (
          <div className="canvas-skeleton">
            <div className="skeleton-shimmer" />
            <div className="skeleton-grid">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="skeleton-cell" style={{ animationDelay: `${i * 0.05}s` }} />
              ))}
            </div>
            <div className="skeleton-bars">
              <div className="skeleton-bar" style={{ width: '65%', animationDelay: '0.2s' }} />
              <div className="skeleton-bar skeleton-bar--short" style={{ width: '45%', animationDelay: '0.35s' }} />
            </div>
          </div>
        )}

        {/* 空状态 */}
        {!options && !isGenerating && <div className="canvas-empty">输入标题并点击生成头图</div>}

        {/* Canvas 画布 */}
        <canvas
          ref={canvasRef}
          className={`canvas-result ${options ? 'is-visible' : ''} ${showAnimation ? 'animate-in' : ''}`}
        />

        {/* 生成动画遮罩 */}
        {isGenerating && renderInfo && (
          <div className="canvas-generating-overlay">
            <div className="generating-spinner">
              <div className="spinner-ring" />
              <div className="spinner-ring" />
              <div className="spinner-ring" />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
