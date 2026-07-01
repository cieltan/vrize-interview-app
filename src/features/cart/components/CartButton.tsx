import { formatCurrency } from '../../products'
import { useCart } from '../useCart'

interface CartButtonProps {
  onClick: () => void
}

export function CartButton({ onClick }: CartButtonProps) {
  const { totalItems, totalPrice } = useCart()

  return (
    <button
      type="button"
      onClick={onClick}
      className="relative flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-50"
    >
      <span aria-hidden="true">🛒</span>
      <span>{formatCurrency(totalPrice, 'USD')}</span>
      {totalItems > 0 && (
        <span className="absolute -right-2 -top-2 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-gray-900 px-1 text-xs font-semibold text-white">
          {totalItems}
        </span>
      )}
    </button>
  )
}
