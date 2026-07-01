import type { Product } from '../types'

const STYLES: Record<Product['stockStatus'], string> = {
  in_stock: 'bg-green-50 text-green-700 ring-green-600/20',
  low_stock: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  out_of_stock: 'bg-gray-100 text-gray-500 ring-gray-500/20',
}

const LABELS: Record<Product['stockStatus'], (stockCount: number) => string> = {
  in_stock: () => 'In stock',
  low_stock: (stockCount) => `Only ${stockCount} left`,
  out_of_stock: () => 'Out of stock',
}

export function StockBadge({ stockStatus, stockCount }: Pick<Product, 'stockStatus' | 'stockCount'>) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${STYLES[stockStatus]}`}
    >
      {LABELS[stockStatus](stockCount)}
    </span>
  )
}
