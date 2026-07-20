import './TestimonialsStats.css'
import { testimonialsStats } from '../../data/testimonialsData.js'

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

function GradCapIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path d="M12 4l10 4-10 4L2 8l10-4z" fill="#22C55E" />
      <path d="M6 10.5V15c3.5 2.4 8.5 2.4 12 0v-4.5l-6 2.4-6-2.4z" fill="#22C55E" opacity="0.75" />
      <path d="M21 9v5" stroke="#22C55E" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function TrophyIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path
        d="M7 4h10v5.5a5 5 0 0 1-10 0V4z"
        fill="#8B5CF6"
      />
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

function StarIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24">
      <path
        d="M12 2.5l2.9 5.9 6.6 1-4.7 4.6 1.1 6.5L12 17.4l-5.9 3.1 1.1-6.5L2.5 9.4l6.6-1L12 2.5z"
        fill="#F9B233"
      />
    </svg>
  )
}

function GlobeIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9.5" stroke="#EC4899" strokeWidth="1.9" />
      <ellipse cx="12" cy="12" rx="4.2" ry="9.5" stroke="#EC4899" strokeWidth="1.9" />
      <path d="M2.8 12h18.4M4 7.5h16M4 16.5h16" stroke="#EC4899" strokeWidth="1.9" />
    </svg>
  )
}

const icons = {
  students: <StudentsIcon />,
  courses: <GradCapIcon />,
  certificates: <TrophyIcon />,
  rating: <StarIcon />,
  countries: <GlobeIcon />,
}

export default function TestimonialsStats() {
  return (
    <section className="tstats">
      <div className="container">
        <div className="tstats-card">
          {testimonialsStats.map((s, i) => (
            <div className={`tstats-item${i > 0 ? ' has-divider' : ''}`} key={s.key}>
              <span className="tstats-icon" style={{ background: s.tint }}>
                {icons[s.key]}
              </span>
              <div className="tstats-copy">
                <span className="tstats-value">{s.value}</span>
                <span className="tstats-label">{s.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
