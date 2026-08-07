import { useNotifications } from '../Notifications/NotificationProvider.jsx'
import CourseIllustration from '../Courses/CourseIllustrations.jsx'

function HeartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20.2 4.9 13a4.6 4.6 0 0 1 0-6.5 4.5 4.5 0 0 1 6.4 0l.7.7.7-.7a4.5 4.5 0 0 1 6.4 0 4.6 4.6 0 0 1 0 6.5Z" />
    </svg>
  )
}

function StarIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="m12 4 2.3 4.9 5.2.7-3.8 3.7.9 5.2L12 16l-4.6 2.5.9-5.2-3.8-3.7 5.2-.7Z" />
    </svg>
  )
}

export default function WishlistCard({ item, onRemove }) {
  const { info } = useNotifications()
  const { title, instructor, category, categoryTint, tint, rating, reviews, price, originalPrice } = item
  const imageType = category === 'Data Science' ? 'datascience' : category === 'Design' ? 'design' : category === 'Cloud' ? 'cloud' : 'development'

  return (
    <article className="wishlist-card">
      <div className="wishlist-art">
        <CourseIllustration type={imageType} />
        <button
          type="button"
          className="wishlist-heart"
          aria-label={`Remove ${title} from wishlist`}
          onClick={() => onRemove(item)}
        >
          <HeartIcon />
        </button>
      </div>

      <div className="wishlist-body">
        <span className={`profile-pill profile-pill--${categoryTint}`}>{category}</span>
        <h4 className="wishlist-title">{title}</h4>
        <p className="wishlist-instructor">By {instructor}</p>

        <div className="wishlist-rating">
          <span className="wishlist-stars" aria-hidden="true">
            <StarIcon /><StarIcon /><StarIcon /><StarIcon /><StarIcon />
          </span>
          <span className="wishlist-rating-value">{rating}</span>
          <span className="wishlist-reviews">({reviews})</span>
        </div>

        <div className="wishlist-price-row">
          <span className="wishlist-price">{price}</span>
          <span className="wishlist-price-original">{originalPrice}</span>
        </div>

        <button
          type="button"
          className="wishlist-cart-btn"
          onClick={() => info('Cart and checkout are coming soon.')}
        >
          Add to Cart
        </button>
      </div>
    </article>
  )
}
