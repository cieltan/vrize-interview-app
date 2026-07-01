import { SearchField } from './SearchField'

interface SearchBarProps {
  query: string
  onQueryChange: (query: string) => void
  onSubmit: () => void
  onClear: () => void
  searching: boolean
  invalid: boolean
  aiOpen: boolean
  onToggleAi: () => void
}

export function SearchBar({
  query,
  onQueryChange,
  onSubmit,
  onClear,
  searching,
  invalid,
  aiOpen,
  onToggleAi,
}: SearchBarProps) {
  return (
    <div className="mb-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchField
          query={query}
          onQueryChange={onQueryChange}
          onSubmit={onSubmit}
          onClear={onClear}
          searching={searching}
          invalid={invalid}
        />

        {/* Rainbow glowing gradient toggle — opens the AI chat panel on the left. */}
        <div className="relative inline-block shrink-0">
          <span
            aria-hidden="true"
            className="ai-rainbow-bg pointer-events-none absolute -inset-1 rounded-md opacity-70 blur-md"
          />
          <button
            type="button"
            onClick={onToggleAi}
            aria-pressed={aiOpen}
            className="ai-rainbow-bg relative block cursor-pointer rounded-sm p-[2px] shadow-sm"
          >
            <span
              className={`block rounded-[3px] px-4 py-1.5 text-sm font-semibold transition-colors ${
                aiOpen ? 'bg-transparent text-white' : 'bg-white text-gray-900'
              }`}
            >
              ✨ {aiOpen ? 'AI Search on' : 'Enable AI Search'}
            </span>
          </button>
        </div>
      </div>

      {searching ? (
        <p className="mt-1.5 text-xs text-gray-400">Searching…</p>
      ) : invalid ? (
        <p className="mt-1.5 text-xs text-rose-600">Invalid regular expression — showing all products.</p>
      ) : null}
    </div>
  )
}
