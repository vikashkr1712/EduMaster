import { aboutStats } from '../../data/aboutData.js'

function StudentsIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <circle cx="9.5" cy="8.5" r="3.4" fill="#2563EB" />
      <path d="M3.5 19c0-3.2 2.7-5.3 6-5.3s6 2.1 6 5.3v.8h-12v-.8z" fill="#2563EB" />
      <circle cx="16.8" cy="9" r="2.7" fill="#7CA4F5" />
      <path d="M15.6 14c2.8.4 5 2.3 5 5v.8h-3.4" fill="#7CA4F5" />
    </svg>
  )
}

function BookIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15.5H6.5A2.5 2.5 0 0 0 4 21V5.5z"
        fill="#22C55E"
      />
      <path d="M4 21a2.5 2.5 0 0 1 2.5-2.5H20" stroke="#15803D" strokeWidth="1.6" />
      <path d="M8.5 7.5h7M8.5 11h5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function GradCapIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path d="M12 4l10 4-10 4L2 8l10-4z" fill="#F9B233" />
      <path d="M6 10.5V15c3.5 2.4 8.5 2.4 12 0v-4.5l-6 2.4-6-2.4z" fill="#F9B233" opacity="0.8" />
      <path d="M21 9v5" stroke="#F9B233" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function TrophyIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path d="M7 4h10v5.5a5 5 0 0 1-10 0V4z" fill="#8B5CF6" />
      <path
        d="M7 5H4.5v1.5A3.5 3.5 0 0 0 8 10M17 5h2.5v1.5A3.5 3.5 0 0 1 16 10"
        stroke="#8B5CF6"
        strokeWidth="1.7"
      />
      <path d="M10.5 14h3v3h-3z" fill="#8B5CF6" />
      <path d="M8 19.5c0-1.4 1.8-2.5 4-2.5s4 1.1 4 2.5v.5H8v-.5z" fill="#8B5CF6" />
    </svg>
  )
}

function SmileIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9.5" stroke="#EC4899" strokeWidth="1.9" />
      <circle cx="8.8" cy="10" r="1.3" fill="#EC4899" />
      <circle cx="15.2" cy="10" r="1.3" fill="#EC4899" />
      <path
        d="M8 14.3c1 1.5 2.4 2.3 4 2.3s3-.8 4-2.3"
        stroke="#EC4899"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  )
}

const icons = {
  students: <StudentsIcon />,
  courses: <BookIcon />,
  instructors: <GradCapIcon />,
  certificates: <TrophyIcon />,
  satisfaction: <SmileIcon />,
}

export default function AboutStats() {
  return (
    <section className="astats">
      <div className="container">
        <div className="astats-card">
          {aboutStats.map((s, i) => (
            <div className={`astats-item${i > 0 ? ' has-divider' : ''}`} key={s.key}>
              <span className="astats-icon" style={{ background: s.tint }}>
                {icons[s.key]}
              </span>
              <div className="astats-copy">
                <span className="astats-value">{s.value}</span>
                <span className="astats-label">{s.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
