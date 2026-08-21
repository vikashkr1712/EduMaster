const dateFormatter = new Intl.DateTimeFormat('en-IN', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
})

const formatDate = (value) => {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : dateFormatter.format(date)
}

export default function AdminRecentOrders({ orders, pagination, loading, error, onPageChange, onRetry }) {
  return (
    <section className="admin-panel admin-panel--orders" aria-labelledby="recent-orders-title">
      <div className="admin-panel__heading">
        <div>
          <h2 id="recent-orders-title">Recent Orders</h2>
          <p>Latest purchases across the platform.</p>
        </div>
      </div>

      {loading ? (
        <div className="admin-recent-loading" aria-busy="true">Loading recent orders…</div>
      ) : error ? (
        <div className="admin-recent-error" role="alert"><span>{error}</span><button type="button" onClick={onRetry}>Retry</button></div>
      ) : orders.length === 0 ? (
        <div className="admin-empty-state">No recent orders found.</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table admin-table--orders">
            <thead>
              <tr>
                <th scope="col">Order ID</th>
                <th scope="col">Student</th>
                <th scope="col">Course</th>
                <th scope="col">Amount</th>
                <th scope="col">Status</th>
                <th scope="col">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const status = String(order.paymentStatus || order.status || 'pending').toLowerCase()
                return (
                  <tr key={order._id || order.orderNumber}>
                    <td><strong>{order.orderNumber || '—'}</strong></td>
                    <td>
                      <div className="admin-user-cell">
                        <AdminAvatar user={order.student} size="small" />
                        <span><strong>{order.student?.name || 'Unknown student'}</strong><small>{order.student?.email || 'Email unavailable'}</small></span>
                      </div>
                    </td>
                    <td>{order.course || order.courseTitle || 'Course unavailable'}</td>
                    <td>{currencyFormatter.format(Number(order.amount) || 0)}</td>
                    <td><span className={`admin-status admin-status--${status}`}>{status}</span></td>
                    <td>{formatDate(order.createdAt)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
      {!loading && !error && pagination?.total > 0 && (
        <AdminPagination {...pagination} itemLabel="orders" onPageChange={onPageChange} />
      )}
    </section>
  )
}
import AdminAvatar from './AdminAvatar.jsx'
import AdminPagination from './AdminPagination.jsx'
