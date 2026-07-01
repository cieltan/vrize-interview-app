import { useMemo } from 'react'
import { useCartStore, type CartLineItem } from './store'

// Convenience selector hook: reads the global cart store and derives line items + totals.
export function useCart() {
  const quantities = useCartStore((s) => s.quantities)
  const catalog = useCartStore((s) => s.catalog)

  const lineItems = useMemo<CartLineItem[]>(() => {
    return Object.entries(quantities)
      .map(([productId, quantity]) => {
        const product = catalog[productId]
        if (!product) return null
        return { product, quantity, lineTotal: product.price * quantity }
      })
      .filter((item): item is CartLineItem => item !== null)
  }, [quantities, catalog])

  const totalItems = lineItems.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = lineItems.reduce((sum, item) => sum + item.lineTotal, 0)

  return { quantities, lineItems, totalItems, totalPrice }
}
