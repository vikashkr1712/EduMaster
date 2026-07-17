export default function CoursesPagination({ page, totalPages, onPage }) {
  if (totalPages <= 1) return null

  // Build page list: 1 2 3 4 ... N (with ellipsis when needed)
  const pages = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else if (page <= 4) {
    pages.push(1, 2, 3, 4, 5, '…', totalPages)
  } else if (page >= totalPages - 3) {
    pages.push(1, '…', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
  } else {
    pages.push(1, '…', page - 1, page, page + 1, '…', totalPages)
  }

  return (
    <nav className="cpagination" aria-label="Course pages">
      {pages.map((p, i) =>
        p === '…' ? (
          <span key={`e${i}`} className="cpage-ellipsis">
            …
          </span>
        ) : (
          <button
            key={p}
            className={`cpage${p === page ? ' active' : ''}`}
            onClick={() => onPage(p)}
            aria-current={p === page ? 'page' : undefined}
          >
            {p}
          </button>
        )
      )}
      <button
        className="cpage cpage-next"
        onClick={() => onPage(Math.min(page + 1, totalPages))}
        disabled={page === totalPages}
        aria-label="Next page"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M4 12h16m0 0l-6-6m6 6l-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </nav>
  )
}
