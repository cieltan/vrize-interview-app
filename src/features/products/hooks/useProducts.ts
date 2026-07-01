import { useEffect, useState } from 'react'
import type { Product } from '../types'
import productsData from '../products.json'

interface ProductsState {
  products: Product[]
  loading: boolean
}

// Simulates an API round-trip so the loading state has something to show.
const SIMULATED_LATENCY_MS = 600

export function useProducts(): ProductsState {
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const timer = setTimeout(() => {
      setProducts(productsData.products as Product[])
      setLoading(false)
    }, SIMULATED_LATENCY_MS)

    return () => clearTimeout(timer)
  }, [])

  return { products, loading }
}
