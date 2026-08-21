import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCourses } from '../../api/course.js'
import { useCart } from './CartProvider.jsx'
import CourseIllustration from '../Courses/CourseIllustrations.jsx'
import { useAuth } from '../Auth/AuthProvider.jsx'

const CAT_ILLUSTRATION = {
  Development: 'development', 'Data Science': 'datascience', Design: 'design',
  Business: 'business', Marketing: 'marketing', 'IT & Software': 'cloud',
  'Personal Development': 'productivity',
}

function StarIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="#F9B233"><path d="M12 2.5l2.9 5.9 6.6 1-4.7 4.6 1.1 6.5L12 17.4l-5.9 3.1 1.1-6.5L2.5 9.4l6.6-1L12 2.5z"/></svg>
}

function RecoCard({ course }) {
  const { addCourseToCart, isInCart, isPending } = useCart()
  const inCart = isInCart(course)
  const pending = isPending(course)
  const price = Number(course.discountPrice) > 0 ? Number(course.discountPrice) : Number(course.price)
  const isFree = course.priceType === 'Free' || price === 0
  const imageType = course.imageType || CAT_ILLUSTRATION[course.category] || 'development'

  return (
    <div className="cart-reco-card">
      <Link to={course.slug ? `/courses/${course.slug}` : '#'} className="cart-reco-thumb">
        <CourseIllustration type={imageType} />
      </Link>
      <div className="cart-reco-body">
        <Link to={course.slug ? `/courses/${course.slug}` : '#'} className="cart-reco-title-link">
          <h4 className="cart-reco-title">{course.title}</h4>
        </Link>
        <p className="cart-reco-instructor">{course.instructor}</p>
        {Number(course.rating) > 0 && (
          <span className="cart-reco-rating"><StarIcon /><b>{Number(course.rating).toFixed(1)}</b></span>
        )}
        <div className="cart-reco-footer">
          <span className="cart-reco-price">{isFree ? 'Free' : `₹${price.toLocaleString('en-IN')}`}</span>
          {!isFree && (
            <button
              className={`cart-reco-btn${inCart ? ' in-cart' : ''}`}
              onClick={() => !inCart && addCourseToCart(course)}
              disabled={pending || inCart}
            >
              {inCart ? 'In Cart ✓' : 'Add to Cart'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CartRecommendations() {
  const { items } = useCart()
  const { user } = useAuth()
  const [courses, setCourses] = useState([])

  useEffect(() => {
    const cartIds = new Set(items.map((i) => String(i.course?._id ?? i.course?.id ?? '')))
    const ownedIds = new Set((user?.enrolledCourses || []).map((entry) => String(entry?._id ?? entry)))
    getCourses({ limit: 8, sort: 'ratingDesc' })
      .then((res) => {
        const all = Array.isArray(res?.data?.courses) ? res.data.courses : []
        const filtered = all
          .filter((c) => {
            const id = String(c._id ?? c.id)
            return !cartIds.has(id) && !ownedIds.has(id)
          })
          .slice(0, 3)
        setCourses(filtered)
      })
      .catch(() => setCourses([]))
  }, [items, user?.enrolledCourses])

  if (courses.length === 0) return null

  return (
    <div className="cart-recommendations">
      <h3 className="cart-reco-heading">You may also like</h3>
      <div className="cart-reco-grid">
        {courses.map((c) => <RecoCard key={c._id ?? c.id} course={c} />)}
      </div>
    </div>
  )
}
