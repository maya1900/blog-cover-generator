import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { createCompressedCanvasImageBlob, exportCanvasAsImage, renderCoverToCanvas } from '../lib/cover/renderCover'
import { THEMES, TITLE_FONT_PRESETS } from '../lib/cover/themes'
import type { CoverOptions, RenderResult } from '../lib/cover/types'

interface CoverPreviewProps {
  options: CoverOptions | null
  renderInfo: RenderResult | null
  onRendered: (result: RenderResult) => void
}

const PREVIEW_SCALE = 0.58
const COPY_IMAGE_MAX_BYTES = 150 * 1024

export type ExportFormat = 'jpg' | 'png' | 'webp'

export function CoverPreview({ options, renderInfo, onRendered }: CoverPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copying' | 'copied' | 'error'>('idle')
  const [copyMessage, setCopyMessage] = useState('')
  const [exportFormat, setExportFormat] = useState<ExportFormat>('png')
  const prevOptionsRef = useRef<CoverOptions | null>(null)
  const renderTimeoutRef = useRef<number | null>(null)
  const copyResetTimeoutRef = useRef<number | null>(null)
  const canCopyImage = typeof navigator !== 'undefined' && Boolean(navigator.clipboard?.write) && typeof window !== 'undefined' && 'ClipboardItem' in window

  const resetCopyStatusLater = () => {
    if (copyResetTimeoutRef.current) {
      window.clearTimeout(copyResetTimeoutRef.current)
    }
    copyResetTimeoutRef.current = window.setTimeout(() => {
      setCopyStatus('idle')
      setCopyMessage('')
      copyResetTimeoutRef.current = null
    }, 1800)
  }

  useEffect(() => {
    return () => {
      if (renderTimeoutRef.current) {
        window.clearTimeout(renderTimeoutRef.current)
        renderTimeoutRef.current = null
      }
      if (copyResetTimeoutRef.current) {
        window.clearTimeout(copyResetTimeoutRef.current)
        copyResetTimeoutRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    setCopyStatus('idle')
    setCopyMessage('')
    if (copyResetTimeoutRef.current) {
      window.clearTimeout(copyResetTimeoutRef.current)
      copyResetTimeoutRef.current = null
    }
  }, [options])

  useEffect(() => {
    if (!options || !canvasRef.current) {
      return
    }

    // 检测是否是新的生成
    const isNewGenerate = prevOptionsRef.current?.title !== options.title ||
                          prevOptionsRef.current?.variant !== options.variant

    if (renderTimeoutRef.current) {
      window.clearTimeout(renderTimeoutRef.current)
      renderTimeoutRef.current = null
    }

    prevOptionsRef.current = options

    const result = renderCoverToCanvas(canvasRef.current, options)

    if (isNewGenerate) {
      setIsGenerating(true)
    }

    renderTimeoutRef.current = window.setTimeout(() => {
      setIsGenerating(false)
      onRendered(result)
      renderTimeoutRef.current = null
    }, isNewGenerate ? 100 : 0)

    return () => {
      if (renderTimeoutRef.current) {
        window.clearTimeout(renderTimeoutRef.current)
        renderTimeoutRef.current = null
      }
    }
  }, [options, onRendered])

  const handleDownload = async () => {
    if (!options) {
      return
    }

    setIsDownloading(true)

    const fileName = `${THEMES[options.style].label}-${options.title.slice(0, 12) || 'untitled-cover'}`

    try {
      const exportCanvas = document.createElement('canvas')
      renderCoverToCanvas(exportCanvas, options)
      await exportCanvasAsImage(exportCanvas, `${fileName}.${exportFormat}`)
    } finally {
      setIsDownloading(false)
    }
  }

  const handleCopyPreview = async () => {
    if (!canvasRef.current || !options || !canCopyImage) {
      return
    }

    try {
      setCopyStatus('copying')
      setCopyMessage('正在压缩并复制 PNG 图片...')
      const exportCanvas = document.createElement('canvas')
      renderCoverToCanvas(exportCanvas, options)
      const blob = await createCompressedCanvasImageBlob(exportCanvas, {
        maxBytes: COPY_IMAGE_MAX_BYTES,
        format: 'image/png',
      })
      if (!blob) {
        throw new Error('preview export blob unavailable')
      }

      await navigator.clipboard.write([
        new window.ClipboardItem({
          [blob.type]: blob,
        }),
      ])

      setCopyStatus('copied')
      setCopyMessage(`已复制 PNG，约 ${Math.max(1, Math.round(blob.size / 1024))} KB`)
    } catch (error) {
      setCopyStatus('error')
      const message = error instanceof Error ? error.message.toLowerCase() : ''
      if (!canCopyImage || message.includes('clipboard') || message.includes('notallowed')) {
        setCopyMessage('当前浏览器不支持复制图片，请改用下载')
      } else {
        setCopyMessage('复制失败，请重试；不行就先下载')
      }
    } finally {
      resetCopyStatusLater()
    }
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
            className={`secondary-button copy-button copy-button--${copyStatus}`}
            onClick={handleCopyPreview}
            disabled={!options || isGenerating || copyStatus === 'copying' || !canCopyImage}
          >
            {copyStatus === 'copying' ? '复制中...' : copyStatus === 'copied' ? '已复制' : copyStatus === 'error' ? '复制失败' : '复制图片'}
          </button>
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
        <p className={`copy-feedback copy-feedback--${copyStatus}`} aria-live="polite">
          {copyStatus === 'idle'
            ? canCopyImage
              ? '复制时会自动压缩，尽量控制在 150KB 内'
              : '当前浏览器不支持直接复制图片，请使用下载'
            : copyMessage}
        </p>
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
        {!options && !isGenerating && <div className="canvas-empty">可直接生成头图，也可以输入标题后再生成</div>}

        {/* Canvas 画布 */}
        <canvas
          ref={canvasRef}
          className={`canvas-result ${options ? 'is-visible' : ''}`}
        />

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
