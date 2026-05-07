import { THEMES } from '../lib/cover/themes'
import type { CoverHistoryItem } from '../lib/cover/types'

interface HistoryPanelProps {
  items: CoverHistoryItem[]
  onReplay: (item: CoverHistoryItem) => void
  onClear: () => void
}

export function HistoryPanel({ items, onReplay, onClear }: HistoryPanelProps) {
  return (
    <section className="panel history-panel">
      <div className="panel__header preview-panel__header">
        <div>
          <p className="eyebrow">History</p>
          <h2>历史记录</h2>
        </div>
        <button type="button" className="secondary-button" onClick={onClear} disabled={items.length === 0}>
          清空
        </button>
      </div>

      {items.length === 0 ? (
        <div className="history-empty">还没有生成记录。</div>
      ) : (
        <div className="history-list">
          {items.map((item, index) => (
            <button key={item.id} type="button" className="history-item" onClick={() => onReplay(item)}>
              <span className="history-item__style">
                {THEMES[item.style].label} · 第 {item.variant ?? items.length - index} 版
              </span>
              <strong>{item.title || '未命名头图'}</strong>
              <span className="history-item__meta">Seed {item.seed}</span>
              <span>{new Date(item.createdAt).toLocaleString()}</span>
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
