import type { CoverStyle, StyleRecommendation, TitleFontPreset } from '../lib/cover/types'
import { THEMES, TITLE_FONT_PRESETS } from '../lib/cover/themes'
import { StyleCard } from './StyleCard'
import type { MouseEvent } from 'react'

interface TitleFormProps {
  title: string
  style: CoverStyle
  titleFont: TitleFontPreset
  titleScale: number
  recommendations: StyleRecommendation[]
  onTitleChange: (value: string) => void
  onStyleChange: (style: CoverStyle) => void
  onTitleFontChange: (font: TitleFontPreset) => void
  onTitleScaleChange: (scale: number) => void
  onGenerate: () => void
}

const CONFIDENCE_LABEL: Record<StyleRecommendation['confidence'], string> = {
  high: '高匹配',
  medium: '较匹配',
  low: '可尝试',
}

export function TitleForm({
  title,
  style,
  titleFont,
  titleScale,
  recommendations,
  onTitleChange,
  onStyleChange,
  onTitleFontChange,
  onTitleScaleChange,
  onGenerate,
}: TitleFormProps) {
  const topRecommendation = recommendations[0]
  const recommendationReason = topRecommendation?.matchedKeywords[0] ?? topRecommendation?.reasons[0]

  return (
    <section className="panel form-panel">
      <div className="panel__header form-panel__header">
        <div>
          <p className="eyebrow">Blog Cover Generator</p>
          <h1>博客头图生成器</h1>
          <p className="panel__lead">四种风格、随机元素组合、更强标题排版。可直接生成纯背景头图，也可输入标题生成带字版本。---by 羊的小栈</p>
        </div>
      </div>

      <label className="field field--compact">
        <span className="field__label">文章标题</span>
        <textarea
          value={title}
          rows={3}
          placeholder="比如：为什么 AI Agent 正在重塑软件工程；留空则生成无标题头图"
          onChange={(event) => onTitleChange(event.target.value)}
        />
      </label>

      <div className="form-controls form-controls--inline">
        <label className="field field--compact field--inline">
          <span className="field__label">标题字体</span>
          <div className="select-wrap">
            <select value={titleFont} onChange={(event) => onTitleFontChange(event.target.value as TitleFontPreset)}>
              {Object.entries(TITLE_FONT_PRESETS).map(([key, item]) => (
                <option key={key} value={key}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </label>

        <label className="field field--compact field--inline field--slider">
          <span className="field__label">字号</span>
          <div className="range-wrap">
            <input
              type="range"
              min="0.85"
              max="1.25"
              step="0.05"
              value={titleScale}
              onChange={(event) => onTitleScaleChange(Number(event.target.value))}
            />
            <span className="field__hint">{Math.round(titleScale * 100)}%</span>
          </div>
        </label>
      </div>

      <div className="field field--compact">
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

      <div className="recommendation-bar">
        <span className="recommendation-bar__label">智能推荐</span>
        {topRecommendation ? (
          <button type="button" className="recommendation-bar__content" onClick={() => onStyleChange(topRecommendation.style)}>
            <strong>{THEMES[topRecommendation.style].label}</strong>
            <span>{CONFIDENCE_LABEL[topRecommendation.confidence]}</span>
            {recommendationReason ? <span>· {recommendationReason}</span> : null}
          </button>
        ) : (
          <span className="recommendation-bar__empty">输入标题后自动推荐风格</span>
        )}
      </div>

      <button
        className="primary-button primary-button--compact"
        type="button"
        onClick={(e: MouseEvent<HTMLButtonElement>) => {
          const button = e.currentTarget
          const ripple = document.createElement('span')
          ripple.className = 'ripple'
          const rect = button.getBoundingClientRect()
          const size = Math.max(rect.width, rect.height)
          ripple.style.width = ripple.style.height = `${size}px`
          ripple.style.left = `${e.clientX - rect.left - size / 2}px`
          ripple.style.top = `${e.clientY - rect.top - size / 2}px`
          button.appendChild(ripple)
          setTimeout(() => ripple.remove(), 600)
          onGenerate()
        }}
      >
        生成头图
      </button>
    </section>
  )
}
