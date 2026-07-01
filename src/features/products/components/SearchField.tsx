interface SearchFieldProps {
  query: string
  onQueryChange: (query: string) => void
  onSubmit: () => void
  onClear: () => void
  searching: boolean
  invalid: boolean
}

export function SearchField({
  query,
  onQueryChange,
  onSubmit,
  onClear,
  searching,
  invalid,
}: SearchFieldProps) {
  return (
    <div className="relative flex-1">
      {/* Leading icon swaps to a spinner while a search is running. */}
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true">
        {searching ? (
          <span className="block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-800" />
        ) : (
          <span className="text-gray-400">🔍</span>
        )}
      </span>

      <input
        type="text"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onSubmit()
        }}
        placeholder="Search products — regex supported, press Enter (e.g. ^Aur|keyboard)"
        aria-label="Search products"
        aria-invalid={invalid}
        className={`w-full rounded-sm border bg-white py-2 pl-9 pr-28 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none ${
          invalid ? 'border-rose-400 focus:border-rose-500' : 'border-gray-300 focus:border-gray-900'
        }`}
      />

      <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1.5">
        {query && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear search"
            className="cursor-pointer rounded-sm px-1 text-gray-400 hover:text-gray-700"
          >
            ✕
          </button>
        )}
        <button
          type="button"
          onClick={onSubmit}
          aria-label="Run search"
          className="flex cursor-pointer items-center gap-1 rounded-sm border border-gray-300 bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100"
        >
          <span aria-hidden="true">↵</span> Enter
        </button>
      </div>
    </div>
  )
}
