export default function DashboardHeader({ title, subtitle, actions }) {
  return (
    <div className="dash-header">
      <div className="dash-header-text">
        <h1 className="dash-header-title">{title}</h1>
        {subtitle && <p className="dash-header-subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="dash-header-actions">{actions}</div>}
    </div>
  )
}
