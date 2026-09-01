import { useState } from 'react'

function TagIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.9" strokeLinecap="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
      <circle cx="7" cy="7" r="1.5" fill="#22c55e" stroke="none"/>
    </svg>
  )
}

export default function CouponSection({ appliedCode = '', couponDiscount = 0, onApply, onRemove, pending = false, initialCode = '' }) {
  const [code, setCode] = useState(initialCode)
  const [error, setError] = useState('')

  async function handleApply() {
    const upper = code.trim().toUpperCase()
    if (!upper) { setError('Enter a coupon code.'); return }
    setError('')
    try { await onApply(upper) }
    catch (requestError) { setError(requestError.message || 'This coupon could not be applied.') }
  }

  async function handleRemove() {
    setError('')
    try {
      await onRemove()
      setCode('')
    } catch (requestError) { setError(requestError.message || 'This coupon could not be removed.') }
  }

  return (
    <div className="chk-coupon">
      <p className="chk-coupon-title">Have a coupon?</p>
      {appliedCode ? (
        <div className="chk-coupon-applied">
          <TagIcon />
          <span className="chk-coupon-code">{appliedCode}</span>
          <span className="chk-coupon-savings">− ₹{Number(couponDiscount).toLocaleString('en-IN')} applied</span>
          <button type="button" className="chk-coupon-remove" onClick={handleRemove} disabled={pending}>✕ Remove</button>
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
            <button type="button" className="chk-coupon-btn" onClick={handleApply} disabled={!code.trim() || pending}>
              {pending ? 'Checking…' : 'Apply'}
            </button>
          </div>
          {error && <span className="chk-error" style={{ marginTop: 6, display: 'block' }}>{error}</span>}
        </>
      )}
    </div>
  )
}
