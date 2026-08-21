import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  archiveNotification,
  deleteNotification,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '../../api/notification.js'
import { useNotifications } from './NotificationProvider.jsx'

const LABELS = {
  course: 'Course', certificate: 'Certificate', assignment: 'Assignment', quiz: 'Quiz',
  order: 'Order', payment: 'Payment', system: 'System', promotion: 'Offer',
}

function relativeTime(value) {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 1000))
  if (seconds < 60) return 'Just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short' }).format(new Date(value))
}

export default function NotificationDropdown({ open, onClose, onUnreadChange }) {
  const [items, setItems] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const requestRef = useRef(0)
  const navigate = useNavigate()
  const { error } = useNotifications()

  const load = useCallback(async ({ nextPage = 1, append = false } = {}) => {
    const requestId = ++requestRef.current
    append ? setLoadingMore(true) : setLoading(true)
    setErrorMessage('')
    try {
      const response = await getNotifications({ page: nextPage, limit: 10 })
      if (requestId !== requestRef.current) return
      const data = response?.data || {}
      setItems((current) => append ? [...current, ...(data.notifications || [])] : (data.notifications || []))
      setPage(nextPage)
      setHasMore(Boolean(data.pagination?.hasMore))
      onUnreadChange(data.unreadCount || 0)
    } catch (requestError) {
      if (requestId === requestRef.current) setErrorMessage(requestError.message)
    } finally {
      if (requestId === requestRef.current) {
        setLoading(false)
        setLoadingMore(false)
      }
    }
  }, [onUnreadChange])

  useEffect(() => { load() }, [load])
  useEffect(() => {
    const refresh = () => load()
    const visibility = () => { if (document.visibilityState === 'visible') load() }
    window.addEventListener('edumaster:notifications-changed', refresh)
    document.addEventListener('visibilitychange', visibility)
    return () => {
      window.removeEventListener('edumaster:notifications-changed', refresh)
      document.removeEventListener('visibilitychange', visibility)
    }
  }, [load])

  const markAll = async () => {
    try {
      await markAllNotificationsRead()
      setItems((current) => current.map((item) => ({ ...item, read: true })))
      onUnreadChange(0)
    } catch (requestError) { error(requestError.message) }
  }

  const openItem = async (item) => {
    if (!item.read) {
      setItems((current) => current.map((value) => value._id === item._id ? { ...value, read: true } : value))
      onUnreadChange((count) => Math.max(0, count - 1))
      markNotificationRead(item._id).catch(() => load())
    }
    if (item.actionUrl) {
      onClose()
      navigate(item.actionUrl)
    }
  }

  const removeItem = async (item, archive = false) => {
    try {
      await (archive ? archiveNotification(item._id) : deleteNotification(item._id))
      setItems((current) => current.filter((value) => value._id !== item._id))
      if (!item.read) onUnreadChange((count) => Math.max(0, count - 1))
    } catch (requestError) { error(requestError.message) }
  }

  return (
    <section className={`notification-dropdown${open ? ' is-open' : ''}`} aria-hidden={!open} aria-label="Notifications">
      <header className="notification-dropdown__head">
        <div><h2>Notifications</h2><p>Learning and account updates</p></div>
        <button type="button" onClick={markAll} disabled={!items.some((item) => !item.read)}>Mark all read</button>
      </header>
      <div
        className="notification-dropdown__list"
        onScroll={(event) => {
          const node = event.currentTarget
          if (hasMore && !loadingMore && node.scrollHeight - node.scrollTop - node.clientHeight < 80) load({ nextPage: page + 1, append: true })
        }}
      >
        {loading && [...Array(4)].map((_, index) => <span className="notification-dropdown__skeleton" key={index} />)}
        {!loading && errorMessage && (
          <div className="notification-dropdown__state"><p>{errorMessage}</p><button type="button" onClick={() => load()}>Try again</button></div>
        )}
        {!loading && !errorMessage && items.length === 0 && (
          <div className="notification-dropdown__state"><span aria-hidden="true">✓</span><strong>You're all caught up</strong><p>New updates will appear here.</p></div>
        )}
        {!loading && items.map((item) => (
          <article className={`notification-dropdown__item${item.read ? '' : ' is-unread'}`} key={item._id}>
            <button className="notification-dropdown__main" type="button" onClick={() => openItem(item)}>
              <span className={`notification-dropdown__icon notification-dropdown__icon--${item.type}`} aria-hidden="true">{item.type === 'certificate' ? '★' : item.type === 'quiz' ? '?' : item.type === 'assignment' ? '✓' : item.type === 'payment' ? '₹' : '•'}</span>
              <span className="notification-dropdown__copy">
                <span><strong>{item.title}</strong><time>{relativeTime(item.createdAt)}</time></span>
                <small>{LABELS[item.type] || 'Update'}</small>
                <p>{item.message}</p>
              </span>
            </button>
            <div className="notification-dropdown__actions">
              {!item.read && <button type="button" onClick={() => openItem({ ...item, actionUrl: '' })}>Mark read</button>}
              <button type="button" onClick={() => removeItem(item, true)}>Archive</button>
              <button type="button" onClick={() => removeItem(item)}>Delete</button>
            </div>
          </article>
        ))}
        {loadingMore && <span className="notification-dropdown__skeleton" />}
      </div>
    </section>
  )
}
