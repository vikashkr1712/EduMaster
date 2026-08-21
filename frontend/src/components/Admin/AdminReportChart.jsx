const compactNumber = new Intl.NumberFormat('en-IN', { notation: 'compact', maximumFractionDigits: 1 })

export default function AdminReportChart({ id, title, description, data = [], valueLabel, currency = false }) {
  const values = data.map((item) => Number(item.value) || 0)
  const max = Math.max(...values, 0)
  const total = values.reduce((sum, value) => sum + value, 0)
  const visibleLabels = data.length > 10 ? Math.ceil(data.length / 6) : Math.max(1, Math.ceil(data.length / 7))

  return (
    <section className="admin-report-chart" aria-labelledby={`${id}-title`}>
      <div className="admin-report-chart__heading">
        <div><h2 id={`${id}-title`}>{title}</h2><p>{description}</p></div>
        <strong aria-label={`${valueLabel}: ${total}`}>{currency ? `₹${compactNumber.format(total)}` : compactNumber.format(total)}</strong>
      </div>
      {data.length === 0 ? (
        <div className="admin-report-chart__empty">No {valueLabel.toLowerCase()} data for this period.</div>
      ) : (
        <div className="admin-report-chart__plot" role="img" aria-label={`${title}. ${data.length} periods. ${valueLabel}: ${total}.`}>
          {data.map((item, index) => {
            const height = max > 0 ? Math.max(3, (Number(item.value) / max) * 100) : 3
            return (
              <div className="admin-report-chart__point" key={item.label} title={`${item.label}: ${item.value}`}>
                <span className="admin-report-chart__value">{currency ? '₹' : ''}{compactNumber.format(item.value)}</span>
                <span className="admin-report-chart__bar" style={{ height: `${height}%` }} />
                <small>{index % visibleLabels === 0 || index === data.length - 1 ? item.label : ''}</small>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
