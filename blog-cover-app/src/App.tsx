import { useCallback, useMemo, useState } from 'react'
import './index.css'
import { CoverPreview } from './components/CoverPreview'
import { HistoryPanel } from './components/HistoryPanel'
import { TitleForm } from './components/TitleForm'
import { recommendStyle } from './lib/recommendation/recommendStyle'
import { clearHistory, readHistory, saveHistory } from './lib/storage/history'
import type { CoverHistoryItem, CoverOptions, CoverStyle, RenderResult, TitleFontPreset } from './lib/cover/types'

function App() {
  const [title, setTitle] = useState('')
  const [style, setStyle] = useState<CoverStyle>('tech')
  const [titleFont, setTitleFont] = useState<TitleFontPreset>('yahei')
  const [titleScale, setTitleScale] = useState(1)
  const [variant, setVariant] = useState(0)
  const [history, setHistory] = useState<CoverHistoryItem[]>(() => readHistory())
  const [currentOptions, setCurrentOptions] = useState<CoverOptions | null>(null)
  const [renderInfo, setRenderInfo] = useState<RenderResult | null>(null)

  const recommendations = useMemo(() => recommendStyle(title), [title])

  const handleGenerate = () => {
    const normalized = title.trim()
    if (!normalized) return

    const nextVariant = variant + 1
    setVariant(nextVariant)
    setCurrentOptions({
      title: normalized,
      style,
      variant: nextVariant,
      titleFont,
      titleScale,
    })
  }

  const handleRendered = useCallback(
    (result: RenderResult) => {
      if (!currentOptions) return
      setRenderInfo(result)
      setHistory(
        saveHistory({
          title: currentOptions.title,
          style: currentOptions.style,
          seed: result.seed,
          variant: result.variant,
        }),
      )
    },
    [currentOptions],
  )

  const handleReplay = (item: CoverHistoryItem) => {
    setTitle(item.title)
    setStyle(item.style)
    setRenderInfo({
      seed: item.seed,
      width: 1200,
      height: 630,
      variant: item.variant ?? 0,
    })
    setCurrentOptions({
      title: item.title,
      style: item.style,
      seedOverride: item.seed,
      variant: item.variant,
      titleFont,
      titleScale,
    })
  }

  const handleClearHistory = () => {
    clearHistory()
    setHistory([])
  }

  return (
    <div className="app-shell">
      <main className="layout">
        <div className="layout__main layout__column">
          <TitleForm
            title={title}
            style={style}
            titleFont={titleFont}
            titleScale={titleScale}
            recommendations={recommendations}
            onTitleChange={setTitle}
            onStyleChange={setStyle}
            onTitleFontChange={setTitleFont}
            onTitleScaleChange={setTitleScale}
            onGenerate={handleGenerate}
          />
          <div className="tool-row">
            <span className="seed-hint">输出尺寸已调整为 1200 × 630，下载时自动压缩为高质量 JPG</span>
          </div>
          <CoverPreview options={currentOptions} renderInfo={renderInfo} onRendered={handleRendered} />
        </div>

        <aside className="layout__side layout__column">
          <HistoryPanel items={history} onReplay={handleReplay} onClear={handleClearHistory} />
        </aside>
      </main>
    </div>
  )
}

export default App
