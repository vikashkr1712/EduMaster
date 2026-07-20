import './WhyChoose.css'
import WhyChooseIllustration from '../../../assets/svg/home/WhyChooseIllustration.jsx'

function StarBadgeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2.5l2.9 5.9 6.6 1-4.7 4.6 1.1 6.5L12 17.4l-5.9 3.1 1.1-6.5L2.5 9.4l6.6-1L12 2.5z"
        fill="#F9B233"
      />
    </svg>
  )
}

function BookIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5v-17z" fill="#2563EB" />
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20v3H6.5" fill="#1D4ED8" />
      <rect x="8" y="6" width="8" height="2" rx="1" fill="#fff" opacity="0.85" />
    </svg>
  )
}

function PlaySquareIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="4" fill="#22C55E" />
      <path d="M10 8.5l6 3.5-6 3.5v-7z" fill="#fff" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9.5" stroke="#F97316" strokeWidth="2.2" />
      <path d="M12 7v5l3.5 2" stroke="#F97316" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}

function MedalIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="9" r="5.6" fill="#8B5CF6" />
      <circle cx="12" cy="9" r="3" fill="#C4B5FD" />
      <path d="M9 13.5L7 21l5-3 5 3-2-7.5" fill="#8B5CF6" />
    </svg>
  )
}

function ChartIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="12" width="4" height="8" rx="1.5" fill="#EC4899" />
      <rect x="10" y="8" width="4" height="12" rx="1.5" fill="#EC4899" opacity="0.75" />
      <rect x="16" y="4" width="4" height="16" rx="1.5" fill="#EC4899" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2l8 3v6c0 5-3.4 9.4-8 11-4.6-1.6-8-6-8-11V5l8-3z"
        stroke="#2563EB"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M8.5 12l2.5 2.5 4.5-5" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const features = [
  {
    icon: <BookIcon />,
    tint: 'var(--tint-blue)',
    title: 'Expert Instructors',
    text: 'Learn from industry experts with real-world experience.',
  },
  {
    icon: <PlaySquareIcon />,
    tint: 'var(--tint-green)',
    title: 'High Quality Content',
    text: 'Well-structured courses designed for real learning.',
  },
  {
    icon: <ClockIcon />,
    tint: 'var(--tint-orange)',
    title: 'Learn at Your Pace',
    text: 'Access content anytime, anywhere and learn at your own speed.',
  },
  {
    icon: <MedalIcon />,
    tint: 'var(--tint-purple)',
    title: 'Certified Learning',
    text: 'Earn industry-recognized certificates to boost your career.',
  },
  {
    icon: <ChartIcon />,
    tint: 'var(--tint-pink)',
    title: 'Track Your Progress',
    text: 'Monitor your learning progress with detailed insights.',
  },
  {
    icon: <ShieldIcon />,
    tint: 'var(--tint-blue)',
    title: 'Secure & Reliable',
    text: 'Your data and privacy are safe with us.',
  },
]

export default function WhyChoose() {
  return (
    <section className="whychoose">
      <div className="container whychoose-inner">
        <div className="whychoose-content">
          <span className="section-badge whychoose-badge">
            <StarBadgeIcon /> Why Choose Us
          </span>
          <h2 className="whychoose-title">
            The Better Way
            <br />
            to <span>Learn Online</span>
          </h2>
          <p className="whychoose-text">
            We combine quality content, expert instruction, and flexible learning to help you
            achieve your goals.
          </p>

          <div className="whychoose-grid">
            {features.map((f) => (
              <div className="wc-feature" key={f.title}>
                <span className="wc-feature-icon" style={{ background: f.tint }}>
                  {f.icon}
                </span>
                <div>
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="whychoose-illustration">
          <WhyChooseIllustration className="whychoose-illustration-svg" />
        </div>
      </div>
    </section>
  )
}
