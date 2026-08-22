import { useEffect, useState } from 'react'
import CourseIllustration from './CourseIllustrations.jsx'

const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || ''

const CATEGORY_ILLUSTRATIONS = {
  Development: 'development',
  'Data Science': 'dataScience',
  Design: 'design',
  Business: 'business',
  Marketing: 'marketing',
  'IT & Software': 'development',
  'Personal Development': 'personalDevelopment',
}

const FINANCE_TOPICS = /\b(finance|financial|invest(?:ing|ment)?|accounting|valuation|mergers?|banking|wealth|stocks?|taxation)\b/i
const AI_TOPICS = /\b(artificial intelligence|machine learning|deep learning|generative ai|neural|nlp|natural language processing|transformers?|mlops|computer vision|pytorch)\b/i

export function getCourseIllustrationType(course = {}) {
  const topic = `${course.title || ''} ${course.category || ''}`

  // Strong topic matches take precedence over broad catalog categories.
  if (FINANCE_TOPICS.test(topic)) return 'finance'
  if (AI_TOPICS.test(topic)) return 'ai'

  if (CATEGORY_ILLUSTRATIONS[course.category]) return CATEGORY_ILLUSTRATIONS[course.category]

  const legacyType = String(course.imageType || '').trim()
  if (legacyType) return legacyType

  const normalized = topic.toLowerCase()
  if (/marketing|seo|social media|copywriting|advertising|branding/.test(normalized)) return 'marketing'
  if (/design|ui|ux|figma|typography|creative/.test(normalized)) return 'design'
  if (/data|analytics|statistics|tableau|power bi/.test(normalized)) return 'dataScience'
  if (/business|startup|entrepreneur|management|strategy|growth/.test(normalized)) return 'business'
  if (/leadership|productivity|career|habits?|mindfulness|personal development/.test(normalized)) return 'personalDevelopment'
  return 'development'
}

export const resolveCourseThumbnailUrl = (value) => {
  const source = String(value || '').trim()
  if (!source || /^(?:https?:|blob:|data:)/i.test(source)) return source
  if (!API_BASE_URL) return source
  try { return new URL(source, `${API_BASE_URL}/`).toString() } catch { return source }
}

export default function CourseThumbnail({ course = {}, source, alt = '', className = '', preferIllustration = false }) {
  const thumbnail = source ?? course.thumbnail
  const resolvedSource = resolveCourseThumbnailUrl(thumbnail)
  const [failed, setFailed] = useState(false)

  useEffect(() => setFailed(false), [resolvedSource])

  if (!preferIllustration && resolvedSource && !failed) {
    return <img className={`course-thumbnail-image ${className}`.trim()} src={resolvedSource} alt={alt} loading="lazy" onError={() => setFailed(true)} />
  }

  const imageType = getCourseIllustrationType(course)
  return <span className={`course-thumbnail-fallback ${className}`.trim()} role="img" aria-label={alt || 'Course thumbnail unavailable'}><CourseIllustration type={imageType} /></span>
}
