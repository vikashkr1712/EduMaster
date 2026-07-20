import './FeaturesSection.css'
import { programFeatures } from '../../data/programsData.js'

function GradCapIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path d="M12 4l10 4-10 4L2 8l10-4z" fill="#2563EB" />
      <path d="M6 10.5V15c3.5 2.4 8.5 2.4 12 0v-4.5l-6 2.4-6-2.4z" fill="#2563EB" opacity="0.75" />
      <path d="M21 9v5" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function HandsOnIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="8" r="3.2" stroke="#22C55E" strokeWidth="1.9" />
      <path
        d="M3.5 19c.6-3 2.9-4.8 5.5-4.8s4.9 1.8 5.5 4.8"
        stroke="#22C55E"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <path
        d="M15.5 5.6a3.2 3.2 0 0 1 0 4.9M17.7 14.6c1.6.7 2.7 2.1 3 4.1"
        stroke="#22C55E"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  )
}

function CareerIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path d="M12 4l10 4-10 4L2 8l10-4z" fill="#F97316" />
      <path d="M6 10.5V15c3.5 2.4 8.5 2.4 12 0v-4.5l-6 2.4-6-2.4z" fill="#FDBA74" />
      <path d="M21 9v5" stroke="#F97316" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function FlexibleIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="13" width="3.4" height="7" rx="1.2" fill="#8B5CF6" />
      <rect x="10.3" y="9" width="3.4" height="11" rx="1.2" fill="#8B5CF6" />
      <rect x="16.6" y="5" width="3.4" height="15" rx="1.2" fill="#8B5CF6" />
      <circle cx="19" cy="4" r="1.6" fill="#C4B5FD" />
    </svg>
  )
}

const ICONS = {
  industry: <GradCapIcon />,
  handson: <HandsOnIcon />,
  career: <CareerIcon />,
  flexible: <FlexibleIcon />,
}

export default function FeaturesSection() {
  return (
    <section className="programs-features">
      <div className="container">
        <div className="programs-features-card">
          {programFeatures.map((f) => (
            <div className="programs-feature-item" key={f.key}>
              <span className="programs-feature-icon" style={{ background: f.tint }}>
                {ICONS[f.key]}
              </span>
              <div className="programs-feature-copy">
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
