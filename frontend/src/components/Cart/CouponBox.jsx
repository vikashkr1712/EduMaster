import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function TagIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
      <circle cx="7" cy="7" r="1.5" fill="#22c55e" stroke="none"/>
    </svg>
  )
}

export default function CouponBox({ onApply }) {
  const [code, setCode] = useState('')
  const [applied, setApplied] = useState(false)
  const [appliedCode, setAppliedCode] = useState('')

  function handleApply() {
    if (!code.trim()) return
    setApplied(true)
    setAppliedCode(code.trim())
    if (onApply) onApply(code.trim())
  }

  function handleRemove() {
    setApplied(false)
    setCode('')
    setAppliedCode('')
    if (onApply) onApply(null)
  }

  return (
    <div className="cart-coupon">
      <p className="cart-coupon-title">Have a coupon?</p>
      {applied ? (
        <div className="cart-coupon-applied">
          <TagIcon />
          <span className="cart-coupon-code">{appliedCode}</span>
          <span className="cart-coupon-saved">applied</span>
          <button className="cart-coupon-remove" onClick={handleRemove}>✕</button>
        </div>
      ) : (
        <div className="cart-coupon-row">
          <input
            type="text"
            className="cart-coupon-input"
            placeholder="Enter coupon code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleApply()}
          />
          <button
            className="cart-coupon-btn"
            onClick={handleApply}
            disabled={!code.trim()}
          >
            Apply
          </button>
        </div>
      )}
    </div>
  )
}
