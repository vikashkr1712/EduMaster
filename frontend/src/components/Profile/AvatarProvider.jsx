import { createContext, useCallback, useContext, useMemo } from 'react'
import { useAuth } from '../Auth/AuthProvider.jsx'
import defaultAvatar from '../../profile_img/man_img.png'
import { uploadAvatar } from '../../api/user.js'

// Single source of truth for the profile picture, used by the navbar,
// profile dropdown, dashboard sidebar and profile hero. The saved avatar is
// always read from AuthProvider's database-backed user record.

const AvatarContext = createContext(null)

const DEFAULT_AVATAR = defaultAvatar

// Diagnostic for the default image path during development. Vite resolves this
// import to a browser URL (never an undefined value).
if (import.meta.env.DEV) console.log('Default avatar URL:', defaultAvatar)

export const AVATAR_ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp']
export const AVATAR_MAX_BYTES = 2 * 1024 * 1024 // 2 MB

const absoluteAvatarUrl = (avatar) => {
  if (!avatar || /^data:|^https?:\/\//i.test(avatar)) return avatar
  const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/api\/v1\/?$/, '')
  // Avatar paths returned by MongoDB are backend-relative (/uploads/...).
  // Resolve them against the configured API origin rather than the Vite
  // origin, which would otherwise produce a 404 in development.
  if (!apiUrl) return avatar
  return new URL(avatar, `${apiUrl}/`).toString()
}

export function AvatarProvider({ children }) {
  const { user, updateUser } = useAuth()

  const saveAvatar = useCallback(async (dataUrl) => {
    if (!user) {
      throw new Error('You must be signed in to update your photo.')
    }

    // Optimistic update provides an immediate preview while the upload is in
    // progress; the server response then replaces it with the persisted path.
    const previousAvatar = user.avatar
    updateUser({ avatar: dataUrl })
    try {
      const response = await uploadAvatar(dataUrl)
      const savedUser = response?.data?.user ?? response?.user
      if (!savedUser) throw new Error('The server did not return the updated user.')
      updateUser(savedUser)
    } catch (error) {
      updateUser({ avatar: previousAvatar })
      throw error
    }
  }, [updateUser, user])

  const value = useMemo(() => ({
    avatar: absoluteAvatarUrl(user?.avatar) || DEFAULT_AVATAR,
    fallbackAvatar: DEFAULT_AVATAR,
    hasCustomAvatar: Boolean(user?.avatar),
    saveAvatar,
  }), [saveAvatar, user?.avatar])

  return <AvatarContext.Provider value={value}>{children}</AvatarContext.Provider>
}

export function useAvatar() {
  const avatar = useContext(AvatarContext)
  if (!avatar) {
    throw new Error('useAvatar must be used within an AvatarProvider')
  }
  return avatar
}
