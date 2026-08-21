import { client } from './client.js'

export const getCart = () => client('/cart')

export const addToCart = (courseId) =>
  client('/cart', { method: 'POST', body: { courseId } })

export const removeFromCart = (courseId) =>
  client(`/cart/${encodeURIComponent(courseId)}`, { method: 'DELETE' })

export const clearCart = () => client('/cart', { method: 'DELETE' })
