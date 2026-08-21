import { client } from './client.js'

export const getWishlist = () => client('/users/wishlist')
export const addToWishlist = (courseId) => client('/users/wishlist', { method: 'POST', body: { courseId } })
export const removeFromWishlist = (courseId) => client(`/users/wishlist/${encodeURIComponent(courseId)}`, { method: 'DELETE' })
