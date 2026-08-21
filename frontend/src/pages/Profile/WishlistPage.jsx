import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/Dashboard/DashboardLayout.jsx'
import DashboardHeader from '../../components/Dashboard/DashboardHeader.jsx'
import DashboardContent from '../../components/Dashboard/DashboardContent.jsx'
import WishlistCard from '../../components/Wishlist/WishlistCard.jsx'
import { useWishlist } from '../../components/Wishlist/WishlistProvider.jsx'
import '../../components/Wishlist/Wishlist.css'

function HeartOutlineIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20.2 4.9 13a4.6 4.6 0 0 1 0-6.5 4.5 4.5 0 0 1 6.4 0l.7.7.7-.7a4.5 4.5 0 0 1 6.4 0 4.6 4.6 0 0 1 0 6.5Z" />
    </svg>
  )
}

export default function WishlistPage() {
  const { items, removeWishlistItem } = useWishlist()
  const displayItems = items.map((item) => {
    const tint = item.tint || ({ 'Data Science': 'green', Design: 'purple' }[item.category] || 'blue')
    const art = item.art || ({ 'Data Science': 'chart', Design: 'design', 'IT & Software': 'cloud' }[item.category] || 'code')
    const formatPrice = (value) => typeof value === 'number' ? `₹${value.toLocaleString('en-IN')}` : value
    return {
      ...item,
      id: item._id ?? item.id,
      tint,
      art,
      reviews: item.reviews || '—',
      price: formatPrice(item.price),
      originalPrice: formatPrice(item.originalPrice ?? item.oldPrice),
    }
  })

  const removeItem = async (item) => {
    await removeWishlistItem(item)
  }

  return (
    <DashboardLayout>
      <DashboardHeader
        title="My Wishlist"
        subtitle="Courses you have saved for later."
      />
      <DashboardContent>
        {displayItems.length > 0 ? (
          <>
            <p className="cert-count">
              {displayItems.length} {displayItems.length === 1 ? 'course' : 'courses'} in your wishlist
            </p>
            <div className="wishlist-grid">
              {displayItems.map((item) => (
                <WishlistCard key={item.id} item={item} onRemove={removeItem} />
              ))}
            </div>
          </>
        ) : (
          <div className="wishlist-empty">
            <span className="wishlist-empty-icon"><HeartOutlineIcon /></span>
            <h3 className="wishlist-empty-title">Your wishlist is empty</h3>
            <p className="wishlist-empty-text">
              Browse our courses and tap the heart icon to save them for later.
            </p>
            <Link to="/courses" className="wishlist-empty-btn">Explore Courses</Link>
          </div>
        )}
      </DashboardContent>
    </DashboardLayout>
  )
}
