import DashboardLayout from '../../components/Dashboard/DashboardLayout.jsx'
import DashboardHeader from '../../components/Dashboard/DashboardHeader.jsx'
import DashboardContent from '../../components/Dashboard/DashboardContent.jsx'
import PaymentCard, { VisaMark, MastercardMark } from '../../components/Payments/PaymentCard.jsx'
import { SAVED_CARDS } from '../../components/Payments/paymentsData.js'
import { useNotifications } from '../../components/Notifications/NotificationProvider.jsx'
import '../../components/Payments/Payments.css'

const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" {...stroke}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

function CardPlusIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" {...stroke}>
      <rect x="2.5" y="5.5" width="16" height="11.5" rx="2" />
      <path d="M2.5 9.5h16" />
      <circle cx="18" cy="17" r="4.2" fill="#22c55e" stroke="none" />
      <path d="M18 15.2v3.6M16.2 17h3.6" stroke="#fff" strokeWidth="1.5" />
    </svg>
  )
}

function ShieldLockIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2.5 4.5 5.5v5.5c0 5.3 3.4 9 7.5 10.5 4.1-1.5 7.5-5.2 7.5-10.5V5.5Z" fill="#2563eb" />
      <rect x="9.3" y="10.2" width="5.4" height="4.6" rx="1" fill="#fff" />
      <path d="M10.6 10.2V9a1.4 1.4 0 0 1 2.8 0v1.2" stroke="#fff" strokeWidth="1.3" />
    </svg>
  )
}

const NETWORKS = [
  { id: 'visa', node: <VisaMark /> },
  { id: 'mastercard', node: <MastercardMark /> },
  { id: 'rupay', node: <span className="pay-brand-rupay">RuPay<span>›</span></span> },
  { id: 'upi', node: <span className="pay-brand-upi">UPI<span>›</span></span> },
]

export default function PaymentMethodsPage() {
  const { info } = useNotifications()
  const openAddCardNotice = () => info('Adding payment methods is coming soon.')

  return (
    <DashboardLayout>
      <DashboardHeader
        title="Payment Methods"
        subtitle="Manage your saved payment methods and billing details."
      />
      <DashboardContent>
        <div className="pay-section-head">
          <h3 className="pay-section-title">Saved Payment Methods</h3>
          <button type="button" className="pay-add-btn" onClick={openAddCardNotice}>
            <PlusIcon /> Add New Card
          </button>
        </div>

        <div className="pay-cards">
          {SAVED_CARDS.map((card) => (
            <PaymentCard key={card.id} card={card} />
          ))}
        </div>

        {/* dashed add-new panel */}
        <div className="pay-add-panel">
          <span className="pay-add-panel-icon"><CardPlusIcon /></span>
          <div className="pay-add-panel-text">
            <h4 className="pay-add-panel-title">Add New Payment Method</h4>
            <p className="pay-add-panel-desc">
              Add a new credit or debit card to make learning more convenient.
            </p>
          </div>
          <button type="button" className="pay-add-btn" onClick={openAddCardNotice}>Add New Card</button>
        </div>

        {/* security banner */}
        <div className="pay-secure">
          <span className="pay-secure-icon"><ShieldLockIcon /></span>
          <div className="pay-secure-text">
            <h4 className="pay-secure-title">Your Payments are Secure</h4>
            <p className="pay-secure-desc">
              We use industry-standard encryption to keep your payment information
              safe and secure. Your data is never stored or shared.
            </p>
          </div>
          <div className="pay-secure-brands">
            {NETWORKS.map(({ id, node }) => (
              <span key={id} className="pay-secure-chip">{node}</span>
            ))}
          </div>
        </div>
      </DashboardContent>
    </DashboardLayout>
  )
}
