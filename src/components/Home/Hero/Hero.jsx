import './Hero.css'
import HeroIllustration from '../../../assets/svg/home/HeroIllustration.jsx'

function RocketIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2c4 2 7 6 7 11l-3.5-1.5L12 16l-3.5-4.5L5 13c0-5 3-9 7-11z"
        fill="#F97316"
      />
      <path d="M9 17l-2 5 4-2.5L15 22l-2-5" fill="#F9B233" />
    </svg>
  )
}

function BookIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5v-17z"
        fill="#2563EB"
      />
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20v3H6.5" fill="#1D4ED8" />
      <rect x="8" y="6" width="8" height="2" rx="1" fill="#fff" opacity="0.85" />
    </svg>
  )
}

function StudentsIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="8" r="3.4" fill="#22C55E" />
      <path d="M3 19c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5v1H3v-1z" fill="#22C55E" />
      <circle cx="16.5" cy="8.5" r="2.8" fill="#4ADE80" />
      <path d="M15 13.7c2.9.3 5.5 2.3 5.5 5.3v1h-4" fill="#4ADE80" />
    </svg>
  )
}

function CertIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="9" r="5.5" fill="#8B5CF6" />
      <circle cx="12" cy="9" r="3" fill="#C4B5FD" />
      <path d="M9 13.5 7 21l5-3 5 3-2-7.5" fill="#8B5CF6" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="#F97316" strokeWidth="2.4" />
      <path d="M10 8.5l6 3.5-6 3.5v-7z" fill="#F97316" />
    </svg>
  )
}

const stats = [
  { icon: <BookIcon />, tint: 'var(--tint-blue)', top: '10,000+', bottom: 'Courses' },
  { icon: <StudentsIcon />, tint: 'var(--tint-green)', top: '5M+', bottom: 'Students' },
  { icon: <CertIcon />, tint: 'var(--tint-purple)', top: '50,000+', bottom: 'Certifications' },
  { icon: <PlayIcon />, tint: 'var(--tint-orange)', top: 'Learn at Your', bottom: 'Own Pace' },
]

export default function Hero() {
  return (
    <section className="hero">
      <div className="container hero-inner">
        <div className="hero-content">
          <span className="hero-badge">
            <RocketIcon /> Learn From Anywhere, Anytime
          </span>

          <h1 className="hero-title">
            Unlock Your Potential
            <br />
            With <span>Quality Education</span>
          </h1>

          <p className="hero-text">
            Discover industry-leading courses taught by experts and gain skills that help you grow
            your career.
          </p>

          <div className="hero-stats">
            {stats.map((s) => (
              <div className="hero-stat" key={s.bottom}>
                <span className="hero-stat-icon" style={{ background: s.tint }}>
                  {s.icon}
                </span>
                <span className="hero-stat-top">{s.top}</span>
                <span className="hero-stat-bottom">{s.bottom}</span>
              </div>
            ))}
          </div>

          <div className="hero-actions">
            <button className="btn-explore">
              Explore Courses
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 12h16m0 0l-6-6m6 6l-6 6"
                  stroke="#fff"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button className="btn-demo">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#1B2B4B" />
                <path d="M10 8.5l5.5 3.5-5.5 3.5v-7z" fill="#fff" />
              </svg>
              Watch Demo
            </button>
          </div>
        </div>

        <div className="hero-illustration">
          <HeroIllustration className="hero-illustration-svg" />
        </div>
      </div>
    </section>
  )
}
