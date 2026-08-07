const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' }

const ICONS = {
  courses: (
    <svg width="24" height="24" viewBox="0 0 24 24" {...stroke}>
      <path d="M12 6.5c-1.8-1.6-4.4-2-8-2v13c3.6 0 6.2.4 8 2 1.8-1.6 4.4-2 8-2v-13c-3.6 0-6.2.4-8 2Zm0 0v13" />
    </svg>
  ),
  certificates: (
    <svg width="24" height="24" viewBox="0 0 24 24" {...stroke}>
      <rect x="3.5" y="4.5" width="17" height="13" rx="2" />
      <circle cx="12" cy="10" r="2.4" />
      <path d="M10.3 12.2 9 17.5l3-1.6 3 1.6-1.3-5.3" />
    </svg>
  ),
  hours: (
    <svg width="24" height="24" viewBox="0 0 24 24" {...stroke}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  ),
}

export default function StatsCard({ id, value, label, tint }) {
  return (
    <div className="profile-stat-card">
      <span className={`profile-tile profile-tile--${tint}`}>{ICONS[id]}</span>
      <p className="profile-stat-value">{value}</p>
      <p className="profile-stat-label">{label}</p>
    </div>
  )
}
