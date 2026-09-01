import { useEffect, useMemo, useState } from 'react'
import { resolveCourseThumbnailUrl } from '../Courses/CourseThumbnail.jsx'
import { getYouTubeThumbnailUrls } from '../../utils/youtube.js'

export default function LessonThumbnail({ lesson = {}, source, alt, className = '', eager = false }) {
  const candidates = useMemo(() => {
    const custom = resolveCourseThumbnailUrl(source ?? lesson.thumbnail)
    return [...new Set([custom, ...getYouTubeThumbnailUrls(lesson.videoId)].filter(Boolean))]
  }, [lesson.thumbnail, lesson.videoId, source])
  const [candidateIndex, setCandidateIndex] = useState(0)

  useEffect(() => setCandidateIndex(0), [candidates.join('|')])

  if (!candidates[candidateIndex]) {
    return <span className={`lesson-thumbnail-fallback ${className}`.trim()} role="img" aria-label={alt || `${lesson.title || 'Lesson'} thumbnail unavailable`}><span aria-hidden="true">▶</span></span>
  }

  return (
    <img
      className={`lesson-thumbnail-image ${className}`.trim()}
      src={candidates[candidateIndex]}
      alt={alt || `${lesson.title || 'Lesson'} thumbnail`}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onLoad={(event) => {
        if (candidates[candidateIndex]?.includes('/maxresdefault.jpg') && event.currentTarget.naturalWidth <= 120) {
          setCandidateIndex((index) => index + 1)
        }
      }}
      onError={() => setCandidateIndex((index) => index + 1)}
    />
  )
}
