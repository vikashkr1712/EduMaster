import { useEffect, useRef, useState } from 'react'
import { changePassword, updateProfile } from '../../api/user.js'
import AdminAvatar from '../../components/Admin/AdminAvatar.jsx'
import AdminIcon from '../../components/Admin/AdminIcons.jsx'
import { useAuth } from '../../components/Auth/AuthProvider.jsx'
import { useNotifications } from '../../components/Notifications/NotificationProvider.jsx'
import { AVATAR_ALLOWED_TYPES, AVATAR_MAX_BYTES, useAvatar } from '../../components/Profile/AvatarProvider.jsx'
import './AdminProfile.css'

const formatJoined = (value) => {
  const date = value ? new Date(value) : null
  return !date || Number.isNaN(date.getTime())
    ? 'Not available'
    : new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }).format(date)
}

const emptyPasswords = { currentPassword: '', newPassword: '', confirmPassword: '' }

export default function AdminProfilePage() {
  const { user, refreshUser } = useAuth()
  const { saveAvatar } = useAvatar()
  const notifications = useNotifications()
  const fileRef = useRef(null)
  const [mode, setMode] = useState('view')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', location: '', bio: '' })
  const [passwords, setPasswords] = useState(emptyPasswords)

  useEffect(() => {
    setForm({ name: user?.name || '', phone: user?.phone || '', location: user?.location || '', bio: user?.bio || '' })
  }, [user])

  const selectPhoto = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!AVATAR_ALLOWED_TYPES.includes(file.type)) return notifications.error('Choose a PNG, JPG, or WebP image.')
    if (file.size > AVATAR_MAX_BYTES) return notifications.error('Profile photos must be 2 MB or smaller.')
    setUploading(true)
    const reader = new FileReader()
    reader.onload = async () => {
      try {
        await saveAvatar(reader.result)
        notifications.success('Profile photo updated.')
      } catch (error) {
        notifications.error(error.message || 'Could not update the profile photo.')
      } finally {
        setUploading(false)
      }
    }
    reader.onerror = () => { setUploading(false); notifications.error('Could not read that image.') }
    reader.readAsDataURL(file)
  }

  const saveDetails = async (event) => {
    event.preventDefault()
    if (form.name.trim().length < 2) return notifications.error('Name must contain at least 2 characters.')
    setSaving(true)
    try {
      await updateProfile(Object.fromEntries(Object.entries(form).map(([key, value]) => [key, value.trim()])))
      await refreshUser()
      setMode('view')
      notifications.success('Profile updated successfully.')
    } catch (error) {
      notifications.error(error.message || 'Could not update the profile.')
    } finally {
      setSaving(false)
    }
  }

  const savePassword = async (event) => {
    event.preventDefault()
    if (passwords.newPassword !== passwords.confirmPassword) return notifications.error('New passwords do not match.')
    setSaving(true)
    try {
      await changePassword({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword })
      setPasswords(emptyPasswords)
      setMode('view')
      notifications.success('Password changed successfully.')
    } catch (error) {
      notifications.error(error.message || 'Could not change the password.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="admin-profile-page">
      <header className="admin-profile-page__heading">
        <h1>Admin Profile</h1>
        <p>View and manage your personal information and account settings.</p>
      </header>

      <section className="admin-profile-card" aria-labelledby="admin-profile-name">
        <div className="admin-profile-card__main">
          <div className="admin-profile-photo">
            <div className="admin-profile-photo__frame">
              <AdminAvatar user={user} size="profile" />
              <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} aria-label="Change profile photo"><AdminIcon name="camera" size={21} /></button>
            </div>
            <input ref={fileRef} hidden type="file" accept={AVATAR_ALLOWED_TYPES.join(',')} onChange={selectPhoto} />
            <button className="admin-profile-photo__button" type="button" onClick={() => fileRef.current?.click()} disabled={uploading}><AdminIcon name="camera" size={19} />{uploading ? 'Uploading…' : 'Change Photo'}</button>
          </div>

          <div className="admin-profile-details">
            <div className="admin-profile-details__top">
              <div>
                <h2 id="admin-profile-name">{user?.name || 'Admin User'}</h2>
                <span className="admin-profile-badge"><AdminIcon name="shield" size={19} />Administrator</span>
              </div>
            </div>
            <div className="admin-profile-details__columns">
              <dl className="admin-profile-contact">
                <div><dt><AdminIcon name="mail" size={21} /><span>Email</span></dt><dd>{user?.email || 'Not available'}</dd></div>
                <div><dt><AdminIcon name="phone" size={21} /><span>Phone</span></dt><dd>{user?.phone || 'Not added'}</dd></div>
                <div><dt><AdminIcon name="location" size={21} /><span>Location</span></dt><dd>{user?.location || 'Not added'}</dd></div>
              </dl>
              <div className="admin-profile-bio"><h3>Bio</h3><p>{user?.bio || 'Add a short bio to introduce yourself and your role at EduMaster.'}</p></div>
            </div>
            <dl className="admin-profile-facts">
              <div><dt><span><AdminIcon name="building" size={22} /></span>Department</dt><dd>{user?.department || 'Administration'}</dd></div>
              <div><dt><span><AdminIcon name="calendar" size={22} /></span>Joined</dt><dd>{formatJoined(user?.createdAt)}</dd></div>
              <div><dt><span><AdminIcon name="users" size={22} /></span>Access Level</dt><dd>Full Access</dd></div>
            </dl>
          </div>
        </div>

        <div className="admin-profile-card__actions">
          <button type="button" className="is-primary" onClick={() => setMode(mode === 'edit' ? 'view' : 'edit')}><AdminIcon name="edit" size={19} />{mode === 'edit' ? 'Cancel Editing' : 'Edit Profile'}</button>
          <button type="button" onClick={() => setMode(mode === 'password' ? 'view' : 'password')}><AdminIcon name="lock" size={19} />{mode === 'password' ? 'Cancel Password Change' : 'Change Password'}</button>
        </div>

        {mode === 'edit' && (
          <form className="admin-profile-form" onSubmit={saveDetails}>
            <div className="admin-profile-form__heading"><h3>Edit Profile</h3><p>Email, role, and account dates are protected.</p></div>
            <div className="admin-profile-form__grid">
              <label><span>Name</span><input required minLength="2" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} /></label>
              <label><span>Phone</span><input value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} /></label>
              <label><span>Location</span><input value={form.location} onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))} /></label>
              <label className="is-wide"><span>Bio</span><textarea rows="4" maxLength="500" value={form.bio} onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))} /></label>
            </div>
            <button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</button>
          </form>
        )}

        {mode === 'password' && (
          <form className="admin-profile-form" onSubmit={savePassword}>
            <div className="admin-profile-form__heading"><h3>Change Password</h3><p>Use your current password to secure this change.</p></div>
            <div className="admin-profile-form__grid">
              <label><span>Current Password</span><input required type="password" autoComplete="current-password" value={passwords.currentPassword} onChange={(event) => setPasswords((current) => ({ ...current, currentPassword: event.target.value }))} /></label>
              <label><span>New Password</span><input required minLength="8" type="password" autoComplete="new-password" value={passwords.newPassword} onChange={(event) => setPasswords((current) => ({ ...current, newPassword: event.target.value }))} /></label>
              <label><span>Confirm New Password</span><input required minLength="8" type="password" autoComplete="new-password" value={passwords.confirmPassword} onChange={(event) => setPasswords((current) => ({ ...current, confirmPassword: event.target.value }))} /></label>
            </div>
            <button type="submit" disabled={saving}>{saving ? 'Updating…' : 'Update Password'}</button>
          </form>
        )}
      </section>
    </div>
  )
}
