import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/Dashboard/DashboardLayout.jsx'
import DashboardHeader from '../../components/Dashboard/DashboardHeader.jsx'
import DashboardContent from '../../components/Dashboard/DashboardContent.jsx'
import SettingsCard from '../../components/Settings/SettingsCard.jsx'
import ToggleSwitch from '../../components/Settings/ToggleSwitch.jsx'
import PasswordInput from '../../components/Settings/PasswordInput.jsx'
import { useAuth } from '../../components/Auth/AuthProvider.jsx'
import { useNotifications } from '../../components/Notifications/NotificationProvider.jsx'
import { useTheme } from '../../components/Theme/ThemeProvider.jsx'
import { changePassword, updateProfile } from '../../api/user.js'
import '../../components/Settings/Settings.css'

const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' }

const PencilIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" {...stroke}>
    <path d="M16.5 4.5a2.2 2.2 0 0 1 3 3L8 19l-4 1 1-4Z" />
  </svg>
)

const LockIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" {...stroke}>
    <rect x="5" y="10.5" width="14" height="9.5" rx="2" />
    <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
  </svg>
)

const SunIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" {...stroke}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.5V5M12 19v2.5M2.5 12H5M19 12h2.5M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" />
  </svg>
)

const BellIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" {...stroke}>
    <path d="M18 9a6 6 0 1 0-12 0c0 6-2.5 7-2.5 7h17S18 15 18 9" />
    <path d="M10.3 20a2 2 0 0 0 3.4 0" />
  </svg>
)

const MailIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" {...stroke}>
    <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
    <path d="m4.5 7.5 7.5 5.5 7.5-5.5" />
  </svg>
)

const TagIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" {...stroke}>
    <path d="m12.6 3.5 7.9 7.9a1.5 1.5 0 0 1 0 2.1l-7 7a1.5 1.5 0 0 1-2.1 0l-7.9-7.9V4.5a1 1 0 0 1 1-1Z" />
    <circle cx="8.3" cy="8.3" r="1.3" />
  </svg>
)

const ShieldIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" {...stroke}>
    <path d="M12 3 5 6v5c0 5 3.2 8.4 7 10 3.8-1.6 7-5 7-10V6Z" />
    <path d="m9 11.8 2.2 2.2 3.8-4" />
  </svg>
)

const AlertIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" {...stroke}>
    <path d="M12 4 2.8 19.5h18.4Z" />
    <path d="M12 10v4.5" />
    <circle cx="12" cy="17" r="0.4" fill="currentColor" />
  </svg>
)

function HeadAction({ icon, label, onClick, disabled, title }) {
  return (
    <button
      type="button"
      className="settings-head-btn"
      onClick={onClick}
      disabled={disabled}
      title={title}
    >
      {icon} {label}
    </button>
  )
}

export default function SettingsPage() {
  const { user, refreshUser } = useAuth()
  const { theme, setTheme } = useTheme()
  const { success, error } = useNotifications()
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)

  const resetForm = () => {
    setForm({
      name: user?.name || '',
      username: user?.username || (user?.name || '').toLowerCase().replace(/\s+/g, ''),
      email: user?.email || '',
      phone: user?.phone || '',
      bio: user?.bio || '',
      location: user?.location || '',
    })
  }

  const toggleEditing = () => {
    if (editing) resetForm() // Cancel discards unsaved edits
    setEditing((v) => !v)
  }

  const [form, setForm] = useState({ name: '', username: '', email: '', phone: '', bio: '', location: '' })
  useEffect(() => {
    setForm({
      name: user?.name || '',
      username: user?.username || (user?.name || '').toLowerCase().replace(/\s+/g, ''),
      email: user?.email || '',
      phone: user?.phone || '',
      bio: user?.bio || '',
      location: user?.location || '',
    })
  }, [user])

  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const saveProfile = async () => {
    if (form.name.trim().length < 2) {
      error('Please enter a name with at least 2 characters.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      error('Please enter a valid email address.')
      return
    }

    const payload = Object.fromEntries(['name', 'username', 'email', 'phone', 'bio', 'location'].map((key) => [key, form[key].trim()]))

    if (Object.keys(payload).length === 0) {
      success('Your profile is already up to date.')
    }

    setSaving(true)
    try {
      await updateProfile(payload)
      await refreshUser()
      setEditing(false)
      success('Profile updated successfully.')
    } catch (err) {
      error(err.message || 'Could not update your profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const [notifications, setNotifications] = useState({
    course: true,
    email: true,
    offers: false,
  })
  const [security, setSecurity] = useState({
    loginAlerts: true,
  })
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [changingPassword, setChangingPassword] = useState(false)

  useEffect(() => {
    if (!user?.preferences) return
    setNotifications({ course: user.preferences.notifications?.course ?? true, email: user.preferences.notifications?.email ?? true, offers: user.preferences.notifications?.offers ?? false })
    setSecurity({ loginAlerts: user.preferences.loginAlerts ?? true })
  }, [user?.preferences])

  const savePreference = async (preferences) => {
    try {
      await updateProfile({ preferences })
      await refreshUser()
      success('Preference saved.')
    } catch (requestError) { error(requestError.message) }
  }

  const submitPassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) return error('New passwords do not match.')
    setChangingPassword(true)
    try {
      await changePassword({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword })
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' })
      success('Password changed successfully.')
    } catch (requestError) { error(requestError.message) } finally { setChangingPassword(false) }
  }

  return (
    <DashboardLayout>
      <DashboardHeader
        title="Settings"
        subtitle="Manage your preferences and account settings."
      />
      <DashboardContent>
        {/* Profile Information */}
        <SettingsCard
          title="Profile Information"
          subtitle="Update your personal information."
          action={
            <HeadAction
              icon={<PencilIcon />}
              label={editing ? 'Cancel' : 'Edit'}
              onClick={toggleEditing}
            />
          }
        >
          <div className="settings-form-grid">
            <div className="settings-field">
              <label className="settings-label" htmlFor="settings-name">Full Name</label>
              <input id="settings-name" className="settings-input" type="text" value={form.name} onChange={setField('name')} disabled={!editing} />
            </div>
            <div className="settings-field">
              <label className="settings-label" htmlFor="settings-username">Username</label>
              <input id="settings-username" className="settings-input" type="text" value={form.username} onChange={setField('username')} disabled={!editing} />
            </div>
            <div className="settings-field">
              <label className="settings-label" htmlFor="settings-email">Email Address</label>
              <input id="settings-email" className="settings-input" type="email" value={form.email} onChange={setField('email')} disabled={!editing} />
            </div>
            <div className="settings-field">
              <label className="settings-label" htmlFor="settings-phone">Phone Number</label>
              <div className="settings-phone">
                <span className="settings-phone-code">🇮🇳 +91</span>
                <input
                  id="settings-phone"
                  className="settings-input"
                  type="tel"
                  placeholder="98765 43210"
                  value={form.phone}
                  onChange={setField('phone')}
                  disabled={!editing}
                />
              </div>
            </div>
            <div className="settings-field settings-field--full">
              <label className="settings-label" htmlFor="settings-location">Location</label>
              <input id="settings-location" className="settings-input" type="text" value={form.location} onChange={setField('location')} disabled={!editing} />
            </div>
            <div className="settings-field settings-field--full">
              <label className="settings-label" htmlFor="settings-bio">Bio</label>
              <textarea id="settings-bio" className="settings-input settings-textarea" rows="3" value={form.bio} onChange={setField('bio')} disabled={!editing} />
            </div>
          </div>
          <div className="settings-actions">
            <button
              type="button"
              className="settings-primary-btn"
              onClick={saveProfile}
              disabled={saving || !editing}
              title={editing ? undefined : 'Click Edit to make changes'}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </SettingsCard>

        {/* Change Password */}
        <SettingsCard
          title="Change Password"
          subtitle="Update your password to keep your account secure."
        >
          <div className="settings-password-list">
            <PasswordInput id="settings-current-pass" label="Current Password" placeholder="Enter current password" autoComplete="current-password" value={passwords.currentPassword} onChange={(event) => setPasswords((value) => ({ ...value, currentPassword: event.target.value }))} />
            <PasswordInput id="settings-new-pass" label="New Password" placeholder="Enter new password" autoComplete="new-password" value={passwords.newPassword} onChange={(event) => setPasswords((value) => ({ ...value, newPassword: event.target.value }))} />
            <PasswordInput id="settings-confirm-pass" label="Confirm New Password" placeholder="Confirm new password" autoComplete="new-password" value={passwords.confirmPassword} onChange={(event) => setPasswords((value) => ({ ...value, confirmPassword: event.target.value }))} />
          </div>
          <div className="settings-actions">
            <button
              type="button"
              className="settings-primary-btn"
              disabled={changingPassword || !passwords.currentPassword || passwords.newPassword.length < 8 || !passwords.confirmPassword}
              onClick={submitPassword}
            >
              {changingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </SettingsCard>

        {/* Account Preferences */}
        <SettingsCard
          title="Account Preferences"
          subtitle="Manage your account related preferences."
        >
          <div className="settings-row">
            <span className="settings-row-icon"><SunIcon /></span>
            <div className="settings-row-text">
              <p className="settings-row-label">Theme Mode</p>
              <p className="settings-row-desc">Choose your preferred theme for the application.</p>
            </div>
            <select
              className="settings-select"
              value={theme}
              onChange={(event) => {
                const nextTheme = event.target.value
                setTheme(nextTheme)
                savePreference({ theme: nextTheme })
              }}
              aria-label="Theme mode"
            >
              <option value="light">Light Mode</option>
              <option value="dark">Dark Mode</option>
            </select>
          </div>
        </SettingsCard>

        {/* Notifications */}
        <SettingsCard
          title="Notification Preferences"
          subtitle="Choose which updates you want to receive."
        >
          <div className="settings-rows">
            <ToggleSwitch
              icon={<BellIcon />}
              label="Course Updates"
              description="Get notified about new lessons and course announcements."
              checked={notifications.course}
              onChange={(v) => { setNotifications((n) => ({ ...n, course: v })); savePreference({ notifications: { ...notifications, course: v } }) }}
            />
            <ToggleSwitch
              icon={<MailIcon />}
              label="Email Notifications"
              description="Receive important account activity by email."
              checked={notifications.email}
              onChange={(v) => { setNotifications((n) => ({ ...n, email: v })); savePreference({ notifications: { ...notifications, email: v } }) }}
            />
            <ToggleSwitch
              icon={<TagIcon />}
              label="Promotional Offers"
              description="Receive offers, discounts and recommendations."
              checked={notifications.offers}
              onChange={(v) => { setNotifications((n) => ({ ...n, offers: v })); savePreference({ notifications: { ...notifications, offers: v } }) }}
            />
          </div>
        </SettingsCard>

        {/* Security */}
        <SettingsCard
          title="Security"
          subtitle="Add extra protection to your account."
        >
          <div className="settings-rows">
            <ToggleSwitch
              icon={<AlertIcon />}
              label="Login Alerts"
              description="Get alerted when your account is accessed from a new device."
              checked={security.loginAlerts}
              onChange={(v) => { setSecurity({ loginAlerts: v }); savePreference({ loginAlerts: v }) }}
            />
          </div>
        </SettingsCard>
      </DashboardContent>
    </DashboardLayout>
  )
}
