import { useCallback, useMemo, useState } from 'react'
import './index.css'
import { CoverPreview } from './components/CoverPreview'
import { HistoryPanel } from './components/HistoryPanel'
import { TitleForm } from './components/TitleForm'
import { recommendStyle } from './lib/recommendation/recommendStyle'
import { clearHistory, readHistory, saveHistory } from './lib/storage/history'
import type { CoverHistoryItem, CoverOptions, CoverStyle } from './lib/cover/types'

function App() {
  const [title, setTitle] = useState('')
  const [style, setStyle] = useState<CoverStyle>('tech')
  const [variant, setVariant] = useState(0)
  const [history, setHistory] = useState<CoverHistoryItem[]>(() => readHistory())
  const [currentOptions, setCurrentOptions] = useState<CoverOptions | null>(null)

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
    })
  }

  const handleRendered = useCallback(
    (seed: number) => {
      if (!currentOptions) return
      setHistory(saveHistory({ title: currentOptions.title, style: currentOptions.style, seed }))
    },
    [currentOptions],
  )

  const handleReplay = (item: CoverHistoryItem) => {
    setTitle(item.title)
    setStyle(item.style)
    setCurrentOptions({
      title: item.title,
      style: item.style,
      seedOverride: item.seed,
    })
  }

  const handleClearHistory = () => {
    clearHistory()
    setHistory([])
  }

  return (
    <div className="app-shell">
      <main className="layout">
        <div className="layout__main">
          <TitleForm
            title={title}
            style={style}
            recommendations={recommendations}
            onTitleChange={setTitle}
            onStyleChange={setStyle}
            onGenerate={handleGenerate}
          />
          <div className="tool-row">
            <span className="seed-hint">每次点击都会生成新的构图版本；历史记录可回放旧版本</span>
          </div>
          <CoverPreview options={currentOptions} onRendered={handleRendered} />
        </div>

        <aside className="layout__side">
          <HistoryPanel items={history} onReplay={handleReplay} onClear={handleClearHistory} />
        </aside>
      </main>
    </div>
  )
}

export default App
