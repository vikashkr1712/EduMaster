import { useRef, useState } from 'react'
import { useAuth } from '../Auth/AuthProvider.jsx'
import { useNotifications } from '../Notifications/NotificationProvider.jsx'
import { useAvatar, AVATAR_ALLOWED_TYPES, AVATAR_MAX_BYTES } from './AvatarProvider.jsx'
import ProfileAvatar from './ProfileAvatar.jsx'

const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' }

function PinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" {...stroke}>
      <path d="M12 21s-6.5-5.4-6.5-10.5a6.5 6.5 0 0 1 13 0C18.5 15.6 12 21 12 21Z" />
      <circle cx="12" cy="10.3" r="2.3" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" {...stroke}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" />
    </svg>
  )
}

function PencilIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16.5 4.5a2.2 2.2 0 0 1 3 3L8 19l-4 1 1-4Z" />
    </svg>
  )
}

function formatJoinedDate(createdAt) {
  const date = createdAt ? new Date(createdAt) : null
  if (!date || Number.isNaN(date.getTime())) return 'Joined —'
  return `Joined ${new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric' }).format(date)}`
}

export default function ProfileHero() {
  const { user } = useAuth()
  const { avatar, fallbackAvatar, saveAvatar } = useAvatar()
  const { success, error } = useNotifications()
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)

  const onFileSelected = (e) => {
    const file = e.target.files?.[0]
    e.target.value = '' // allow picking the same file again later
    if (!file) return

    if (!AVATAR_ALLOWED_TYPES.includes(file.type)) {
      error('Unsupported file type. Please choose a PNG, JPG or WebP image.')
      return
    }
    if (file.size > AVATAR_MAX_BYTES) {
      error('Image is too large. Maximum size is 2 MB.')
      return
    }

    setUploading(true)
    const reader = new FileReader()
    reader.onload = async () => {
      try {
        await saveAvatar(reader.result)
        success('Profile photo updated.')
      } catch (err) {
        error(err.message || 'Could not save your photo. Please try again.')
      } finally {
        setUploading(false)
      }
    }
    reader.onerror = () => {
      setUploading(false)
      error('Could not read that file. Please try another image.')
    }
    reader.readAsDataURL(file)
  }

  return (
    <section className="profile-hero">
      <div className="profile-hero-main">
        <div className="profile-hero-avatar-wrap">
          <ProfileAvatar className="profile-hero-avatar" src={avatar} defaultSrc={fallbackAvatar} />
          <input
            ref={inputRef}
            type="file"
            accept={AVATAR_ALLOWED_TYPES.join(',')}
            hidden
            onChange={onFileSelected}
          />
          <button
            type="button"
            className="profile-hero-edit"
            aria-label="Change profile picture"
            aria-busy={uploading}
            title={uploading ? 'Uploading profile picture…' : 'Change profile picture'}
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            <PencilIcon />
          </button>
        </div>

        <div className="profile-hero-info">
          <h2 className="profile-hero-name">{user?.name || 'Learner'}</h2>
          <p className="profile-hero-email">{user?.email || ''}</p>
          <div className="profile-hero-facts">
            <span className="profile-hero-fact">
              <PinIcon /> {user?.location || 'Location not added'}
            </span>
            <span className="profile-hero-fact">
              <CalendarIcon /> {formatJoinedDate(user?.createdAt)}
            </span>
          </div>
          <p className="profile-hero-bio">{user?.bio || 'Add a short bio in Settings to personalize your learning profile.'}</p>
        </div>
      </div>

    </section>
  )
}
