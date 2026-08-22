import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getAdminUsers, updateAdminUserRole, updateAdminUserStatus } from '../../api/admin.js'
import { useAuth } from '../../components/Auth/AuthProvider.jsx'
import AdminConfirmModal from '../../components/Admin/AdminConfirmModal.jsx'
import AdminIcon from '../../components/Admin/AdminIcons.jsx'
import AdminUserTable from '../../components/Admin/AdminUserTable.jsx'
import { useNotifications } from '../../components/Notifications/NotificationProvider.jsx'
import './AdminUsers.css'

const PAGE_SIZE = 10
const initialFilters = { role: '', status: '', sort: 'newest' }

const errorMessage = (error) => {
  if (error?.status === 401) return 'Your Admin session has expired. Please sign in again.'
  if (error?.status === 403) return 'Administrator permission is required to manage users.'
  if (error?.code === 'NETWORK' || error?.code === 'OFFLINE') return 'Unable to reach the server. Check your connection and retry.'
  return error?.message || 'Unable to load users.'
}

const visiblePages = (current, total) => {
  const start = Math.max(1, Math.min(current - 2, total - 4))
  const end = Math.min(total, start + 4)
  return Array.from({ length: Math.max(0, end - start + 1) }, (_, index) => start + index)
}

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth()
  const notifications = useNotifications()
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [filters, setFilters] = useState(initialFilters)
  const [page, setPage] = useState(1)
  const [users, setUsers] = useState([])
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1, limit: PAGE_SIZE })
  const [summary, setSummary] = useState({ total: 0, students: 0, admins: 0, active: 0, inactive: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pendingAction, setPendingAction] = useState(null)
  const [confirmation, setConfirmation] = useState(null)
  const requestId = useRef(0)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim())
      setPage(1)
    }, 300)
    return () => window.clearTimeout(timer)
  }, [search])

  const query = useMemo(() => ({ search: debouncedSearch, ...filters, page, limit: PAGE_SIZE }), [debouncedSearch, filters, page])

  const loadUsers = useCallback(async ({ silent = false } = {}) => {
    const activeRequest = requestId.current + 1
    requestId.current = activeRequest
    if (!silent) setLoading(true)
    setError(null)
    try {
      const response = await getAdminUsers(query)
      if (requestId.current !== activeRequest) return
      const data = response?.data ?? {}
      setUsers(Array.isArray(data.users) ? data.users : [])
      setPagination(data.pagination ?? { total: 0, page: 1, pages: 1, limit: PAGE_SIZE })
      setSummary(data.summary ?? { total: 0, students: 0, admins: 0, active: 0, inactive: 0 })
    } catch (requestError) {
      if (requestId.current === activeRequest) setError(requestError)
    } finally {
      if (requestId.current === activeRequest) setLoading(false)
    }
  }, [query])

  useEffect(() => {
    loadUsers()
    return () => { requestId.current += 1 }
  }, [loadUsers])

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

  const confirmAction = async () => {
    if (!confirmation) return
    const { type, user } = confirmation
    setPendingAction({ id: user._id, type })
    try {
      if (type === 'role') {
        const nextRole = user.role === 'admin' ? 'user' : 'admin'
        await updateAdminUserRole(user._id, nextRole)
        notifications.success(`User role updated to ${nextRole === 'admin' ? 'Admin' : 'Student'}.`)
      } else if (type === 'status') {
        await updateAdminUserStatus(user._id, !user.isActive)
        notifications.success(user.isActive ? 'User deactivated.' : 'User activated.')
      }
      setConfirmation(null)
      await loadUsers({ silent: true })
    } catch (actionError) {
      notifications.error(errorMessage(actionError))
      setConfirmation(null)
    } finally {
      setPendingAction(null)
    }
  }

  const hasFilters = Boolean(debouncedSearch || filters.role || filters.status || filters.sort !== 'newest')
  const start = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1
  const end = Math.min(pagination.page * pagination.limit, pagination.total)
  const confirmationCopy = confirmation?.type === 'role'
    ? `${confirmation.user.role === 'admin' ? 'Admin → Student' : 'Student → Admin'}`
    : `${confirmation?.user.isActive ? 'Deactivate' : 'Activate'} this account?`

  return (
    <div className="admin-users">
      <div className="admin-user-page-heading"><div><h1>Users</h1><p>Manage registered EduMaster users.</p></div></div>

      <section className="admin-user-summary" aria-label="User totals">
        {[
          ['Total Users', summary.total],
          ['Students', summary.students],
          ['Admins', summary.admins],
          ['Inactive', summary.inactive],
        ].map(([label, value]) => <div key={label}><span>{label}</span><strong>{Number(value) || 0}</strong></div>)}
      </section>

      <section className="admin-user-manager" aria-labelledby="user-list-title">
        <div className="admin-user-toolbar">
          <label className="admin-user-search"><span className="admin-user-sr-only">Search users</span><AdminIcon name="search" size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name or email…" /></label>
          <select aria-label="Filter by role" value={filters.role} onChange={(event) => updateFilter('role', event.target.value)}><option value="">All roles</option><option value="user">Students</option><option value="admin">Admins</option></select>
          <select aria-label="Filter by status" value={filters.status} onChange={(event) => updateFilter('status', event.target.value)}><option value="">All statuses</option><option value="active">Active</option><option value="inactive">Inactive</option></select>
          <select aria-label="Sort users" value={filters.sort} onChange={(event) => updateFilter('sort', event.target.value)}><option value="newest">Newest</option><option value="oldest">Oldest</option><option value="nameAsc">Name A–Z</option><option value="nameDesc">Name Z–A</option></select>
        </div>

        <div className="admin-user-manager__heading"><div><h2 id="user-list-title">User Directory</h2><p>Showing {start}–{end} of {pagination.total} users</p></div>{hasFilters && <button type="button" onClick={clearFilters}>Clear filters</button>}</div>

        {loading ? (
          <div className="admin-user-table-loading" aria-busy="true" aria-label="Loading users">{Array.from({ length: 6 }, (_, index) => <span key={index} />)}</div>
        ) : error ? (
          <div className="admin-user-list-state" role="alert"><h3>Unable to load users</h3><p>{errorMessage(error)}</p><button type="button" className="admin-button admin-button--primary" onClick={() => loadUsers()}>Retry</button></div>
        ) : users.length === 0 ? (
          <div className="admin-user-list-state"><h3>{hasFilters ? 'No users match your search or selected filters.' : 'No users found.'}</h3><p>{hasFilters ? 'Try clearing or changing the current filters.' : 'Registered users will appear here.'}</p>{hasFilters && <button type="button" className="admin-button admin-button--secondary" onClick={clearFilters}>Clear filters</button>}</div>
        ) : <AdminUserTable users={users} currentUserId={currentUser?._id} pendingAction={pendingAction} onRole={(user) => setConfirmation({ type: 'role', user })} onStatus={(user) => setConfirmation({ type: 'status', user })} />}

        {!loading && !error && pagination.total > 0 && (
          <div className="admin-user-pagination"><span>Showing {start}–{end} of {pagination.total} users</span><div><button type="button" onClick={() => setPage((current) => current - 1)} disabled={page <= 1}>Previous</button>{visiblePages(page, pagination.pages).map((pageNumber) => <button type="button" className={pageNumber === page ? 'is-active' : ''} aria-current={pageNumber === page ? 'page' : undefined} onClick={() => setPage(pageNumber)} key={pageNumber}>{pageNumber}</button>)}<button type="button" onClick={() => setPage((current) => current + 1)} disabled={page >= pagination.pages}>Next</button></div></div>
        )}
      </section>

      <AdminConfirmModal
        open={Boolean(confirmation)}
        title={confirmation?.type === 'role' ? 'Change Role?' : 'Change Account Status?'}
        confirmLabel={confirmation?.type === 'role' ? 'Confirm role change' : (confirmation?.user.isActive ? 'Deactivate user' : 'Activate user')}
        pending={Boolean(pendingAction)}
        pendingLabel="Saving…"
        icon={confirmation?.type === 'role' ? 'shield' : 'power'}
        tone={confirmation?.type === 'status' && confirmation?.user.isActive ? 'danger' : 'primary'}
        onCancel={() => setConfirmation(null)}
        onConfirm={confirmAction}
      >
        <p><strong>{confirmation?.user.name}</strong></p><p>{confirmationCopy}</p>{confirmation?.type === 'status' && confirmation?.user.isActive && <p>Course history and financial records will be preserved.</p>}
      </AdminConfirmModal>
    </div>
  )
}
