import CourseIllustration from '../Courses/CourseIllustrations.jsx'

function CheckIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="m5 12 4 4 10-10" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
}

function StarIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="#f9b233"><path d="m12 2.5 2.9 5.9 6.6 1-4.7 4.6 1.1 6.5-5.9-3.1-5.9 3.1 1.1-6.5-4.7-4.6 6.6-1L12 2.5Z"/></svg>
}

export default function OrderSummaryCard({ order }) {
  const course = order.courses?.[0] || {}
  const item = order.items?.[0] || {}
  const title = course.title || item.title || 'Course enrollment'
  const imageType = course.imageType || item.imageType || 'development'
  const instructor = course.instructor || item.instructor
  const rating = Number(course.rating ?? item.rating)
  const originalSubtotal = Number(order.subtotal || 0) + Number(order.courseDiscount || 0)
  const inr = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`
  const includes = [
    `${course.duration || 'Lifetime'} on-demand video`,
    'Full curriculum access',
    'Full lifetime access',
    'Access on mobile and TV',
    course.hasCertificate === false ? null : 'Certificate of completion',
  ].filter(Boolean)

  return (
    <div className="order-side-stack">
      <section className="order-side-card">
        <h3>Course Summary</h3>
        <div className="order-course-summary">
          <div className="order-course-art"><CourseIllustration type={imageType} /></div>
          <div className="order-course-copy">
            <h4>{title}</h4>
            {course.category || item.category ? <span className="order-course-category">{course.category || item.category}</span> : null}
            {instructor && <p>By {instructor}</p>}
            {Number.isFinite(rating) && rating > 0 && <span className="order-course-rating"><StarIcon /> {rating.toFixed(1)}</span>}
          </div>
        </div>
        {order.courses?.length > 1 && <p className="order-more-courses">+{order.courses.length - 1} more course{order.courses.length > 2 ? 's' : ''}</p>}
        <div className="order-includes">
          <strong>What's Included:</strong>
          {includes.map((value) => <span key={value}><CheckIcon /> {value}</span>)}
        </div>
      </section>

      <section className="order-side-card order-breakdown-card">
        <h3>Order Summary</h3>
        <div className="order-price-row"><span>Course Price</span><span>{inr(originalSubtotal)}</span></div>
        {order.courseDiscount > 0 && <div className="order-price-row is-discount"><span>Course Discount</span><span>− {inr(order.courseDiscount)}</span></div>}
        {order.coupon?.discount > 0 && <div className="order-price-row is-discount"><span>Coupon ({order.coupon.code})</span><span>− {inr(order.coupon.discount)}</span></div>}
        <div className="order-price-row"><span>GST (18%)</span><span>{inr(order.tax)}</span></div>
        <div className="order-price-total"><span>Total Amount</span><strong>{inr(order.amount)}</strong></div>
        <p className="order-payment-complete"><span>✓</span> Payment Completed</p>
      </section>
    </div>
  )
}
