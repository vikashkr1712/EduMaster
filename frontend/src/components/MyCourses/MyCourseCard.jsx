import { useNavigate } from 'react-router-dom'
import CourseIllustration from '../Courses/CourseIllustrations.jsx'

const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' }

function LessonsIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" {...stroke}>
      <path d="M12 6.5c-1.8-1.6-4.4-2-8-2v13c3.6 0 6.2.4 8 2 1.8-1.6 4.4-2 8-2v-13c-3.6 0-6.2.4-8 2Zm0 0v13" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" {...stroke}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  )
}

const STATUS_PILL = {
  'In Progress': 'profile-pill--green',
  Completed: 'profile-pill--blue',
  'Not Started': 'profile-pill--purple',
}

const CTA = {
  'In Progress': { label: 'Continue Learning', variant: 'blue' },
  Completed: { label: 'View Certificate', variant: 'green' },
  'Not Started': { label: 'Start Learning', variant: 'purple' },
}

export default function MyCourseCard({ course }) {
  const navigate = useNavigate()
  const { title, instructor, imageType, tint, status, progress, lessons, duration, activity = {} } = course
  const cta = CTA[status]
  const activityTotal = (activity.pendingAssignments || 0) + (activity.submittedAssignments || 0) + (activity.discussionActivity || 0)

  return (
    <article className="mycourse-card">
      <div className="mycourse-art"><CourseIllustration type={imageType} /></div>

      <div className="mycourse-body">
        <span className={`profile-pill ${STATUS_PILL[status]}`}>{status === 'Completed' ? 'Completed ✓' : status}</span>
        <h4 className="mycourse-title">{title}</h4>
        <p className="mycourse-instructor">By {instructor}</p>

        <div className="mycourse-meta">
          <span className="mycourse-meta-item"><LessonsIcon /> {lessons}</span>
          <span className="mycourse-meta-item"><ClockIcon /> {duration}</span>
        </div>

        <details className="mycourse-lms-activity">
          <summary>
            <span>Course activity</span>
            <span className="mycourse-activity-summary-count">{activityTotal}</span>
          </summary>
          <div className="mycourse-activity-details" aria-label="Course learning activity">
            <span className={activity.pendingAssignments ? 'is-pending' : ''}>Pending Assignment <b>{activity.pendingAssignments || 0}</b></span>
            <span className={activity.submittedAssignments ? 'is-submitted' : ''}>Submitted Assignment <b>{activity.submittedAssignments || 0}</b></span>
            <span>Discussion Activity <b>{activity.discussionActivity || 0}</b></span>
          </div>
        </details>

        <div className="mycourse-progress">
          <div className="mycourse-progress-row">
            <span>Progress</span>
            <span className="mycourse-progress-value">{progress}%</span>
          </div>
          <div
            className="cert-progress-track"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${title} progress`}
          >
            <div className={`mycourse-progress-fill mycourse-progress-fill--${tint}`} style={{ width: `${progress}%` }} />
          </div>
        </div>

        <button
          type="button"
          className={`profile-course-btn profile-course-btn--${cta.variant === 'green' ? 'green' : cta.variant}`}
          onClick={() => navigate(status === 'Completed' ? '/profile/certificates' : `/learn/${course.id}`)}
        >
          {cta.label}
        </button>
      </div>
    </article>
  )
}
