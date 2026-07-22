import { useState } from 'react'
import { UserIcon, MailIcon, LockIcon, EyeIcon, EyeOffIcon } from './AuthIcons.jsx'

const fieldIcons = {
  user: UserIcon,
  mail: MailIcon,
  lock: LockIcon,
}

/* Labelled input with a left icon and an optional password
   visibility toggle. Shared by the Login and Signup cards. */
export default function AuthField({
  id,
  label,
  type = 'text',
  placeholder,
  icon = 'user',
  autoComplete,
  value,
  onChange,
}) {
  const [visible, setVisible] = useState(false)
  const isPassword = type === 'password'
  const Icon = fieldIcons[icon] || UserIcon

  return (
    <div className="authfield">
      <label className="authfield-label" htmlFor={id}>
        {label}
      </label>
      <div className="authfield-box">
        <span className="authfield-icon" aria-hidden="true">
          <Icon />
        </span>
        <input
          id={id}
          name={id}
          type={isPassword && visible ? 'text' : type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
        />
        {isPassword && (
          <button
            type="button"
            className="authfield-eye"
            aria-label={visible ? 'Hide password' : 'Show password'}
            aria-pressed={visible}
            onClick={() => setVisible(!visible)}
          >
            {visible ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}
      </div>
    </div>
  )
}
