import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getAdminEnrollment } from '../../api/admin.js'
import AdminAvatar from '../../components/Admin/AdminAvatar.jsx'
import AdminIcon from '../../components/Admin/AdminIcons.jsx'
import './AdminCommerce.css'

const dateFormatter = new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
const formatDate = (value) => { if (!value) return '—'; const date = new Date(value); return Number.isNaN(date.getTime()) ? '—' : dateFormatter.format(date) }
const formatWatchTime = (seconds) => { const total = Number(seconds) || 0; const hours = Math.floor(total / 3600); const minutes = Math.floor((total % 3600) / 60); return hours ? `${hours}h ${minutes}m` : `${minutes}m` }

export default function AdminEnrollmentDetailsPage() {
  const { id } = useParams()
  const [enrollment, setEnrollment] = useState(null); const [loading, setLoading] = useState(true); const [error, setError] = useState(null)
  const loadEnrollment = useCallback(async () => {
    setLoading(true); setError(null)
    try { const response = await getAdminEnrollment(id); setEnrollment(response?.data?.enrollment ?? null) } catch (requestError) { setError(requestError) } finally { setLoading(false) }
  }, [id])
  useEffect(() => { loadEnrollment() }, [loadEnrollment])
  if (loading) return <div className="admin-commerce-detail-loading" aria-busy="true" aria-label="Loading enrollment"><span /><span /><span /></div>
  if (error || !enrollment) return <div className="admin-commerce-state" role="alert"><h2>Unable to load enrollment</h2><p>{error?.message || 'Enrollment not found.'}</p><button type="button" className="admin-commerce-button admin-commerce-button--primary" onClick={loadEnrollment}>Retry</button></div>
  const progress = Math.min(100, Math.max(0, Number(enrollment.effectiveProgress) || 0)); const summary = enrollment.learningSummary || {}
  return (
    <div className="admin-commerce admin-commerce-detail-page">
      <div className="admin-commerce-heading"><div><Link className="admin-commerce-back" to="/admin/enrollments"><AdminIcon name="arrowLeft" size={17} />Back to enrollments</Link><h1>Enrollment Details</h1><p>Read-only student learning progress and purchase context.</p></div></div>
      <section className="admin-enrollment-hero">
        <div className="admin-enrollment-identity"><AdminAvatar user={enrollment.user} size="large" /><div><span>Student</span><h2>{enrollment.user?.name || 'Deleted user'}</h2><p>{enrollment.user?.email || '—'}</p></div></div>
        <div className="admin-enrollment-hero__status"><span className={`admin-completion-status admin-completion-status--${enrollment.isCompleted ? 'completed' : 'progress'}`}>{enrollment.isCompleted ? 'Completed' : 'In progress'}</span><strong>{Math.round(progress)}%</strong></div>
      </section>
      <div className="admin-enrollment-progress-panel"><div><span>Overall progress</span><strong>{Math.round(progress)}%</strong></div><div className="admin-enrollment-progress-track"><i style={{ width: `${progress}%` }} /></div></div>
      <div className="admin-commerce-detail-grid">
        <div className="admin-commerce-detail-main">
          <section className="admin-commerce-detail-card"><div className="admin-commerce-section-heading"><h2>Learning Summary</h2><p>Derived from this enrollment’s stored progress.</p></div><div className="admin-learning-summary">{[
            ['Completed Lessons', `${summary.completedLessonCount || 0} / ${summary.totalLessonCount || 0}`], ['Completed Modules', summary.completedModuleCount || 0], ['Watch Time', formatWatchTime(summary.totalWatchSeconds)], ['Bookmarks', summary.bookmarkCount || 0], ['Quiz-ready Lessons', summary.quizReadyLessonCount || 0],
          ].map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div></section>
          <section className="admin-commerce-detail-card"><div className="admin-commerce-section-heading"><h2>Learning Position</h2></div><dl className="admin-enrollment-fields"><div><dt>Current module</dt><dd>{enrollment.currentModule || '—'}</dd></div><div><dt>Current lesson</dt><dd>{enrollment.currentLesson || '—'}</dd></div><div><dt>Enrolled</dt><dd>{formatDate(enrollment.enrolledAt || enrollment.createdAt)}</dd></div><div><dt>Last watched</dt><dd>{formatDate(enrollment.lastWatchedAt || enrollment.lastWatched)}</dd></div><div><dt>Completed</dt><dd>{formatDate(enrollment.completedAt)}</dd></div></dl></section>
          {enrollment.completedLessons?.length > 0 && <section className="admin-commerce-detail-card"><div className="admin-commerce-section-heading"><h2>Completed Lesson IDs</h2><p>Stored lesson identifiers; curriculum editing is outside this module.</p></div><div className="admin-completed-lessons">{enrollment.completedLessons.map((lesson) => <span key={lesson}>{lesson}</span>)}</div></section>}
        </div>
        <aside className="admin-commerce-detail-side">
          <section className="admin-commerce-detail-card"><div className="admin-commerce-section-heading"><h2>Related Course</h2></div><div className="admin-related-record"><strong>{enrollment.course?.title || 'Unavailable course'}</strong><span>{enrollment.course?.instructor || '—'}</span>{enrollment.course?._id && <Link to={`/admin/courses/${enrollment.course._id}/edit`}>Open course <span aria-hidden="true">→</span></Link>}</div></section>
          <section className="admin-commerce-detail-card"><div className="admin-commerce-section-heading"><h2>Related Records</h2></div><div className="admin-related-actions">{enrollment.user?._id && <Link to={`/admin/users/${enrollment.user._id}`}><AdminIcon name="users" size={17} /><span><strong>User details</strong><small>{enrollment.user.email}</small></span></Link>}{enrollment.order?._id && <Link to={`/admin/orders/${enrollment.order._id}`}><AdminIcon name="receipt" size={17} /><span><strong>Order details</strong><small>{enrollment.order.orderNumber}</small></span></Link>}</div></section>
          <section className="admin-commerce-integrity"><AdminIcon name="shield" size={19} /><div><strong>View-only learning record</strong><p>This module cannot delete enrollments or alter course access.</p></div></section>
        </aside>
      </div>
    </div>
  )
}
