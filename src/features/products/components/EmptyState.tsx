interface EmptyStateProps {
  onReset: () => void
}

export function EmptyState({ onReset }: EmptyStateProps) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-gray-300 py-16 text-center">
      <p className="text-4xl" aria-hidden="true">
        🔍
      </p>
      <p className="text-sm font-medium text-gray-900">No products match your filters</p>
      <p className="max-w-xs text-sm text-gray-500">Try a different sort or clear the filter to see the full catalog.</p>
      <button
        type="button"
        onClick={onReset}
        className="mt-1 cursor-pointer rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700"
      >
        Clear filters
      </button>
    </div>
  )
}
