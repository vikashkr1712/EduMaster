import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { deleteAdminCourse, getAdminCourses, toggleAdminCoursePublish } from '../../api/admin.js'
import AdminConfirmModal from '../../components/Admin/AdminConfirmModal.jsx'
import AdminCourseDetailsModal from '../../components/Admin/AdminCourseDetailsModal.jsx'
import AdminCourseTable from '../../components/Admin/AdminCourseTable.jsx'
import AdminIcon from '../../components/Admin/AdminIcons.jsx'
import { useNotifications } from '../../components/Notifications/NotificationProvider.jsx'
import './AdminCourses.css'

const PAGE_SIZE = 10
const initialFilters = { status: '', category: '', level: '', price: '', sort: 'newest' }

const getErrorCopy = (error) => {
  if (error?.status === 401) return 'Your Admin session has expired. Please sign in again.'
  if (error?.status === 403) return 'Administrator permission is required to manage courses.'
  if (error?.code === 'NETWORK' || error?.code === 'OFFLINE') return 'Unable to reach the server. Check your connection and retry.'
  return error?.message || 'Unable to load courses.'
}

const getVisiblePages = (current, total) => {
  const start = Math.max(1, Math.min(current - 2, total - 4))
  const end = Math.min(total, start + 4)
  return Array.from({ length: Math.max(0, end - start + 1) }, (_, index) => start + index)
}

export default function AdminCoursesPage() {
  const notifications = useNotifications()
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [filters, setFilters] = useState(initialFilters)
  const [page, setPage] = useState(1)
  const [courses, setCourses] = useState([])
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1, limit: PAGE_SIZE })
  const [summary, setSummary] = useState({ total: 0, published: 0, draft: 0, free: 0, paid: 0 })
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pendingAction, setPendingAction] = useState(null)
  const [viewCourse, setViewCourse] = useState(null)
  const [deleteCourse, setDeleteCourse] = useState(null)
  const requestId = useRef(0)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim())
      setPage(1)
    }, 300)
    return () => window.clearTimeout(timer)
  }, [search])

  const query = useMemo(() => ({
    search: debouncedSearch,
    ...filters,
    page,
    limit: PAGE_SIZE,
  }), [debouncedSearch, filters, page])

  const loadCourses = useCallback(async ({ silent = false } = {}) => {
    const currentRequest = requestId.current + 1
    requestId.current = currentRequest
    if (!silent) setLoading(true)
    setError(null)
    try {
      const response = await getAdminCourses(query)
      if (requestId.current !== currentRequest) return
      const data = response?.data ?? {}
      setCourses(Array.isArray(data.courses) ? data.courses : [])
      setPagination(data.pagination ?? { total: 0, page: 1, pages: 1, limit: PAGE_SIZE })
      setSummary(data.summary ?? { total: 0, published: 0, draft: 0, free: 0, paid: 0 })
      setCategories(Array.isArray(data.categories) ? data.categories : [])
    } catch (requestError) {
      if (requestId.current === currentRequest) setError(requestError)
    } finally {
      if (requestId.current === currentRequest) setLoading(false)
    }
  }, [query])

  useEffect(() => {
    loadCourses()
    return () => { requestId.current += 1 }
  }, [loadCourses])

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

  const handlePublish = async (course) => {
    setPendingAction({ id: course._id, type: 'publish' })
    try {
      const response = await toggleAdminCoursePublish(course._id)
      const published = response?.data?.course?.isPublished
      notifications.success(published ? 'Course published.' : 'Course unpublished.')
      await loadCourses({ silent: true })
    } catch (actionError) {
      notifications.error(getErrorCopy(actionError))
    } finally {
      setPendingAction(null)
    }
  }

  const handleDelete = async () => {
    if (!deleteCourse) return
    setPendingAction({ id: deleteCourse._id, type: 'delete' })
    try {
      await deleteAdminCourse(deleteCourse._id)
      notifications.success('Course deleted.')
      setDeleteCourse(null)
      if (courses.length === 1 && page > 1) setPage((current) => current - 1)
      else await loadCourses({ silent: true })
    } catch (actionError) {
      notifications.error(getErrorCopy(actionError))
      setDeleteCourse(null)
    } finally {
      setPendingAction(null)
    }
  }

  const hasFilters = Boolean(debouncedSearch || filters.status || filters.category || filters.level || filters.price || filters.sort !== 'newest')
  const start = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1
  const end = Math.min(pagination.page * pagination.limit, pagination.total)

  return (
    <div className="admin-courses">
      <div className="admin-page-heading">
        <div><h1>Courses</h1><p>Manage courses available on EduMaster.</p></div>
        <Link className="admin-button admin-button--primary" to="/admin/courses/new"><AdminIcon name="plus" size={18} />Add Course</Link>
      </div>

      <section className="admin-course-summary" aria-label="Course totals">
        {[
          ['Total Courses', summary.total],
          ['Published', summary.published],
          ['Draft', summary.draft],
          ['Free', summary.free],
          ['Paid', summary.paid],
        ].map(([label, value]) => <div key={label}><span>{label}</span><strong>{Number(value) || 0}</strong></div>)}
      </section>

      <section className="admin-course-manager" aria-labelledby="course-list-title">
        <div className="admin-course-toolbar">
          <label className="admin-course-search">
            <span className="sr-only">Search courses</span>
            <AdminIcon name="search" size={18} />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search title, category or instructor…" />
          </label>
          <select aria-label="Filter by status" value={filters.status} onChange={(event) => updateFilter('status', event.target.value)}>
            <option value="">All statuses</option><option value="published">Published</option><option value="draft">Draft</option>
          </select>
          <select aria-label="Filter by category" value={filters.category} onChange={(event) => updateFilter('category', event.target.value)}>
            <option value="">All categories</option>{categories.map((category) => <option value={category} key={category}>{category}</option>)}
          </select>
          <select aria-label="Filter by level" value={filters.level} onChange={(event) => updateFilter('level', event.target.value)}>
            <option value="">All levels</option><option>Beginner</option><option>Intermediate</option><option>Advanced</option>
          </select>
          <select aria-label="Filter by price" value={filters.price} onChange={(event) => updateFilter('price', event.target.value)}>
            <option value="">All prices</option><option value="free">Free</option><option value="paid">Paid</option>
          </select>
          <select aria-label="Sort courses" value={filters.sort} onChange={(event) => updateFilter('sort', event.target.value)}>
            <option value="newest">Newest</option><option value="oldest">Oldest</option><option value="titleAsc">Title A–Z</option><option value="titleDesc">Title Z–A</option><option value="priceAsc">Price Low–High</option><option value="priceDesc">Price High–Low</option>
          </select>
        </div>

        <div className="admin-course-manager__heading">
          <div><h2 id="course-list-title">Course Catalog</h2><p>Showing {start}–{end} of {pagination.total}</p></div>
          {hasFilters && <button type="button" onClick={clearFilters}>Clear filters</button>}
        </div>

        {loading ? (
          <div className="admin-course-table-loading" aria-busy="true" aria-label="Loading courses">{Array.from({ length: 6 }, (_, index) => <span key={index} />)}</div>
        ) : error ? (
          <div className="admin-course-list-state" role="alert"><h3>Unable to load courses</h3><p>{getErrorCopy(error)}</p><button type="button" className="admin-button admin-button--primary" onClick={() => loadCourses()}>Retry</button></div>
        ) : courses.length === 0 ? (
          <div className="admin-course-list-state"><h3>{hasFilters ? 'No courses match your search or filters.' : 'No courses found.'}</h3><p>{hasFilters ? 'Try clearing or changing the current filters.' : 'Create your first EduMaster course to get started.'}</p>{hasFilters && <button type="button" className="admin-button admin-button--secondary" onClick={clearFilters}>Clear filters</button>}</div>
        ) : <AdminCourseTable courses={courses} pendingAction={pendingAction} onView={setViewCourse} onPublish={handlePublish} onDelete={setDeleteCourse} />}

        {!loading && !error && pagination.total > 0 && (
          <div className="admin-pagination">
            <span>Showing {start}–{end} of {pagination.total}</span>
            <div>
              <button type="button" onClick={() => setPage((current) => current - 1)} disabled={page <= 1}>Previous</button>
              {getVisiblePages(page, pagination.pages).map((pageNumber) => <button type="button" className={pageNumber === page ? 'is-active' : ''} aria-current={pageNumber === page ? 'page' : undefined} onClick={() => setPage(pageNumber)} key={pageNumber}>{pageNumber}</button>)}
              <button type="button" onClick={() => setPage((current) => current + 1)} disabled={page >= pagination.pages}>Next</button>
            </div>
          </div>
        )}
      </section>

      <AdminCourseDetailsModal course={viewCourse} onClose={() => setViewCourse(null)} />
      <AdminConfirmModal open={Boolean(deleteCourse)} title="Delete Course?" confirmLabel="Delete course" pending={pendingAction?.type === 'delete'} onCancel={() => setDeleteCourse(null)} onConfirm={handleDelete}>
        <p><strong>{deleteCourse?.title}</strong> will be permanently deleted.</p><p>This action cannot be undone. Courses with linked learner data cannot be deleted.</p>
      </AdminConfirmModal>
    </div>
  )
}
