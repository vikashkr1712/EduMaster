import { useNavigate } from 'react-router-dom'
import CourseIllustration from '../Courses/CourseIllustrations.jsx'

export default function CourseCard({ course }) {
  const navigate = useNavigate()
  const { title, status, tint, cta, imageType } = course
  const started = status !== 'Not Started'

  return (
    <article className="profile-course-card">
      <div className="profile-course-art"><CourseIllustration type={imageType} /></div>
      <div className="profile-course-body">
        <span className={`profile-pill profile-pill--${started ? tint : 'purple'}`}>{status}</span>
        <h4 className="profile-course-title">{title}</h4>
        <button
          type="button"
          className={`profile-course-btn profile-course-btn--${tint}`}
          onClick={() => navigate(status === 'Completed' ? '/profile/certificates' : '/courses')}
        >
          {cta}
        </button>
      </div>
    </article>
  )
}
