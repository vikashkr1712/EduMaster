import { Link } from 'react-router-dom'
import AdminIcon from './AdminIcons.jsx'

const audienceLabels = { allStudents: 'All Students', specificUser: 'Specific User', courseStudents: 'Course Students' }

export default function AdminNotificationTable({ notifications }) {
  return (
    <div className="admin-notification-table-wrap">
      <table className="admin-notification-table">
        <thead><tr><th>Notification</th><th>Audience</th><th>Recipients</th><th>Read</th><th>Created</th><th>Created By</th><th><span className="sr-only">Actions</span></th></tr></thead>
        <tbody>{notifications.map((notification) => (
          <tr key={notification._id}>
            <td><Link className="admin-notification-table__title" to={`/admin/notifications/${notification._id}`}>{notification.title}</Link><span>{notification.message}</span><small>{notification.type}</small></td>
            <td><strong>{audienceLabels[notification.audience] || notification.audience}</strong>{notification.course?.title && <span>{notification.course.title}</span>}</td>
            <td>{notification.recipientCount}</td>
            <td><strong>{notification.readCount}</strong><span>{notification.unreadCount} unread</span></td>
            <td><time dateTime={notification.createdAt}>{new Date(notification.createdAt).toLocaleDateString()}</time></td>
            <td><strong>{notification.createdBy?.name || 'Admin unavailable'}</strong><span>{notification.createdBy?.email}</span></td>
            <td><Link className="admin-row-action" to={`/admin/notifications/${notification._id}`} aria-label={`View notification ${notification.title}`}><AdminIcon name="eye" size={17} /></Link></td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  )
}
