import Avatar from '../../assets/svg/common/Avatar.jsx'

function QuoteIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="#2563EB">
      <path d="M4 12c0-4 2.5-7 6.5-8l.8 1.8C8.6 7 7.4 8.6 7.2 10.5c.3-.1.7-.2 1.1-.2 1.9 0 3.2 1.4 3.2 3.3 0 2-1.5 3.4-3.5 3.4C5.5 17 4 15 4 12zm10 0c0-4 2.5-7 6.5-8l.8 1.8c-2.7 1.2-3.9 2.8-4.1 4.7.3-.1.7-.2 1.1-.2 1.9 0 3.2 1.4 3.2 3.3 0 2-1.5 3.4-3.5 3.4-2.5 0-4-2-4-5z" />
    </svg>
  )
}

function StarRow({ rating }) {
  return (
    <div className="tcard-stars" aria-label={`Rated ${rating} out of 5`}>
      {[...Array(5)].map((_, i) => (
        <svg key={i} width="17" height="17" viewBox="0 0 24 24">
          <path
            d="M12 2.5l2.9 5.9 6.6 1-4.7 4.6 1.1 6.5L12 17.4l-5.9 3.1 1.1-6.5L2.5 9.4l6.6-1L12 2.5z"
            fill={i < rating ? '#F9B233' : '#E3E8F0'}
          />
        </svg>
      ))}
    </div>
  )
}

export default function TestimonialCard({ testimonial }) {
  const t = testimonial
  return (
    <article className="tcard">
      <div className="tcard-topline">
        <QuoteIcon />
        <StarRow rating={t.rating} />
      </div>
      <p className="tcard-text">{t.review}</p>
      <div className="tcard-person">
        <Avatar variant={t.avatar} size={44} />
        <div className="tcard-person-copy">
          <span className="tcard-name">{t.name}</span>
          <span className="tcard-role">{t.designation}</span>
          <span className="tcard-company">Placed at {t.company}</span>
        </div>
      </div>
    </article>
  )
}
