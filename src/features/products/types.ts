export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock'

export interface Product {
  id: string
  name: string
  brand: string
  category: string
  price: number
  originalPrice: number | null
  currency: string
  rating: number
  reviewCount: number
  stockStatus: StockStatus
  stockCount: number
  imageUrl: string
  tags: string[]
}
