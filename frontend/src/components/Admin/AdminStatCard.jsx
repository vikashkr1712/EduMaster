import AdminIcon from './AdminIcons.jsx'

export default function AdminStatCard({ icon, label, value, description }) {
  return (
    <article className="admin-stat-card">
      <div className={`admin-stat-card__icon admin-stat-card__icon--${icon}`}>
        <AdminIcon name={icon} size={22} />
      </div>
      <div className="admin-stat-card__body">
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{description}</small>
      </div>
    </article>
  )
}
