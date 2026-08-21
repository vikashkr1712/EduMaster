import { useAuth } from '../Auth/AuthProvider.jsx'
import { useAvatar } from '../Profile/AvatarProvider.jsx'
import ProfileAvatar from '../Profile/ProfileAvatar.jsx'

export default function ProfileSummary() {
  const { user } = useAuth()
  const { avatar, fallbackAvatar } = useAvatar()

  return (
    <div className="dash-profile-summary">
      <ProfileAvatar className="dash-profile-avatar" src={avatar} defaultSrc={fallbackAvatar} />
      <div className="dash-profile-meta">
        <p className="dash-profile-name">{user?.name || 'Learner'}</p>
        <p className="dash-profile-email">{user?.email || ''}</p>
      </div>
    </div>
  )
}
