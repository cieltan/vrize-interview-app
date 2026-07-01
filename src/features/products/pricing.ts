import type { Product } from './types'

export function isOnSale(product: Product): boolean {
  return product.originalPrice != null && product.originalPrice > product.price
}

export function discountPercent(product: Product): number {
  if (!isOnSale(product)) return 0
  return Math.round((1 - product.price / (product.originalPrice as number)) * 100)
}
