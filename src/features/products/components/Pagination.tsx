interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  const isFirst = currentPage <= 1
  const isLast = currentPage >= totalPages

  const arrowClass =
    'rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white enabled:cursor-pointer'

  return (
    <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Pagination">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={isFirst}
        className={arrowClass}
      >
        ← Prev
      </button>

      {pages.map((page) => {
        const isActive = page === currentPage
        return (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            aria-current={isActive ? 'page' : undefined}
            className={`h-9 w-9 cursor-pointer rounded-lg border text-sm font-medium transition ${
              isActive
                ? 'border-gray-900 bg-gray-900 text-white'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        )
      })}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={isLast}
        className={arrowClass}
      >
        Next →
      </button>
    </nav>
  )
}
