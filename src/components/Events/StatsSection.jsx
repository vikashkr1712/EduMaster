import './StatsSection.css'
import { eventStats } from '../../data/eventsData.js'

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

function BookOpenIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 6c-2-1.8-5-2.2-8-2v14c3-.2 6 .2 8 2 2-1.8 5-2.2 8-2V4c-3-.2-6 .2-8 2z"
        fill="#22C55E"
      />
      <path d="M12 6v14" stroke="#fff" strokeWidth="1.6" />
    </svg>
  )
}

function GradCapIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path d="M12 4l10 4-10 4L2 8l10-4z" fill="#F9B233" />
      <path d="M6 10.5V15c3.5 2.4 8.5 2.4 12 0v-4.5l-6 2.4-6-2.4z" fill="#F9B233" opacity="0.75" />
      <path d="M21 9v5" stroke="#F9B233" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function TrophyIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path
        d="M7 4h10v6a5 5 0 0 1-10 0V4z"
        fill="#8B5CF6"
      />
      <path
        d="M7 5H4v2a3.5 3.5 0 0 0 3 3.5M17 5h3v2a3.5 3.5 0 0 1-3 3.5"
        stroke="#8B5CF6"
        strokeWidth="1.8"
      />
      <path d="M12 15v3" stroke="#8B5CF6" strokeWidth="1.8" />
      <path d="M8.5 21c.5-2 1.8-3 3.5-3s3 1 3.5 3h-7z" fill="#8B5CF6" />
    </svg>
  )
}

function SmileIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9.4" stroke="#EC4899" strokeWidth="1.9" />
      <circle cx="9" cy="10" r="1.3" fill="#EC4899" />
      <circle cx="15" cy="10" r="1.3" fill="#EC4899" />
      <path d="M8.5 14.5c1 1.4 2.2 2 3.5 2s2.5-.6 3.5-2" stroke="#EC4899" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  )
}

const ICONS = {
  students: <StudentsIcon />,
  courses: <BookOpenIcon />,
  instructors: <GradCapIcon />,
  certs: <TrophyIcon />,
  satisfaction: <SmileIcon />,
}

export default function StatsSection() {
  return (
    <section className="programs-stats">
      <div className="container">
        <div className="programs-stats-card">
          {eventStats.map((s, i) => (
            <div className={`programs-stats-item${i > 0 ? ' has-divider' : ''}`} key={s.key}>
              <span className="programs-stats-icon" style={{ background: s.tint }}>
                {ICONS[s.key]}
              </span>
              <div className="programs-stats-copy">
                <span className="programs-stats-value">{s.value}</span>
                <span className="programs-stats-label">{s.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
