import AdminAvatar from './AdminAvatar.jsx'
import AdminPagination from './AdminPagination.jsx'

const dateFormatter = new Intl.DateTimeFormat('en-IN', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

const formatDate = (value) => {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : dateFormatter.format(date)
}

export default function AdminRecentUsers({ users, pagination, loading, error, onPageChange, onRetry }) {
  return (
    <section className="admin-panel admin-panel--users" aria-labelledby="recent-users-title">
      <div className="admin-panel__heading">
        <div>
          <h2 id="recent-users-title">Recent Users</h2>
          <p>Newest EduMaster accounts.</p>
        </div>
      </div>

      {loading ? (
        <div className="admin-recent-loading" aria-busy="true">Loading recent users…</div>
      ) : error ? (
        <div className="admin-recent-error" role="alert"><span>{error}</span><button type="button" onClick={onRetry}>Retry</button></div>
      ) : users.length === 0 ? (
        <div className="admin-empty-state">No recent users yet.</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table admin-table--users">
            <thead>
              <tr>
                <th scope="col">User</th>
                <th scope="col">Role</th>
                <th scope="col">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id || user.email}>
                  <td>
                    <div className="admin-user-cell">
                      <AdminAvatar user={user} size="small" />
                      <span>
                        <strong>{user.name || 'Unnamed user'}</strong>
                        <small>{user.email || 'Email unavailable'}</small>
                      </span>
                    </div>
                  </td>
                  <td><span className={`admin-role admin-role--${user.role}`}>{user.role === 'admin' ? 'Administrator' : 'Student'}</span></td>
                  <td>{formatDate(user.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!loading && !error && pagination?.total > 0 && (
        <AdminPagination {...pagination} itemLabel="users" onPageChange={onPageChange} />
      )}
    </section>
  )
}
