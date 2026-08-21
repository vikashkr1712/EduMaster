import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from '../Auth/AuthProvider.jsx'
import { useNotifications } from '../Notifications/NotificationProvider.jsx'
import { getCart, addToCart, removeFromCart } from '../../api/cart.js'

const CartContext = createContext(null)

const getCourseId = (course) =>
  String(course?._id ?? course?.id ?? course?.sourceId ?? course ?? '')

const itemCourseId = (item) =>
  String(item?.course?._id ?? item?.course?.id ?? item?.courseId ?? item?._id ?? '')

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const { success, error } = useNotifications()
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [pendingIds, setPendingIds] = useState([])

  const loadCart = useCallback(async () => {
    if (!isAuthenticated) { setItems([]); return }
    setIsLoading(true)
    try {
      const res = await getCart()
      setItems(Array.isArray(res?.data?.items) ? res.data.items : [])
    } catch {
      setItems([])
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => { loadCart() }, [loadCart])

  const isInCart = useCallback((course) => {
    const id = getCourseId(course)
    return items.some((item) => itemCourseId(item) === id)
  }, [items])

  const setPending = (id, pending) =>
    setPendingIds((cur) => pending ? [...new Set([...cur, id])] : cur.filter((v) => v !== id))

  const addCourseToCart = useCallback(async (course) => {
    if (!isAuthenticated) {
      error('Please sign in to add courses to your cart.')
      return false
    }
    const id = getCourseId(course)
    if (!id || pendingIds.includes(id)) return false
    if (isInCart(course)) {
      error('This course is already in your cart.')
      return false
    }

    setPending(id, true)
    // Optimistic add
    const optimisticItem = {
      _id: id,
      course: { ...course, _id: course._id ?? course.id },
      price: Number(course.price) || 0,
      discountPrice: Number(course.discountPrice) || 0,
      addedAt: new Date().toISOString(),
    }
    setItems((cur) => [...cur, optimisticItem])

    try {
      const res = await addToCart(id)
      setItems(Array.isArray(res?.data?.items) ? res.data.items : [])
      success('Added to Cart!')
      return true
    } catch (err) {
      setItems((cur) => cur.filter((item) => itemCourseId(item) !== id))
      error(err.message || 'Could not add to cart.')
      return false
    } finally {
      setPending(id, false)
    }
  }, [error, isAuthenticated, isInCart, pendingIds, success])

  const removeCourseFromCart = useCallback(async (course) => {
    const id = getCourseId(course)
    if (!id || pendingIds.includes(id)) return false
    const before = items
    setPending(id, true)
    setItems((cur) => cur.filter((item) => itemCourseId(item) !== id))
    try {
      const res = await removeFromCart(id)
      setItems(Array.isArray(res?.data?.items) ? res.data.items : [])
      success('Removed from Cart')
      return true
    } catch (err) {
      setItems(before)
      error(err.message || 'Could not remove from cart.')
      return false
    } finally {
      setPending(id, false)
    }
  }, [error, items, pendingIds, success])

  const subtotal = useMemo(() =>
    items.reduce((sum, item) => {
      const p = Number(item.discountPrice) > 0 ? Number(item.discountPrice) : Number(item.price)
      return sum + (Number.isFinite(p) ? p : 0)
    }, 0),
  [items])

  const originalTotal = useMemo(() =>
    items.reduce((sum, item) => {
      const current = Number(item.discountPrice) > 0 ? Number(item.discountPrice) : Number(item.price)
      const oldPrice = Number(item.course?.oldPrice)
      const p = Number.isFinite(oldPrice) && oldPrice > current ? oldPrice : Number(item.price)
      return sum + (Number.isFinite(p) ? p : 0)
    }, 0),
  [items])

  const value = useMemo(() => ({
    items,
    count: items.length,
    isLoading,
    isInCart,
    isPending: (course) => pendingIds.includes(getCourseId(course)),
    addCourseToCart,
    removeCourseFromCart,
    refreshCart: loadCart,
    subtotal,
    originalTotal,
    discount: originalTotal - subtotal,
  }), [addCourseToCart, isInCart, isLoading, items, loadCart, originalTotal, pendingIds, removeCourseFromCart, subtotal])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
