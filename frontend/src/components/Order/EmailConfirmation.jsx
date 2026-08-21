import { motion } from 'framer-motion'

export default function EmailConfirmation({ email }) {
  return (
    <motion.div
      className="order-email-card"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.32 }}
    >
      <span className="order-email-icon" aria-hidden="true">
        <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>
      </span>
      <div>
        <strong>We've sent the course details to your email</strong>
        <span>{email || 'Your account email'}</span>
        <p>Invoice, receipt, and enrollment confirmation are included.</p>
      </div>
      <span className="order-email-check" aria-label="Email confirmation sent">✓</span>
    </motion.div>
  )
}
