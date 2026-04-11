import { useEffect, useRef } from 'react'
import { exportCanvasAsPng, renderCoverToCanvas } from '../lib/cover/renderCover'
import { THEMES } from '../lib/cover/themes'
import type { CoverOptions } from '../lib/cover/types'

interface CoverPreviewProps {
  options: CoverOptions | null
  onRendered: (seed: number) => void
}

export function CoverPreview({ options, onRendered }: CoverPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (!options || !canvasRef.current) {
      return
    }

    const { seed } = renderCoverToCanvas(canvasRef.current, options)
    onRendered(seed)
  }, [options, onRendered])

  const handleDownload = () => {
    if (!canvasRef.current || !options) {
      return
    }

    exportCanvasAsPng(canvasRef.current, `${THEMES[options.style].label}-${options.title.slice(0, 12) || 'cover'}.png`)
  }

  return (
    <section className="panel preview-panel">
      <div className="panel__header preview-panel__header">
        <div>
          <p className="eyebrow">Preview</p>
          <h2>头图预览</h2>
        </div>
        <button type="button" className="secondary-button" onClick={handleDownload} disabled={!options}>
          下载 PNG
        </button>
      </div>

      <div className="canvas-shell">
        {options ? null : <div className="canvas-empty">输入标题并点击生成头图</div>}
        <canvas ref={canvasRef} className={options ? 'is-visible' : ''} />
      </div>
    </section>
  )
}
