// White section card with "Title + subtitle" head and an optional action button,
// shared by all Settings sections
export default function SettingsCard({ title, subtitle, action, children }) {
  return (
    <section className="settings-card">
      <div className="settings-card-head">
        <div>
          <h3 className="settings-card-title">{title}</h3>
          {subtitle && <p className="settings-card-subtitle">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}
