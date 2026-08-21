import { useEffect, useState } from 'react'

const getAvatarSource = (user) => {
  const source = user?.avatar || user?.avatarUrl || user?.profileImage || user?.image || user?.photo || ''
  if (!source || /^data:|^blob:|^https?:\/\//i.test(source)) return source
  const apiOrigin = import.meta.env.VITE_API_URL?.replace(/\/api\/v1\/?$/, '')
  if (!apiOrigin || !source.startsWith('/')) return source
  try { return new URL(source, `${apiOrigin}/`).toString() } catch { return source }
}

function UserFallback() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="24" r="11" fill="currentColor" opacity=".92" />
      <path d="M13.5 53.5c1.8-11 8.7-17 18.5-17s16.7 6 18.5 17" fill="currentColor" opacity=".92" />
      <path d="M8 32a24 24 0 1 1 48 0 24 24 0 0 1-48 0Z" fill="none" stroke="currentColor" strokeWidth="2.5" opacity=".24" />
    </svg>
  )
}

export default function AdminAvatar({ user, size = 'medium', className = '' }) {
  const [imageFailed, setImageFailed] = useState(false)
  const source = getAvatarSource(user)

  useEffect(() => setImageFailed(false), [source])

  if (source && !imageFailed) {
    return (
      <img
        className={`admin-avatar admin-avatar--${size} ${className}`.trim()}
        src={source}
        alt={`${user.name || 'Admin'} avatar`}
        onError={() => setImageFailed(true)}
      />
    )
  }

  return (
    <span
      className={`admin-avatar admin-avatar--${size} admin-avatar--fallback ${className}`.trim()}
      role="img"
      aria-label={`${user?.name || 'Admin'} avatar`}
    >
      <UserFallback />
    </span>
  )
}
