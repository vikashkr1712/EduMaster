import SectionCard from './SectionCard.jsx'

const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' }

const ICONS = {
  course: {
    tint: 'blue',
    svg: (
      <svg width="20" height="20" viewBox="0 0 24 24" {...stroke}>
        <circle cx="12" cy="12" r="8.5" />
        <path d="m10 8.8 5 3.2-5 3.2Z" fill="currentColor" />
      </svg>
    ),
  },
  certificate: {
    tint: 'green',
    svg: (
      <svg width="20" height="20" viewBox="0 0 24 24" {...stroke}>
        <rect x="3.5" y="4.5" width="17" height="13" rx="2" />
        <circle cx="12" cy="10" r="2.4" />
        <path d="M10.3 12.2 9 17.5l3-1.6 3 1.6-1.3-5.3" />
      </svg>
    ),
  },
  quiz: {
    tint: 'orange',
    svg: (
      <svg width="20" height="20" viewBox="0 0 24 24" {...stroke}>
        <path d="m12 4 2.3 4.9 5.2.7-3.8 3.7.9 5.2L12 16l-4.6 2.5.9-5.2-3.8-3.7 5.2-.7Z" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  order: { tint: 'green', svg: <span aria-hidden="true">₹</span> },
  assignment: { tint: 'orange', svg: <span aria-hidden="true">✓</span> },
  discussion: { tint: 'blue', svg: <span aria-hidden="true">?</span> },
  note: { tint: 'purple', svg: <span aria-hidden="true">✎</span> },
  download: { tint: 'green', svg: <span aria-hidden="true">↓</span> },
  account: { tint: 'blue', svg: <span aria-hidden="true">✓</span> },
}

function relativeTime(value) {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 1000))
  if (seconds < 60) return 'Just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short' }).format(new Date(value))
}

export default function RecentActivity({ activities = [], loading = false }) {

  return (
    <SectionCard
      title="Recent Activity"
    >
      <ul className="profile-activity-list">
        {loading && [...Array(3)].map((_, index) => <li key={index} className="profile-activity-skeleton" />)}
        {!loading && activities.map((activity) => {
          const icon = ICONS[activity.type] || ICONS.course
          return (
          <li key={activity._id} className="profile-activity-item">
            <span className={`profile-tile profile-tile--sm profile-tile--${icon.tint}`}>
              {icon.svg}
            </span>
            <p className="profile-activity-text"><strong>{activity.title}</strong><span>{activity.message}</span></p>
            <span className="profile-activity-time">{relativeTime(activity.createdAt)}</span>
          </li>
          )
        })}
        {!loading && activities.length === 0 && <li className="profile-api-empty">Your course activity will appear here.</li>}
      </ul>
    </SectionCard>
  )
}
