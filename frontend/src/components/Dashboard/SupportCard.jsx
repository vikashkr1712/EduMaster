import { Link } from 'react-router-dom'

function HeadsetIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 13v-2a7.5 7.5 0 0 1 15 0v2" />
      <rect x="3" y="12.5" width="4" height="6" rx="1.8" />
      <rect x="17" y="12.5" width="4" height="6" rx="1.8" />
      <path d="M19.5 18.5v.8a2.7 2.7 0 0 1-2.7 2.7H13.5" />
    </svg>
  )
}

export default function SupportCard() {
  return (
    <div className="dash-support-card">
      <span className="dash-support-icon">
        <HeadsetIcon />
      </span>
      <p className="dash-support-title">Need Help?</p>
      <p className="dash-support-text">
        Our support team is here to help you.
      </p>
      <Link to="/contact" className="dash-support-btn">Contact Support</Link>
    </div>
  )
}
