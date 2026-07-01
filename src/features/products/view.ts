import type { Product } from './types'
import type { SortOption } from './components/Toolbar'
import { isOnSale, discountPercent } from './pricing'

export interface ProductViewOptions {
  saleOnly: boolean
  sort: SortOption
}

// Shared "on sale only" filter + sort, used by the store page and the AI results page.
export function applyProductView(products: Product[], { saleOnly, sort }: ProductViewOptions): Product[] {
  let list = products
  if (saleOnly) list = list.filter(isOnSale)

  if (sort === 'featured') return list

  const sorted = [...list]
  if (sort === 'price_asc') sorted.sort((a, b) => a.price - b.price)
  if (sort === 'price_desc') sorted.sort((a, b) => b.price - a.price)
  if (sort === 'rating_desc') sorted.sort((a, b) => b.rating - a.rating)
  if (sort === 'discount_desc') sorted.sort((a, b) => discountPercent(b) - discountPercent(a))
  return sorted
}
