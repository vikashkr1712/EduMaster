import { motion } from 'framer-motion'
import CourseThumbnail from '../Courses/CourseThumbnail.jsx'

const CAT_CLASS = {
  Development: 'ccat-dev',
  'Data Science': 'ccat-data',
  Design: 'ccat-design',
  Business: 'ccat-business',
  Marketing: 'ccat-marketing',
  'IT & Software': 'ccat-it',
  'Personal Development': 'ccat-personal',
}

function StarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#F9B233">
      <path d="M12 2.5l2.9 5.9 6.6 1-4.7 4.6 1.1 6.5L12 17.4l-5.9 3.1 1.1-6.5L2.5 9.4l6.6-1L12 2.5z" />
    </svg>
  )
}

function StudentsIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3.5 19c.6-3 2.9-4.8 5.5-4.8s4.9 1.8 5.5 4.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M15.5 5.6a3.2 3.2 0 0 1 0 4.9M17.7 14.6c1.6.7 2.7 2.1 3 4.1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <polygon points="5,3 19,12 5,21" fill="currentColor" />
    </svg>
  )
}

function InstructorAvatar({ name }) {
  const hues = ['#2563EB', '#F97316', '#22C55E', '#8B5CF6', '#EC4899', '#0EA5E9', '#F9B233']
  const safeName = name || 'EduMaster'
  const hue = hues[safeName.length % hues.length]
  const initials = safeName.split(' ').map((w) => w[0]).join('').slice(0, 2)
  return (
    <span className="cdp-instructor-avatar" style={{ background: hue }}>
      {initials}
    </span>
  )
}

export default function CourseHero({ course }) {
  const rating = Number(course.rating)
  const hasRating = Number.isFinite(rating) && rating > 0
  const studentCount = typeof course.students === 'string'
    ? parseInt(course.students.replace(/[,+]/g, ''), 10) || 0
    : Number(course.students) || 0
  const reviewCount = Array.isArray(course.reviews) ? course.reviews.length : 0
  const previewLesson = course.modules?.flatMap((module) => module.lessons || []).find((lesson) => lesson.videoId)

  function previewCourse() {
    if (previewLesson?.videoId) {
      window.open(`https://www.youtube.com/watch?v=${encodeURIComponent(previewLesson.videoId)}`, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div className="cdp-hero">
      <motion.div
        className="cdp-hero-media"
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className="cdp-hero-illustration">
          <CourseThumbnail course={course} alt={`${course.title} thumbnail`} />
        </div>
        <button className="cdp-preview-btn" aria-label="Preview course" onClick={previewCourse} disabled={!previewLesson}>
          <PlayIcon />
          Preview Course
        </button>
      </motion.div>

      <motion.div
        className="cdp-hero-info"
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45, delay: 0.08 }}
      >
        <span className={`cdp-cat-badge ${CAT_CLASS[course.category] || 'ccat-dev'}`}>
          {course.category}
        </span>
        <h1 className="cdp-hero-title">{course.title}</h1>
        <p className="cdp-hero-desc">
          {course.shortDescription || (course.description ? course.description.slice(0, 180) + '…' : '')}
        </p>
        <div className="cdp-hero-instructor-row">
          <InstructorAvatar name={course.instructor} />
          <div>
            <span className="cdp-instructor-name">{course.instructor}</span>
          </div>
        </div>
        <div className="cdp-hero-meta">
          {hasRating && (
            <span className="cdp-hero-rating">
              <StarIcon />
              <b>{rating.toFixed(1)}</b>
              {reviewCount > 0 && <span className="cdp-hero-reviews">({reviewCount.toLocaleString('en-IN')} reviews)</span>}
            </span>
          )}
          {studentCount > 0 && (
            <span className="cdp-hero-students">
              <StudentsIcon />
              {course.students} Students
            </span>
          )}
        </div>
      </motion.div>
    </div>
  )
}
