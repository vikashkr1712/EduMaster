import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAdminNotifications } from '../../api/admin.js'
import AdminIcon from '../../components/Admin/AdminIcons.jsx'
import AdminNotificationTable from '../../components/Admin/AdminNotificationTable.jsx'
import './AdminNotifications.css'

const initialFilters = { audience: '', type: '', course: '', sort: 'newest' }
const TYPES = ['course', 'certificate', 'assignment', 'quiz', 'order', 'payment', 'system', 'promotion']
const errorCopy = (error) => error?.status === 400 ? 'One or more notification filters are invalid.' : error?.status === 401 ? 'Your Admin session has expired.' : error?.status === 403 ? 'Administrator permission is required.' : error?.code === 'NETWORK' || error?.code === 'OFFLINE' ? 'Unable to reach the server. Check your connection and retry.' : error?.message || 'Unable to load notifications.'

export default function AdminNotificationsPage() {
  const requestId = useRef(0)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [filters, setFilters] = useState(initialFilters)
  const [page, setPage] = useState(1)
  const [items, setItems] = useState([])
  const [courses, setCourses] = useState([])
  const [summary, setSummary] = useState({ total: 0, totalRecipients: 0, read: 0, unread: 0 })
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1, limit: 10 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => { const timer = setTimeout(() => { setDebouncedSearch(search.trim()); setPage(1) }, 300); return () => clearTimeout(timer) }, [search])
  const query = useMemo(() => ({ search: debouncedSearch, ...filters, page, limit: 10 }), [debouncedSearch, filters, page])
  const load = useCallback(async () => {
    const currentRequest = ++requestId.current
    setLoading(true); setError(null)
    try {
      const response = await getAdminNotifications(query)
      if (currentRequest !== requestId.current) return
      setItems(response?.data?.notifications ?? [])
      setCourses(response?.data?.courses ?? [])
      setSummary(response?.data?.summary ?? {})
      setPagination(response?.data?.pagination ?? {})
    } catch (requestError) { if (currentRequest === requestId.current) setError(requestError) } finally { if (currentRequest === requestId.current) setLoading(false) }
  }, [query])
  useEffect(() => { load(); return () => { requestId.current += 1 } }, [load])

  const update = (name, value) => { setFilters((current) => ({ ...current, [name]: value })); setPage(1) }
  const clear = () => { setSearch(''); setDebouncedSearch(''); setFilters(initialFilters); setPage(1) }
  const filtered = Boolean(debouncedSearch || filters.audience || filters.type || filters.course || filters.sort !== 'newest')
  const start = pagination.total ? (pagination.page - 1) * pagination.limit + 1 : 0
  const end = Math.min(pagination.page * pagination.limit, pagination.total || 0)

  return <div className="admin-notifications"><div className="admin-page-heading"><div><h1>Notifications</h1><p>Manage persistent in-app notifications for EduMaster learners.</p></div><Link className="admin-button admin-button--primary" to="/admin/notifications/new"><AdminIcon name="plus" size={17} />Create Notification</Link></div><section className="admin-notification-summary" aria-label="Notification summary">{[['Total Notifications', summary.total], ['Total Recipients', summary.totalRecipients], ['Read', summary.read], ['Unread', summary.unread]].map(([label, value]) => <div key={label}><span>{label}</span><strong>{Number(value) || 0}</strong></div>)}</section><section className="admin-notification-manager"><div className="admin-notification-toolbar"><label className="admin-course-search"><span className="sr-only">Search notifications</span><AdminIcon name="search" size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search title or message…" /></label><select aria-label="Filter by audience" value={filters.audience} onChange={(event) => update('audience', event.target.value)}><option value="">All audiences</option><option value="allStudents">All Students</option><option value="specificUser">Specific User</option><option value="courseStudents">Course Students</option></select><select aria-label="Filter by type" value={filters.type} onChange={(event) => update('type', event.target.value)}><option value="">All types</option>{TYPES.map((type) => <option key={type} value={type}>{type[0].toUpperCase() + type.slice(1)}</option>)}</select><select aria-label="Filter by course" value={filters.course} onChange={(event) => update('course', event.target.value)}><option value="">All courses</option>{courses.map((course) => <option key={course._id} value={course._id}>{course.title}</option>)}</select><select aria-label="Sort notifications" value={filters.sort} onChange={(event) => update('sort', event.target.value)}><option value="newest">Newest</option><option value="oldest">Oldest</option><option value="titleAsc">Title A–Z</option></select></div><div className="admin-course-manager__heading"><div><h2>Notification registry</h2><p>Showing {start}–{end} of {pagination.total || 0}</p></div>{filtered && <button type="button" onClick={clear}>Clear filters</button>}</div>{loading ? <div className="admin-course-table-loading" aria-busy="true" aria-label="Loading notifications">{Array.from({ length: 6 }, (_, index) => <span key={index} />)}</div> : error ? <div className="admin-course-list-state" role="alert"><h3>Unable to load notifications</h3><p>{errorCopy(error)}</p><button type="button" className="admin-button admin-button--primary" onClick={load}>Retry</button></div> : items.length === 0 ? <div className="admin-course-list-state"><h3>{filtered ? 'No notifications match your search.' : 'No notifications have been created.'}</h3><p>{filtered ? 'Clear or change the current filters.' : 'Create a notification to send an in-app update to learners.'}</p></div> : <AdminNotificationTable notifications={items} />}{!loading && !error && pagination.total > 0 && <div className="admin-pagination"><span>Showing {start}–{end} of {pagination.total}</span><div><button type="button" disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>Previous</button><button type="button" disabled={page >= pagination.pages} onClick={() => setPage((value) => value + 1)}>Next</button></div></div>}</section></div>
}
