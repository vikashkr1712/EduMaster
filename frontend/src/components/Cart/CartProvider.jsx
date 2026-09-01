import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useAuth } from '../Auth/AuthProvider.jsx'
import { useNotifications } from '../Notifications/NotificationProvider.jsx'
import { getCart, addToCart, removeFromCart } from '../../api/cart.js'
import { quoteOrder } from '../../api/order.js'

const CartContext = createContext(null)
const COUPON_STORAGE_KEY = 'edumaster:course-coupon'
const emptyPricing = Object.freeze({
  items: [], originalPrice: 0, originalSubtotal: 0, courseDiscount: 0,
  subtotal: 0, couponCode: null, couponDiscount: 0, taxableAmount: 0,
  tax: 0, finalPrice: 0,
})

const readCouponCode = () => {
  try { return sessionStorage.getItem(COUPON_STORAGE_KEY) || '' } catch { return '' }
}

const persistCouponCode = (code) => {
  try {
    if (code) sessionStorage.setItem(COUPON_STORAGE_KEY, code)
    else sessionStorage.removeItem(COUPON_STORAGE_KEY)
  } catch {
    // Pricing remains backend-authoritative if browser storage is unavailable.
  }
}

const getCourseId = (course) =>
  String(course?._id ?? course?.id ?? course?.sourceId ?? course ?? '')

const itemCourseId = (item) =>
  String(item?.course?._id ?? item?.course?.id ?? item?.courseId ?? item?._id ?? '')

export function CartProvider({ children }) {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth()
  const { success, error: notifyError } = useNotifications()
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [pendingIds, setPendingIds] = useState([])
  const [couponCode, setCouponCode] = useState(readCouponCode)
  const couponCodeRef = useRef(couponCode)
  const [pricing, setPricing] = useState(emptyPricing)
  const [pricingLoading, setPricingLoading] = useState(false)

  const loadPricing = useCallback(async (nextItems, nextCouponCode = '', { recoverInvalid = false } = {}) => {
    if (nextItems.length === 0) {
      setPricing(emptyPricing)
      return emptyPricing
    }
    setPricingLoading(true)
    try {
      const courseIds = nextItems.map(itemCourseId).filter(Boolean)
      const response = await quoteOrder({ courseIds, ...(nextCouponCode ? { couponCode: nextCouponCode } : {}) })
      const nextPricing = response?.data?.pricing
      if (!nextPricing) throw new Error('Pricing could not be loaded.')
      setPricing(nextPricing)
      return nextPricing
    } catch (requestError) {
      if (nextCouponCode && requestError?.code === 'COUPON_INVALID' && recoverInvalid) {
        setCouponCode('')
        couponCodeRef.current = ''
        persistCouponCode('')
        notifyError(requestError.message || 'This coupon is no longer valid and was removed.')
        const response = await quoteOrder({ courseIds: nextItems.map(itemCourseId).filter(Boolean) })
        const nextPricing = response?.data?.pricing || emptyPricing
        setPricing(nextPricing)
        return nextPricing
      }
      throw requestError
    } finally {
      setPricingLoading(false)
    }
  }, [notifyError])

  const loadCart = useCallback(async () => {
    if (isAuthLoading) return
    if (!isAuthenticated) {
      setItems([])
      setPricing(emptyPricing)
      setCouponCode('')
      couponCodeRef.current = ''
      persistCouponCode('')
      return
    }
    setIsLoading(true)
    try {
      const res = await getCart()
      const nextItems = Array.isArray(res?.data?.items) ? res.data.items : []
      setItems(nextItems)
      try {
        await loadPricing(nextItems, couponCodeRef.current, { recoverInvalid: true })
      } catch (pricingError) {
        setPricing(emptyPricing)
        notifyError(pricingError.message || 'Your cart loaded, but its price summary could not be refreshed.')
      }
    } catch (cartError) {
      setItems([])
      setPricing(emptyPricing)
      notifyError(cartError.message || 'Your cart could not be loaded.')
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, isAuthLoading, loadPricing, notifyError])

  useEffect(() => { loadCart() }, [loadCart])

  const isInCart = useCallback((course) => {
    const id = getCourseId(course)
    return items.some((item) => itemCourseId(item) === id)
  }, [items])

  const setPending = (id, pending) =>
    setPendingIds((cur) => pending ? [...new Set([...cur, id])] : cur.filter((v) => v !== id))

  const addCourseToCart = useCallback(async (course) => {
    if (!isAuthenticated) {
      notifyError('Please sign in to add courses to your cart.')
      return false
    }
    const id = getCourseId(course)
    if (!id || pendingIds.includes(id)) return false
    if (isInCart(course)) {
      notifyError('This course is already in your cart.')
      return false
    }

    setPending(id, true)
    try {
      const res = await addToCart(id)
      const nextItems = Array.isArray(res?.data?.items) ? res.data.items : []
      setItems(nextItems)
      try { await loadPricing(nextItems, couponCode, { recoverInvalid: true }) }
      catch (pricingError) { notifyError(pricingError.message || 'The course was added, but pricing could not be refreshed.') }
      success('Added to Cart!')
      return true
    } catch (err) {
      notifyError(err.message || 'Could not add to cart.')
      return false
    } finally {
      setPending(id, false)
    }
  }, [couponCode, isAuthenticated, isInCart, loadPricing, notifyError, pendingIds, success])

  const removeCourseFromCart = useCallback(async (course) => {
    const id = getCourseId(course)
    if (!id || pendingIds.includes(id)) return false
    setPending(id, true)
    try {
      const res = await removeFromCart(id)
      const nextItems = Array.isArray(res?.data?.items) ? res.data.items : []
      setItems(nextItems)
      try { await loadPricing(nextItems, couponCode, { recoverInvalid: true }) }
      catch (pricingError) { notifyError(pricingError.message || 'The course was removed, but pricing could not be refreshed.') }
      success('Removed from Cart')
      return true
    } catch (err) {
      notifyError(err.message || 'Could not remove from cart.')
      return false
    } finally {
      setPending(id, false)
    }
  }, [couponCode, items, loadPricing, notifyError, pendingIds, success])

  const applyCoupon = useCallback(async (value) => {
    const code = String(value || '').trim().toUpperCase()
    if (!code) throw new Error('Enter a coupon code.')
    const nextPricing = await loadPricing(items, code)
    setCouponCode(code)
    couponCodeRef.current = code
    persistCouponCode(code)
    return nextPricing
  }, [items, loadPricing])

  const removeCoupon = useCallback(async () => {
    const nextPricing = await loadPricing(items, '')
    setCouponCode('')
    couponCodeRef.current = ''
    persistCouponCode('')
    return nextPricing
  }, [items, loadPricing])

  const clearCoupon = useCallback(() => {
    setCouponCode('')
    couponCodeRef.current = ''
    persistCouponCode('')
  }, [])

  const value = useMemo(() => ({
    items,
    count: items.length,
    isLoading,
    isInCart,
    isPending: (course) => pendingIds.includes(getCourseId(course)),
    addCourseToCart,
    removeCourseFromCart,
    refreshCart: loadCart,
    couponCode,
    pricing,
    pricingLoading,
    applyCoupon,
    removeCoupon,
    clearCoupon,
    subtotal: pricing.subtotal,
    originalTotal: pricing.originalPrice,
    discount: pricing.courseDiscount,
  }), [addCourseToCart, applyCoupon, clearCoupon, couponCode, isInCart, isLoading, items, loadCart, pendingIds, pricing, pricingLoading, removeCoupon, removeCourseFromCart])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
