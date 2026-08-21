import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/Dashboard/DashboardLayout.jsx'
import DashboardHeader from '../../components/Dashboard/DashboardHeader.jsx'
import DashboardContent from '../../components/Dashboard/DashboardContent.jsx'
import { VisaMark, MastercardMark } from '../../components/Payments/PaymentCard.jsx'
import '../../components/Payments/Payments.css'

function ShieldLockIcon() {
  return <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2.5 4.5 5.5v5.5c0 5.3 3.4 9 7.5 10.5 4.1-1.5 7.5-5.2 7.5-10.5V5.5Z" fill="#2563eb" /><rect x="9.3" y="10.2" width="5.4" height="4.6" rx="1" fill="#fff" /><path d="M10.6 10.2V9a1.4 1.4 0 0 1 2.8 0v1.2" stroke="#fff" strokeWidth="1.3" /></svg>
}

const NETWORKS = [<VisaMark key="visa" />, <MastercardMark key="mastercard" />, <span className="pay-brand-rupay" key="rupay">RuPay<span>›</span></span>, <span className="pay-brand-upi" key="upi">UPI<span>›</span></span>]

export default function PaymentMethodsPage() {
  return <DashboardLayout><DashboardHeader title="Payment Methods" subtitle="Payment options are selected securely during checkout." /><DashboardContent>
    <div className="pay-add-panel"><span className="pay-add-panel-icon" aria-hidden="true">💳</span><div className="pay-add-panel-text"><h3 className="pay-add-panel-title">No saved payment methods</h3><p className="pay-add-panel-desc">EduMaster does not store raw card or UPI credentials. Choose an available payment method when you enroll in a paid course.</p></div><Link className="pay-add-btn" to="/courses">Browse Courses</Link></div>
    <div className="pay-secure"><span className="pay-secure-icon"><ShieldLockIcon /></span><div className="pay-secure-text"><h4 className="pay-secure-title">Your Payments are Secure</h4><p className="pay-secure-desc">Checkout validates payment details and stores only non-sensitive transaction metadata required for your receipt.</p></div><div className="pay-secure-brands">{NETWORKS.map((node, index) => <span key={index} className="pay-secure-chip">{node}</span>)}</div></div>
  </DashboardContent></DashboardLayout>
}
