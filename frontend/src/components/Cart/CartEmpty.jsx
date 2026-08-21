import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

function EmptyCartIllustration() {
  return (
    <svg width="180" height="160" viewBox="0 0 180 160" fill="none">
      <ellipse cx="90" cy="148" rx="70" ry="8" fill="#f0f3f8"/>
      <rect x="30" y="40" width="120" height="90" rx="12" fill="#e3ecff" stroke="#2563eb" strokeWidth="1.5"/>
      <path d="M30 58h120" stroke="#2563eb" strokeWidth="1.2"/>
      <circle cx="50" cy="49" r="4" fill="#2563eb"/>
      <circle cx="65" cy="49" r="4" fill="#f9b233"/>
      <rect x="48" y="72" width="84" height="8" rx="4" fill="#c7d9ff"/>
      <rect x="58" y="88" width="64" height="6" rx="3" fill="#dde6fa"/>
      <rect x="68" y="102" width="44" height="6" rx="3" fill="#dde6fa"/>
      <circle cx="140" cy="32" r="18" fill="#fff7e0" stroke="#f9b233" strokeWidth="1.5"/>
      <text x="133" y="38" fontSize="18" fill="#f9b233">?</text>
    </svg>
  )
}

export default function CartEmpty() {
  return (
    <motion.div
      className="cart-empty"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <EmptyCartIllustration />
      <h2 className="cart-empty-title">Your cart is empty</h2>
      <p className="cart-empty-sub">Looks like you haven't added any courses yet. Explore our catalog and start learning today!</p>
      <Link to="/courses" className="cart-empty-btn">Browse Courses</Link>
    </motion.div>
  )
}
