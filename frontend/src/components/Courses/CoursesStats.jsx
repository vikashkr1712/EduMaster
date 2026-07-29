import './CoursesStats.css'
import { CountUp } from '../Home/motion.jsx'

function BookIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5v-17z" fill="#2563EB" />
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20v3H6.5" fill="#1D4ED8" />
      <rect x="8" y="6" width="8" height="2" rx="1" fill="#fff" opacity="0.85" />
    </svg>
  )
}

function InstructorIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="8" r="3.4" fill="#F97316" />
      <path d="M3 19c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5v1H3v-1z" fill="#F97316" />
      <circle cx="16.5" cy="8.5" r="2.8" fill="#FDBA74" />
      <path d="M15 13.7c2.9.3 5.5 2.3 5.5 5.3v1h-4" fill="#FDBA74" />
    </svg>
  )
}

function TrophyIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M7 3h10v6a5 5 0 0 1-10 0V3z" fill="#8B5CF6" />
      <path d="M7 4H4v2a4 4 0 0 0 3 3.9M17 4h3v2a4 4 0 0 1-3 3.9" stroke="#8B5CF6" strokeWidth="1.8" />
      <path d="M10 14h4v3h-4z" fill="#8B5CF6" />
      <rect x="8" y="17" width="8" height="3.5" rx="1.2" fill="#C4B5FD" />
    </svg>
  )
}

function StudentsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="8" r="3.4" fill="#22C55E" />
      <path d="M3 19c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5v1H3v-1z" fill="#22C55E" />
      <circle cx="16.5" cy="8.5" r="2.8" fill="#4ADE80" />
      <path d="M15 13.7c2.9.3 5.5 2.3 5.5 5.3v1h-4" fill="#4ADE80" />
    </svg>
  )
}

const stats = [
  { icon: <BookIcon />, tint: 'var(--tint-blue)', top: '1,200+', bottom: 'Courses' },
  { icon: <InstructorIcon />, tint: 'var(--tint-orange)', top: '300+', bottom: 'Expert Instructors' },
  { icon: <TrophyIcon />, tint: 'var(--tint-purple)', top: '25,000+', bottom: 'Certifications' },
  { icon: <StudentsIcon />, tint: 'var(--tint-green)', top: '50,000+', bottom: 'Active Students' },
]

export default function CoursesStats() {
  return (
    <div className="courses-stats">
      {stats.map((s) => (
        <div className="courses-stat" key={s.bottom}>
          <span className="courses-stat-icon" style={{ background: s.tint }}>
            {s.icon}
          </span>
          <span className="courses-stat-copy">
            <span className="courses-stat-top"><CountUp value={s.top} /></span>
            <span className="courses-stat-bottom">{s.bottom}</span>
          </span>
        </div>
      ))}
    </div>
  )
}
