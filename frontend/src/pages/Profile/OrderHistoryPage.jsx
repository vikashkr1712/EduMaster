import { useState } from 'react'
import DashboardLayout from '../../components/Dashboard/DashboardLayout.jsx'
import DashboardHeader from '../../components/Dashboard/DashboardHeader.jsx'
import DashboardContent from '../../components/Dashboard/DashboardContent.jsx'
import { useNotifications } from '../../components/Notifications/NotificationProvider.jsx'
import { ORDERS } from '../../components/Orders/ordersData.js'
import { COURSE_ART, PAY_ICONS } from '../../components/Orders/orderIcons.jsx'
import '../../components/Orders/Orders.css'

function ChevronIcon({ direction = 'right' }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={direction === 'left' ? { transform: 'rotate(180deg)' } : undefined}
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  )
}

const FILTERS = ['All Orders', 'Completed', 'Processing']

export default function OrderHistoryPage() {
  const [filter, setFilter] = useState('All Orders')
  const [page, setPage] = useState(1)
  const { info } = useNotifications()
  const pageSize = 4

  const visible = filter === 'All Orders'
    ? ORDERS
    : ORDERS.filter((order) => order.status === filter)
  const pageCount = Math.max(1, Math.ceil(visible.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const pagedOrders = visible.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const changeFilter = (value) => {
    setFilter(value)
    setPage(1)
  }

  return (
    <DashboardLayout>
      <DashboardHeader
        title="Order History"
        subtitle="View your course purchase history and order details."
        actions={
          <label className="orders-filter">
            Filter:
            <select
              className="orders-filter-select"
              value={filter}
              onChange={(e) => changeFilter(e.target.value)}
              aria-label="Filter orders"
            >
              {FILTERS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
        }
      />
      <DashboardContent>
        <div className="orders-card">
          <div className="orders-scroll">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Course</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Payment Method</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pagedOrders.map((order) => (
                  <tr key={order.id}>
                    <td data-label="Order ID" className="orders-id">{order.id}</td>
                    <td data-label="Course">
                      <div className="orders-course">
                        <span className={`orders-course-art profile-tile--${order.tint}`}>
                          {COURSE_ART[order.art]}
                        </span>
                        <div className="orders-course-text">
                          <p className="orders-course-title">{order.course}</p>
                          <p className="orders-course-author">By {order.author}</p>
                        </div>
                      </div>
                    </td>
                    <td data-label="Date">
                      <p className="orders-date">{order.date}</p>
                      <p className="orders-time">{order.time}</p>
                    </td>
                    <td data-label="Amount" className="orders-amount">{order.amount}</td>
                    <td data-label="Payment Method">
                      <div className="orders-pay">
                        <span className="orders-pay-icon">{PAY_ICONS[order.payMethod]}</span>
                        <div className="orders-pay-text">
                          <p className="orders-pay-label">{order.payLabel}</p>
                          <p className="orders-pay-sub">{order.paySub}</p>
                        </div>
                      </div>
                    </td>
                    <td data-label="Status">
                      <span
                        className={`profile-pill ${order.status === 'Completed' ? 'profile-pill--green' : 'cert-pill--orange'}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td data-label="Action" className="orders-action">
                      <button
                        type="button"
                        className="orders-btn"
                        onClick={() => info(`${order.status === 'Processing' ? 'Order tracking' : 'Order details'} are coming soon.`)}
                      >
                        {order.status === 'Processing' ? 'Track Order' : 'View Details'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <nav className="orders-pagination" aria-label="Order pages">
          <button type="button" className="orders-page-btn" aria-label="Previous page" disabled={currentPage === 1} onClick={() => setPage((value) => value - 1)}>
            <ChevronIcon direction="left" />
          </button>
          {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              className={`orders-page-btn${currentPage === pageNumber ? ' is-active' : ''}`}
              aria-current={currentPage === pageNumber ? 'page' : undefined}
              onClick={() => setPage(pageNumber)}
            >
              {pageNumber}
            </button>
          ))}
          <button type="button" className="orders-page-btn" aria-label="Next page" disabled={currentPage === pageCount} onClick={() => setPage((value) => value + 1)}>
            <ChevronIcon />
          </button>
        </nav>
      </DashboardContent>
    </DashboardLayout>
  )
}
