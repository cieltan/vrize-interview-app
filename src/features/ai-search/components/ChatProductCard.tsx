import type { Product } from '../../products'
import {
  formatCurrency,
  isOnSale as computeOnSale,
  discountPercent as computeDiscount,
  StarRating,
  StockBadge,
} from '../../products'

interface ChatProductCardProps {
  product: Product
  onAddToCart: (productId: string) => void
}

export function ChatProductCard({ product, onAddToCart }: ChatProductCardProps) {
  const outOfStock = product.stockStatus === 'out_of_stock'
  const onSale = computeOnSale(product)
  const discount = computeDiscount(product)

  return (
    <div className="flex gap-3 rounded-lg border border-gray-200 bg-white p-2.5">
      <div className="relative h-16 w-16 shrink-0">
        <img src={product.imageUrl} alt={product.name} className="h-16 w-16 rounded-md object-cover" />
        {onSale && (
          <span className="absolute -left-1 -top-1 rounded-full bg-rose-600 px-1.5 py-0.5 text-[10px] font-semibold text-white shadow">
            -{discount}%
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">{product.brand}</p>
        <p className="line-clamp-2 text-xs font-semibold text-gray-900" title={product.name}>
          {product.name}
        </p>

        <StarRating rating={product.rating} reviewCount={product.reviewCount} />

        <div className="flex items-baseline gap-1.5">
          <span className="text-sm font-bold text-gray-900">
            {formatCurrency(product.price, product.currency)}
          </span>
          {onSale && (
            <span className="text-xs text-gray-400 line-through">
              {formatCurrency(product.originalPrice as number, product.currency)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <StockBadge stockStatus={product.stockStatus} stockCount={product.stockCount} />
          <button
            type="button"
            onClick={() => onAddToCart(product.id)}
            disabled={outOfStock}
            className="shrink-0 cursor-pointer rounded-sm bg-gray-900 px-2.5 py-1 text-xs font-semibold text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
          >
            {outOfStock ? 'Sold out' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  )
}
