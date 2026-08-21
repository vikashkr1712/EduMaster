import { Link } from 'react-router-dom'
import AdminAvatar from './AdminAvatar.jsx'
import AdminIcon from './AdminIcons.jsx'

const joinedFormatter = new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
const formatDate = (value) => {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : joinedFormatter.format(date)
}

export default function AdminUserTable({ users, currentUserId, pendingAction, onRole, onStatus, onDelete }) {
  return (
    <div className="admin-user-table-wrap">
      <table className="admin-user-table">
        <thead><tr><th scope="col">User</th><th scope="col">Email</th><th scope="col">Role</th><th scope="col">Enrollments</th><th scope="col">Orders</th><th scope="col">Certificates</th><th scope="col">Joined</th><th scope="col">Status</th><th scope="col">Actions</th></tr></thead>
        <tbody>
          {users.map((user) => {
            const isSelf = String(user._id) === String(currentUserId)
            const busy = pendingAction?.id === user._id
            return (
              <tr key={user._id}>
                <td><div className="admin-user-table__identity"><AdminAvatar user={user} size="small" /><span><strong>{user.name}</strong>{isSelf && <small>You</small>}</span></div></td>
                <td>{user.email}</td>
                <td><span className={`admin-user-role admin-user-role--${user.role}`}>{user.role === 'admin' ? 'Admin' : 'Student'}</span></td>
                <td>{Number(user.enrollmentCount) || 0}</td>
                <td>{Number(user.orderCount) || 0}</td>
                <td>{Number(user.certificateCount) || 0}</td>
                <td>{formatDate(user.createdAt)}</td>
                <td><span className={`admin-user-status admin-user-status--${user.isActive ? 'active' : 'inactive'}`}><i />{user.isActive ? 'Active' : 'Inactive'}</span></td>
                <td>
                  <div className="admin-user-actions">
                    <Link to={`/admin/users/${user._id}`} aria-label={`View ${user.name}`}><AdminIcon name="eye" size={16} /><span>View</span></Link>
                    <button type="button" onClick={() => onRole(user)} disabled={busy || isSelf} aria-label={`${user.role === 'admin' ? 'Change to Student' : 'Change to Admin'} ${user.name}`} title={isSelf ? 'You cannot change your own Admin role' : undefined}><AdminIcon name="shield" size={16} /><span>Role</span></button>
                    <button type="button" onClick={() => onStatus(user)} disabled={busy || isSelf} aria-label={`${user.isActive ? 'Deactivate' : 'Activate'} ${user.name}`} title={isSelf ? 'You cannot deactivate yourself' : undefined}><AdminIcon name="power" size={16} /><span>{user.isActive ? 'Deactivate' : 'Activate'}</span></button>
                    <button type="button" className="is-danger" onClick={() => onDelete(user)} disabled={busy || isSelf} aria-label={`Delete ${user.name}`} title={isSelf ? 'You cannot delete yourself' : undefined}><AdminIcon name="trash" size={16} /><span>Delete</span></button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
