import './StatsBar.css'

function PeopleIcon() {
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
      <path d="M12 6c-2-1.8-5-2.2-8-2v14c3-.2 6 .2 8 2 2-1.8 5-2.2 8-2V4c-3-.2-6 .2-8 2z" fill="#22C55E" />
      <path d="M12 6v14" stroke="#fff" strokeWidth="1.6" />
    </svg>
  )
}

function InstructorsIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="7.5" r="3.4" fill="#F97316" />
      <path d="M5.5 19c0-3.6 2.9-5.8 6.5-5.8s6.5 2.2 6.5 5.8v.7h-13v-.7z" fill="#F97316" />
      <circle cx="5.5" cy="9" r="2.4" fill="#FDBA74" />
      <circle cx="18.5" cy="9" r="2.4" fill="#FDBA74" />
    </svg>
  )
}

function TrophyIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path d="M7 3h10v6a5 5 0 0 1-10 0V3z" fill="#8B5CF6" />
      <path d="M7 4H4a3.5 3.5 0 0 0 3.5 5M17 4h3a3.5 3.5 0 0 1-3.5 5" stroke="#8B5CF6" strokeWidth="1.8" />
      <path d="M11 14h2v3h-2z" fill="#8B5CF6" />
      <rect x="8" y="17" width="8" height="3.4" rx="1.2" fill="#8B5CF6" />
    </svg>
  )
}

function SmileIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9.5" stroke="#EC4899" strokeWidth="2" />
      <circle cx="9" cy="10" r="1.3" fill="#EC4899" />
      <circle cx="15" cy="10" r="1.3" fill="#EC4899" />
      <path d="M8.2 14.2c1 1.5 2.3 2.2 3.8 2.2s2.8-.7 3.8-2.2" stroke="#EC4899" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

const stats = [
  { icon: <PeopleIcon />, tint: 'var(--tint-blue)', value: '50,000+', label: 'Active Students' },
  { icon: <BookOpenIcon />, tint: 'var(--tint-green)', value: '1,200+', label: 'Expert Courses' },
  { icon: <InstructorsIcon />, tint: 'var(--tint-orange)', value: '300+', label: 'Expert Instructors' },
  { icon: <TrophyIcon />, tint: 'var(--tint-purple)', value: '25,000+', label: 'Certifications Issued' },
  { icon: <SmileIcon />, tint: 'var(--tint-pink)', value: '95%', label: 'Satisfaction Rate' },
]

export default function StatsBar() {
  return (
    <section className="statsbar">
      <div className="container">
        <div className="statsbar-card">
          {stats.map((s, i) => (
            <div className={`statsbar-item${i > 0 ? ' has-divider' : ''}`} key={s.label}>
              <span className="statsbar-icon" style={{ background: s.tint }}>
                {s.icon}
              </span>
              <div className="statsbar-copy">
                <span className="statsbar-value">{s.value}</span>
                <span className="statsbar-label">{s.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
