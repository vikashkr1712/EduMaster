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
  completed: (
    <svg width="24" height="24" viewBox="0 0 24 24" {...stroke}>
      <circle cx="12" cy="12" r="8.5" /><path d="m8.2 12.2 2.4 2.5 5.2-5.3" />
    </svg>
  ),
  achievements: (
    <svg width="24" height="24" viewBox="0 0 24 24" {...stroke}>
      <path d="M8 4h8v5a4 4 0 0 1-8 0V4Z"/><path d="M8 6H5v2a4 4 0 0 0 4 4m7-6h3v2a4 4 0 0 1-4 4M12 13v4m-3 3h6"/>
    </svg>
  ),
  hours: (
    <svg width="24" height="24" viewBox="0 0 24 24" {...stroke}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  ),
  'quiz-attempts': <svg width="24" height="24" viewBox="0 0 24 24" {...stroke}><path d="M6 3.5h12v17H6zM9 8h6m-6 4h6m-6 4h3"/></svg>,
  'quiz-average': <svg width="24" height="24" viewBox="0 0 24 24" {...stroke}><circle cx="12" cy="12" r="8.5"/><path d="M8.5 15.5 15.5 8.5M9 9h.01M15 15h.01"/></svg>,
  'quiz-passed': <svg width="24" height="24" viewBox="0 0 24 24" {...stroke}><path d="M5 12.5 9.2 17 19 7"/></svg>,
  'quiz-best': <svg width="24" height="24" viewBox="0 0 24 24" {...stroke}><path d="m12 3 2.5 5.2 5.7.8-4.1 4 1 5.7-5.1-2.7-5.1 2.7 1-5.7-4.1-4 5.7-.8Z"/></svg>,
  assignments: <svg width="24" height="24" viewBox="0 0 24 24" {...stroke}><path d="M7 3.5h10v17H7zM10 8h4m-4 4h4m-4 4h2"/></svg>,
  discussions: <svg width="24" height="24" viewBox="0 0 24 24" {...stroke}><path d="M4 5h16v11H9l-5 4V5Z"/></svg>,
  notes: <svg width="24" height="24" viewBox="0 0 24 24" {...stroke}><path d="M6 3.5h12v17H6zM9 8h6m-6 4h6m-6 4h4"/></svg>,
  downloads: <svg width="24" height="24" viewBox="0 0 24 24" {...stroke}><path d="M12 4v11m0 0 4-4m-4 4-4-4M5 20h14"/></svg>,
}

export default function StatsCard({ id, value, label, tint, suffix = '' }) {
  return (
    <div className="profile-stat-card">
      <span className={`profile-tile profile-tile--${tint}`}>{ICONS[id]}</span>
      <p className="profile-stat-value">{value}{suffix}</p>
      <p className="profile-stat-label">{label}</p>
    </div>
  )
}
