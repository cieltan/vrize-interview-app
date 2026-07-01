import { create } from 'zustand'
import type { Product } from '../products'

export interface CartLineItem {
  product: Product
  quantity: number
  lineTotal: number
}

interface CartState {
  /** productId -> quantity (source of truth). */
  quantities: Record<string, number>
  /** productId -> product, hydrated from the loaded catalog so the store is self-contained. */
  catalog: Record<string, Product>
  hydrateCatalog: (products: Product[]) => void
  /** Adds one unit; returns false (no-op) when already at the stock cap. */
  addToCart: (productId: string) => boolean
  setQuantity: (productId: string, quantity: number) => void
  removeFromCart: (productId: string) => void
  clear: () => void
}

export const useCartStore = create<CartState>((set, get) => ({
  quantities: {},
  catalog: {},

  hydrateCatalog: (products) => {
    const catalog: Record<string, Product> = {}
    for (const product of products) catalog[product.id] = product
    set({ catalog })
  },

  addToCart: (productId) => {
    const { quantities, catalog } = get()
    const stock = catalog[productId]?.stockCount ?? 0
    // Never let the cart hold more units than exist in stock.
    if ((quantities[productId] ?? 0) + 1 > stock) return false
    set({ quantities: { ...quantities, [productId]: (quantities[productId] ?? 0) + 1 } })
    return true
  },

  setQuantity: (productId, quantity) => {
    const { quantities, catalog } = get()
    if (quantity <= 0) {
      const next = { ...quantities }
      delete next[productId]
      set({ quantities: next })
      return
    }
    const stock = catalog[productId]?.stockCount ?? 0
    set({ quantities: { ...quantities, [productId]: Math.min(quantity, stock) } })
  },

  removeFromCart: (productId) => {
    const next = { ...get().quantities }
    delete next[productId]
    set({ quantities: next })
  },

  clear: () => set({ quantities: {} }),
}))
