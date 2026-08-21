import { useEffect } from 'react'
import { useAuth } from '../Auth/AuthProvider.jsx'

const REQUIRED = ['fullName', 'email', 'phone']

export default function BillingForm({ data, onChange, errors, touched, onBlur }) {
  const { user } = useAuth()

  useEffect(() => {
    if (user && !data.fullName && !data.email) {
      onChange('fullName', user.name || '')
      onChange('email', user.email || '')
    }
  }, [user])

  const field = (name, label, placeholder, type = 'text', required = false) => (
    <div className={`chk-field${touched[name] && errors[name] ? ' has-error' : ''}`}>
      <label htmlFor={`billing-${name}`}>
        {label}
        {required && <span className="chk-required">*</span>}
      </label>
      <input
        id={`billing-${name}`}
        type={type}
        placeholder={placeholder}
        value={data[name] || ''}
        onChange={e => onChange(name, e.target.value)}
        onBlur={() => onBlur(name)}
        autoComplete={name}
      />
      {touched[name] && errors[name] && (
        <span className="chk-error">{errors[name]}</span>
      )}
    </div>
  )

  return (
    <div className="chk-billing-form">
      <h3 className="chk-section-title">2. Billing Details</h3>

      <div className="chk-form-grid-3">
        {field('fullName', 'Full Name', 'Your full name', 'text', true)}
        {field('email', 'Email Address', 'you@example.com', 'email', true)}
        {field('phone', 'Phone Number', '+91 98765 43210', 'tel', true)}
      </div>

      <div className="chk-form-grid-3">
        <div className="chk-field">
          <label>Country</label>
          <select value={data.country || 'India'} onChange={e => onChange('country', e.target.value)} className="chk-select">
            <option>India</option>
            <option>United States</option>
            <option>United Kingdom</option>
            <option>Canada</option>
            <option>Australia</option>
            <option>Germany</option>
            <option>Singapore</option>
          </select>
        </div>
        {field('state', 'State', 'e.g. Maharashtra')}
        {field('city', 'City', 'e.g. Mumbai')}
      </div>

      <div className="chk-form-grid-2">
        {field('pincode', 'PIN Code', '400001')}
        {field('address1', 'Address Line 1', 'House/Flat/Block No., Street')}
      </div>

      {field('address2', 'Address Line 2 (optional)', 'Landmark, Area')}

      <p className="chk-secure-note">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        Your payment information is secure and encrypted.
      </p>
    </div>
  )
}
