import { useState, useCallback, useRef } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../../components/Home/Navbar/Navbar.jsx'
import Footer from '../../components/Home/Footer/Footer.jsx'
import { useCart } from '../../components/Cart/CartProvider.jsx'
import { useAuth } from '../../components/Auth/AuthProvider.jsx'
import { useNotifications } from '../../components/Notifications/NotificationProvider.jsx'
import { createOrder } from '../../api/order.js'
import PaymentSelector from '../../components/Checkout/PaymentSelector.jsx'
import BillingForm from '../../components/Checkout/BillingForm.jsx'
import OrderSummary from '../../components/Checkout/OrderSummary.jsx'
import CouponSection from '../../components/Checkout/CouponSection.jsx'
import './CheckoutPage.css'
import { calculateCoupon } from '../../utils/coupons.js'

const TAX_RATE = 0.18

function validateBilling(data) {
  const errs = {}
  if (!data.fullName?.trim()) errs.fullName = 'Full name is required'
  if (!data.email?.trim()) errs.email = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errs.email = 'Invalid email address'
  if (!data.phone?.trim()) errs.phone = 'Phone number is required'
  else if (data.phone.replace(/\D/g, '').length < 10) errs.phone = 'Enter a valid phone number'
  return errs
}

function validatePayment(method, cardData, upiValue, bankValue, walletValue) {
  const errs = {}
  if (method === 'card') {
    const rawCard = cardData.cardNumber?.replace(/\s/g, '') || ''
    if (!/^\d{16}$/.test(rawCard)) errs.cardNumber = 'Enter a valid 16-digit card number'
    if (!cardData.cardHolder?.trim()) errs.cardHolder = 'Card holder name is required'
    const expiryMatch = (cardData.expiry || '').match(/^(\d{2})\s*\/\s*(\d{2})$/)
    if (!expiryMatch || Number(expiryMatch[1]) < 1 || Number(expiryMatch[1]) > 12) {
      errs.expiry = 'Enter a valid expiry as MM / YY'
    } else {
      const expiryDate = new Date(2000 + Number(expiryMatch[2]), Number(expiryMatch[1]))
      const thisMonth = new Date()
      thisMonth.setDate(1)
      thisMonth.setHours(0, 0, 0, 0)
      if (expiryDate <= thisMonth) errs.expiry = 'This card has expired'
    }
    if (!/^\d{3,4}$/.test(cardData.cvv || '')) errs.cvv = 'Enter a valid CVV'
  }
  const upiErr = method === 'upi' && !/^[\w.-]{2,}@[A-Za-z]{2,}$/.test((upiValue || '').trim())
    ? 'Enter a valid UPI ID (e.g. name@upi)'
    : ''
  const bankError = method === 'netbanking' && !bankValue ? 'Select a bank to continue' : ''
  const walletError = method === 'wallet' && !walletValue ? 'Select a wallet to continue' : ''
  return { cardErrors: errs, upiError: upiErr, bankError, walletError }
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 2.5 19 5v6c0 4.4-2.8 8.1-7 9.5C7.8 19.1 5 15.4 5 11V5l7-2.5Z" fill="#dcf7e5" stroke="#22c55e" strokeWidth="1.8" />
      <path d="m9 12 2 2 4-4" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function CheckoutPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { items, subtotal, discount, count, refreshCart } = useCart()
  const { user, updateUser } = useAuth()
  const { error: notifyError } = useNotifications()

  const [method, setMethod] = useState('card')
  const [cardData, setCardData] = useState({ cardNumber: '', cardHolder: '', expiry: '', cvv: '' })
  const [cardErrors, setCardErrors] = useState({})
  const [upiValue, setUpiValue] = useState('')
  const [upiError, setUpiError] = useState('')
  const [bankValue, setBankValue] = useState('')
  const [bankError, setBankError] = useState('')
  const [walletValue, setWalletValue] = useState('')
  const [walletError, setWalletError] = useState('')

  const [billing, setBilling] = useState({ fullName: user?.name || '', email: user?.email || '', phone: '', country: 'India', state: '', city: '', pincode: '', address1: '', address2: '' })
  const [billingErrors, setBillingErrors] = useState({})
  const [touched, setTouched] = useState({})

  const [submitting, setSubmitting] = useState(false)
  const submittingRef = useRef(false)
  const [directCourse] = useState(() => {
    if (location.state?.directCourse) return location.state.directCourse
    try { return JSON.parse(sessionStorage.getItem('edumaster:direct-checkout-course')) || null } catch { return null }
  })
  const [initialCouponCode] = useState(() => sessionStorage.getItem('edumaster:course-coupon') || '')
  const directItem = directCourse ? {
    _id: `direct-${directCourse._id ?? directCourse.id ?? directCourse.sourceId}`,
    course: directCourse,
    price: Number(directCourse.price) || 0,
    discountPrice: Number(directCourse.discountPrice) || 0,
  } : null
  const checkoutItems = directItem ? [directItem] : items
  const checkoutCount = checkoutItems.length
  const checkoutSubtotal = checkoutItems.reduce((sum, item) => sum + (Number(item.discountPrice) > 0 ? Number(item.discountPrice) : Number(item.price) || 0), 0)
  const checkoutOriginalTotal = checkoutItems.reduce((sum, item) => {
    const course = item.course || {}
    const current = Number(item.discountPrice) > 0 ? Number(item.discountPrice) : Number(item.price) || 0
    const oldPrice = Number(course.oldPrice)
    return sum + (Number.isFinite(oldPrice) && oldPrice > current ? oldPrice : Number(item.price) || current)
  }, 0)
  const checkoutDiscount = Math.max(0, checkoutOriginalTotal - checkoutSubtotal)
  const [coupon, setCoupon] = useState(() => calculateCoupon(checkoutSubtotal, initialCouponCode))

  const onBillingChange = useCallback((name, value) => {
    setBilling(prev => ({ ...prev, [name]: value }))
    setBillingErrors(prev => { const n = { ...prev }; delete n[name]; return n })
  }, [])

  const onBlur = useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }))
    const errs = validateBilling({ ...billing })
    setBillingErrors(errs)
  }, [billing])

  const onCardChange = useCallback((name, value) => {
    setCardData(prev => ({ ...prev, [name]: value }))
    setCardErrors(prev => { const n = { ...prev }; delete n[name]; return n })
  }, [])

  const onMethodChange = useCallback((nextMethod) => {
    setMethod(nextMethod)
    setCardErrors({})
    setUpiError('')
    setBankError('')
    setWalletError('')
  }, [])

  const couponDiscount = coupon?.discount || 0
  const afterCoupon = Math.max(0, checkoutSubtotal - couponDiscount)
  const tax = Math.round(afterCoupon * TAX_RATE)
  const total = afterCoupon + tax

  async function handlePay() {
    if (submittingRef.current) return

    const allTouched = { fullName: true, email: true, phone: true }
    setTouched(prev => ({ ...prev, ...allTouched }))
    const bErrors = validateBilling(billing)
    setBillingErrors(bErrors)
    const {
      cardErrors: pErrors,
      upiError: uErr,
      bankError: bErr,
      walletError: wErr,
    } = validatePayment(method, cardData, upiValue, bankValue, walletValue)
    setCardErrors(pErrors)
    setUpiError(uErr)
    setBankError(bErr)
    setWalletError(wErr)

    if (Object.keys(bErrors).length > 0 || Object.keys(pErrors).length > 0 || uErr || bErr || wErr) return

    submittingRef.current = true
    setSubmitting(true)
    try {
      const paymentDetails = method === 'card'
        ? `•••• ${cardData.cardNumber.replace(/\s/g, '').slice(-4)}`
        : method === 'upi'
          ? upiValue.trim()
          : method === 'netbanking'
            ? bankValue
            : walletValue
      const response = await createOrder({
        ...(directCourse ? { courseIds: [String(directCourse._id ?? directCourse.id ?? directCourse.sourceId)] } : {}),
        couponCode: coupon?.code,
        paymentMethod: method,
        paymentDetails,
        billing,
      })
      const order = response?.data?.order
      if (!order?._id) throw new Error('The order could not be completed')

      if (response.data.user) updateUser(response.data.user)
      sessionStorage.setItem('edumaster:last-order-id', order._id)
      sessionStorage.removeItem('edumaster:direct-checkout-course')
      sessionStorage.removeItem('edumaster:course-coupon')
      await refreshCart()
      navigate('/order-success', {
        state: { order, enrollments: response.data.enrollments },
        replace: true,
      })
    } catch (err) {
      notifyError(err.message || 'Payment could not be completed. Please try again.')
    } finally {
      submittingRef.current = false
      setSubmitting(false)
    }
  }

  const inr = (value) => `₹${Math.round(value).toLocaleString('en-IN')}`

  return (
    <>
      <Navbar />

      <div className="chk-breadcrumb-bar">
        <div className="container chk-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true">›</span>
          <Link to="/courses">Courses</Link>
          <span aria-hidden="true">›</span>
          <Link to="/cart">Shopping Cart</Link>
          <span aria-hidden="true">›</span>
          <span className="chk-breadcrumb-current">Checkout</span>
        </div>
      </div>

      <main className="chk-page">
        <div className="container">
          <motion.div
            className="chk-heading"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <h1>Complete Your Enrollment</h1>
            <p>Choose a payment method and complete your purchase to access your courses.</p>
          </motion.div>

          {checkoutCount === 0 ? (
            <section className="chk-empty" aria-labelledby="checkout-empty-title">
              <span className="chk-empty-icon" aria-hidden="true">🛒</span>
              <h2 id="checkout-empty-title">Your cart is empty</h2>
              <p>Add a course to your cart before starting checkout.</p>
              <Link to="/courses" className="chk-empty-button">Browse Courses</Link>
            </section>
          ) : (
            <div className="chk-layout">
              <motion.section
                className="chk-main-card"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
              >
                <PaymentSelector
                  method={method}
                  onMethodChange={onMethodChange}
                  cardData={cardData}
                  onCardChange={onCardChange}
                  cardErrors={cardErrors}
                  upiValue={upiValue}
                  onUpiChange={(value) => { setUpiValue(value); setUpiError('') }}
                  upiError={upiError}
                  bankValue={bankValue}
                  onBankChange={(value) => { setBankValue(value); setBankError('') }}
                  bankError={bankError}
                  walletValue={walletValue}
                  onWalletChange={(value) => { setWalletValue(value); setWalletError('') }}
                  walletError={walletError}
                />

                <div className="chk-divider" />

                <BillingForm
                  data={billing}
                  onChange={onBillingChange}
                  errors={billingErrors}
                  touched={touched}
                  onBlur={onBlur}
                />

                <button
                  type="button"
                  className="chk-pay-button"
                  onClick={handlePay}
                  disabled={submitting}
                  aria-busy={submitting}
                >
                  {submitting ? (
                    <><span className="chk-spinner" aria-hidden="true" /> Processing Payment…</>
                  ) : (
                    <><LockIcon /> Pay Securely {inr(total)}</>
                  )}
                </button>

                <div className="chk-security" aria-label="Checkout security information">
                  <div className="chk-security-lead">
                    <ShieldIcon />
                    <div><strong>Secure Checkout</strong><span>Your information is protected</span></div>
                  </div>
                  <div className="chk-security-points">
                    <span>SSL Encrypted</span>
                    <span>Money Back Guarantee</span>
                    <span>Safe Payments</span>
                  </div>
                </div>
              </motion.section>

              <motion.aside
                className="chk-sidebar"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.12 }}
              >
                <OrderSummary
                  items={checkoutItems}
                  subtotal={checkoutSubtotal}
                  discount={checkoutDiscount}
                  couponDiscount={couponDiscount}
                  couponCode={coupon?.code}
                />
                <CouponSection subtotal={checkoutSubtotal} onCouponApply={setCoupon} initialCode={initialCouponCode} />
                <div className="chk-guarantee-card">
                  <ShieldIcon />
                  <div>
                    <strong>30-Day Money-Back Guarantee</strong>
                    <span>Full refund if you're not satisfied</span>
                  </div>
                </div>
              </motion.aside>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
