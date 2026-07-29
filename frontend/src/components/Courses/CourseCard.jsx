import CourseIllustration from './CourseIllustrations.jsx'

const CAT_CLASS = {
  Development: 'ccat-dev',
  'Data Science': 'ccat-data',
  Design: 'ccat-design',
  Business: 'ccat-business',
  Marketing: 'ccat-marketing',
  'IT & Software': 'ccat-it',
  'Personal Development': 'ccat-personal',
}

function HeartIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 20.5C6.5 15.7 3 12.6 3 8.9 3 6.2 5.2 4 7.9 4c1.6 0 3.1.8 4.1 2 1-1.2 2.5-2 4.1-2C18.8 4 21 6.2 21 8.9c0 3.7-3.5 6.8-9 11.6z"
        stroke="#9AA5B5"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2.5l2.9 5.9 6.6 1-4.7 4.6 1.1 6.5L12 17.4l-5.9 3.1 1.1-6.5L2.5 9.4l6.6-1L12 2.5z"
        fill="#F9B233"
      />
    </svg>
  )
}

function StudentsIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="8" r="3.2" stroke="#8A97AB" strokeWidth="1.8" />
      <path d="M3.5 19c.6-3 2.9-4.8 5.5-4.8s4.9 1.8 5.5 4.8" stroke="#8A97AB" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M15.5 5.6a3.2 3.2 0 0 1 0 4.9M17.7 14.6c1.6.7 2.7 2.1 3 4.1" stroke="#8A97AB" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function InstructorAvatar({ name }) {
  const hues = ['#2563EB', '#F97316', '#22C55E', '#8B5CF6', '#EC4899', '#0EA5E9', '#F9B233']
  const hue = hues[name.length % hues.length]
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
  return (
    <span className="course-avatar" style={{ background: hue }}>
      {initials}
    </span>
  )
}

export default function CourseCard({ course }) {
  const inr = (n) => `₹${n.toLocaleString('en-IN')}`
  const studentCount = parseInt(course.students.replace(/[,+]/g, ''), 10) || 0
  const reviews = studentCount >= 5000
    ? `${(Math.round(studentCount / 500) / 10).toFixed(1)}K`
    : `${Math.round(studentCount / 5)}`
  return (
    <article className="ccard">
      <div className="ccard-media">
        <CourseIllustration type={course.imageType} />
      </div>
      <div className="ccard-body">
        <div className="ccard-topline">
          <span className={`ccard-cat ${CAT_CLASS[course.category] || 'ccat-dev'}`}>
            {course.category}
          </span>
          <button className="ccard-wishlist" aria-label="Add to wishlist">
            <HeartIcon />
          </button>
        </div>

        <h3 className="ccard-title">{course.title}</h3>

        <div className="ccard-instructor">
          <InstructorAvatar name={course.instructor} />
          {course.instructor}
        </div>

        <div className="ccard-meta">
          <span className="ccard-rating">
            <StarIcon />
            <b>{course.rating.toFixed(1)}</b>
            <span className="ccard-reviews">({reviews})</span>
          </span>
          <span className="ccard-students">
            <StudentsIcon />
            {course.students} Students
          </span>
        </div>

        <div className="ccard-pricing">
          {course.priceType === 'Free' ? (
            <span className="ccard-price ccard-price-free">Free</span>
          ) : (
            <>
              <span className="ccard-price">{inr(course.price)}</span>
              <span className="ccard-oldprice">{inr(course.oldPrice)}</span>
            </>
          )}
        </div>
      </div>
    </article>
  )
}
