import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { forwardRef } from 'react'
import { useCart } from '../Cart/CartProvider.jsx'
import { useWishlist } from '../Wishlist/WishlistProvider.jsx'
import CourseIllustration from '../Courses/CourseIllustrations.jsx'

const CAT_ILLUSTRATION = {
  Development: 'development', 'Data Science': 'datascience', Design: 'design',
  Business: 'business', Marketing: 'marketing', 'IT & Software': 'cloud',
  'Personal Development': 'productivity',
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
      <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
    </svg>
  )
}

function HeartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20.5C6.5 15.7 3 12.6 3 8.9 3 6.2 5.2 4 7.9 4c1.6 0 3.1.8 4.1 2 1-1.2 2.5-2 4.1-2C18.8 4 21 6.2 21 8.9c0 3.7-3.5 6.8-9 11.6z"/>
    </svg>
  )
}

function StarIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="#F9B233"><path d="M12 2.5l2.9 5.9 6.6 1-4.7 4.6 1.1 6.5L12 17.4l-5.9 3.1 1.1-6.5L2.5 9.4l6.6-1L12 2.5z"/></svg>
}

const CartItem = forwardRef(function CartItem({ item }, ref) {
  const { removeCourseFromCart, isPending } = useCart()
  const { toggleWishlist, isWishlisted } = useWishlist()
  const inr = (n) => `₹${Number(n).toLocaleString('en-IN')}`

  const course = item.course ?? {}
  const courseForHook = { _id: String(course._id ?? item._id ?? ''), ...course }
  const imageType = course.imageType || CAT_ILLUSTRATION[course.category] || 'development'
  const pending = isPending(courseForHook)

  const price = Number(item.price) || 0
  const discountPrice = Number(item.discountPrice) > 0 ? Number(item.discountPrice) : null
  const effectivePrice = discountPrice ?? price
  const oldPrice = Number(course.oldPrice)
  const originalPrice = Number.isFinite(oldPrice) && oldPrice > effectivePrice ? oldPrice : price
  const saved = Math.max(0, originalPrice - effectivePrice)
  const rating = Number(course.rating)
  const hasRating = Number.isFinite(rating) && rating > 0

  return (
    <motion.div
      ref={ref}
      className="cart-item"
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -40, height: 0, marginBottom: 0, padding: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Link to={course.slug ? `/courses/${course.slug}` : '#'} className="cart-item-thumb" tabIndex={-1}>
        <CourseIllustration type={imageType} />
      </Link>
      <div className="cart-item-body">
        <Link to={course.slug ? `/courses/${course.slug}` : '#'} className="cart-item-title-link">
          <h3 className="cart-item-title">{course.title || 'Course'}</h3>
        </Link>
        <p className="cart-item-instructor">{course.instructor}</p>
        {hasRating && (
          <span className="cart-item-rating">
            <StarIcon />
            <b>{rating.toFixed(1)}</b>
          </span>
        )}
        <div className="cart-item-actions">
          <button
            className="cart-item-btn cart-item-remove"
            onClick={() => removeCourseFromCart(courseForHook)}
            disabled={pending}
            aria-label="Remove from cart"
          >
            <TrashIcon /> Remove
          </button>
          <button
            className="cart-item-btn cart-item-wishlist"
            onClick={() => toggleWishlist(courseForHook)}
            aria-label="Move to wishlist"
          >
            <HeartIcon /> {isWishlisted(courseForHook) ? 'Wishlisted' : 'Save to Wishlist'}
          </button>
        </div>
      </div>
      <div className="cart-item-price">
        <span className="cart-item-effective-price">{inr(effectivePrice)}</span>
        {originalPrice > effectivePrice && (
          <span className="cart-item-original-price">{inr(originalPrice)}</span>
        )}
        {saved > 0 && (
          <span className="cart-item-saved">You save {inr(saved)}</span>
        )}
      </div>
    </motion.div>
  )
})

export default CartItem
