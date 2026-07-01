export type SortOption =
  | 'featured'
  | 'price_asc'
  | 'price_desc'
  | 'rating_desc'
  | 'discount_desc'

interface ToolbarProps {
  sort: SortOption
  onSortChange: (sort: SortOption) => void
  saleOnly: boolean
  onSaleOnlyChange: (saleOnly: boolean) => void
  resultCount: number
}

export function Toolbar({ sort, onSortChange, saleOnly, onSaleOnlyChange, resultCount }: ToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-4">
      <p className="text-sm text-gray-500">
        {resultCount} {resultCount === 1 ? 'product' : 'products'}
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={saleOnly}
            onChange={(e) => onSaleOnlyChange(e.target.checked)}
            className="h-4 w-4 cursor-pointer rounded border-gray-300 text-gray-900 focus:ring-gray-900"
          />
          On sale only
        </label>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 focus:border-gray-900 focus:outline-none"
        >
          <option value="featured">Featured</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating_desc">Rating: High to Low</option>
          <option value="discount_desc">Biggest discount</option>
        </select>
      </div>
    </div>
  )
}
