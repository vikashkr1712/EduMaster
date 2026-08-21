import { useState } from 'react'
import { calculateCoupon } from '../../utils/coupons.js'

function TagIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.9" strokeLinecap="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
      <circle cx="7" cy="7" r="1.5" fill="#22c55e" stroke="none"/>
    </svg>
  )
}

export default function CouponSection({ subtotal, onCouponApply, initialCode = '' }) {
  const [code, setCode] = useState(initialCode)
  const [applied, setApplied] = useState(() => calculateCoupon(subtotal, initialCode))
  const [error, setError] = useState('')

  function handleApply() {
    const upper = code.trim().toUpperCase()
    if (!upper) { setError('Enter a coupon code.'); return }
    const coupon = calculateCoupon(subtotal, upper)
    if (!coupon) { setError('Invalid coupon code.'); return }
    setApplied(coupon)
    setError('')
    onCouponApply(coupon)
  }

  function handleRemove() {
    setApplied(null)
    setCode('')
    setError('')
    onCouponApply(null)
  }

  return (
    <div className="chk-coupon">
      <p className="chk-coupon-title">Have a coupon?</p>
      {applied ? (
        <div className="chk-coupon-applied">
          <TagIcon />
          <span className="chk-coupon-code">{applied.code}</span>
          <span className="chk-coupon-savings">− ₹{applied.discount.toLocaleString('en-IN')} applied</span>
          <button className="chk-coupon-remove" onClick={handleRemove}>✕ Remove</button>
        </div>
      ) : (
        <>
          <div className="chk-coupon-row">
            <input
              type="text"
              className="chk-coupon-input"
              placeholder="Enter coupon code"
              value={code}
              onChange={e => { setCode(e.target.value); setError('') }}
              onKeyDown={e => e.key === 'Enter' && handleApply()}
            />
            <button className="chk-coupon-btn" onClick={handleApply} disabled={!code.trim()}>
              Apply
            </button>
          </div>
          {error && <span className="chk-error" style={{ marginTop: 6, display: 'block' }}>{error}</span>}
        </>
      )}
    </div>
  )
}
