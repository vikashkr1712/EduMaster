import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getAdminOrders } from '../../api/admin.js'
import AdminIcon from '../../components/Admin/AdminIcons.jsx'
import AdminOrderTable from '../../components/Admin/AdminOrderTable.jsx'
import './AdminCommerce.css'

const PAGE_SIZE = 10
const initialFilters = { paymentStatus: '', paymentMethod: '', price: '', sort: 'newest' }
const currency = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })
const pagesAround = (current, total) => {
  const start = Math.max(1, Math.min(current - 2, total - 4))
  const end = Math.min(total, start + 4)
  return Array.from({ length: Math.max(0, end - start + 1) }, (_, index) => start + index)
}
const errorCopy = (error) => {
  if (error?.status === 401) return 'Your Admin session has expired. Please sign in again.'
  if (error?.status === 403) return 'Administrator permission is required to inspect orders.'
  if (error?.code === 'NETWORK' || error?.code === 'OFFLINE') return 'Unable to reach the server. Check your connection and retry.'
  return error?.message || 'Unable to load orders.'
}

export default function AdminOrdersPage() {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [filters, setFilters] = useState(initialFilters)
  const [page, setPage] = useState(1)
  const [orders, setOrders] = useState([])
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1, limit: PAGE_SIZE })
  const [summary, setSummary] = useState({ total: 0, completed: 0, pending: 0, free: 0, revenue: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const requestId = useRef(0)

  useEffect(() => {
    const timer = window.setTimeout(() => { setDebouncedSearch(search.trim()); setPage(1) }, 300)
    return () => window.clearTimeout(timer)
  }, [search])
  const query = useMemo(() => ({ search: debouncedSearch, ...filters, page, limit: PAGE_SIZE }), [debouncedSearch, filters, page])
  const loadOrders = useCallback(async () => {
    const activeRequest = requestId.current + 1
    requestId.current = activeRequest
    setLoading(true)
    setError(null)
    try {
      const response = await getAdminOrders(query)
      if (requestId.current !== activeRequest) return
      const data = response?.data ?? {}
      setOrders(Array.isArray(data.orders) ? data.orders : [])
      setPagination(data.pagination ?? { total: 0, page: 1, pages: 1, limit: PAGE_SIZE })
      setSummary(data.summary ?? { total: 0, completed: 0, pending: 0, free: 0, revenue: 0 })
    } catch (requestError) {
      if (requestId.current === activeRequest) setError(requestError)
    } finally {
      if (requestId.current === activeRequest) setLoading(false)
    }
  }, [query])
  useEffect(() => { loadOrders(); return () => { requestId.current += 1 } }, [loadOrders])

  const updateFilter = (name, value) => { setFilters((current) => ({ ...current, [name]: value })); setPage(1) }
  const clearFilters = () => { setSearch(''); setDebouncedSearch(''); setFilters(initialFilters); setPage(1) }
  const hasFilters = Boolean(debouncedSearch || filters.paymentStatus || filters.paymentMethod || filters.price || filters.sort !== 'newest')
  const start = pagination.total ? (pagination.page - 1) * pagination.limit + 1 : 0
  const end = Math.min(pagination.page * pagination.limit, pagination.total)

  return (
    <div className="admin-commerce admin-orders">
      <div className="admin-commerce-heading"><div><h1>Orders</h1><p>Manage platform purchases and enrollment transactions.</p></div></div>
      <section className="admin-commerce-summary" aria-label="Order totals">{[
        ['Total Orders', summary.total], ['Completed', summary.completed], ['Pending', summary.pending], ['Revenue', currency.format(Number(summary.revenue) || 0)],
      ].map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</section>
      <section className="admin-commerce-manager" aria-labelledby="order-list-title">
        <div className="admin-commerce-toolbar">
          <label className="admin-commerce-search"><span className="admin-commerce-sr-only">Search orders</span><AdminIcon name="search" size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search order, student or course…" /></label>
          <select aria-label="Filter by payment status" value={filters.paymentStatus} onChange={(event) => updateFilter('paymentStatus', event.target.value)}><option value="">All statuses</option><option value="completed">Completed</option><option value="pending">Pending</option><option value="failed">Failed</option><option value="refunded">Refunded</option></select>
          <select aria-label="Filter by payment method" value={filters.paymentMethod} onChange={(event) => updateFilter('paymentMethod', event.target.value)}><option value="">All methods</option><option value="card">Card</option><option value="upi">UPI</option><option value="netbanking">Net Banking</option><option value="wallet">Wallet</option><option value="free">Free</option></select>
          <select aria-label="Filter free or paid orders" value={filters.price} onChange={(event) => updateFilter('price', event.target.value)}><option value="">Free & paid</option><option value="free">Free</option><option value="paid">Paid</option></select>
          <select aria-label="Sort orders" value={filters.sort} onChange={(event) => updateFilter('sort', event.target.value)}><option value="newest">Newest</option><option value="oldest">Oldest</option><option value="amountDesc">Amount High–Low</option><option value="amountAsc">Amount Low–High</option></select>
        </div>
        <div className="admin-commerce-manager__heading"><div><h2 id="order-list-title">Order History</h2><p>Showing {start}–{end} of {pagination.total} orders</p></div>{hasFilters && <button type="button" onClick={clearFilters}>Clear filters</button>}</div>
        {loading ? <div className="admin-commerce-loading" aria-busy="true" aria-label="Loading orders">{Array.from({ length: 6 }, (_, index) => <span key={index} />)}</div>
          : error ? <div className="admin-commerce-state" role="alert"><h3>Unable to load orders</h3><p>{errorCopy(error)}</p><button type="button" className="admin-commerce-button admin-commerce-button--primary" onClick={loadOrders}>Retry</button></div>
            : orders.length === 0 ? <div className="admin-commerce-state"><h3>{hasFilters ? 'No orders match your search or filters.' : 'No orders found.'}</h3><p>{hasFilters ? 'Try clearing or changing the current filters.' : 'Completed purchases and free enrollments will appear here.'}</p>{hasFilters && <button type="button" className="admin-commerce-button admin-commerce-button--secondary" onClick={clearFilters}>Clear filters</button>}</div>
              : <AdminOrderTable orders={orders} />}
        {!loading && !error && pagination.total > 0 && <div className="admin-commerce-pagination"><span>Showing {start}–{end} of {pagination.total} orders</span><div><button type="button" onClick={() => setPage((current) => current - 1)} disabled={page <= 1}>Previous</button>{pagesAround(page, pagination.pages).map((number) => <button type="button" className={number === page ? 'is-active' : ''} aria-current={number === page ? 'page' : undefined} onClick={() => setPage(number)} key={number}>{number}</button>)}<button type="button" onClick={() => setPage((current) => current + 1)} disabled={page >= pagination.pages}>Next</button></div></div>}
      </section>
    </div>
  )
}
