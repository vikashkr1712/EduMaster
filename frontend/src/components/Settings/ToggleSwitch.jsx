export default function ToggleSwitch({ label, description, checked, onChange, icon }) {
  return (
    <div className="settings-row">
      {icon && <span className="settings-row-icon">{icon}</span>}
      <div className="settings-row-text">
        <p className="settings-row-label">{label}</p>
        {description && <p className="settings-row-desc">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        className={`settings-toggle${checked ? ' is-on' : ''}`}
        onClick={() => onChange(!checked)}
      >
        <span className="settings-toggle-knob" />
      </button>
    </div>
  )
}
