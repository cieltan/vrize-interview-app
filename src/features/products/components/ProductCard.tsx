import { useState } from 'react'
import type { Product } from '../types'
import { formatCurrency } from '../format'
import { deriveStock } from '../stock'
import { isOnSale as computeOnSale } from '../pricing'
import { StarRating } from './StarRating'
import { StockBadge } from './StockBadge'

interface ProductCardProps {
  product: Product
  quantityInCart: number
  onAddToCart: (productId: string) => void
}

export function ProductCard({ product, quantityInCart, onAddToCart }: ProductCardProps) {
  const [saved, setSaved] = useState(false)
  const { remaining, status, maxedOut } = deriveStock(product, quantityInCart)
  const isOutOfStock = status === 'out_of_stock'
  const isOnSale = computeOnSale(product)
  const savedAmount = isOnSale ? (product.originalPrice as number) - product.price : 0
  const tag = product.tags[0]

  return (
    <div
      className={`group flex flex-col bg-white transition ${isOutOfStock ? 'opacity-70' : ''}`}
    >
      <div className="relative aspect-square overflow-hidden bg-neutral-100">
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <button
          type="button"
          onClick={() => setSaved((v) => !v)}
          aria-label={saved ? 'Remove from saved' : 'Save for later'}
          aria-pressed={saved}
          className="absolute right-3 top-3 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/80 text-lg text-gray-700 shadow-sm backdrop-blur transition hover:bg-white"
        >
          <span className={saved ? 'text-rose-600' : ''}>{saved ? '♥' : '♡'}</span>
        </button>

        {quantityInCart > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-gray-900/85 px-2.5 py-1 text-xs font-semibold text-white shadow">
            {quantityInCart} in cart
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        {tag && (
          <span className="w-fit rounded-full bg-gray-900 px-2.5 py-1 text-xs font-medium capitalize text-white">
            {tag}
          </span>
        )}

        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{product.brand}</p>

        <h3
          className="line-clamp-2 min-h-[2.75rem] text-[15px] font-semibold leading-snug text-gray-900"
          title={product.name}
        >
          {product.name}
        </h3>

        <StarRating rating={product.rating} reviewCount={product.reviewCount} />

        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="text-lg font-semibold text-gray-900">
            {formatCurrency(product.price, product.currency)}
          </span>
          {isOnSale && (
            <>
              <span className="text-sm text-gray-400 line-through">
                {formatCurrency(product.originalPrice as number, product.currency)}
              </span>
              <span className="text-sm font-medium text-green-700">
                Save {formatCurrency(savedAmount, product.currency)}
              </span>
            </>
          )}
        </div>

        <div>
          <StockBadge stockStatus={status} stockCount={remaining} />
        </div>

        <button
          type="button"
          disabled={isOutOfStock}
          onClick={() => onAddToCart(product.id)}
          className={`mt-auto w-full rounded-sm px-4 py-2.5 text-sm font-semibold transition ${
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
