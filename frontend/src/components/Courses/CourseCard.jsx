import CourseIllustration from './CourseIllustrations.jsx'
import { useWishlist } from '../Wishlist/WishlistProvider.jsx'

const CAT_CLASS = {
  Development: 'ccat-dev',
  'Data Science': 'ccat-data',
  Design: 'ccat-design',
  Business: 'ccat-business',
  Marketing: 'ccat-marketing',
  'IT & Software': 'ccat-it',
  'Personal Development': 'ccat-personal',
}

const CAT_ILLUSTRATION = {
  Development: 'development',
  'Data Science': 'datascience',
  Design: 'design',
  Business: 'business',
  Marketing: 'marketing',
  'IT & Software': 'cloud',
  'Personal Development': 'productivity',
}

function HeartIcon({ filled }) {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 20.5C6.5 15.7 3 12.6 3 8.9 3 6.2 5.2 4 7.9 4c1.6 0 3.1.8 4.1 2 1-1.2 2.5-2 4.1-2C18.8 4 21 6.2 21 8.9c0 3.7-3.5 6.8-9 11.6z"
        fill={filled ? '#EF4444' : 'none'}
        stroke={filled ? '#EF4444' : '#9AA5B5'}
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2.5l2.9 5.9 6.6 1-4.7 4.6 1.1 6.5L12 17.4l-5.9 3.1 1.1-6.5L2.5 9.4l6.6-1L12 2.5z"
        fill="#F9B233"
      />
    </svg>
  )
}

function StudentsIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="8" r="3.2" stroke="#8A97AB" strokeWidth="1.8" />
      <path d="M3.5 19c.6-3 2.9-4.8 5.5-4.8s4.9 1.8 5.5 4.8" stroke="#8A97AB" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M15.5 5.6a3.2 3.2 0 0 1 0 4.9M17.7 14.6c1.6.7 2.7 2.1 3 4.1" stroke="#8A97AB" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function InstructorAvatar({ name }) {
  const hues = ['#2563EB', '#F97316', '#22C55E', '#8B5CF6', '#EC4899', '#0EA5E9', '#F9B233']
  const safeName = name || 'EduMaster'
  const hue = hues[safeName.length % hues.length]
  const initials = safeName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
  return (
    <span className="course-avatar" style={{ background: hue }}>
      {initials}
    </span>
  )
}

export default function CourseCard({ course }) {
  const { isWishlisted, toggleWishlist, isPending } = useWishlist()
  const inr = (n) => `₹${n.toLocaleString('en-IN')}`

  const rating = Number(course.rating)
  const hasRating = Number.isFinite(rating) && rating > 0
  const studentCount = typeof course.students === 'string'
    ? parseInt(course.students.replace(/[,+]/g, ''), 10) || 0
    : Number(course.students) || 0
  const reviews = studentCount >= 5000
    ? `${(Math.round(studentCount / 500) / 10).toFixed(1)}K`
    : `${Math.round(studentCount / 5)}`

  const price = Number(course.price) || 0
  // a discountPrice of 0 means "no discount" (schema default), not a free course
  const rawDiscount = Number(course.discountPrice)
  const discountPrice = Number.isFinite(rawDiscount) && rawDiscount > 0 ? rawDiscount : null
  const effectivePrice = discountPrice ?? price
  const isFree = course.priceType === 'Free' || effectivePrice === 0
  const oldPrice = course.oldPrice ?? (discountPrice != null && discountPrice < price ? price : null)
  const imageType = course.imageType || CAT_ILLUSTRATION[course.category] || 'development'
  const wishlisted = isWishlisted(course)

  return (
    <article className="ccard">
      <div className="ccard-media">
        <CourseIllustration type={imageType} />
      </div>
      <div className="ccard-body">
        <div className="ccard-topline">
          <span className={`ccard-cat ${CAT_CLASS[course.category] || 'ccat-dev'}`}>
            {course.category}
          </span>
          <button className="ccard-wishlist" aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'} aria-pressed={wishlisted} disabled={isPending(course)} onClick={() => toggleWishlist(course)}>
            <HeartIcon filled={wishlisted} />
          </button>
        </div>

        <h3 className="ccard-title">{course.title}</h3>

        <div className="ccard-instructor">
          <InstructorAvatar name={course.instructor} />
          {course.instructor}
        </div>

        {(hasRating || studentCount > 0) && (
          <div className="ccard-meta">
            {hasRating && (
              <span className="ccard-rating">
                <StarIcon />
                <b>{rating.toFixed(1)}</b>
                <span className="ccard-reviews">({reviews})</span>
              </span>
            )}
            {studentCount > 0 && (
              <span className="ccard-students">
                <StudentsIcon />
                {course.students} Students
              </span>
            )}
          </div>
        )}

        <div className="ccard-pricing">
          {isFree ? (
            <span className="ccard-price ccard-price-free">Free</span>
          ) : (
            <>
              <span className="ccard-price">{inr(effectivePrice)}</span>
              {oldPrice != null && oldPrice > 0 && (
                <span className="ccard-oldprice">{inr(oldPrice)}</span>
              )}
            </>
          )}
        </div>
      </div>
    </article>
  )
}
