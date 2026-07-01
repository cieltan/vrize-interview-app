import { useMemo, useState } from 'react'
import type { Product } from '../types'

export interface CartLineItem {
  product: Product
  quantity: number
  lineTotal: number
}

export function useCart(products: Product[]) {
  const [quantities, setQuantities] = useState<Record<string, number>>({})

  const productsById = useMemo(() => {
    const map = new Map<string, Product>()
    for (const product of products) map.set(product.id, product)
    return map
  }, [products])

  // Returns true if a unit was actually added (false when already at stock cap).
  function addToCart(productId: string): boolean {
    const stock = productsById.get(productId)?.stockCount ?? 0
    if ((quantities[productId] ?? 0) + 1 > stock) return false
    setQuantities((prev) => {
      const next = (prev[productId] ?? 0) + 1
      // Never let the cart hold more units than exist in stock.
      if (next > stock) return prev
      return { ...prev, [productId]: next }
    })
    return true
  }

  function setQuantity(productId: string, quantity: number) {
    setQuantities((prev) => {
      if (quantity <= 0) {
        const next = { ...prev }
        delete next[productId]
        return next
      }
      const stock = productsById.get(productId)?.stockCount ?? 0
      return { ...prev, [productId]: Math.min(quantity, stock) }
    })
  }

  function removeFromCart(productId: string) {
    setQuantities((prev) => {
      const next = { ...prev }
      delete next[productId]
      return next
    })
  }

  const lineItems: CartLineItem[] = useMemo(() => {
    return Object.entries(quantities)
      .map(([productId, quantity]) => {
        const product = productsById.get(productId)
        if (!product) return null
        return { product, quantity, lineTotal: product.price * quantity }
      })
      .filter((item): item is CartLineItem => item !== null)
  }, [quantities, productsById])

  const totalItems = lineItems.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = lineItems.reduce((sum, item) => sum + item.lineTotal, 0)

  return {
    lineItems,
    quantities,
    totalItems,
    totalPrice,
    addToCart,
    setQuantity,
    removeFromCart,
  }
}
