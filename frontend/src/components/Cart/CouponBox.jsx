import { useState } from 'react'
import { useCart } from './CartProvider.jsx'

function TagIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
      <circle cx="7" cy="7" r="1.5" fill="#22c55e" stroke="none"/>
    </svg>
  )
}

export default function CouponBox() {
  const { couponCode, pricing, pricingLoading, applyCoupon, removeCoupon } = useCart()
  const [code, setCode] = useState(couponCode)
  const [error, setError] = useState('')

  async function handleApply() {
    if (!code.trim()) return
    setError('')
    try { await applyCoupon(code) }
    catch (requestError) { setError(requestError.message || 'This coupon could not be applied.') }
  }

  async function handleRemove() {
    setError('')
    try {
      await removeCoupon()
      setCode('')
    } catch (requestError) {
      setError(requestError.message || 'This coupon could not be removed.')
    }
  }

  return (
    <div className="cart-coupon">
      <p className="cart-coupon-title">Have a coupon?</p>
      {couponCode ? (
        <div className="cart-coupon-applied">
          <TagIcon />
          <span className="cart-coupon-code">{couponCode}</span>
          <span className="cart-coupon-saved">− ₹{Number(pricing.couponDiscount || 0).toLocaleString('en-IN')} applied</span>
          <button type="button" className="cart-coupon-remove" onClick={handleRemove} disabled={pricingLoading} aria-label={`Remove coupon ${couponCode}`}>✕</button>
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
            aria-invalid={Boolean(error)}
          />
          <button
            type="button"
            className="cart-coupon-btn"
            onClick={handleApply}
            disabled={!code.trim() || pricingLoading}
          >
            {pricingLoading ? 'Checking…' : 'Apply'}
          </button>
        </div>
      )}
      {error && <span className="chk-error" role="alert">{error}</span>}
    </div>
  )
}
