import { useNavigate } from 'react-router-dom'
import { useCart } from './CartProvider.jsx'
import CouponBox from './CouponBox.jsx'

const TAX_RATE = 0.18

function ShieldIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 2l7 3v6c0 4.5-3 8.3-7 9.5C8 19.3 5 15.5 5 11V5l7-3z" stroke="#22c55e" strokeWidth="1.8" fill="#dcf7e5"/>
      <path d="M9 12l2 2 4-4" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function LockIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
      <rect x="3" y="11" width="18" height="11" rx="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  )
}

export default function CartSummary() {
  const navigate = useNavigate()
  const { items, subtotal, originalTotal, discount, count } = useCart()
  const inr = (n) => `₹${Math.round(n).toLocaleString('en-IN')}`

  const tax = Math.round(subtotal * TAX_RATE)
  const total = subtotal + tax

  if (count === 0) return null

  const proceedToCheckout = () => {
    sessionStorage.removeItem('edumaster:direct-checkout-course')
    sessionStorage.removeItem('edumaster:course-coupon')
    navigate('/checkout')
  }

  return (
    <div className="cart-summary">
      <h3 className="cart-summary-title">Order Summary</h3>

      <div className="cart-summary-rows">
        <div className="cart-summary-row">
          <span>Original Price</span>
          <span>{inr(originalTotal)}</span>
        </div>
        {discount > 0 && (
          <div className="cart-summary-row discount">
            <span>Discount</span>
            <span>− {inr(discount)}</span>
          </div>
        )}
        <div className="cart-summary-row">
          <span>Subtotal</span>
          <span>{inr(subtotal)}</span>
        </div>
        <div className="cart-summary-row">
          <span>GST (18%)</span>
          <span>{inr(tax)}</span>
        </div>
      </div>

      <div className="cart-summary-total">
        <span>Total</span>
        <span>{inr(total)}</span>
      </div>

      {discount > 0 && (
        <p className="cart-summary-savings">🎉 You save {inr(discount)} on this order!</p>
      )}

      <CouponBox />

      <button
        className="cart-checkout-btn"
        onClick={proceedToCheckout}
      >
        <LockIcon />
        Proceed to Checkout
      </button>

      <div className="cart-guarantee">
        <ShieldIcon />
        <span>30-Day Money-Back Guarantee</span>
      </div>
    </div>
  )
}
