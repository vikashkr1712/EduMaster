import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getAdminNotification } from '../../api/admin.js'
import AdminAvatar from '../../components/Admin/AdminAvatar.jsx'
import AdminIcon from '../../components/Admin/AdminIcons.jsx'
import './AdminNotifications.css'

const audienceLabels = { allStudents: 'All Students', specificUser: 'Specific User', courseStudents: 'Course Students' }

export default function AdminNotificationDetailsPage() {
  const { id } = useParams()
  const [page, setPage] = useState(1)
  const [notification, setNotification] = useState(null)
  const [recipients, setRecipients] = useState([])
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1, limit: 20 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const load = useCallback(async () => {
    setLoading(true); setError(null)
    try { const response = await getAdminNotification(id, { recipientPage: page, recipientLimit: 20 }); setNotification(response?.data?.notification); setRecipients(response?.data?.recipients ?? []); setPagination(response?.data?.pagination ?? {}) } catch (requestError) { setError(requestError) } finally { setLoading(false) }
  }, [id, page])
  useEffect(() => { load() }, [load])
  if (loading && !notification) return <div className="admin-notification-loading" aria-busy="true"><span className="admin-spinner" />Loading notification…</div>
  if (error || !notification) return <div className="admin-course-list-state" role="alert"><h2>Unable to load notification</h2><p>{error?.status === 404 ? 'This notification does not exist.' : error?.message || 'Notification not found.'}</p><Link className="admin-button admin-button--secondary" to="/admin/notifications">Back to notifications</Link></div>
  const start = pagination.total ? (pagination.page - 1) * pagination.limit + 1 : 0
  const end = Math.min(pagination.page * pagination.limit, pagination.total || 0)
  return <div className="admin-notification-details"><div className="admin-page-heading"><div><Link className="admin-back-link" to="/admin/notifications"><AdminIcon name="arrowLeft" size={17} />Back to notifications</Link><h1>{notification.title}</h1><p>Created {new Date(notification.createdAt).toLocaleString()}</p></div><span className="admin-notification-type">{notification.type}</span></div><section className="admin-notification-detail-grid"><article><span>Audience</span><h2>{audienceLabels[notification.audience] || notification.audience}</h2>{notification.course && <Link to={`/admin/courses/${notification.course._id}/edit`}>{notification.course.title}</Link>}</article><article><span>Created By</span><h2>{notification.createdBy?.name || 'Admin unavailable'}</h2><p>{notification.createdBy?.email}</p></article><article><span>Action</span><h2>{notification.actionUrl || 'No action link'}</h2><p>Internal in-app destination</p></article></section><article className="admin-notification-message"><span>Message</span><p>{notification.message}</p><small>Delivered notification content cannot be edited or deleted from Admin.</small></article><section className="admin-notification-summary" aria-label="Delivery summary"><div><span>Recipients</span><strong>{notification.recipientCount}</strong></div><div><span>Read</span><strong>{notification.readCount}</strong></div><div><span>Unread</span><strong>{notification.unreadCount}</strong></div></section><section className="admin-notification-recipients"><div className="admin-course-manager__heading"><div><h2>Recipients</h2><p>Showing {start}–{end} of {pagination.total || 0}</p></div></div>{loading ? <div className="admin-course-table-loading" aria-busy="true">{Array.from({ length: 4 }, (_, index) => <span key={index} />)}</div> : <div className="admin-recipient-table-wrap"><table className="admin-recipient-table"><thead><tr><th>Student</th><th>Status</th><th>Read Date</th><th>Archived</th></tr></thead><tbody>{recipients.map((recipient) => <tr key={recipient._id}><td><div className="admin-discussion-author"><AdminAvatar user={recipient.user} /><span><Link to={`/admin/users/${recipient.user?._id}`}>{recipient.user?.name || 'User unavailable'}</Link><small>{recipient.user?.email}</small></span></div></td><td><span className={`admin-read-status ${recipient.read ? 'is-read' : 'is-unread'}`}>{recipient.read ? 'Read' : 'Unread'}</span></td><td>{recipient.readAt ? <time dateTime={recipient.readAt}>{new Date(recipient.readAt).toLocaleString()}</time> : '—'}</td><td>{recipient.archived ? 'Archived' : 'Active'}</td></tr>)}</tbody></table></div>}{!loading && pagination.total > 0 && <div className="admin-pagination"><span>Showing {start}–{end} of {pagination.total}</span><div><button type="button" disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>Previous</button><button type="button" disabled={page >= pagination.pages} onClick={() => setPage((value) => value + 1)}>Next</button></div></div>}</section></div>
}
