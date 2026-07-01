import type { CartLineItem } from '../hooks/useCart'
import { formatCurrency } from '../format'

interface CartPanelProps {
  open: boolean
  onClose: () => void
  lineItems: CartLineItem[]
  totalItems: number
  totalPrice: number
  onSetQuantity: (productId: string, quantity: number) => void
  onRemove: (productId: string) => void
}

export function CartPanel({
  open,
  onClose,
  lineItems,
  totalItems,
  totalPrice,
  onSetQuantity,
  onRemove,
}: CartPanelProps) {
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-label="Shopping cart"
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Your cart <span className="text-gray-400">({totalItems})</span>
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart"
            className="cursor-pointer rounded-full p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {lineItems.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
              <p className="text-3xl" aria-hidden="true">
                🛒
              </p>
              <p className="text-sm font-medium text-gray-900">Your cart is empty</p>
              <p className="text-sm text-gray-500">Add a product to see it here.</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {lineItems.map(({ product, quantity, lineTotal }) => (
                <li key={product.id} className="flex gap-3">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-16 w-16 shrink-0 rounded-lg object-cover"
                  />
                  <div className="flex flex-1 flex-col gap-1">
                    <p className="line-clamp-2 text-sm font-medium text-gray-900" title={product.name}>
                      {product.name}
                    </p>
                    <p className="text-sm text-gray-500">{formatCurrency(product.price, product.currency)} each</p>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="flex items-center rounded-lg border border-gray-300">
                        <button
                          type="button"
                          onClick={() => onSetQuantity(product.id, quantity - 1)}
                          aria-label={`Decrease quantity of ${product.name}`}
                          className="cursor-pointer px-2 py-1 text-gray-600 hover:bg-gray-100"
                        >
                          −
                        </button>
                        <span className="min-w-[2ch] px-1 text-center text-sm">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => onSetQuantity(product.id, quantity + 1)}
                          disabled={quantity >= product.stockCount}
                          aria-label={`Increase quantity of ${product.name}`}
                          className="cursor-pointer px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemove(product.id)}
                        className="cursor-pointer text-xs font-medium text-gray-400 hover:text-rose-600"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <p className="shrink-0 text-sm font-semibold text-gray-900">
                    {formatCurrency(lineTotal, product.currency)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-gray-200 px-5 py-4">
          <div className="mb-3 flex items-center justify-between text-base font-semibold text-gray-900">
            <span>Subtotal</span>
            <span>{formatCurrency(totalPrice, 'USD')}</span>
          </div>
          <button
            type="button"
            disabled={lineItems.length === 0}
            className="w-full cursor-pointer rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
          >
            Checkout
          </button>
        </div>
      </aside>
    </>
  )
}
