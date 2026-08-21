const visiblePages = (current, total) => {
  if (total <= 5) return Array.from({ length: total }, (_, index) => index + 1)
  const candidates = new Set([1, total, current - 1, current, current + 1])
  const sorted = [...candidates].filter((page) => page >= 1 && page <= total).sort((a, b) => a - b)
  return sorted.flatMap((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) return [`ellipsis-${page}`, page]
    return [page]
  })
}

export default function AdminPagination({ page, pages, total, limit = 10, itemLabel = 'items', onPageChange }) {
  if (!total) return null
  const start = (page - 1) * limit + 1
  const end = Math.min(page * limit, total)
  const goTo = (nextPage) => {
    if (nextPage >= 1 && nextPage <= pages && nextPage !== page) onPageChange(nextPage)
  }

  return (
    <nav className="admin-shared-pagination" aria-label={`${itemLabel} pagination`}>
      <span>Showing {start}–{end} of {total} {itemLabel}</span>
      <div className="admin-shared-pagination__controls">
        <button type="button" onClick={() => goTo(page - 1)} disabled={page <= 1}>Previous</button>
        <span className="admin-shared-pagination__mobile">Page {page} of {pages}</span>
        <span className="admin-shared-pagination__pages">
          {visiblePages(page, pages).map((item) => typeof item === 'string'
            ? <i key={item} aria-hidden="true">…</i>
            : <button type="button" key={item} className={item === page ? 'is-active' : ''} aria-current={item === page ? 'page' : undefined} onClick={() => goTo(item)}>{item}</button>)}
        </span>
        <button type="button" onClick={() => goTo(page + 1)} disabled={page >= pages}>Next</button>
      </div>
    </nav>
  )
}
