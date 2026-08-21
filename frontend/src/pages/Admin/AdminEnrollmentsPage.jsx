import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getAdminEnrollments } from '../../api/admin.js'
import AdminEnrollmentTable from '../../components/Admin/AdminEnrollmentTable.jsx'
import AdminIcon from '../../components/Admin/AdminIcons.jsx'
import './AdminCommerce.css'

const PAGE_SIZE = 10
const initialFilters = { progress: '', completion: '', sort: 'newest' }
const pagesAround = (current, total) => {
  const start = Math.max(1, Math.min(current - 2, total - 4)); const end = Math.min(total, start + 4)
  return Array.from({ length: Math.max(0, end - start + 1) }, (_, index) => start + index)
}
const errorCopy = (error) => {
  if (error?.status === 401) return 'Your Admin session has expired. Please sign in again.'
  if (error?.status === 403) return 'Administrator permission is required to inspect enrollments.'
  if (error?.code === 'NETWORK' || error?.code === 'OFFLINE') return 'Unable to reach the server. Check your connection and retry.'
  return error?.message || 'Unable to load enrollments.'
}

export default function AdminEnrollmentsPage() {
  const [search, setSearch] = useState(''); const [debouncedSearch, setDebouncedSearch] = useState('')
  const [filters, setFilters] = useState(initialFilters); const [page, setPage] = useState(1)
  const [enrollments, setEnrollments] = useState([]); const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1, limit: PAGE_SIZE })
  const [summary, setSummary] = useState({ total: 0, completed: 0, inProgress: 0, averageProgress: 0 })
  const [loading, setLoading] = useState(true); const [error, setError] = useState(null); const requestId = useRef(0)
  useEffect(() => { const timer = window.setTimeout(() => { setDebouncedSearch(search.trim()); setPage(1) }, 300); return () => window.clearTimeout(timer) }, [search])
  const query = useMemo(() => ({ search: debouncedSearch, ...filters, page, limit: PAGE_SIZE }), [debouncedSearch, filters, page])
  const loadEnrollments = useCallback(async () => {
    const activeRequest = requestId.current + 1; requestId.current = activeRequest; setLoading(true); setError(null)
    try {
      const response = await getAdminEnrollments(query); if (requestId.current !== activeRequest) return; const data = response?.data ?? {}
      setEnrollments(Array.isArray(data.enrollments) ? data.enrollments : []); setPagination(data.pagination ?? { total: 0, page: 1, pages: 1, limit: PAGE_SIZE }); setSummary(data.summary ?? { total: 0, completed: 0, inProgress: 0, averageProgress: 0 })
    } catch (requestError) { if (requestId.current === activeRequest) setError(requestError) } finally { if (requestId.current === activeRequest) setLoading(false) }
  }, [query])
  useEffect(() => { loadEnrollments(); return () => { requestId.current += 1 } }, [loadEnrollments])
  const updateFilter = (name, value) => { setFilters((current) => ({ ...current, [name]: value })); setPage(1) }
  const clearFilters = () => { setSearch(''); setDebouncedSearch(''); setFilters(initialFilters); setPage(1) }
  const hasFilters = Boolean(debouncedSearch || filters.progress || filters.completion || filters.sort !== 'newest')
  const start = pagination.total ? (pagination.page - 1) * pagination.limit + 1 : 0; const end = Math.min(pagination.page * pagination.limit, pagination.total)
  return (
    <div className="admin-commerce admin-enrollments">
      <div className="admin-commerce-heading"><div><h1>Enrollments</h1><p>Track students and their course access and progress.</p></div></div>
      <section className="admin-commerce-summary" aria-label="Enrollment totals">{[['Total Enrollments', summary.total], ['Completed', summary.completed], ['In Progress', summary.inProgress], ['Average Progress', `${Number(summary.averageProgress) || 0}%`]].map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</section>
      <section className="admin-commerce-manager" aria-labelledby="enrollment-list-title">
        <div className="admin-commerce-toolbar">
          <label className="admin-commerce-search"><span className="admin-commerce-sr-only">Search enrollments</span><AdminIcon name="search" size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search student, course or order…" /></label>
          <select aria-label="Filter by progress" value={filters.progress} onChange={(event) => updateFilter('progress', event.target.value)}><option value="">All progress</option><option value="notStarted">Not started (0%)</option><option value="active">Active (1–99%)</option><option value="complete">100% progress</option></select>
          <select aria-label="Filter by completion" value={filters.completion} onChange={(event) => updateFilter('completion', event.target.value)}><option value="">All completion</option><option value="inProgress">In progress</option><option value="completed">Completed</option></select>
          <select aria-label="Sort enrollments" value={filters.sort} onChange={(event) => updateFilter('sort', event.target.value)}><option value="newest">Newest</option><option value="oldest">Oldest</option><option value="progressDesc">Progress High–Low</option><option value="progressAsc">Progress Low–High</option></select>
        </div>
        <div className="admin-commerce-manager__heading"><div><h2 id="enrollment-list-title">Enrollment Directory</h2><p>Showing {start}–{end} of {pagination.total} enrollments</p></div>{hasFilters && <button type="button" onClick={clearFilters}>Clear filters</button>}</div>
        {loading ? <div className="admin-commerce-loading" aria-busy="true" aria-label="Loading enrollments">{Array.from({ length: 6 }, (_, index) => <span key={index} />)}</div>
          : error ? <div className="admin-commerce-state" role="alert"><h3>Unable to load enrollments</h3><p>{errorCopy(error)}</p><button type="button" className="admin-commerce-button admin-commerce-button--primary" onClick={loadEnrollments}>Retry</button></div>
            : enrollments.length === 0 ? <div className="admin-commerce-state"><h3>{hasFilters ? 'No enrollments match your search or filters.' : 'No enrollments found.'}</h3><p>{hasFilters ? 'Try clearing or changing the current filters.' : 'Course enrollments will appear here after purchase.'}</p>{hasFilters && <button type="button" className="admin-commerce-button admin-commerce-button--secondary" onClick={clearFilters}>Clear filters</button>}</div>
              : <AdminEnrollmentTable enrollments={enrollments} />}
        {!loading && !error && pagination.total > 0 && <div className="admin-commerce-pagination"><span>Showing {start}–{end} of {pagination.total} enrollments</span><div><button type="button" onClick={() => setPage((current) => current - 1)} disabled={page <= 1}>Previous</button>{pagesAround(page, pagination.pages).map((number) => <button type="button" className={number === page ? 'is-active' : ''} aria-current={number === page ? 'page' : undefined} onClick={() => setPage(number)} key={number}>{number}</button>)}<button type="button" onClick={() => setPage((current) => current + 1)} disabled={page >= pagination.pages}>Next</button></div></div>}
      </section>
    </div>
  )
}
