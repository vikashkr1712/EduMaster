import { client } from './client.js'

const query = (params = {}) => new URLSearchParams(
  Object.entries(params).filter(([, value]) => value !== undefined && value !== null)
).toString()

export const getNotifications = (params) => client(`/notifications?${query(params)}`)
export const markNotificationRead = (id) => client(`/notifications/read/${encodeURIComponent(id)}`, { method: 'PATCH' })
export const markAllNotificationsRead = () => client('/notifications/read-all', { method: 'PATCH' })
export const archiveNotification = (id) => client(`/notifications/archive/${encodeURIComponent(id)}`, { method: 'PATCH' })
export const deleteNotification = (id) => client(`/notifications/${encodeURIComponent(id)}`, { method: 'DELETE' })
export const getActivities = (params) => client(`/activities?${query(params)}`)

export const requestNotificationRefresh = () => window.dispatchEvent(new CustomEvent('edumaster:notifications-changed'))
