export { useProducts } from './hooks/useProducts'
export { useCart, type CartLineItem } from './hooks/useCart'

export { ProductCard } from './components/ProductCard'
export { ProductCardSkeleton } from './components/ProductCardSkeleton'
export { EmptyState } from './components/EmptyState'
export { SearchBar } from './components/SearchBar'
export { Toolbar, type SortOption } from './components/Toolbar'
export { Pagination } from './components/Pagination'
export { CartButton } from './components/CartButton'
export { CartPanel } from './components/CartPanel'

// Shared primitives other features (e.g. ai-search) build on.
export { StarRating } from './components/StarRating'
export { StockBadge } from './components/StockBadge'
export { formatCurrency } from './format'
export { isOnSale, discountPercent } from './pricing'
export { deriveStock } from './stock'

export type { Product, StockStatus } from './types'
