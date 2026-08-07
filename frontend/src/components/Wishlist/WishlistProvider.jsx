import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from '../Auth/AuthProvider.jsx'
import { addToWishlist, getWishlist, removeFromWishlist } from '../../api/wishlist.js'
import { useNotifications } from '../Notifications/NotificationProvider.jsx'

const WishlistContext = createContext(null)

const getCourseId = (course) => String(course?._id ?? course?.id ?? course?.sourceId ?? course ?? '')
const getSourceId = (course) => String(course?.sourceId ?? course?.id ?? '')

const responseCourses = (response) => Array.isArray(response?.data?.courses) ? response.data.courses : []

export function WishlistProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const { success, error } = useNotifications()
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [pendingIds, setPendingIds] = useState([])

  const loadWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([])
      return
    }
    setIsLoading(true)
    try {
      const response = await getWishlist()
      setItems(responseCourses(response))
    } catch (requestError) {
      setItems([])
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    loadWishlist()
  }, [loadWishlist])

  const isWishlisted = useCallback((course) => {
    const id = getCourseId(course)
    const sourceId = getSourceId(course)
    return items.some((item) => getCourseId(item) === id || (sourceId && String(item.sourceId) === sourceId))
  }, [items])

  const setPending = (id, pending) => {
    setPendingIds((current) => pending
      ? [...new Set([...current, id])]
      : current.filter((value) => value !== id))
  }

  const toggleWishlist = useCallback(async (course) => {
    if (!isAuthenticated) {
      error('Please sign in to manage your wishlist.')
      return false
    }

    const id = getCourseId(course)
    if (!id || pendingIds.includes(id)) return false

    const alreadyWishlisted = isWishlisted(course)
    const beforeUpdate = items
    setPending(id, true)

    try {
      if (alreadyWishlisted) {
        setItems((current) => current.filter((item) => getCourseId(item) !== id && String(item.sourceId) !== getSourceId(course)))
        const response = await removeFromWishlist(id)
        setItems(responseCourses(response))
        success('Removed from Wishlist')
      } else {
        // Optimistic state makes every matching heart red before the request completes.
        setItems((current) => [...current, { ...course, sourceId: course.sourceId ?? course.id }])
        const response = await addToWishlist(id)
        setItems(responseCourses(response))
        success('Added to Wishlist')
      }
      return true
    } catch (requestError) {
      setItems(beforeUpdate)
      error(requestError.message || 'Unable to update your wishlist.')
      return false
    } finally {
      setPending(id, false)
    }
  }, [error, isAuthenticated, isWishlisted, items, pendingIds, success])

  const removeWishlistItem = useCallback((course) => toggleWishlist(course), [toggleWishlist])

  const value = useMemo(() => ({
    items,
    count: items.length,
    isLoading,
    isWishlisted,
    isPending: (course) => pendingIds.includes(getCourseId(course)),
    toggleWishlist,
    removeWishlistItem,
    refreshWishlist: loadWishlist,
  }), [isLoading, isWishlisted, items, loadWishlist, pendingIds, removeWishlistItem, toggleWishlist])

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) throw new Error('useWishlist must be used within WishlistProvider')
  return context
}
