import type { Product } from '../types'
import { formatCurrency } from '../format'
import { deriveStock } from '../stock'
import { isOnSale as computeOnSale, discountPercent as computeDiscount } from '../pricing'
import { StarRating } from './StarRating'
import { StockBadge } from './StockBadge'

interface ProductCardProps {
  product: Product
  quantityInCart: number
  onAddToCart: (productId: string) => void
}

export function ProductCard({ product, quantityInCart, onAddToCart }: ProductCardProps) {
  const { remaining, status, maxedOut } = deriveStock(product, quantityInCart)
  const isOutOfStock = status === 'out_of_stock'
  const isOnSale = computeOnSale(product)
  const discountPercent = computeDiscount(product)

  return (
    <div
      className={`group flex flex-col overflow-hidden border border-gray-200 bg-white transition duration-200 hover:z-10 hover:shadow-lg ${
        isOutOfStock ? 'opacity-60' : ''
      }`}
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        {isOnSale && (
          <span className="absolute left-3 top-3 rounded-full bg-rose-600 px-3 py-1 text-sm font-bold text-white shadow">
            -{discountPercent}%
          </span>
        )}
        {quantityInCart > 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-gray-900/85 px-3 py-1 text-sm font-semibold text-white shadow">
            {quantityInCart} in cart
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{product.brand}</p>
        <h3
          className="line-clamp-2 min-h-[3.5rem] text-xl font-bold leading-snug tracking-tight text-gray-900"
          title={product.name}
        >
          {product.name}
        </h3>

        <StarRating rating={product.rating} reviewCount={product.reviewCount} />

        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight text-gray-900">
            {formatCurrency(product.price, product.currency)}
          </span>
          {isOnSale && (
            <span className="text-base text-gray-400 line-through">
              {formatCurrency(product.originalPrice!, product.currency)}
            </span>
          )}
        </div>

        <div>
          <StockBadge stockStatus={status} stockCount={remaining} />
        </div>

        <button
          type="button"
          disabled={isOutOfStock}
          onClick={() => onAddToCart(product.id)}
          className={`mt-auto w-full rounded-sm px-4 py-3 text-base font-bold transition ${
            isOutOfStock
              ? 'cursor-not-allowed bg-gray-100 text-gray-400'
              : 'cursor-pointer bg-gray-900 text-white hover:bg-gray-700 active:bg-gray-800'
          }`}
        >
          {isOutOfStock ? (maxedOut ? 'Max in cart' : 'Out of stock') : 'Add to cart'}
        </button>
      </div>
    </div>
  )
}
