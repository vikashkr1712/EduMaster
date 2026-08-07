import { useState } from 'react'

const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' }

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" {...stroke}>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.8" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" {...stroke}>
      <path d="M2.5 12S6 5.5 12 5.5c1.6 0 3 .4 4.3 1.1M21.5 12S18 18.5 12 18.5c-1.6 0-3-.4-4.3-1.1" />
      <path d="M9.9 9.9a2.8 2.8 0 0 0 4 4M4 20 20 4" />
    </svg>
  )
}

export default function PasswordInput({ id, label, placeholder, autoComplete }) {
  const [visible, setVisible] = useState(false)
  const [value, setValue] = useState('')

  return (
    <div className="settings-password-row">
      <label className="settings-label" htmlFor={id}>{label}</label>
      <div className="settings-password-field">
        <input
          id={id}
          className="settings-input"
          type={visible ? 'text' : 'password'}
          placeholder={placeholder}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button
          type="button"
          className="settings-eye"
          aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          onClick={() => setVisible((v) => !v)}
        >
          {visible ? <EyeIcon /> : <EyeOffIcon />}
        </button>
      </div>
    </div>
  )
}
