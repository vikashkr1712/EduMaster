import './Features.css'

function ShieldCheckIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path d="M12 2l8 3v6c0 5-3.4 9.4-8 11-4.6-1.6-8-6-8-11V5l8-3z" fill="#22C55E" />
      <path
        d="M8.5 12l2.5 2.5 4.5-5"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9.5" stroke="#2563EB" strokeWidth="2.2" />
      <path d="M12 7v5l3.5 2" stroke="#2563EB" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}

function MedalIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="9" r="5.6" fill="#F97316" />
      <circle cx="12" cy="9" r="3" fill="#FDBA74" />
      <path d="M9 13.5L7 21l5-3 5 3-2-7.5" fill="#F97316" />
    </svg>
  )
}

function StarIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2.5l2.9 5.9 6.6 1-4.7 4.6 1.1 6.5L12 17.4l-5.9 3.1 1.1-6.5L2.5 9.4l6.6-1L12 2.5z"
        stroke="#8B5CF6"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const features = [
  {
    icon: <ShieldCheckIcon />,
    tint: 'var(--tint-green)',
    title: 'Quality Content',
    text: 'Curated by industry experts and professionals',
  },
  {
    icon: <ClockIcon />,
    tint: 'var(--tint-blue)',
    title: 'Flexible Learning',
    text: 'Learn anytime, anywhere at your convenience',
  },
  {
    icon: <MedalIcon />,
    tint: 'var(--tint-orange)',
    title: 'Certified Courses',
    text: 'Earn certificates and boost your career',
  },
  {
    icon: <StarIcon />,
    tint: 'var(--tint-purple)',
    title: 'Career Support',
    text: 'Get career guidance and job placement support',
  },
]

export default function Features() {
  return (
    <section className="features">
      <div className="container">
        <div className="features-card">
          {features.map((f) => (
            <div className="feature-item" key={f.title}>
              <span className="feature-icon" style={{ background: f.tint }}>
                {f.icon}
              </span>
              <div className="feature-copy">
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
