import { THEMES } from '../cover/themes'
import type { CoverStyle, StyleRecommendation } from '../cover/types'

type WeightedKeyword = {
  word: string
  weight: number
  reason: string
}

const STYLE_RULES: Record<CoverStyle, WeightedKeyword[]> = {
  tech: [
    { word: 'ai', weight: 4, reason: '标题出现 AI / 智能相关表达' },
    { word: '人工智能', weight: 4, reason: '标题出现 AI / 智能相关表达' },
    { word: 'agent', weight: 4, reason: '标题带有 Agent / 自动执行语义' },
    { word: '自动化', weight: 3, reason: '标题偏自动化、系统化' },
    { word: '工程', weight: 3, reason: '标题偏工程实践' },
    { word: '编程', weight: 3, reason: '标题偏编程开发' },
    { word: '技术', weight: 3, reason: '标题直指技术主题' },
    { word: '系统', weight: 3, reason: '标题强调系统设计或架构' },
    { word: '算法', weight: 3, reason: '标题包含算法导向' },
    { word: '数据', weight: 2, reason: '标题偏数据与信息处理' },
    { word: '开发', weight: 2, reason: '标题偏开发实践' },
  ],
  art: [
    { word: '写作', weight: 4, reason: '标题偏表达、叙述和写作气质' },
    { word: '故事', weight: 4, reason: '标题带有故事感或叙事感' },
    { word: '阅读', weight: 3, reason: '标题偏阅读与内容体验' },
    { word: '生活', weight: 3, reason: '标题偏生活观察与感受' },
    { word: '电影', weight: 3, reason: '标题偏审美与文化表达' },
    { word: '书', weight: 2, reason: '标题带有书写与阅读意象' },
    { word: '诗', weight: 3, reason: '标题带有诗意表达' },
    { word: '文艺', weight: 3, reason: '标题直指文艺气质' },
    { word: '情绪', weight: 2, reason: '标题强调情绪氛围' },
    { word: '咖啡', weight: 2, reason: '标题有轻文艺生活感' },
    { word: '随笔', weight: 3, reason: '标题偏个人表达与感受' },
  ],
  business: [
    { word: '增长', weight: 4, reason: '标题强调增长与结果导向' },
    { word: '复盘', weight: 4, reason: '标题带有复盘总结语义' },
    { word: '策略', weight: 4, reason: '标题偏策略与决策' },
    { word: '管理', weight: 3, reason: '标题偏管理与协作' },
    { word: '营销', weight: 3, reason: '标题偏商业传播与转化' },
    { word: '投资', weight: 3, reason: '标题偏商业判断与价值评估' },
    { word: '团队', weight: 3, reason: '标题聚焦组织与团队' },
    { word: '效率', weight: 2, reason: '标题偏效率优化' },
    { word: '方法', weight: 2, reason: '标题呈现方法论表达' },
    { word: '战略', weight: 4, reason: '标题指向战略层思考' },
    { word: '案例', weight: 2, reason: '标题带有案例分析结构' },
  ],
  nature: [
    { word: '旅行', weight: 4, reason: '标题直指出行与在路上的感觉' },
    { word: '自然', weight: 4, reason: '标题直指自然气息' },
    { word: '治愈', weight: 4, reason: '标题偏治愈和舒缓氛围' },
    { word: '森林', weight: 3, reason: '标题具有自然场景意象' },
    { word: '山', weight: 2, reason: '标题出现山野相关意象' },
    { word: '海', weight: 2, reason: '标题出现海边与开放场景意象' },
    { word: '阳光', weight: 3, reason: '标题强调光感和呼吸感' },
    { word: '风景', weight: 3, reason: '标题偏景观与画面感' },
    { word: '植物', weight: 3, reason: '标题偏植物与生命力' },
    { word: '户外', weight: 3, reason: '标题偏户外与自然体验' },
    { word: '春天', weight: 2, reason: '标题带有季节感和生命力' },
  ],
}

const FALLBACK_STYLE_ORDER: CoverStyle[] = ['tech', 'business', 'art', 'nature']

function normalizeTitle(title: string) {
  return title.trim().toLowerCase()
}

function dedupeReasons(reasons: string[]) {
  return Array.from(new Set(reasons))
}

function resolveConfidence(score: number): StyleRecommendation['confidence'] {
  if (score >= 6) return 'high'
  if (score >= 3) return 'medium'
  return 'low'
}

export function recommendStyle(title: string): StyleRecommendation[] {
  const normalized = normalizeTitle(title)

  if (!normalized) {
    return []
  }

  const scored = (Object.entries(THEMES) as [CoverStyle, (typeof THEMES)[CoverStyle]][]).map(([style, theme], index) => {
    const matched = STYLE_RULES[style].filter((rule) => normalized.includes(rule.word))
    const matchedKeywords = matched.map((item) => item.word)
    const keywordScore = matched.reduce((sum, item) => sum + item.weight, 0)
    const semanticBonus =
      normalized.includes('为什么') || normalized.includes('如何') || normalized.includes('实战') || normalized.includes('指南')
        ? style === 'tech' || style === 'business'
          ? 1
          : 0
        : normalized.includes('感') || normalized.includes('日常') || normalized.includes('体验')
          ? style === 'art' || style === 'nature'
            ? 1
            : 0
          : 0

    const score = keywordScore + semanticBonus
    const reasons = matched.map((item) => item.reason)

    if (semanticBonus > 0) {
      reasons.push(
        style === 'tech' || style === 'business'
          ? '标题偏方法、分析或实战表达'
          : '标题偏感受、体验或氛围表达',
      )
    }

    return {
      style,
      score: score || Math.max(0.2, 1 - index * 0.1),
      matchedKeywords,
      reasons: dedupeReasons(score > 0 ? reasons : [`默认按「${theme.label}」适配常见博客题材`]),
      confidence: resolveConfidence(score),
    }
  })

  return scored
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score
      }
      return FALLBACK_STYLE_ORDER.indexOf(left.style) - FALLBACK_STYLE_ORDER.indexOf(right.style)
    })
    .slice(0, 3)
}
