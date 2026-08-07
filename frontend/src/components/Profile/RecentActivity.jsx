import SectionCard from './SectionCard.jsx'
import { useNotifications } from '../Notifications/NotificationProvider.jsx'
import { PROFILE_ACTIVITY } from './profileData.js'

const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' }

const ICONS = {
  play: {
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
  star: {
    tint: 'orange',
    svg: (
      <svg width="20" height="20" viewBox="0 0 24 24" {...stroke}>
        <path d="m12 4 2.3 4.9 5.2.7-3.8 3.7.9 5.2L12 16l-4.6 2.5.9-5.2-3.8-3.7 5.2-.7Z" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
}

export default function RecentActivity() {
  const { info } = useNotifications()

  return (
    <SectionCard
      title="Recent Activity"
      linkLabel="View All Activity"
      onLinkClick={() => info('Full activity history is coming soon.')}
    >
      <ul className="profile-activity-list">
        {PROFILE_ACTIVITY.map(({ id, type, text, time }) => (
          <li key={id} className="profile-activity-item">
            <span className={`profile-tile profile-tile--sm profile-tile--${ICONS[type].tint}`}>
              {ICONS[type].svg}
            </span>
            <p className="profile-activity-text">{text}</p>
            <span className="profile-activity-time">{time}</span>
          </li>
        ))}
      </ul>
    </SectionCard>
  )
}
