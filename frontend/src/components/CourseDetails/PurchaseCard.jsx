import { useEffect, useRef, useState } from 'react'
import { useWishlist } from '../Wishlist/WishlistProvider.jsx'
import { useCart } from '../Cart/CartProvider.jsx'
import { useAuth } from '../Auth/AuthProvider.jsx'
import { useLocation, useNavigate } from 'react-router-dom'
import { createOrder } from '../../api/order.js'
import { useNotifications } from '../Notifications/NotificationProvider.jsx'
import { calculateCoupon } from '../../utils/coupons.js'

function CheckIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path d="M5 12l5 5L19 7" stroke="#22c55e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function HeartIcon({ filled }) {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 20.5C6.5 15.7 3 12.6 3 8.9 3 6.2 5.2 4 7.9 4c1.6 0 3.1.8 4.1 2 1-1.2 2.5-2 4.1-2C18.8 4 21 6.2 21 8.9c0 3.7-3.5 6.8-9 11.6z"
        fill={filled ? '#EF4444' : 'none'}
        stroke={filled ? '#EF4444' : '#5a6b87'}
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 2l7 3v6c0 4.5-3 8.3-7 9.5C8 19.3 5 15.5 5 11V5l7-3z" stroke="#22c55e" strokeWidth="1.8" fill="#dcf7e5" />
      <path d="M9 12l2 2 4-4" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="#f97316" strokeWidth="2" />
      <path d="M12 7v5l3 3" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

const COURSE_INCLUDES = [
  (c) => `${c.duration || '10 hours'} on-demand video`,
  () => 'Full lifetime access',
  () => 'Access on mobile and TV',
  (c) => c.hasCertificate !== false ? 'Certificate of completion' : null,
]

const TARGET_AUDIENCE = [
  'Aspiring professionals',
  'Students and learners',
  'Anyone looking to upskill',
  'Career changers',
]

export default function PurchaseCard({ course, autoResume = false }) {
  const { isWishlisted, toggleWishlist, isPending: isWishlistPending } = useWishlist()
  const { isInCart, addCourseToCart, isPending: isCartPending, refreshCart } = useCart()
  const { user, updateUser } = useAuth()
  const { error } = useNotifications()
  const navigate = useNavigate()
  const location = useLocation()
  const [coupon, setCoupon] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)
  const [couponError, setCouponError] = useState('')
  const [enrolling, setEnrolling] = useState(false)
  const enrollingRef = useRef(false)
  const resumedPurchase = useRef(false)
  const wishlisted = isWishlisted(course)
  const inCart = isInCart(course)
  const courseId = String(course._id ?? course.id ?? course.sourceId ?? '')
  const ownsCourse = Boolean(user?.enrolledCourses?.some((entry) => String(entry?._id ?? entry) === courseId))

  const price = Number(course.price) || 0
  const rawDiscount = Number(course.discountPrice)
  const discountPrice = Number.isFinite(rawDiscount) && rawDiscount > 0 ? rawDiscount : null
  const effectivePrice = discountPrice ?? price
  const isFree = course.priceType === 'Free' || effectivePrice === 0
  const oldPrice = course.oldPrice ?? (discountPrice != null && discountPrice < price ? price : null)
  const inr = (n) => `₹${Number(n).toLocaleString('en-IN')}`

  const discountPct = oldPrice && oldPrice > effectivePrice
    ? Math.round(((oldPrice - effectivePrice) / oldPrice) * 100)
    : null

  const includes = COURSE_INCLUDES.map((fn) => fn(course)).filter(Boolean)

  useEffect(() => {
    if (!autoResume || !user || ownsCourse || resumedPurchase.current || !location.state?.purchaseAction) return
    resumedPurchase.current = true
    navigate(location.pathname, { replace: true, state: null })
    handleBuyNow()
  }, [autoResume, location.pathname, location.state, navigate, ownsCourse, user])

  async function handleBuyNow() {
    if (ownsCourse) {
      navigate(`/learn/${courseId}`)
      return
    }
    if (!user) {
      navigate('/login', {
        state: {
          from: { pathname: location.pathname, search: location.search, hash: location.hash },
          purchaseAction: isFree ? 'enroll' : 'buy',
        },
      })
      return
    }
    if (!isFree) {
      sessionStorage.setItem('edumaster:direct-checkout-course', JSON.stringify(course))
      navigate('/checkout', { state: { directCourse: course } })
      return
    }

    if (enrollingRef.current) return
    enrollingRef.current = true
    setEnrolling(true)
    try {
      const response = await createOrder({
        courseIds: [courseId],
        paymentMethod: 'free',
        paymentDetails: 'Free enrollment',
        billing: { fullName: user.name || '', email: user.email || '' },
      })
      const order = response?.data?.order
      if (!order?._id) throw new Error('Enrollment could not be completed')
      if (response.data.user) updateUser(response.data.user)
      sessionStorage.setItem('edumaster:last-order-id', order._id)
      await refreshCart()
      navigate('/order-success', {
        state: { order, enrollments: response.data.enrollments },
      })
    } catch (err) {
      error(err.message || 'Enrollment could not be completed. Please try again.')
    } finally {
      enrollingRef.current = false
      setEnrolling(false)
    }
  }

  function handleAddToCart() {
    if (!user) {
      navigate('/login', { state: { from: { pathname: location.pathname, search: location.search, hash: location.hash } } })
      return
    }
    addCourseToCart(course)
  }

  function handleWishlist() {
    if (!user) {
      navigate('/login', { state: { from: { pathname: location.pathname, search: location.search, hash: location.hash } } })
      return
    }
    toggleWishlist(course)
  }

  function handleCoupon() {
    const applied = calculateCoupon(effectivePrice, coupon)
    if (!applied) {
      setCouponApplied(false)
      setCouponError('Enter a valid coupon code.')
      sessionStorage.removeItem('edumaster:course-coupon')
      return
    }
    setCoupon(applied.code)
    setCouponApplied(true)
    setCouponError('')
    sessionStorage.setItem('edumaster:course-coupon', applied.code)
  }

  return (
    <div className="cdp-purchase-card">
      <div className="cdp-pc-includes">
        <p className="cdp-pc-includes-title">Course Includes:</p>
        {includes.map((item, i) => (
          <div key={i} className="cdp-pc-include-row">
            <CheckIcon />
            <span>{item}</span>
          </div>
        ))}
      </div>

      <div className="cdp-pc-price-block">
        {isFree ? (
          <div className="cdp-pc-price-row">
            <span className="cdp-pc-price free">Free</span>
            {oldPrice > 0 && <span className="cdp-pc-oldprice">{inr(oldPrice)}</span>}
            <ClockIcon />
            <span className="cdp-pc-limited">100% Off · Limited time!</span>
          </div>
        ) : (
          <div className="cdp-pc-price-row">
            <span className="cdp-pc-price">{inr(effectivePrice)}</span>
            {oldPrice && oldPrice > effectivePrice && (
              <span className="cdp-pc-oldprice">{inr(oldPrice)}</span>
            )}
            {discountPct && <span className="cdp-pc-discount-badge">{discountPct}% OFF</span>}
          </div>
        )}
      </div>

      <button className="cdp-btn-enroll" onClick={handleBuyNow} disabled={enrolling || isCartPending(course)}>
        {ownsCourse ? '▶ Continue Learning' : enrolling ? 'Enrolling…' : isFree ? '🛒 Enroll for Free' : '🛒 Buy Now'}
      </button>

      {!isFree && !ownsCourse && (
        <button
          className={`cdp-btn-add-cart${inCart ? ' in-cart' : ''}`}
          onClick={inCart ? () => navigate('/cart') : handleAddToCart}
          disabled={isCartPending(course)}
        >
          {inCart ? '✓ Go to Cart' : '🛒 Add to Cart'}
        </button>
      )}

      <button
        className={`cdp-btn-wishlist${wishlisted ? ' wishlisted' : ''}`}
        disabled={isWishlistPending(course)}
        onClick={handleWishlist}
        aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <HeartIcon filled={wishlisted} />
        {wishlisted ? 'Wishlisted' : 'Add to Wishlist'}
      </button>

      <div className="cdp-pc-audience">
        <p className="cdp-pc-audience-title">This course is perfect for:</p>
        {TARGET_AUDIENCE.map((a, i) => (
          <div key={i} className="cdp-pc-include-row">
            <CheckIcon />
            <span>{a}</span>
          </div>
        ))}
      </div>

      <div className="cdp-pc-coupon">
        <p className="cdp-pc-coupon-title">Have a coupon?</p>
        <div className="cdp-coupon-row">
          <input
            type="text"
            className="cdp-coupon-input"
            placeholder="Enter coupon code"
            value={coupon}
            onChange={(e) => { setCoupon(e.target.value); setCouponError('') }}
            disabled={couponApplied}
          />
          <button className="cdp-coupon-btn" onClick={handleCoupon} disabled={couponApplied || !coupon.trim()}>
            {couponApplied ? 'Applied' : 'Apply'}
          </button>
        </div>
        {couponError && <span className="cdp-coupon-error" role="status">{couponError}</span>}
        {couponApplied && <span className="cdp-coupon-success" role="status">Coupon will be applied at checkout.</span>}
      </div>

      <div className="cdp-pc-guarantee">
        <ShieldIcon />
        <div>
          <p className="cdp-guarantee-title">30-Day Money-Back Guarantee</p>
          <p className="cdp-guarantee-sub">Full refund if you're not satisfied</p>
        </div>
      </div>
    </div>
  )
}
