import { useEffect, useState } from 'react'
import CourseIllustration from './CourseIllustrations.jsx'

const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || ''

const CATEGORY_ILLUSTRATIONS = {
  Development: 'development',
  'Data Science': 'datascience',
  Design: 'design',
  Business: 'business',
  Marketing: 'marketing',
  'IT & Software': 'cloud',
  'Personal Development': 'productivity',
}

export const resolveCourseThumbnailUrl = (value) => {
  const source = String(value || '').trim()
  if (!source || /^(?:https?:|blob:|data:)/i.test(source)) return source
  if (!API_BASE_URL) return source
  try { return new URL(source, `${API_BASE_URL}/`).toString() } catch { return source }
}

export default function CourseThumbnail({ course = {}, source, alt = '', className = '' }) {
  const thumbnail = source ?? course.thumbnail
  const resolvedSource = resolveCourseThumbnailUrl(thumbnail)
  const [failed, setFailed] = useState(false)

  useEffect(() => setFailed(false), [resolvedSource])

  if (resolvedSource && !failed) {
    return <img className={`course-thumbnail-image ${className}`.trim()} src={resolvedSource} alt={alt} loading="lazy" onError={() => setFailed(true)} />
  }

  const imageType = course.imageType || CATEGORY_ILLUSTRATIONS[course.category] || 'development'
  return <span className={`course-thumbnail-fallback ${className}`.trim()} role="img" aria-label={alt || 'Course thumbnail unavailable'}><CourseIllustration type={imageType} /></span>
}
