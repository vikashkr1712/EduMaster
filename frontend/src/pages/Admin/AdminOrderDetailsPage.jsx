import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getAdminOrder } from '../../api/admin.js'
import AdminAvatar from '../../components/Admin/AdminAvatar.jsx'
import AdminIcon from '../../components/Admin/AdminIcons.jsx'
import './AdminCommerce.css'

const currency = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 })
const dateFormatter = new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
const formatDate = (value) => { const date = new Date(value); return Number.isNaN(date.getTime()) ? '—' : dateFormatter.format(date) }
const label = (value) => String(value || '').replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (letter) => letter.toUpperCase())

export default function AdminOrderDetailsPage() {
  const { id } = useParams()
  const [data, setData] = useState(null); const [loading, setLoading] = useState(true); const [error, setError] = useState(null)
  const loadOrder = useCallback(async () => {
    setLoading(true); setError(null)
    try { const response = await getAdminOrder(id); setData(response?.data ?? null) } catch (requestError) { setError(requestError) } finally { setLoading(false) }
  }, [id])
  useEffect(() => { loadOrder() }, [loadOrder])
  if (loading) return <div className="admin-commerce-detail-loading" aria-busy="true" aria-label="Loading order"><span /><span /><span /></div>
  if (error || !data?.order) return <div className="admin-commerce-state" role="alert"><h2>Unable to load order</h2><p>{error?.message || 'Order not found.'}</p><button type="button" className="admin-commerce-button admin-commerce-button--primary" onClick={loadOrder}>Retry</button></div>
  const { order, enrollments = [] } = data
  const courseById = new Map((order.courses || []).map((course) => [String(course._id), course]))
  return (
    <div className="admin-commerce admin-commerce-detail-page">
      <div className="admin-commerce-heading"><div><Link className="admin-commerce-back" to="/admin/orders"><AdminIcon name="arrowLeft" size={17} />Back to orders</Link><h1>Order Details</h1><p>Read-only financial and enrollment record.</p></div></div>
      <section className="admin-order-hero">
        <div><span>Order number</span><h2>{order.orderNumber}</h2><p>{formatDate(order.createdAt)}</p></div>
        <div className="admin-order-hero__badges"><span className={`admin-payment-status admin-payment-status--${order.paymentStatus}`}>{label(order.paymentStatus)}</span><span className="admin-payment-method">{label(order.paymentMethod)}</span></div>
      </section>
      <div className="admin-commerce-detail-grid">
        <div className="admin-commerce-detail-main">
          <section className="admin-commerce-detail-card"><div className="admin-commerce-section-heading"><h2>Course Items</h2><p>Immutable snapshots captured when the order was created.</p></div><div className="admin-order-items">{(order.items || []).map((item, index) => {
            const course = courseById.get(String(item.course)); return <article key={`${item.course}-${index}`}><div><span className="admin-order-item-index">{index + 1}</span><div><h3>{item.title}</h3><p>{item.instructor}{item.category ? ` · ${item.category}` : ''}</p></div></div><dl><div><dt>Original price</dt><dd>{Number(item.originalPrice) === 0 ? 'Free' : currency.format(item.originalPrice)}</dd></div><div><dt>Final price</dt><dd>{Number(item.price) === 0 ? 'Free' : currency.format(item.price)}</dd></div></dl>{course && <Link to={`/admin/courses/${course._id}/edit`}>View course <span aria-hidden="true">→</span></Link>}</article>
          })}</div></section>
          <section className="admin-commerce-detail-card"><div className="admin-commerce-section-heading"><h2>Created Enrollments</h2><p>{enrollments.length} enrollment{enrollments.length === 1 ? '' : 's'} linked to this order.</p></div><div className="admin-related-list">{enrollments.length ? enrollments.map((enrollment) => <Link to={`/admin/enrollments/${enrollment._id}`} key={enrollment._id}><span><strong>{enrollment.course?.title || 'Course enrollment'}</strong><small>{Math.max(Number(enrollment.percentageCompleted) || 0, Number(enrollment.progress) || 0)}% progress</small></span><AdminIcon name="eye" size={17} /></Link>) : <p>No enrollment record is linked to this order.</p>}</div></section>
        </div>
        <aside className="admin-commerce-detail-side">
          <section className="admin-commerce-detail-card admin-order-student"><div className="admin-commerce-section-heading"><h2>Student</h2></div><div className="admin-order-student__body"><AdminAvatar user={order.user} size="large" /><div><strong>{order.user?.name || 'Deleted user'}</strong><span>{order.user?.email || '—'}</span></div></div>{order.user?._id && <Link className="admin-commerce-related-link" to={`/admin/users/${order.user._id}`}>View user details <span aria-hidden="true">→</span></Link>}</section>
          <section className="admin-commerce-detail-card"><div className="admin-commerce-section-heading"><h2>Financial Summary</h2><p>Amounts are protected and read-only.</p></div><dl className="admin-financial-summary"><div><dt>Subtotal</dt><dd>{currency.format(Number(order.subtotal) || 0)}</dd></div><div><dt>Course discount</dt><dd>− {currency.format(Number(order.courseDiscount) || 0)}</dd></div><div><dt>Coupon discount{order.coupon?.code ? ` (${order.coupon.code})` : ''}</dt><dd>− {currency.format(Number(order.coupon?.discount) || 0)}</dd></div><div><dt>GST / Tax</dt><dd>{currency.format(Number(order.tax) || 0)}</dd></div><div className="is-total"><dt>Final amount</dt><dd>{Number(order.amount) === 0 ? 'Free' : currency.format(order.amount)}</dd></div></dl></section>
        </aside>
      </div>
    </div>
  )
}
