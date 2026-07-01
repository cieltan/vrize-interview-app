import { useEffect, useMemo, useState } from 'react'
import { useProducts, ProductCard, ProductCardSkeleton } from '../../products'
import { useCartStore, CartButton, CartPanel } from '../../cart'
import { useToasts, ToastViewport } from '../../toast'
import { matchProducts } from '../match'

interface AiResultsPageProps {
  query: string
}

// Full-page view of every product that matched an AI search — opened in a new tab from the
// chat's "show all" button.
export function AiResultsPage({ query }: AiResultsPageProps) {
  const { products, loading } = useProducts()
  const toasts = useToasts()
  const [cartOpen, setCartOpen] = useState(false)

  const quantities = useCartStore((s) => s.quantities)
  const addToCart = useCartStore((s) => s.addToCart)
  const hydrateCatalog = useCartStore((s) => s.hydrateCatalog)

  useEffect(() => {
    hydrateCatalog(products)
  }, [products, hydrateCatalog])

  const matched = useMemo(() => matchProducts(query, products).products, [query, products])

  const handleAddToCart = (productId: string) => {
    if (!addToCart(productId)) return
    const product = products.find((p) => p.id === productId)
    if (product) toasts.add(`Added ${product.name} to cart`)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <a href={window.location.pathname} className="text-xl font-bold text-gray-900">
            Vrize Store
          </a>
          <CartButton onClick={() => setCartOpen(true)} />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-gray-400">AI Search results</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-gray-900">“{query}”</h1>
        <p className="mt-2 text-sm text-gray-500">
          {loading ? 'Searching…' : `${matched.length} ${matched.length === 1 ? 'product' : 'products'} matched`}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-2 lg:grid-cols-3">
          {loading && Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)}

          {!loading &&
            matched.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                quantityInCart={quantities[product.id] ?? 0}
                onAddToCart={handleAddToCart}
              />
            ))}
        </div>

        {!loading && matched.length === 0 && (
          <div className="mt-10 rounded-xl border border-dashed border-gray-300 py-16 text-center">
            <p className="text-sm font-medium text-gray-900">No products matched “{query}”.</p>
            <a href={window.location.pathname} className="mt-3 inline-block text-sm font-semibold text-gray-900 underline">
              Back to the store
            </a>
          </div>
        )}
      </main>

      <CartPanel open={cartOpen} onClose={() => setCartOpen(false)} />
      <ToastViewport toasts={toasts.toasts} onDismiss={toasts.dismiss} />
    </div>
  )
}
