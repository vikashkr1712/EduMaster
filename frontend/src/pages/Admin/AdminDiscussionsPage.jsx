import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getAdminDiscussions } from '../../api/admin.js'
import AdminDiscussionTable from '../../components/Admin/AdminDiscussionTable.jsx'
import AdminIcon from '../../components/Admin/AdminIcons.jsx'
import './AdminDiscussions.css'

const initialFilters = { course: '', replies: '', sort: 'newest' }
const errorCopy = (error) => error?.status === 400
  ? 'One or more discussion filters are invalid.'
  : error?.status === 401
    ? 'Your Admin session has expired.'
    : error?.status === 403
      ? 'Administrator permission is required.'
      : error?.code === 'NETWORK' || error?.code === 'OFFLINE'
        ? 'Unable to reach the server. Check your connection and retry.'
        : error?.message || 'Unable to load discussions.'

export default function AdminDiscussionsPage() {
  const requestId = useRef(0)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [filters, setFilters] = useState(initialFilters)
  const [page, setPage] = useState(1)
  const [discussions, setDiscussions] = useState([])
  const [courses, setCourses] = useState([])
  const [summary, setSummary] = useState({ total: 0, totalReplies: 0, activeCourses: 0 })
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1, limit: 10 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim())
      setPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  const query = useMemo(() => ({ search: debouncedSearch, ...filters, page, limit: 10 }), [debouncedSearch, filters, page])
  const load = useCallback(async () => {
    const currentRequest = ++requestId.current
    setLoading(true)
    setError(null)
    try {
      const response = await getAdminDiscussions(query)
      if (currentRequest !== requestId.current) return
      setDiscussions(response?.data?.discussions ?? [])
      setCourses(response?.data?.courses ?? [])
      setSummary(response?.data?.summary ?? {})
      setPagination(response?.data?.pagination ?? {})
    } catch (requestError) {
      if (currentRequest === requestId.current) setError(requestError)
    } finally {
      if (currentRequest === requestId.current) setLoading(false)
    }
  }, [query])

  useEffect(() => {
    load()
    return () => { requestId.current += 1 }
  }, [load])

  const updateFilter = (name, value) => {
    setFilters((current) => ({ ...current, [name]: value }))
    setPage(1)
  }
  const clearFilters = () => {
    setSearch('')
    setDebouncedSearch('')
    setFilters(initialFilters)
    setPage(1)
  }
  const filtered = Boolean(debouncedSearch || filters.course || filters.replies || filters.sort !== 'newest')
  const start = pagination.total ? (pagination.page - 1) * pagination.limit + 1 : 0
  const end = Math.min(pagination.page * pagination.limit, pagination.total || 0)

  return (
    <div className="admin-discussions">
      <div className="admin-page-heading"><div><h1>Discussions</h1><p>Moderate learner conversations across EduMaster.</p></div></div>
      <section className="admin-discussion-summary" aria-label="Discussion summary">
        <div><span>Total Discussions</span><strong>{Number(summary.total) || 0}</strong></div>
        <div><span>Total Replies</span><strong>{Number(summary.totalReplies) || 0}</strong></div>
        <div><span>Active Courses</span><strong>{Number(summary.activeCourses) || 0}</strong></div>
      </section>
      <section className="admin-discussion-manager">
        <div className="admin-discussion-toolbar">
          <label className="admin-course-search"><span className="sr-only">Search discussions</span><AdminIcon name="search" size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search content, author, course or lesson…" /></label>
          <select aria-label="Filter by course" value={filters.course} onChange={(event) => updateFilter('course', event.target.value)}><option value="">All courses</option>{courses.map((course) => <option key={course._id} value={course._id}>{course.title}</option>)}</select>
          <select aria-label="Filter by replies" value={filters.replies} onChange={(event) => updateFilter('replies', event.target.value)}><option value="">All discussions</option><option value="has">Has replies</option><option value="none">No replies</option></select>
          <select aria-label="Sort discussions" value={filters.sort} onChange={(event) => updateFilter('sort', event.target.value)}><option value="newest">Newest</option><option value="oldest">Oldest</option><option value="mostReplies">Most replies</option><option value="mostLiked">Most liked</option></select>
        </div>
        <div className="admin-course-manager__heading"><div><h2>Discussion registry</h2><p>Showing {start}–{end} of {pagination.total || 0}</p></div>{filtered && <button type="button" onClick={clearFilters}>Clear filters</button>}</div>
        {loading
          ? <div className="admin-course-table-loading" aria-busy="true" aria-label="Loading discussions">{Array.from({ length: 6 }, (_, index) => <span key={index} />)}</div>
          : error
            ? <div className="admin-course-list-state" role="alert"><h3>Unable to load discussions</h3><p>{errorCopy(error)}</p><button type="button" className="admin-button admin-button--primary" onClick={load}>Retry</button></div>
            : discussions.length === 0
              ? <div className="admin-course-list-state"><h3>{filtered ? 'No discussions match your search.' : 'No discussions found.'}</h3><p>{filtered ? 'Clear or change the current filters.' : 'Learner discussions will appear here when they are created.'}</p></div>
              : <AdminDiscussionTable discussions={discussions} />}
        {!loading && !error && pagination.total > 0 && <div className="admin-pagination"><span>Showing {start}–{end} of {pagination.total}</span><div><button type="button" disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>Previous</button><button type="button" disabled={page >= pagination.pages} onClick={() => setPage((value) => value + 1)}>Next</button></div></div>}
      </section>
    </div>
  )
}
