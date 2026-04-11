import type { CoverStyle, CoverTheme, TitleFontPreset } from './types'

export const COVER_SIZE = {
  width: 1200,
  height: 630,
} as const

const YAHEI_STACK = '"Microsoft YaHei", "PingFang SC", "Hiragino Sans GB", sans-serif'

export const TITLE_FONT_PRESETS: Record<TitleFontPreset, { label: string; fontStack: string }> = {
  yahei: {
    label: '雅黑',
    fontStack: '"Microsoft YaHei", "PingFang SC", sans-serif',
  },
  songti: {
    label: '宋体',
    fontStack: '"Songti SC", "STSong", serif',
  },
  kaiti: {
    label: '楷体',
    fontStack: '"Kaiti SC", "STKaiti", serif',
  },
  hei: {
    label: '黑体',
    fontStack: '"PingFang SC", "Heiti SC", sans-serif',
  },
  serif: {
    label: '衬线',
    fontStack: '"Noto Serif SC", "Songti SC", serif',
  },
}

export const THEMES: Record<CoverStyle, CoverTheme> = {
  tech: {
    id: 'tech',
    label: '科技风',
    description: '未来感、理性、数字化、简洁、冷色调',
    palette: ['#050816', '#0f172a', '#0ea5e9', '#8b5cf6', '#67e8f9'],
    fontStack: YAHEI_STACK,
    keywords: ['科技', '技术', 'ai', '人工智能', '算法', '工程', '编程', '系统', '数据', '数字化', '未来'],
  },
  art: {
    id: 'art',
    label: '文艺风',
    description: '情绪感、故事感、质感、柔和、诗意',
    palette: ['#f5f1e8', '#d9d2c3', '#5e6b52', '#7a4b3a', '#722f37'],
    fontStack: YAHEI_STACK,
    keywords: ['文艺', '散文', '阅读', '诗', '生活', '写作', '故事', '电影', '咖啡', '书', '情绪'],
  },
  business: {
    id: 'business',
    label: '商务风',
    description: '专业、可信、稳重、效率、结果导向',
    palette: ['#0f172a', '#111827', '#334155', '#f8fafc', '#d4af37'],
    fontStack: YAHEI_STACK,
    keywords: ['商业', '商务', '增长', '营销', '管理', '效率', '团队', '会议', '战略', '投资', '复盘'],
  },
  nature: {
    id: 'nature',
    label: '自然风',
    description: '舒展、呼吸感、真实、治愈、生命力',
    palette: ['#ecfdf5', '#bfdbfe', '#65a30d', '#15803d', '#c2a878'],
    fontStack: YAHEI_STACK,
    keywords: ['自然', '旅行', '山川', '植物', '治愈', '阳光', '呼吸', '风景', '森林', '户外', '生命力'],
  },
}
