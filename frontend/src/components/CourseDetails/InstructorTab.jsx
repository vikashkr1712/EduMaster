function InstructorAvatar({ name, size = 72 }) {
  const hues = ['#2563EB', '#F97316', '#22C55E', '#8B5CF6', '#EC4899', '#0EA5E9', '#F9B233']
  const safeName = name || 'EduMaster'
  const hue = hues[safeName.length % hues.length]
  const initials = safeName.split(' ').map((w) => w[0]).join('').slice(0, 2)
  return (
    <span
      className="cdp-inst-avatar"
      style={{ background: hue, width: size, height: size, fontSize: size * 0.32 }}
    >
      {initials}
    </span>
  )
}

function StarIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="#F9B233"><path d="M12 2.5l2.9 5.9 6.6 1-4.7 4.6 1.1 6.5L12 17.4l-5.9 3.1 1.1-6.5L2.5 9.4l6.6-1L12 2.5z" /></svg>
}

function buildInstructorBio(name, category) {
  return `${name} is the instructor for this ${category || 'EduMaster'} course. Follow the structured lessons and course resources to build practical subject knowledge.`
}

export default function InstructorTab({ course }) {
  const bio = buildInstructorBio(course.instructor, course.category)

  const stats = [
    { label: 'Students', value: course.students || 'Not provided' },
    { label: 'Rating', value: course.rating ? Number(course.rating).toFixed(1) : '4.8' },
  ]

  return (
    <div className="cdp-instructor-tab">
      <h3 className="cdp-section-title">About the Instructor</h3>
      <div className="cdp-inst-card">
        <div className="cdp-inst-card-top">
          <InstructorAvatar name={course.instructor} size={88} />
          <div className="cdp-inst-card-info">
            <h4 className="cdp-inst-name">{course.instructor}</h4>
            <p className="cdp-inst-role">{course.category} Expert &amp; Educator</p>
            <div className="cdp-inst-rating-row">
              <StarIcon />
              <span className="cdp-inst-rating-val">{course.rating ? Number(course.rating).toFixed(1) : '4.8'}</span>
              <span className="cdp-inst-rating-sub">Instructor Rating</span>
            </div>
          </div>
        </div>
        <div className="cdp-inst-stats">
          {stats.map(({ label, value }) => (
            <div key={label} className="cdp-inst-stat">
              <span className="cdp-inst-stat-val">{value}</span>
              <span className="cdp-inst-stat-label">{label}</span>
            </div>
          ))}
        </div>
        <p className="cdp-inst-bio">{bio}</p>
      </div>
    </div>
  )
}
