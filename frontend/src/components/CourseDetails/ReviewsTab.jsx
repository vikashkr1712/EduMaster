import { motion } from 'framer-motion'

function StarIcon({ filled }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? '#F9B233' : '#e2e7f0'}>
      <path d="M12 2.5l2.9 5.9 6.6 1-4.7 4.6 1.1 6.5L12 17.4l-5.9 3.1 1.1-6.5L2.5 9.4l6.6-1L12 2.5z" />
    </svg>
  )
}

function ReviewerAvatar({ name }) {
  const hues = ['#2563EB', '#F97316', '#22C55E', '#8B5CF6', '#EC4899', '#0EA5E9']
  const hue = hues[name.length % hues.length]
  const initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2)
  return <span className="cdp-review-avatar" style={{ background: hue }}>{initials}</span>
}

function RatingBar({ label, pct }) {
  return (
    <div className="cdp-rating-bar-row">
      <span className="cdp-rating-bar-label">{label}</span>
      <div className="cdp-rating-bar-track">
        <motion.div
          className="cdp-rating-bar-fill"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
      <span className="cdp-rating-bar-pct">{pct}%</span>
    </div>
  )
}

export default function ReviewsTab({ course }) {
  const rating = Number(course.rating) || 4.8
  const reviews = Array.isArray(course.reviews) ? course.reviews : []

  return (
    <div className="cdp-reviews">
      <h3 className="cdp-section-title">Student Reviews</h3>
      <div className="cdp-reviews-summary">
        <div className="cdp-reviews-big-score">
          <span className="cdp-reviews-number">{rating.toFixed(1)}</span>
          <div className="cdp-reviews-stars">
            {[1,2,3,4,5].map((s) => <StarIcon key={s} filled={s <= Math.round(rating)} />)}
          </div>
          <span className="cdp-reviews-label">Course Rating</span>
        </div>
        {reviews.length > 0 && <div className="cdp-reviews-bars" />}
      </div>
      <div className="cdp-reviews-list">
        {reviews.map((rev, i) => (
          <motion.div
            key={i}
            className="cdp-review-card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <div className="cdp-review-top">
              <ReviewerAvatar name={rev.name} />
              <div className="cdp-review-meta">
                <span className="cdp-review-name">{rev.name}</span>
                <div className="cdp-review-stars-row">
                  {[1,2,3,4,5].map((s) => <StarIcon key={s} filled={s <= rev.rating} />)}
                  <span className="cdp-review-date">{rev.date}</span>
                </div>
              </div>
            </div>
            <p className="cdp-review-text">{rev.text}</p>
          </motion.div>
        ))}
        {!reviews.length && <p className="cdp-reviews-empty">No written reviews have been published for this course yet.</p>}
      </div>
    </div>
  )
}
