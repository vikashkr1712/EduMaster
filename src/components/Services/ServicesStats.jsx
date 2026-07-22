import './ServicesStats.css'
import { servicesStats } from '../../data/servicesData.js'

const ICONS = {
  students: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="10" cy="8" r="3.2" stroke="#2563EB" strokeWidth="1.9" />
      <path d="M4 19c.6-3 2.9-4.8 5.5-4.8" stroke="#2563EB" strokeWidth="1.9" strokeLinecap="round" />
      <path d="M16.5 13.5v6M13.5 16.5h6" stroke="#2563EB" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  ),
  courses: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 6.5c-1.8-1.6-4.2-2-8-2v13c3.8 0 6.2.4 8 2 1.8-1.6 4.2-2 8-2v-13c-3.8 0-6.2.4-8 2z" stroke="#22C55E" strokeWidth="1.9" strokeLinejoin="round" />
      <path d="M12 6.5v13" stroke="#22C55E" strokeWidth="1.9" />
    </svg>
  ),
  experts: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="8" r="3.2" stroke="#F97316" strokeWidth="1.9" />
      <path d="M3.5 19c.6-3 2.9-4.8 5.5-4.8s4.9 1.8 5.5 4.8" stroke="#F97316" strokeWidth="1.9" strokeLinecap="round" />
      <path d="M15.5 5.6a3.2 3.2 0 0 1 0 4.9M17.7 14.6c1.6.7 2.7 2.1 3 4.1" stroke="#F97316" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  ),
  certs: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M7 4h10v5.5c0 3.5-2.2 6-5 6s-5-2.5-5-6V4z" stroke="#8B5CF6" strokeWidth="1.9" strokeLinejoin="round" />
      <path d="M7 6H4.5v2A3.5 3.5 0 008 11.5M17 6h2.5v2A3.5 3.5 0 0116 11.5" stroke="#8B5CF6" strokeWidth="1.7" />
      <path d="M12 15.5V19M8.5 20.5h7" stroke="#8B5CF6" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  ),
  partners: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="3.5" y="6.5" width="17" height="13" rx="2.5" stroke="#EC4899" strokeWidth="1.9" />
      <circle cx="12" cy="12.5" r="3" stroke="#EC4899" strokeWidth="1.8" />
      <path d="M9 6.5l1-2h4l1 2" stroke="#EC4899" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  ),
}

export default function ServicesStats() {
  return (
    <section className="sstats">
      <div className="container">
        <div className="sstats-card">
          {servicesStats.map((s) => (
            <div className="sstats-item" key={s.key}>
              <span className={`sstats-icon sstats-${s.tint}`}>{ICONS[s.icon]}</span>
              <div className="sstats-copy">
                <span className="sstats-value">{s.value}</span>
                <span className="sstats-label">{s.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
