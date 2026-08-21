import { Link } from 'react-router-dom'

function BackIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m15 18-6-6 6-6"/><path d="M9 12h10"/></svg>
}

export default function ProgressHeader({ course, completedCount, totalLessons, progress }) {
  return (
    <header className="learn-progress-header">
      <div className="learn-title-row">
        <Link to="/profile/courses" className="learn-back-button"><BackIcon /> Back to My Courses</Link>
        <div className="learn-course-heading">
          <span>{course.category}</span>
          <h1>{course.title}</h1>
        </div>
      </div>
      <div className="learn-overall-progress">
        <div className="learn-progress-copy"><strong>{progress}% Complete</strong><span>{completedCount} / {totalLessons} Lessons</span></div>
        <div className="learn-progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={progress}>
          <div style={{ width: `${progress}%` }} />
        </div>
      </div>
    </header>
  )
}
