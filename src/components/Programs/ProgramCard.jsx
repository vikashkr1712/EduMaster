import CourseIllustration from '../Courses/CourseIllustrations.jsx'

function CalendarIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" stroke="#2563EB" strokeWidth="1.9" />
      <path d="M3.5 9.5h17" stroke="#2563EB" strokeWidth="1.9" />
      <path d="M8 3v4M16 3v4" stroke="#2563EB" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  )
}

function CoursesIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="8" r="3.2" stroke="#2563EB" strokeWidth="1.9" />
      <path
        d="M3.5 19c.6-3 2.9-4.8 5.5-4.8s4.9 1.8 5.5 4.8"
        stroke="#2563EB"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <path
        d="M15.5 5.6a3.2 3.2 0 0 1 0 4.9M17.7 14.6c1.6.7 2.7 2.1 3 4.1"
        stroke="#2563EB"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  )
}

function StarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2.5l2.9 5.9 6.6 1-4.7 4.6 1.1 6.5L12 17.4l-5.9 3.1 1.1-6.5L2.5 9.4l6.6-1L12 2.5z"
        fill="#F9B233"
      />
    </svg>
  )
}

export default function ProgramCard({ program }) {
  return (
    <article className="pcard">
      <div className="pcard-media">
        <CourseIllustration type={program.imageType} />
      </div>

      <div className="pcard-body">
        <h3 className="pcard-title">{program.title}</h3>
        <p className="pcard-desc">{program.description}</p>

        <div className="pcard-meta">
          <div className="pcard-meta-item">
            <span className="pcard-meta-icon">
              <CalendarIcon />
            </span>
            <div className="pcard-meta-copy">
              <span className="pcard-meta-value">{program.duration}</span>
              <span className="pcard-meta-label">Duration</span>
            </div>
          </div>

          <div className="pcard-meta-item">
            <span className="pcard-meta-icon">
              <CoursesIcon />
            </span>
            <div className="pcard-meta-copy">
              <span className="pcard-meta-value">{program.courses}</span>
              <span className="pcard-meta-label">Included</span>
            </div>
          </div>

          <div className="pcard-meta-item">
            <span className="pcard-meta-icon">
              <StarIcon />
            </span>
            <div className="pcard-meta-copy">
              <span className="pcard-meta-value">
                {program.rating} <span className="pcard-reviews">({program.reviews})</span>
              </span>
              <span className="pcard-meta-label">Rating</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
