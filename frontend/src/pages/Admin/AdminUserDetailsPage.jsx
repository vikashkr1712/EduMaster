import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { deleteAdminUser, getAdminUser, updateAdminUser, updateAdminUserRole, updateAdminUserStatus } from '../../api/admin.js'
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
      } else {
        await deleteAdminUser(id)
        notifications.success('User deleted.')
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
    ['Discussions', related.discussionCount], ['Notes', related.noteCount], ['Average Progress', `${Number(related.averageProgress) || 0}%`],
  ]

  return (
    <div className="admin-user-details-page">
      <div className="admin-user-page-heading"><div><Link className="admin-user-back" to="/admin/users"><AdminIcon name="arrowLeft" size={17} />Back to users</Link><h1>User Details</h1><p>Review account, profile, and learning information.</p></div></div>

      <div className="admin-user-detail-layout">
        <aside className="admin-user-profile-card">
          <AdminAvatar user={managedUser} size="large" />
          <h2>{managedUser.name}</h2><p>{managedUser.email}</p>
          <div className="admin-user-profile-card__badges"><span className={`admin-user-role admin-user-role--${managedUser.role}`}>{managedUser.role === 'admin' ? 'Admin' : 'Student'}</span><span className={`admin-user-status admin-user-status--${managedUser.isActive ? 'active' : 'inactive'}`}><i />{managedUser.isActive ? 'Active' : 'Inactive'}</span></div>
          {isSelf && <small className="admin-user-self-note">This is your signed-in Admin account.</small>}
          <dl><div><dt>Username</dt><dd>{managedUser.username || '—'}</dd></div><div><dt>Joined</dt><dd>{formatDate(managedUser.createdAt)}</dd></div><div><dt>Last login</dt><dd>{formatDate(managedUser.lastLoginAt)}</dd></div></dl>
          <div className="admin-user-account-actions">
            <button type="button" onClick={() => setConfirmation('role')} disabled={isSelf || actionPending}><AdminIcon name="shield" size={17} />{managedUser.role === 'admin' ? 'Change to Student' : 'Promote to Admin'}</button>
            <button type="button" onClick={() => setConfirmation('status')} disabled={isSelf || actionPending}><AdminIcon name="power" size={17} />{managedUser.isActive ? 'Deactivate Account' : 'Activate Account'}</button>
            <button type="button" className="is-danger" onClick={() => setConfirmation('delete')} disabled={isSelf || actionPending}><AdminIcon name="trash" size={17} />Delete User</button>
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
        title={confirmation === 'role' ? 'Change Role?' : confirmation === 'status' ? 'Change Account Status?' : 'Delete User?'}
        confirmLabel={confirmation === 'role' ? 'Confirm role change' : confirmation === 'status' ? (managedUser.isActive ? 'Deactivate user' : 'Activate user') : 'Delete user'}
        pending={actionPending}
        pendingLabel={confirmation === 'delete' ? 'Deleting…' : 'Saving…'}
        icon={confirmation === 'role' ? 'shield' : confirmation === 'status' ? 'power' : 'trash'}
        tone={confirmation === 'delete' || (confirmation === 'status' && managedUser.isActive) ? 'danger' : 'primary'}
        onCancel={() => setConfirmation(null)}
        onConfirm={executeAction}
      ><p><strong>{managedUser.name}</strong></p><p>{confirmation === 'role' ? `${managedUser.role === 'admin' ? 'Admin → Student' : 'Student → Admin'}` : confirmation === 'status' ? `${managedUser.isActive ? 'Deactivate' : 'Activate'} this account?` : 'This action cannot be undone. Users with linked learning or order records cannot be deleted.'}</p></AdminConfirmModal>
    </div>
  )
}
