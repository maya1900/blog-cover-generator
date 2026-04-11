import type { CoverStyle, StyleRecommendation } from '../lib/cover/types'
import { THEMES } from '../lib/cover/themes'
import { StyleCard } from './StyleCard'

interface TitleFormProps {
  title: string
  style: CoverStyle
  recommendations: StyleRecommendation[]
  onTitleChange: (value: string) => void
  onStyleChange: (style: CoverStyle) => void
  onGenerate: () => void
}

export function TitleForm({
  title,
  style,
  recommendations,
  onTitleChange,
  onStyleChange,
  onGenerate,
}: TitleFormProps) {
  const topRecommendation = recommendations[0]?.style

  return (
    <section className="panel form-panel">
      <div className="panel__header">
        <div>
          <p className="eyebrow">Blog Cover Generator</p>
          <h1>根据文章标题生成博客头图</h1>
          <p className="panel__lead">四种风格、随机元素组合、更强标题排版。输入标题后每次点击都会生成一版新的头图。</p>
        </div>
      </div>

      <label className="field">
        <span className="field__label">文章标题</span>
        <textarea
          value={title}
          rows={3}
          placeholder="比如：为什么 AI Agent 正在重塑软件工程"
          onChange={(event) => onTitleChange(event.target.value)}
        />
      </label>

      <div className="field">
        <span className="field__label">选择风格</span>
        <div className="style-grid">
          {Object.values(THEMES).map((theme) => (
            <StyleCard
              key={theme.id}
              style={theme.id}
              label={theme.label}
              description={theme.description}
              active={theme.id === style}
              onSelect={onStyleChange}
            />
          ))}
        </div>
      </div>

      <div className="recommendation-box">
        <div>
          <span className="field__label">风格推荐</span>
          <p>
            {topRecommendation
              ? `当前最推荐：${THEMES[topRecommendation].label}`
              : '暂未命中关键词，建议按内容主基调手动选择。'}
          </p>
        </div>
        {recommendations.length > 0 ? (
          <div className="recommendation-tags">
            {recommendations.slice(0, 3).map((item) => (
              <button key={item.style} type="button" className="tag" onClick={() => onStyleChange(item.style)}>
                {THEMES[item.style].label} · {item.matchedKeywords.join(' / ')}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <button className="primary-button" type="button" onClick={onGenerate} disabled={!title.trim()}>
        生成头图
      </button>
    </section>
  )
}
