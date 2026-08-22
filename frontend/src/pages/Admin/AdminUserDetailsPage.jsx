import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { deleteAdminUser, getAdminUser, updateAdminUser, updateAdminUserDemoStatus, updateAdminUserRole, updateAdminUserStatus } from '../../api/admin.js'
import AdminAvatar from '../../components/Admin/AdminAvatar.jsx'
import AdminConfirmModal from '../../components/Admin/AdminConfirmModal.jsx'
import AdminIcon from '../../components/Admin/AdminIcons.jsx'
import { useAuth } from '../../components/Auth/AuthProvider.jsx'
import { useNotifications } from '../../components/Notifications/NotificationProvider.jsx'
import './AdminUsers.css'

const formatter = new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
const formatDate = (value) => {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : formatter.format(date)
}
const editableValues = (user = {}) => ({ name: user.name || '', phone: user.phone || '', location: user.location || '', bio: user.bio || '' })

export default function AdminUserDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const notifications = useNotifications()
  const { user: currentUser, updateUser: updateCurrentUser } = useAuth()
  const [managedUser, setManagedUser] = useState(null)
  const [values, setValues] = useState(editableValues())
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [confirmation, setConfirmation] = useState(null)
  const [actionPending, setActionPending] = useState(false)

  const loadUser = useCallback(async () => {
    setLoading(true)
    setLoadError(null)
    try {
      const response = await getAdminUser(id)
      const user = response?.data?.user
      setManagedUser(user)
      setValues(editableValues(user))
    } catch (error) {
      setLoadError(error)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { loadUser() }, [loadUser])

  const isSelf = String(managedUser?._id) === String(currentUser?._id)
  const updateField = (name, value) => {
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
  }

  const saveProfile = async (event) => {
    event.preventDefault()
    const nextErrors = {}
    if (values.name.trim().length < 2) nextErrors.name = 'Name must be at least 2 characters.'
    if (values.phone && !/^[+()\d\s-]{7,20}$/.test(values.phone)) nextErrors.phone = 'Enter a valid phone number.'
    if (values.bio.length > 500) nextErrors.bio = 'Bio must not exceed 500 characters.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    setSaving(true)
    try {
      const response = await updateAdminUser(id, {
        name: values.name.trim(),
        phone: values.phone.trim(),
        location: values.location.trim(),
        bio: values.bio.trim(),
      })
      const updated = response?.data?.user
      setManagedUser((current) => ({ ...current, ...updated }))
      if (isSelf) updateCurrentUser(updated)
      notifications.success('User updated successfully.')
    } catch (error) {
      notifications.error(error?.message || 'Unable to update this user.')
    } finally {
      setSaving(false)
    }
  }

  const executeAction = async () => {
    if (!confirmation || !managedUser) return
    setActionPending(true)
    try {
      if (confirmation === 'role') {
        const role = managedUser.role === 'admin' ? 'user' : 'admin'
        const response = await updateAdminUserRole(id, role)
        setManagedUser((current) => ({ ...current, ...response?.data?.user }))
        notifications.success(`User role updated to ${role === 'admin' ? 'Admin' : 'Student'}.`)
      } else if (confirmation === 'status') {
        const response = await updateAdminUserStatus(id, !managedUser.isActive)
        setManagedUser((current) => ({ ...current, ...response?.data?.user }))
        notifications.success(managedUser.isActive ? 'User deactivated.' : 'User activated.')
      } else if (confirmation === 'demo') {
        const response = await updateAdminUserDemoStatus(id, !managedUser.isDemo)
        setManagedUser((current) => ({ ...current, ...response?.data?.user }))
        notifications.success(managedUser.isDemo ? 'Demo status removed.' : 'Account marked as a demo/test user.')
      } else {
        await deleteAdminUser(id, managedUser.email)
        notifications.success('Demo user and related test data deleted.')
        navigate('/admin/users', { replace: true })
      }
      setConfirmation(null)
    } catch (error) {
      notifications.error(error?.message || 'Unable to complete this user action.')
      setConfirmation(null)
    } finally {
      setActionPending(false)
    }
  }

  if (loading) return <div className="admin-user-detail-loading" aria-busy="true" aria-label="Loading user"><span /><span /><span /></div>
  if (loadError || !managedUser) return <div className="admin-user-list-state" role="alert"><h2>Unable to load user</h2><p>{loadError?.message || 'User not found.'}</p><button type="button" className="admin-button admin-button--primary" onClick={loadUser}>Retry</button></div>

  const related = managedUser.related || {}
  const relatedCards = [
    ['Enrollments', related.enrollmentCount], ['Completed Courses', related.completedCourseCount], ['Orders', related.orderCount],
    ['Certificates', related.certificateCount], ['Quiz Attempts', related.quizAttemptCount], ['Assignments', related.assignmentSubmissionCount],
    ['Discussions', related.discussionCount], ['Notes', related.noteCount], ['Notifications', related.notificationCount],
    ['Activities', related.activityCount], ['Achievements', related.achievementCount], ['Queued Emails', related.emailQueueCount],
    ['Wishlist Items', related.wishlistCount], ['Cart Items', related.cartCount], ['Average Progress', `${Number(related.averageProgress) || 0}%`],
  ]
  const linkedData = [
    ['order', 'orders', related.orderCount],
    ['enrollment', 'enrollments', related.enrollmentCount],
    ['certificate', 'certificates', related.certificateCount],
    ['quiz attempt', 'quiz attempts', related.quizAttemptCount],
    ['assignment submission', 'assignment submissions', related.assignmentSubmissionCount],
    ['discussion or reply', 'discussions or replies', related.discussionCount],
    ['notification', 'notifications', related.notificationCount],
    ['note', 'notes', related.noteCount],
    ['activity', 'activities', related.activityCount],
    ['achievement', 'achievements', related.achievementCount],
    ['queued email', 'queued emails', related.emailQueueCount],
    ['wishlist item', 'wishlist items', related.wishlistCount],
    ['cart item', 'cart items', related.cartCount],
  ].filter(([, , value]) => Number(value) > 0)

  return (
    <div className="admin-user-details-page">
      <div className="admin-user-page-heading"><div><Link className="admin-user-back" to="/admin/users"><AdminIcon name="arrowLeft" size={17} />Back to users</Link><h1>User Details</h1><p>Review account, profile, and learning information.</p></div></div>

      <div className="admin-user-detail-layout">
        <aside className="admin-user-profile-card">
          <AdminAvatar user={managedUser} size="large" />
          <h2>{managedUser.name}</h2><p>{managedUser.email}</p>
          <div className="admin-user-profile-card__badges"><span className={`admin-user-role admin-user-role--${managedUser.role}`}>{managedUser.role === 'admin' ? 'Admin' : 'Student'}</span><span className={`admin-user-status admin-user-status--${managedUser.isActive ? 'active' : 'inactive'}`}><i />{managedUser.isActive ? 'Active' : 'Inactive'}</span>{managedUser.isDemo && <span className="admin-user-demo-badge">Demo/Test</span>}</div>
          {isSelf && <small className="admin-user-self-note">This is your signed-in Admin account.</small>}
          <dl><div><dt>Username</dt><dd>{managedUser.username || '—'}</dd></div><div><dt>Joined</dt><dd>{formatDate(managedUser.createdAt)}</dd></div><div><dt>Last login</dt><dd>{formatDate(managedUser.lastLoginAt)}</dd></div></dl>
          <div className="admin-user-account-actions">
            <button type="button" onClick={() => setConfirmation('role')} disabled={isSelf || actionPending}><AdminIcon name="shield" size={17} />{managedUser.role === 'admin' ? 'Change to Student' : 'Promote to Admin'}</button>
            <button type="button" onClick={() => setConfirmation('status')} disabled={isSelf || actionPending}><AdminIcon name="power" size={17} />{managedUser.isActive ? 'Deactivate Account' : 'Activate Account'}</button>
            {managedUser.role === 'user' && <button type="button" onClick={() => setConfirmation('demo')} disabled={isSelf || actionPending || (!managedUser.isDemo && managedUser.isActive)} title={!managedUser.isDemo && managedUser.isActive ? 'Deactivate this account before marking it as demo/test' : undefined}><AdminIcon name="userCheck" size={17} />{managedUser.isDemo ? 'Remove Demo Flag' : 'Mark as Demo/Test'}</button>}
            {managedUser.isDemo && <button type="button" className="is-danger" onClick={() => setConfirmation('delete')} disabled={isSelf || actionPending || managedUser.isActive} title={managedUser.isActive ? 'Deactivate this demo account before permanent deletion' : undefined}><AdminIcon name="trash" size={17} />{managedUser.isActive ? 'Deactivate Before Delete' : 'Permanently Delete Demo'}</button>}
          </div>
        </aside>

        <div className="admin-user-detail-content">
          <section className="admin-user-detail-section"><div className="admin-user-section-heading"><h2>Learning & Account Summary</h2><p>Counts are loaded only for this user.</p></div><div className="admin-user-related-grid">{relatedCards.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value ?? 0}</strong></div>)}</div></section>

          <form className="admin-user-detail-section" onSubmit={saveProfile} noValidate>
            <div className="admin-user-section-heading"><h2>Editable Profile</h2><p>Security credentials, email, role, and internal counters cannot be edited here.</p></div>
            <div className="admin-user-form-grid">
              <label className="admin-user-field"><span>Name *</span><input value={values.name} onChange={(event) => updateField('name', event.target.value)} maxLength={60} aria-invalid={Boolean(errors.name)} />{errors.name && <small role="alert">{errors.name}</small>}</label>
              <label className="admin-user-field"><span>Phone</span><input value={values.phone} onChange={(event) => updateField('phone', event.target.value)} maxLength={20} aria-invalid={Boolean(errors.phone)} />{errors.phone && <small role="alert">{errors.phone}</small>}</label>
              <label className="admin-user-field admin-user-field--full"><span>Location</span><input value={values.location} onChange={(event) => updateField('location', event.target.value)} maxLength={120} /></label>
              <label className="admin-user-field admin-user-field--full"><span>Bio</span><textarea rows="6" value={values.bio} onChange={(event) => updateField('bio', event.target.value)} maxLength={500} aria-invalid={Boolean(errors.bio)} />{errors.bio && <small role="alert">{errors.bio}</small>}<em>{values.bio.length}/500</em></label>
            </div>
            <div className="admin-user-form-actions"><Link className="admin-button admin-button--secondary" to="/admin/users">Cancel</Link><button className="admin-button admin-button--primary" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save Profile'}</button></div>
          </form>
        </div>
      </div>

      <AdminConfirmModal
        open={Boolean(confirmation)}
        title={confirmation === 'role' ? 'Change Role?' : confirmation === 'status' ? 'Change Account Status?' : confirmation === 'demo' ? (managedUser.isDemo ? 'Remove Demo Status?' : 'Mark as Demo/Test?') : 'Permanently Delete Demo User?'}
        confirmLabel={confirmation === 'role' ? 'Confirm role change' : confirmation === 'status' ? (managedUser.isActive ? 'Deactivate user' : 'Activate user') : confirmation === 'demo' ? (managedUser.isDemo ? 'Remove demo status' : 'Mark as demo/test') : 'Delete user and related test data'}
        pending={actionPending}
        pendingLabel={confirmation === 'delete' ? 'Deleting…' : 'Saving…'}
        icon={confirmation === 'role' ? 'shield' : confirmation === 'status' ? 'power' : confirmation === 'demo' ? 'userCheck' : 'trash'}
        tone={confirmation === 'delete' || (confirmation === 'status' && managedUser.isActive) ? 'danger' : 'primary'}
        onCancel={() => setConfirmation(null)}
        onConfirm={executeAction}
      >
        <p><strong>{managedUser.name}</strong></p>
        {confirmation === 'role' && <p>{managedUser.role === 'admin' ? 'Admin → Student' : 'Student → Admin'}</p>}
        {confirmation === 'status' && <><p>{managedUser.isActive ? 'Deactivate' : 'Activate'} this account?</p>{managedUser.isActive && <p>Orders, enrollments, certificates, and learning history will be preserved.</p>}</>}
        {confirmation === 'demo' && <p>{managedUser.isDemo ? 'Remove the demo/test designation from this account?' : 'Only clearly temporary accounts should be marked as demo/test users.'}</p>}
        {confirmation === 'delete' && <div className="admin-demo-delete-summary"><p>This user has linked data:</p>{linkedData.length ? <ul>{linkedData.map(([singular, plural, value]) => <li key={plural}><strong>{value}</strong> {Number(value) === 1 ? singular : plural}</li>)}</ul> : <p>No linked data was found.</p>}<p>Permanent deletion will remove related test data. Shared courses and other users&rsquo; records will not be deleted.</p></div>}
      </AdminConfirmModal>
    </div>
  )
}
