import type { Product, StockStatus } from './types'

// Below this many units remaining, an item is surfaced as "low stock".
export const LOW_STOCK_THRESHOLD = 10

export interface DerivedStock {
  /** Units still available to add, after accounting for what's in the cart. */
  remaining: number
  /** Stock status recomputed against the remaining units. */
  status: StockStatus
  /** True once the cart holds every available unit (but the item isn't truly out of stock). */
  maxedOut: boolean
}

export function deriveStock(product: Product, quantityInCart: number): DerivedStock {
  const remaining = Math.max(0, product.stockCount - quantityInCart)
  const maxedOut = product.stockCount > 0 && remaining === 0

  let status: StockStatus
  if (remaining <= 0) {
    status = 'out_of_stock'
  } else if (product.stockStatus === 'low_stock' || remaining <= LOW_STOCK_THRESHOLD) {
    status = 'low_stock'
  } else {
    status = 'in_stock'
  }

  return { remaining, status, maxedOut }
}
