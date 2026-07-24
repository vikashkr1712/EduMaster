import './AuthLeftPanel.css'
import './AuthMotion.css'
import { Link } from 'react-router-dom'
import { AuthTileIcon } from './AuthIcons.jsx'
import { authStats } from '../../data/authData.js'
import { CountUp } from '../Home/motion.jsx'

function LogoMark() {
  return (
    <svg width="46" height="46" viewBox="0 0 46 46" fill="none">
      {/* stacked layers graduation mark */}
      <path d="M23 6 L41 14 L23 22 L5 14 Z" fill="#1B2B4B" />
      <path d="M23 17 L37 23 L23 29 L9 23 Z" fill="#F9B233" />
      <path d="M23 26 L34 30.5 L23 35 L12 30.5 Z" fill="#2563EB" />
      <path d="M39 15 v9" stroke="#F9B233" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="39" cy="26" r="2.4" fill="#F9B233" />
    </svg>
  )
}

export default function AuthLeftPanel({ badge, title, description, features, illustration }) {
  return (
    <section className="authpanel">
      <Link to="/" className="authpanel-brand" aria-label="EduMaster home">
        <LogoMark />
        <span className="authpanel-brand-text">
          <span className="authpanel-brand-name">
            Edu<span>Master</span>
          </span>
          <span className="authpanel-brand-tag">Learn. Grow. Succeed.</span>
        </span>
      </Link>

      <div className="authpanel-main">
        <div className="authpanel-content">
          <span className="authpanel-badge">{badge}</span>

          <h1 className="authpanel-title">{title}</h1>

          <p className="authpanel-text">{description}</p>

          <ul className="authpanel-features">
            {features.map((feature) => (
              <li key={feature.id} className="authpanel-feature">
                <span className={`authpanel-feature-icon tint-${feature.tint}`}>
                  <AuthTileIcon name={feature.icon} />
                </span>
                <span className="authpanel-feature-body">
                  <span className="authpanel-feature-title">{feature.title}</span>
                  <span className="authpanel-feature-text">{feature.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="authpanel-illustration">{illustration}</div>
      </div>

      <div className="authpanel-stats">
        {authStats.map((stat) => (
          <div key={stat.id} className="authpanel-stat">
            <span className={`authpanel-stat-icon tint-${stat.tint}`}>
              <AuthTileIcon name={stat.icon} />
            </span>
            <span className="authpanel-stat-value"><CountUp value={stat.value} /></span>
            <span className="authpanel-stat-label">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
