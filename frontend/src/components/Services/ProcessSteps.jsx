import './ProcessSteps.css'
import { processSteps } from '../../data/servicesData.js'

const ICONS = {
  enroll: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="10" cy="8" r="3.2" stroke="#2563EB" strokeWidth="1.9" />
      <path d="M4 19c.6-3 2.9-4.8 5.5-4.8" stroke="#2563EB" strokeWidth="1.9" strokeLinecap="round" />
      <path d="M16.5 13.5v6M13.5 16.5h6" stroke="#2563EB" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  ),
  learn: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 6.5c-1.8-1.6-4.2-2-8-2v13c3.8 0 6.2.4 8 2 1.8-1.6 4.2-2 8-2v-13c-3.8 0-6.2.4-8 2z" stroke="#22C55E" strokeWidth="1.9" strokeLinejoin="round" />
      <path d="M12 6.5v13" stroke="#22C55E" strokeWidth="1.9" />
    </svg>
  ),
  practice: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="4" width="16" height="16" rx="3" stroke="#8B5CF6" strokeWidth="1.9" />
      <path d="M9.5 9l-2.5 3 2.5 3M14.5 9l2.5 3-2.5 3" stroke="#8B5CF6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  certified: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="9" r="5.4" stroke="#F9B233" strokeWidth="1.9" />
      <circle cx="12" cy="9" r="2.2" fill="#F9B233" />
      <path d="M9.2 13.5L7.5 20.5l4.5-2.6 4.5 2.6-1.7-7" stroke="#F9B233" strokeWidth="1.9" strokeLinejoin="round" />
    </svg>
  ),
  careerstep: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="3.5" y="7.5" width="17" height="12" rx="2.5" stroke="#22C55E" strokeWidth="1.9" />
      <path d="M9 7.5V6a2 2 0 012-2h2a2 2 0 012 2v1.5" stroke="#22C55E" strokeWidth="1.9" />
      <path d="M3.5 12.5h17" stroke="#22C55E" strokeWidth="1.7" />
    </svg>
  ),
}

const TINT_CLASS = {
  blue: 'sprocess-blue',
  green: 'sprocess-green',
  purple: 'sprocess-purple',
  orange: 'sprocess-orange',
}

export default function ProcessSteps() {
  return (
    <section className="sprocess">
      <div className="container">
        <div className="sprocess-head">
          <span className="sprocess-badge">Our Process</span>
        </div>
        <div className="sprocess-track">
          {processSteps.map((s) => (
            <div className="sprocess-step" key={s.id}>
              <span className={`sprocess-icon ${TINT_CLASS[s.tint]}`}>{ICONS[s.icon]}</span>
              <span className="sprocess-stepno">{s.step}</span>
              <h3 className="sprocess-steptitle">{s.title}</h3>
              <p className="sprocess-steptext">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
