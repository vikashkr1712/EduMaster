import { Fragment, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/Dashboard/DashboardLayout.jsx'
import DashboardHeader from '../../components/Dashboard/DashboardHeader.jsx'
import DashboardContent from '../../components/Dashboard/DashboardContent.jsx'
import { getUserOrders } from '../../api/order.js'
import { COURSE_ART, PAY_ICONS } from '../../components/Orders/orderIcons.jsx'
import '../../components/Orders/Orders.css'

function ChevronIcon({ direction = 'right' }) {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={direction === 'left' ? { transform: 'rotate(180deg)' } : undefined}><path d="m9 6 6 6-6 6" /></svg>
}

const FILTERS = ['All Orders', 'Completed', 'Processing', 'Failed']
const price = (value) => Number(value) === 0 ? 'Free' : `₹${Number(value || 0).toLocaleString('en-IN')}`
const paymentLabel = { card: 'Credit / Debit Card', upi: 'UPI', wallet: 'Wallet', netbanking: 'Net Banking', free: 'Free Enrollment' }

export default function OrderHistoryPage() {
  const [filter, setFilter] = useState('All Orders')
  const [page, setPage] = useState(1)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [expandedOrder, setExpandedOrder] = useState(null)
  const pageSize = 4

  const load = async () => {
    setLoading(true); setErrorMessage('')
    try { setOrders((await getUserOrders())?.data?.orders || []) }
    catch (error) { setErrorMessage(error.message) }
    finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  const normalized = useMemo(() => orders.map((order) => {
    const populatedCourses = new Map((order.courses || []).map((course) => [String(course._id), course]))
    const items = (order.items || []).map((item) => {
      const course = populatedCourses.get(String(item.course)) || {}
      return {
        id: course._id || item.course,
        slug: course.slug,
        title: item.title || course.title || 'EduMaster Course',
        author: item.instructor || course.instructor || 'EduMaster Instructor',
        category: item.category || course.category,
        price: Number(item.price) || 0,
        originalPrice: Number(item.originalPrice) || Number(item.price) || 0,
      }
    })
    const firstItem = items[0] || {}
    const date = new Date(order.createdAt)
    const status = order.paymentStatus ? order.paymentStatus[0].toUpperCase() + order.paymentStatus.slice(1) : 'Processing'
    return {
      id: order._id, number: order.orderNumber, items,
      course: items.length > 1 ? `${items.length} courses` : firstItem.title,
      author: items.length > 1 ? 'View all purchased courses below' : firstItem.author,
      date: new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(date),
      time: new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit' }).format(date), amount: price(order.amount),
      payMethod: order.paymentMethod === 'netbanking' ? 'bank' : order.paymentMethod, payLabel: paymentLabel[order.paymentMethod] || order.paymentMethod,
      paySub: order.paymentDetails?.last4 ? `•••• ${order.paymentDetails.last4}` : order.orderNumber, status,
      subtotal: price(order.subtotal), discount: price((order.courseDiscount || 0) + (order.coupon?.discount || 0)), tax: price(order.tax),
      art: ({ Development: 'code', 'Data Science': 'chart', Design: 'design', Marketing: 'megaphone', Business: 'chart' })[firstItem.category] || 'code', tint: 'blue',
    }
  }), [orders])
  const visible = filter === 'All Orders' ? normalized : normalized.filter((order) => order.status === filter)
  const pageCount = Math.max(1, Math.ceil(visible.length / pageSize)); const currentPage = Math.min(page, pageCount)
  const pagedOrders = visible.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  return <DashboardLayout><DashboardHeader title="Order History" subtitle="View your course purchase history and order details." actions={<label className="orders-filter">Filter:<select className="orders-filter-select" value={filter} onChange={(event) => { setFilter(event.target.value); setPage(1) }} aria-label="Filter orders">{FILTERS.map((option) => <option key={option}>{option}</option>)}</select></label>} /><DashboardContent>
    {loading && <div className="orders-loading" aria-busy="true">Loading your orders…</div>}
    {!loading && errorMessage && <div className="orders-empty"><p>{errorMessage}</p><button className="orders-btn" type="button" onClick={load}>Try again</button></div>}
    {!loading && !errorMessage && pagedOrders.length === 0 && <div className="orders-empty"><h3>No orders found</h3><p>Your completed enrollments will appear here.</p><Link className="orders-btn" to="/courses">Browse Courses</Link></div>}
    {!loading && !errorMessage && pagedOrders.length > 0 && <div className="orders-card"><div className="orders-scroll"><table className="orders-table"><thead><tr><th>Order ID</th><th>Course</th><th>Date</th><th>Amount</th><th>Payment Method</th><th>Status</th><th>Action</th></tr></thead><tbody>
      {pagedOrders.map((order) => <Fragment key={order.id}>
        <tr key={order.id}><td data-label="Order ID" className="orders-id">{order.number}</td><td data-label="Course"><div className="orders-course"><span className={`orders-course-art profile-tile--${order.tint}`}>{COURSE_ART[order.art]}</span><div className="orders-course-text"><p className="orders-course-title">{order.course}</p><p className="orders-course-author">{order.author}</p></div></div></td><td data-label="Date"><p className="orders-date">{order.date}</p><p className="orders-time">{order.time}</p></td><td data-label="Amount" className="orders-amount">{order.amount}</td><td data-label="Payment Method"><div className="orders-pay"><span className="orders-pay-icon">{PAY_ICONS[order.payMethod] || PAY_ICONS.card}</span><div className="orders-pay-text"><p className="orders-pay-label">{order.payLabel}</p><p className="orders-pay-sub">{order.paySub}</p></div></div></td><td data-label="Status"><span className={`profile-pill ${order.status === 'Completed' ? 'profile-pill--green' : 'cert-pill--orange'}`}>{order.status}</span></td><td data-label="Action" className="orders-action"><button className="orders-btn" type="button" aria-expanded={expandedOrder === order.id} onClick={() => setExpandedOrder((value) => value === order.id ? null : order.id)}>{expandedOrder === order.id ? 'Hide Details' : 'View Order'}</button></td></tr>
        {expandedOrder === order.id && <tr key={`${order.id}-details`} className="orders-detail-row"><td colSpan="7"><section className="orders-detail" aria-label={`Details for order ${order.number}`}><header><div><span>Order {order.number}</span><h3>Purchased courses</h3></div><strong>{order.amount}</strong></header><div className="orders-detail-items">{order.items.map((item) => <article key={String(item.id)}><div><h4>{item.title}</h4><p>By {item.author}{item.category ? ` · ${item.category}` : ''}</p></div><span>{price(item.price)}</span><Link to={item.id ? `/learn/${item.id}` : item.slug ? `/courses/${item.slug}` : '/profile/courses'}>Continue Learning</Link></article>)}</div><footer><span>Subtotal <b>{order.subtotal}</b></span><span>Discount <b>- {order.discount}</b></span><span>Tax <b>{order.tax}</b></span><span>Total paid <b>{order.amount}</b></span></footer></section></td></tr>}
      </Fragment>)}
    </tbody></table></div></div>}
    {!loading && pageCount > 1 && <nav className="orders-pagination" aria-label="Order pages"><button type="button" className="orders-page-btn" aria-label="Previous page" disabled={currentPage === 1} onClick={() => setPage((value) => value - 1)}><ChevronIcon direction="left" /></button>{Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => <button key={number} type="button" className={`orders-page-btn${currentPage === number ? ' is-active' : ''}`} aria-current={currentPage === number ? 'page' : undefined} onClick={() => setPage(number)}>{number}</button>)}<button type="button" className="orders-page-btn" aria-label="Next page" disabled={currentPage === pageCount} onClick={() => setPage((value) => value + 1)}><ChevronIcon /></button></nav>}
  </DashboardContent></DashboardLayout>
}
