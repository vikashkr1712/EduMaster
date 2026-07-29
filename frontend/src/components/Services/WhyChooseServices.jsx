import './WhyChooseServices.css'
import ServicesStudentSvg from '../../assets/svg/services/ServicesStudentSvg.jsx'
import { whyChooseFeatures } from '../../data/servicesData.js'

const ICONS = {
  mentor: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="3.4" fill="#fff" />
      <path d="M5.5 19.5c.8-3.6 3.4-5.7 6.5-5.7s5.7 2.1 6.5 5.7" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  projects: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M8.5 8l-4 4 4 4M15.5 8l4 4-4 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.2 6.5l-2.4 11" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  skills: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="8" width="16" height="11" rx="2.5" stroke="#fff" strokeWidth="2" />
      <path d="M9 8V6.5A2.5 2.5 0 0111.5 4h1A2.5 2.5 0 0115 6.5V8" stroke="#fff" strokeWidth="2" />
      <path d="M4 13h16" stroke="#fff" strokeWidth="2" />
    </svg>
  ),
  flexible: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8.4" stroke="#fff" strokeWidth="2" />
      <path d="M12 7.5V12l3.2 2.4" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  support: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M5 13v-1.5A7 7 0 0112 4.5v0a7 7 0 017 7V13" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      <rect x="3.5" y="12.5" width="4" height="6.5" rx="2" fill="#fff" />
      <rect x="16.5" y="12.5" width="4" height="6.5" rx="2" fill="#fff" />
    </svg>
  ),
  certificates: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8.4" stroke="#fff" strokeWidth="2" />
      <path d="M8.5 12.2l2.4 2.4 4.6-4.9" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
}

const TINT_BG = {
  blue: 'var(--blue)',
  green: 'var(--green)',
  purple: 'var(--purple)',
  orange: 'var(--yellow)',
}

export default function WhyChooseServices() {
  return (
    <section className="swhy">
      <div className="container swhy-inner">
        <div className="swhy-illustration">
          <ServicesStudentSvg />
        </div>

        <div className="swhy-content">
          <span className="swhy-badge">Why Choose Our Services</span>
          <h2 className="swhy-title">
            Why Thousands Choose <span>EduMaster</span>
          </h2>

          <div className="swhy-grid">
            {whyChooseFeatures.map((f) => (
              <div className="swhy-item" key={f.id}>
                <span className="swhy-item-icon" style={{ background: TINT_BG[f.tint] }}>
                  {ICONS[f.icon]}
                </span>
                <div>
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
