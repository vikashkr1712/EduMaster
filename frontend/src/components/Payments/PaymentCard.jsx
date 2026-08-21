import { useAuth } from '../Auth/AuthProvider.jsx'

export function VisaMark() {
  return <span className="pay-brand-visa">VISA</span>
}

export function MastercardMark() {
  return (
    <span className="pay-brand-mc" aria-hidden="true">
      <span className="pay-brand-mc-red" />
      <span className="pay-brand-mc-orange" />
    </span>
  )
}

function CheckBadge() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#22c55e" />
      <path d="m8 12.2 2.7 2.7L16.3 9.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function KebabIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="5.5" r="1.7" />
      <circle cx="12" cy="12" r="1.7" />
      <circle cx="12" cy="18.5" r="1.7" />
    </svg>
  )
}

export default function PaymentCard({ card }) {
  const { user } = useAuth()
  const { brand, brandLabel, last4, expires, isDefault, status } = card

  return (
    <article className="pay-card">
      <div className="pay-card-tile">
        {brand === 'visa' ? <VisaMark /> : <MastercardMark />}
      </div>

      <div className="pay-card-info">
        <div className="pay-card-brand-row">
          <h4 className="pay-card-brand">{brandLabel}</h4>
          {isDefault && <span className="profile-pill profile-pill--blue">Default</span>}
        </div>
        <p className="pay-card-number">
          <span aria-hidden="true">•••• •••• ••••</span> {last4}
        </p>
        <p className="pay-card-expiry">Expires {expires}</p>
      </div>

      <p className="pay-card-holder">{user?.name || 'Card Holder'}</p>

      <div className="pay-card-status">
        <span className="pay-card-status-pill">
          <CheckBadge /> {status}
        </span>
      </div>

      <button
        type="button"
        className="pay-card-menu"
        aria-label={`${brandLabel} card options`}
        disabled
        title="Payment credentials are managed by the checkout provider"
      >
        <KebabIcon />
      </button>
    </article>
  )
}
