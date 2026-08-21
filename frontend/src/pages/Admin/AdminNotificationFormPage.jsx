import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createAdminNotification, getAdminNotificationOptions } from '../../api/admin.js'
import AdminAvatar from '../../components/Admin/AdminAvatar.jsx'
import AdminIcon from '../../components/Admin/AdminIcons.jsx'
import { useNotifications } from '../../components/Notifications/NotificationProvider.jsx'
import './AdminNotifications.css'

const initialForm = { title: '', message: '', type: 'system', audience: 'allStudents', userId: '', courseId: '', actionUrl: '' }
const TYPES = ['system', 'course', 'certificate', 'assignment', 'quiz', 'order', 'payment', 'promotion']

export default function AdminNotificationFormPage() {
  const navigate = useNavigate()
  const notifications = useNotifications()
  const requestId = useRef(0)
  const [form, setForm] = useState(initialForm)
  const [courses, setCourses] = useState([])
  const [students, setStudents] = useState([])
  const [userSearch, setUserSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [optionsLoading, setOptionsLoading] = useState(true)
  const [optionsError, setOptionsError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  useEffect(() => { const timer = setTimeout(() => setDebouncedSearch(userSearch.trim()), 300); return () => clearTimeout(timer) }, [userSearch])
  const loadOptions = useCallback(async () => {
    const currentRequest = ++requestId.current
    setOptionsLoading(true); setOptionsError('')
    try {
      const response = await getAdminNotificationOptions({ search: debouncedSearch })
      if (currentRequest !== requestId.current) return
      setCourses(response?.data?.courses ?? [])
      setStudents(response?.data?.students ?? [])
    } catch (error) { if (currentRequest === requestId.current) setOptionsError(error?.message || 'Unable to load recipient options.') } finally { if (currentRequest === requestId.current) setOptionsLoading(false) }
  }, [debouncedSearch])
  useEffect(() => { loadOptions(); return () => { requestId.current += 1 } }, [loadOptions])

  const setField = (name, value) => {
    setForm((current) => ({ ...current, [name]: value, ...(name === 'audience' ? { userId: '', courseId: '' } : {}) }))
    setSubmitError('')
  }
  const submit = async (event) => {
    event.preventDefault()
    if (form.audience === 'specificUser' && !form.userId) { setSubmitError('Select a student recipient.'); return }
    if (form.audience === 'courseStudents' && !form.courseId) { setSubmitError('Select a course.'); return }
    setSubmitting(true); setSubmitError('')
    try {
      const response = await createAdminNotification({ title: form.title, message: form.message, type: form.type, audience: form.audience, ...(form.userId ? { userId: form.userId } : {}), ...(form.courseId ? { courseId: form.courseId } : {}), ...(form.actionUrl.trim() ? { actionUrl: form.actionUrl.trim() } : {}) })
      const recipientCount = response?.data?.recipientCount ?? 0
      notifications.success(`Notification created for ${recipientCount} ${recipientCount === 1 ? 'student' : 'students'}.`)
      navigate(`/admin/notifications/${response.data.id}`, { replace: true })
    } catch (error) { setSubmitError(error?.status === 409 ? 'No eligible recipients were found for this audience.' : error?.message || 'Unable to create notification.') } finally { setSubmitting(false) }
  }

  return <div className="admin-notification-form-page"><div className="admin-page-heading"><div><Link className="admin-back-link" to="/admin/notifications"><AdminIcon name="arrowLeft" size={17} />Back to notifications</Link><h1>Create Notification</h1><p>Send a persistent in-app update to an eligible learner audience.</p></div></div><form className="admin-notification-form" onSubmit={submit}><section><div className="admin-section-heading"><span>Content</span><h2>Notification details</h2><p>Delivered content is immutable after creation.</p></div><div className="admin-notification-fields"><label><span>Title *</span><input required minLength="3" maxLength="120" value={form.title} onChange={(event) => setField('title', event.target.value)} placeholder="Course platform update" /><small>{form.title.length}/120</small></label><label className="is-wide"><span>Message *</span><textarea required minLength="3" maxLength="500" rows="6" value={form.message} onChange={(event) => setField('message', event.target.value)} placeholder="Write a concise update for learners…" /><small>{form.message.length}/500</small></label><label><span>Type *</span><select value={form.type} onChange={(event) => setField('type', event.target.value)}>{TYPES.map((type) => <option key={type} value={type}>{type[0].toUpperCase() + type.slice(1)}</option>)}</select></label><label><span>Internal action path</span><input value={form.actionUrl} maxLength="500" pattern="^/(?!/).*" onChange={(event) => setField('actionUrl', event.target.value)} placeholder="/courses or /profile/courses" /><small>Optional. Internal EduMaster paths only.</small></label></div></section><section><div className="admin-section-heading"><span>Recipients</span><h2>Choose an audience</h2><p>Recipient membership is resolved securely by the backend.</p></div><fieldset className="admin-audience-options"><legend className="sr-only">Notification audience</legend>{[['allStudents', 'All Students', 'Every active account with the Student role.'], ['specificUser', 'Specific User', 'One active student selected below.'], ['courseStudents', 'Course Students', 'Active students enrolled in one course.']].map(([value, label, copy]) => <label className={form.audience === value ? 'is-selected' : ''} key={value}><input type="radio" name="audience" value={value} checked={form.audience === value} onChange={(event) => setField('audience', event.target.value)} /><span><strong>{label}</strong><small>{copy}</small></span></label>)}</fieldset>{form.audience === 'specificUser' && <div className="admin-recipient-picker"><label className="admin-course-search"><span className="sr-only">Search students</span><AdminIcon name="search" size={18} /><input value={userSearch} onChange={(event) => setUserSearch(event.target.value)} placeholder="Search student name or email…" /></label>{optionsLoading ? <div className="admin-option-loading" aria-busy="true">Loading students…</div> : optionsError ? <div className="admin-inline-error" role="alert">{optionsError}</div> : students.length === 0 ? <div className="admin-option-loading">No eligible students found.</div> : <div className="admin-student-options" role="radiogroup" aria-label="Select student">{students.map((student) => <label className={form.userId === student._id ? 'is-selected' : ''} key={student._id}><input type="radio" name="userId" value={student._id} checked={form.userId === student._id} onChange={(event) => setField('userId', event.target.value)} /><AdminAvatar user={student} /><span><strong>{student.name}</strong><small>{student.email}</small></span></label>)}</div>}</div>}{form.audience === 'courseStudents' && <label className="admin-course-target"><span>Course *</span><select required value={form.courseId} onChange={(event) => setField('courseId', event.target.value)} disabled={optionsLoading}><option value="">Select a course</option>{courses.map((course) => <option key={course._id} value={course._id}>{course.title}</option>)}</select><small>Enrollment records determine recipients; frontend selections are not trusted.</small></label>}</section>{submitError && <div className="admin-inline-error" role="alert">{submitError}</div>}<div className="admin-notification-form__actions"><Link className="admin-button admin-button--secondary" to="/admin/notifications">Cancel</Link><button className="admin-button admin-button--primary" type="submit" disabled={submitting || optionsLoading}>{submitting ? 'Creating…' : 'Create Notification'}</button></div></form></div>
}
