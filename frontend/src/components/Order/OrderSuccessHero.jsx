import { motion } from 'framer-motion'

const CONFETTI = [
  ['8%', '13%', '#8b5cf6', -18], ['17%', '25%', '#60a5fa', 16], ['28%', '9%', '#fb7185', 40],
  ['41%', '19%', '#a78bfa', -35], ['57%', '9%', '#fbbf24', 22], ['72%', '18%', '#38bdf8', -12],
  ['87%', '11%', '#84cc16', 38], ['94%', '27%', '#f59e0b', -25], ['10%', '52%', '#fb7185', 20],
  ['23%', '43%', '#2dd4bf', -30], ['35%', '58%', '#60a5fa', 12], ['66%', '49%', '#f97316', -18],
  ['79%', '59%', '#22c55e', 34], ['91%', '46%', '#8b5cf6', -40], ['14%', '70%', '#22c55e', 18],
  ['31%', '77%', '#818cf8', -24], ['70%', '76%', '#fbbf24', 32], ['88%', '72%', '#38bdf8', -15],
]

function SuccessIcon() {
  return (
    <motion.div
      className="order-success-icon-ring"
      initial={{ scale: 0.35, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 190, damping: 14, delay: 0.12 }}
    >
      <svg width="74" height="74" viewBox="0 0 74 74" fill="none" aria-hidden="true">
        <circle cx="37" cy="37" r="35" fill="url(#successGradient)" />
        <motion.path
          d="m22 38 10 10 21-23"
          stroke="#fff"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.55, delay: 0.45 }}
        />
        <defs>
          <linearGradient id="successGradient" x1="15" y1="10" x2="61" y2="66" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3CCB59" /><stop offset="1" stopColor="#159431" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  )
}

function PlayIcon() {
  return <svg width="19" height="19" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/><path d="m10 8 6 4-6 4V8Z" fill="currentColor"/></svg>
}

function BookIcon() {
  return <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 6.5c-1.8-1.6-4.5-2-8-2v13c3.5 0 6.2.4 8 2 1.8-1.6 4.5-2 8-2v-13c-3.5 0-6.2.4-8 2Z"/><path d="M12 6.5v13"/></svg>
}

export default function OrderSuccessHero({ order, user, onStartLearning, onMyCourses, onContinueShopping }) {
  const isFreeEnrollment = order.paymentMethod === 'free' || Number(order.amount) === 0
  const firstName = (order.billing?.fullName || user?.name || 'Learner').trim().split(/\s+/)[0]
  const courseNames = order.courses?.map((course) => course.title).filter(Boolean).join(', ')
    || order.items?.map((item) => item.title).join(', ')
  const paymentLabels = { card: 'Credit / Debit Card', upi: 'UPI', netbanking: 'Net Banking', wallet: 'Wallet', free: 'Free Enrollment' }
  const date = new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(order.createdAt))
  const amount = `₹${Number(order.amount || 0).toLocaleString('en-IN')}`
  const details = [
    ['Order Number', order.orderNumber],
    ['Purchase Date', date],
    ['Amount Paid', amount],
    ['Payment Method', paymentLabels[order.paymentMethod] || order.paymentMethod],
    ['Email', order.billing?.email || user?.email || '—'],
    ['Course Name', courseNames || 'Your course'],
  ]

  return (
    <motion.section
      className="order-success-hero"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <div className="order-confetti" aria-hidden="true">
        {CONFETTI.map(([left, top, color, rotate], index) => (
          <motion.span
            key={`${left}-${top}`}
            style={{ left, top, background: color, rotate }}
            initial={{ opacity: 0, y: -18, scale: 0 }}
            animate={{ opacity: [0, 1, 1], y: [0, 14, 8], scale: 1 }}
            transition={{ duration: 0.8, delay: 0.08 + index * 0.025 }}
          />
        ))}
      </div>

      <div className="order-success-copy">
        <SuccessIcon />
        <h1>{isFreeEnrollment ? 'Enrollment Successful!' : 'Payment Successful!'}</h1>
        <h2>Congratulations, {firstName}!</h2>
        <p>You are successfully enrolled.<br />You can now access all your course content.</p>
      </div>

      <div className="order-info-card">
        {details.map(([label, value]) => (
          <div className="order-info-item" key={label}>
            <span>{label}</span>
            <strong title={String(value)}>{value}</strong>
          </div>
        ))}
      </div>

      <div className="order-actions">
        <button type="button" className="order-action-primary" onClick={onStartLearning}><BookIcon /> Start Learning</button>
        <button type="button" className="order-action-secondary" onClick={onMyCourses}><PlayIcon /> Go To My Courses</button>
        <button type="button" className="order-action-link" onClick={onContinueShopping}>Continue Shopping</button>
      </div>
    </motion.section>
  )
}
