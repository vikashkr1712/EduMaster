import CourseIllustration from '../Courses/CourseIllustrations.jsx'

const CAT_ILLUSTRATION = {
  Development: 'development', 'Data Science': 'datascience', Design: 'design',
  Business: 'business', Marketing: 'marketing', 'IT & Software': 'cloud',
  'Personal Development': 'productivity',
}

function StarIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="#F9B233"><path d="M12 2.5l2.9 5.9 6.6 1-4.7 4.6 1.1 6.5L12 17.4l-5.9 3.1 1.1-6.5L2.5 9.4l6.6-1L12 2.5z"/></svg>
}

function CheckIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L19 7" stroke="#22c55e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
}

const INCLUDES = ['12 hours on-demand video', '48 lessons', 'Full lifetime access', 'Access on mobile and TV', 'Certificate of completion']

export default function OrderSummary({ items, subtotal, discount, couponDiscount, couponCode }) {
  const TAX_RATE = 0.18
  const afterCoupon = Math.max(0, subtotal - (couponDiscount || 0))
  const tax = Math.round(afterCoupon * TAX_RATE)
  const total = afterCoupon + tax
  const inr = (n) => `₹${Math.round(n).toLocaleString('en-IN')}`

  const firstItem = items?.[0]
  const course = firstItem?.course ?? {}
  const imageType = course.imageType || CAT_ILLUSTRATION[course.category] || 'development'
  const rating = Number(course.rating)

  return (
    <div className="chk-order-summary">
      <h3 className="chk-os-title">Course Summary</h3>

      {firstItem && (
        <div className="chk-os-course">
          <div className="chk-os-thumb">
            <CourseIllustration type={imageType} />
          </div>
          <div className="chk-os-info">
            <p className="chk-os-course-title">{course.title}</p>
            {course.category && (
              <span className="chk-os-cat">{course.category}</span>
            )}
            <p className="chk-os-instructor">By {course.instructor}</p>
            {Number.isFinite(rating) && rating > 0 && (
              <span className="chk-os-rating">
                <StarIcon /><b>{rating.toFixed(1)}</b>
              </span>
            )}
          </div>
        </div>
      )}

      {items?.length > 1 && (
        <p className="chk-os-more">+{items.length - 1} more course{items.length > 2 ? 's' : ''}</p>
      )}

      <div className="chk-os-includes">
        <p className="chk-os-includes-title">What's Included:</p>
        {INCLUDES.map((item, i) => (
          <div key={i} className="chk-os-include-row">
            <CheckIcon /><span>{item}</span>
          </div>
        ))}
      </div>

      <div className="chk-os-breakdown">
        <h4 className="chk-os-breakdown-title">Order Summary</h4>
        <div className="chk-os-row">
          <span>Course Price</span>
          <span>{inr(subtotal + discount)}</span>
        </div>
        {discount > 0 && (
          <div className="chk-os-row chk-os-discount">
            <span>Discount</span>
            <span>− {inr(discount)}</span>
          </div>
        )}
        {couponDiscount > 0 && (
          <div className="chk-os-row chk-os-discount">
            <span>Coupon ({couponCode})</span>
            <span>− {inr(couponDiscount)}</span>
          </div>
        )}
        <div className="chk-os-row">
          <span>GST (18%)</span>
          <span>{inr(tax)}</span>
        </div>
        <div className="chk-os-total">
          <span>Total Amount</span>
          <span>{inr(total)}</span>
        </div>
        {(discount > 0 || couponDiscount > 0) && (
          <p className="chk-os-savings">
            🎉 You save {inr(discount + (couponDiscount || 0))} on this order!
          </p>
        )}
      </div>
    </div>
  )
}
