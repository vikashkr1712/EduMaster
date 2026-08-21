import { createContext, useCallback, useContext, useState } from 'react'
import './NotificationProvider.css'

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])

  const notify = useCallback((type, message) => {
    const id = crypto.randomUUID()
    setNotifications((current) => [...current, { id, type, message }])
    if (type === 'success') window.setTimeout(() => window.dispatchEvent(new CustomEvent('edumaster:notifications-changed')), 250)
    window.setTimeout(() => {
      setNotifications((current) => current.filter((notification) => notification.id !== id))
    }, 5000)
  }, [])

  const value = {
    success: (message) => notify('success', message),
    error: (message) => notify('error', message),
    info: (message) => notify('info', message),
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <div className="notifications" aria-live="polite" aria-atomic="true">
        {notifications.map((notification) => (
          <div className={`notification notification--${notification.type}`} key={notification.id} role="status">
            <span className="notification__icon" aria-hidden="true">
              {notification.type === 'success' ? '✓' : notification.type === 'info' ? 'i' : '!'}
            </span>
            <span>{notification.message}</span>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const notifications = useContext(NotificationContext)

  if (!notifications) {
    throw new Error('useNotifications must be used within NotificationProvider')
  }

  return notifications
}
