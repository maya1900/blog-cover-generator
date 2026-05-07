import type { CoverStyle } from '../lib/cover/types'

interface StyleCardProps {
  style: CoverStyle
  label: string
  description: string
  active: boolean
  onSelect: (style: CoverStyle) => void
}

export function StyleCard({ style, label, description, active, onSelect }: StyleCardProps) {
  return (
    <button
      type="button"
      className={`style-card ${active ? 'is-active' : ''}`}
      onClick={() => onSelect(style)}
    >
      <span className="style-card__label">{label}</span>
      <span className="style-card__description">{description}</span>
    </button>
  )
}
