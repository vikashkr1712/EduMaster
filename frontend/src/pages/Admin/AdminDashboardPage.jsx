import { useCallback, useEffect, useRef, useState } from 'react'
import { getAdminDashboard, getAdminOrders, getAdminUsers } from '../../api/admin.js'
import { useAuth } from '../../components/Auth/AuthProvider.jsx'
import AdminIcon from '../../components/Admin/AdminIcons.jsx'
import AdminLoading from '../../components/Admin/AdminLoading.jsx'
import AdminRecentOrders from '../../components/Admin/AdminRecentOrders.jsx'
import AdminRecentUsers from '../../components/Admin/AdminRecentUsers.jsx'
import AdminStatCard from '../../components/Admin/AdminStatCard.jsx'

const numberFormatter = new Intl.NumberFormat('en-IN')
const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
})
const PAGE_SIZE = 10
const emptyPagination = { total: 0, page: 1, pages: 1, limit: PAGE_SIZE }

const cards = [
  { field: 'users', label: 'Total Users', icon: 'users', description: 'Registered accounts' },
  { field: 'courses', label: 'Total Courses', icon: 'courses', description: 'Courses in catalog' },
  { field: 'enrollments', label: 'Enrollments', icon: 'enrollments', description: 'Course enrollments' },
  { field: 'orders', label: 'Orders', icon: 'orders', description: 'All course orders' },
  { field: 'revenue', label: 'Revenue', icon: 'revenue', description: 'Completed paid orders' },
  { field: 'certificates', label: 'Certificates', icon: 'certificates', description: 'Certificates issued' },
]

const getErrorCopy = (error) => {
  if (error?.status === 401) return 'Your Admin session has expired. Please sign in again.'
  if (error?.status === 403) return 'Your account does not have permission to view Admin data.'
  if (error?.code === 'NETWORK' || error?.code === 'OFFLINE') return 'Unable to reach the server. Check your connection and retry.'
  return error?.message || 'Unable to load dashboard data.'
}

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const [dashboard, setDashboard] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const requestId = useRef(0)
  const recentRequestId = useRef({ orders: 0, users: 0 })
  const [orderPage, setOrderPage] = useState(1)
  const [userPage, setUserPage] = useState(1)
  const [recentOrders, setRecentOrders] = useState([])
  const [recentUsers, setRecentUsers] = useState([])
  const [orderPagination, setOrderPagination] = useState(emptyPagination)
  const [userPagination, setUserPagination] = useState(emptyPagination)
  const [recentLoading, setRecentLoading] = useState({ orders: true, users: true })
  const [recentErrors, setRecentErrors] = useState({ orders: '', users: '' })

  const loadDashboard = useCallback(async ({ refresh = false } = {}) => {
    const currentRequest = requestId.current + 1
    requestId.current = currentRequest
    if (refresh) setRefreshing(true)
    else setLoading(true)
    setError(null)

    try {
      const response = await getAdminDashboard()
      if (requestId.current === currentRequest) setDashboard(response?.data ?? null)
    } catch (requestError) {
      if (requestId.current === currentRequest) setError(requestError)
    } finally {
      if (requestId.current === currentRequest) {
        setLoading(false)
        setRefreshing(false)
      }
    }
  }, [])

  useEffect(() => {
    loadDashboard()
    return () => { requestId.current += 1 }
  }, [loadDashboard])

  const loadRecent = useCallback(async (type, page) => {
    const activeRequest = recentRequestId.current[type] + 1
    recentRequestId.current[type] = activeRequest
    setRecentLoading((current) => ({ ...current, [type]: true }))
    setRecentErrors((current) => ({ ...current, [type]: '' }))
    try {
      const response = type === 'orders'
        ? await getAdminOrders({ page, limit: PAGE_SIZE, sort: 'newest' })
        : await getAdminUsers({ page, limit: PAGE_SIZE, sort: 'newest' })
      if (recentRequestId.current[type] !== activeRequest) return
      const data = response?.data ?? {}
      if (type === 'orders') {
        setRecentOrders(Array.isArray(data.orders) ? data.orders : [])
        setOrderPagination(data.pagination ?? emptyPagination)
      } else {
        setRecentUsers(Array.isArray(data.users) ? data.users : [])
        setUserPagination(data.pagination ?? emptyPagination)
      }
    } catch (requestError) {
      if (recentRequestId.current[type] === activeRequest) {
        setRecentErrors((current) => ({ ...current, [type]: getErrorCopy(requestError) }))
      }
    } finally {
      if (recentRequestId.current[type] === activeRequest) {
        setRecentLoading((current) => ({ ...current, [type]: false }))
      }
    }
  }, [])

  useEffect(() => { loadRecent('orders', orderPage) }, [loadRecent, orderPage])
  useEffect(() => { loadRecent('users', userPage) }, [loadRecent, userPage])

  const refreshAll = () => {
    loadDashboard({ refresh: true })
    loadRecent('orders', orderPage)
    loadRecent('users', userPage)
  }

  const stats = dashboard?.stats ?? {}

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard__intro">
        <div>
          <p className="admin-dashboard__welcome">Welcome back, {user?.name || 'Admin'}</p>
          <h1>Dashboard</h1>
          <p>Overview of EduMaster platform activity.</p>
        </div>
        <button
          type="button"
          className="admin-refresh-button"
          onClick={refreshAll}
          disabled={loading || refreshing}
        >
          <AdminIcon name="refresh" size={18} className={refreshing ? 'is-spinning' : ''} />
          {refreshing ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      {loading ? <AdminLoading /> : error ? (
        <section className="admin-dashboard-error" role="alert">
          <div className="admin-dashboard-error__icon"><AdminIcon name="refresh" size={25} /></div>
          <h2>Unable to load dashboard data</h2>
          <p>{getErrorCopy(error)}</p>
          <button type="button" onClick={() => loadDashboard()}>Retry</button>
        </section>
      ) : (
        <>
          <section aria-labelledby="platform-overview-title">
            <div className="admin-section-heading">
              <div>
                <h2 id="platform-overview-title">Platform Overview</h2>
                <p>Current totals from your EduMaster database.</p>
              </div>
            </div>
            <div className="admin-stat-grid">
              {cards.map((card) => (
                <AdminStatCard
                  key={card.field}
                  {...card}
                  value={card.field === 'revenue'
                    ? currencyFormatter.format(Number(stats[card.field]) || 0)
                    : numberFormatter.format(Number(stats[card.field]) || 0)}
                />
              ))}
            </div>
          </section>

          <div className="admin-recent-grid">
            <AdminRecentOrders orders={recentOrders} pagination={orderPagination} loading={recentLoading.orders} error={recentErrors.orders} onPageChange={setOrderPage} onRetry={() => loadRecent('orders', orderPage)} />
            <AdminRecentUsers users={recentUsers} pagination={userPagination} loading={recentLoading.users} error={recentErrors.users} onPageChange={setUserPage} onRetry={() => loadRecent('users', userPage)} />
          </div>
        </>
      )}
    </div>
  )
}
