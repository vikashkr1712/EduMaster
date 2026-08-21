import { Link } from 'react-router-dom'
import AdminAvatar from './AdminAvatar.jsx'
import AdminIcon from './AdminIcons.jsx'

const currency = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 })
const dateFormatter = new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
const formatDate = (value) => {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : dateFormatter.format(date)
}
const label = (value) => String(value || '').replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (letter) => letter.toUpperCase())

export default function AdminOrderTable({ orders }) {
  return (
    <div className="admin-commerce-table-wrap">
      <table className="admin-commerce-table admin-order-table">
        <thead><tr><th scope="col">Order</th><th scope="col">Student</th><th scope="col">Courses</th><th scope="col">Amount</th><th scope="col">Payment Method</th><th scope="col">Payment Status</th><th scope="col">Date</th><th scope="col">Actions</th></tr></thead>
        <tbody>{orders.map((order) => <tr key={order._id}>
          <td><strong className="admin-order-number">{order.orderNumber}</strong></td>
          <td><div className="admin-commerce-person"><AdminAvatar user={order.student} size="small" /><span><strong>{order.student?.name || 'Deleted user'}</strong><small>{order.student?.email || '—'}</small></span></div></td>
          <td><span className="admin-commerce-course-summary"><strong>{order.courseCount === 1 ? order.courseTitle : `${order.courseCount} courses`}</strong><small>{Number(order.enrollmentCount) || 0} enrollment{Number(order.enrollmentCount) === 1 ? '' : 's'}</small></span></td>
          <td>{Number(order.amount) === 0 ? <strong className="admin-commerce-free">Free</strong> : currency.format(order.amount)}</td>
          <td><span className="admin-payment-method">{label(order.paymentMethod)}</span></td>
          <td><span className={`admin-payment-status admin-payment-status--${order.paymentStatus}`}>{label(order.paymentStatus)}</span></td>
          <td>{formatDate(order.createdAt)}</td>
          <td><Link className="admin-commerce-view" to={`/admin/orders/${order._id}`} aria-label={`View order ${order.orderNumber}`}><AdminIcon name="eye" size={16} />View</Link></td>
        </tr>)}</tbody>
      </table>
    </div>
  )
}
