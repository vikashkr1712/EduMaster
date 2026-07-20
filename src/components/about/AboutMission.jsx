import { missionCards } from '../../data/aboutData.js'

function TargetIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="13" r="8" stroke="#2563EB" strokeWidth="2" />
      <circle cx="11" cy="13" r="4" stroke="#2563EB" strokeWidth="2" />
      <circle cx="11" cy="13" r="1.4" fill="#2563EB" />
      <path
        d="M11 13l7.5-7.5M18.5 2.5v3h3"
        stroke="#2563EB"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function EyeIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path
        d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12z"
        fill="#22C55E"
      />
      <circle cx="12" cy="12" r="3.1" fill="#fff" />
      <circle cx="12" cy="12" r="1.5" fill="#22C55E" />
    </svg>
  )
}

function DiamondIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path d="M7 4h10l4 6-9 11L3 10l4-6z" fill="#F9B233" />
      <path d="M3 10h18M12 21L8.5 10 12 4l3.5 6L12 21" stroke="#fff" strokeWidth="1.4" />
    </svg>
  )
}

function PeopleIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <circle cx="9.5" cy="8.5" r="3.4" fill="#8B5CF6" />
      <path d="M3.5 19c0-3.2 2.7-5.3 6-5.3s6 2.1 6 5.3v.8h-12v-.8z" fill="#8B5CF6" />
      <circle cx="16.8" cy="9" r="2.7" fill="#C4B5FD" />
      <path d="M15.6 14c2.8.4 5 2.3 5 5v.8h-3.4" fill="#C4B5FD" />
    </svg>
  )
}

const icons = {
  mission: <TargetIcon />,
  vision: <EyeIcon />,
  values: <DiamondIcon />,
  commitment: <PeopleIcon />,
}

export default function AboutMission() {
  return (
    <section className="amission">
      <div className="container">
        <div className="amission-card">
          {missionCards.map((card, i) => (
            <div className={`amission-item${i > 0 ? ' has-divider' : ''}`} key={card.key}>
              <span className="amission-icon" style={{ background: card.tint }}>
                {icons[card.key]}
              </span>
              <div className="amission-copy">
                <h3>{card.title}</h3>
                {card.lines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
