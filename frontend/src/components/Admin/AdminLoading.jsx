export default function AdminLoading() {
  return (
    <div className="admin-dashboard-loading" aria-busy="true" aria-label="Loading dashboard data">
      <div className="admin-stat-grid">
        {Array.from({ length: 6 }, (_, index) => (
          <div className="admin-stat-card admin-skeleton-card" key={index}>
            <span className="admin-skeleton admin-skeleton--icon" />
            <span className="admin-skeleton-stack">
              <span className="admin-skeleton admin-skeleton--label" />
              <span className="admin-skeleton admin-skeleton--metric" />
              <span className="admin-skeleton admin-skeleton--copy" />
            </span>
          </div>
        ))}
      </div>
      <div className="admin-recent-grid">
        <div className="admin-panel admin-skeleton-panel"><span className="admin-skeleton admin-skeleton--heading" /><span className="admin-skeleton admin-skeleton--table" /></div>
        <div className="admin-panel admin-skeleton-panel"><span className="admin-skeleton admin-skeleton--heading" /><span className="admin-skeleton admin-skeleton--table" /></div>
      </div>
    </div>
  )
}
