import { Link } from 'react-router-dom'
import { useAuth } from '../Auth/AuthProvider.jsx'

const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' }

const ITEM_ICONS = {
  picture: (
    <svg width="16" height="16" viewBox="0 0 24 24" {...stroke}>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M5 20c.8-3.6 3.6-5.4 7-5.4s6.2 1.8 7 5.4" />
    </svg>
  ),
  bio: (
    <svg width="16" height="16" viewBox="0 0 24 24" {...stroke}>
      <path d="M16.5 4.5a2.2 2.2 0 0 1 3 3L8 19l-4 1 1-4Z" />
    </svg>
  ),
  location: (
    <svg width="16" height="16" viewBox="0 0 24 24" {...stroke}>
      <path d="M12 21s-6.5-5.4-6.5-10.5a6.5 6.5 0 0 1 13 0C18.5 15.6 12 21 12 21Z" />
      <circle cx="12" cy="10.3" r="2.3" />
    </svg>
  ),
  education: (
    <svg width="16" height="16" viewBox="0 0 24 24" {...stroke}>
      <path d="m2.5 9 9.5-4.5L21.5 9 12 13.5Z" />
      <path d="M6.5 11.5v4.6c0 1.3 2.5 2.9 5.5 2.9s5.5-1.6 5.5-2.9v-4.6" />
    </svg>
  ),
  social: (
    <svg width="16" height="16" viewBox="0 0 24 24" {...stroke}>
      <circle cx="6" cy="12" r="2.6" />
      <circle cx="17.5" cy="6" r="2.6" />
      <circle cx="17.5" cy="18" r="2.6" />
      <path d="m8.4 10.8 6.8-3.6M8.4 13.2l6.8 3.6" />
    </svg>
  ),
}

function CheckCircle({ done }) {
  return done ? (
    <svg className="profile-completion-state is-done" width="21" height="21" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#22c55e" />
      <path d="m8 12.2 2.7 2.7L16.3 9.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg className="profile-completion-state" width="21" height="21" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="#c9d6ee" strokeWidth="2" strokeDasharray="4 3" />
    </svg>
  )
}

export default function ProfileCompletion() {
  const { user } = useAuth()
  const completionItems = [
    { id: 'picture', label: 'Add Profile Picture', done: Boolean(user?.avatar) },
    { id: 'bio', label: 'Add Bio', done: Boolean(user?.bio?.trim()) },
    { id: 'location', label: 'Add Location', done: Boolean(user?.location?.trim()) },
    { id: 'education', label: 'Add Education', done: false },
    { id: 'social', label: 'Add Social Links', done: false },
  ]

  return (
    <section className="profile-section-card">
      <div className="profile-section-head profile-section-head--stacked">
        <h3 className="profile-section-title">Profile Completion</h3>
        <p className="profile-section-subtitle">
          Complete your profile to get personalized recommendations.
        </p>
      </div>

      <ul className="profile-completion-list">
        {completionItems.map(({ id, label, done }) => (
          <li key={id} className="profile-completion-item">
            <span className="profile-completion-icon">{ITEM_ICONS[id]}</span>
            <p className="profile-completion-label">{label}</p>
            <CheckCircle done={done} />
          </li>
        ))}
      </ul>

      <Link to="/profile/settings" className="profile-completion-btn profile-completion-btn--link">
        Complete Profile
      </Link>
    </section>
  )
}
