import { useEffect, useMemo, useRef, useState } from 'react'
import {
  useProducts,
  ProductCard,
  ProductCardSkeleton,
  EmptyState,
  SearchBar,
  Toolbar,
  type SortOption,
  Pagination,
  applyProductView,
} from './features/products'
import { useCartStore, CartButton, CartPanel } from './features/cart'
import { useAiChat, AiChatPanel } from './features/ai-search'
import { useToasts, ToastViewport } from './features/toast'

const PAGE_SIZE = 6

function App() {
  const { products, loading } = useProducts()
  const chat = useAiChat(products)
  const toasts = useToasts()

  const quantities = useCartStore((s) => s.quantities)
  const addToCart = useCartStore((s) => s.addToCart)
  const hydrateCatalog = useCartStore((s) => s.hydrateCatalog)

  // Keep the global cart store's catalog in sync with the loaded products.
  useEffect(() => {
    hydrateCatalog(products)
  }, [products, hydrateCatalog])

  // Random hero image from the internet, picked once per session.
  const [heroSeed] = useState(() => Math.floor(Math.random() * 100000))
  const heroUrl = `https://picsum.photos/seed/hero-${heroSeed}/1600/600`

  const [query, setQuery] = useState('') // live input value
  const [appliedQuery, setAppliedQuery] = useState('') // value actually filtered on (Enter to apply)
  const [searching, setSearching] = useState(false)
  const [aiOpen, setAiOpen] = useState(false)
  const [sort, setSort] = useState<SortOption>('featured')
  const [saleOnly, setSaleOnly] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [headerHidden, setHeaderHidden] = useState(false)

  // Hide the header once the user has scrolled down a bit; reveal it on scroll up.
  useEffect(() => {
    let lastY = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      if (y > 160 && y > lastY) setHeaderHidden(true)
      else if (y < lastY) setHeaderHidden(false)
      lastY = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Add to cart + a confirmation toast (only when a unit was actually added).
  const handleAddToCart = (productId: string) => {
    if (!addToCart(productId)) return
    const product = products.find((p) => p.id === productId)
    if (product) toasts.add(`Added ${product.name} to cart`)
  }

  // Search runs only on Enter. We briefly show a spinner to make it feel like it's working.
  const searchTimer = useRef<number | null>(null)
  useEffect(() => () => {
    if (searchTimer.current) clearTimeout(searchTimer.current)
  }, [])

  const runSearch = () => {
    if (searchTimer.current) clearTimeout(searchTimer.current)
    setSearching(true)
    searchTimer.current = window.setTimeout(() => {
      setAppliedQuery(query)
      setPage(1)
      setSearching(false)
    }, 500)
  }

  const clearSearch = () => {
    if (searchTimer.current) clearTimeout(searchTimer.current)
    setQuery('')
    setAppliedQuery('')
    setSearching(false)
    setPage(1)
  }

  // Compile the applied query as a case-insensitive regex. An invalid pattern
  // falls back to no filtering + a hint.
  const search = useMemo(() => {
    const q = appliedQuery.trim()
    if (!q) return { regex: null as RegExp | null, invalid: false }
    try {
      return { regex: new RegExp(q, 'i'), invalid: false }
    } catch {
      return { regex: null as RegExp | null, invalid: true }
    }
  }, [appliedQuery])

  const filteredProducts = useMemo(() => {
    let list = products

    const regex = search.regex
    if (regex) {
      list = list.filter(
        (p) => regex.test(p.name) || regex.test(p.brand) || regex.test(p.category),
      )
    }

    return applyProductView(list, { saleOnly, sort })
  }, [products, search.regex, saleOnly, sort])

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE))

  // Keep the current page in range when the result set shrinks (e.g. after filtering).
  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  const pageProducts = useMemo(
    () => filteredProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filteredProducts, page],
  )

  return (
    <div className="min-h-screen bg-gray-100">
      <header
        className={`sticky top-0 z-30 border-b border-gray-200 bg-white/90 backdrop-blur transition-transform duration-300 ${
          headerHidden ? '-translate-y-full' : 'translate-y-0'
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <h1 className="text-xl font-bold text-gray-900">Vrize Store</h1>
          <CartButton onClick={() => setCartOpen(true)} />
        </div>
      </header>

      <section className="relative h-72 w-full overflow-hidden bg-gray-900 sm:h-96">
        <img src={heroUrl} alt="" className="h-full w-full object-cover opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-white/80">Just landed</p>
          <h2 className="text-4xl font-extrabold tracking-tight drop-shadow sm:text-6xl">New Arrivals</h2>
          <p className="mt-3 max-w-xl text-base text-white/90 sm:text-lg">
            Fresh drops across audio, home, and everyday carry — handpicked for you.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <SearchBar
          query={query}
          onQueryChange={setQuery}
          onSubmit={runSearch}
          onClear={clearSearch}
          searching={searching}
          invalid={search.invalid}
          aiOpen={aiOpen}
          onToggleAi={() => setAiOpen((v) => !v)}
        />

        <Toolbar
          sort={sort}
          onSortChange={(next) => {
            setSort(next)
            setPage(1)
          }}
          saleOnly={saleOnly}
          onSaleOnlyChange={(next) => {
            setSaleOnly(next)
            setPage(1)
          }}
          resultCount={filteredProducts.length}
        />

        <div className="mt-6 grid grid-cols-2 gap-2 lg:grid-cols-3">
          {loading &&
            Array.from({ length: PAGE_SIZE }).map((_, i) => <ProductCardSkeleton key={i} />)}

          {!loading && filteredProducts.length === 0 && (
            <EmptyState
              onReset={() => {
                clearSearch()
                setSaleOnly(false)
                setSort('featured')
              }}
            />
          )}

          {!loading &&
            pageProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                quantityInCart={quantities[product.id] ?? 0}
                onAddToCart={handleAddToCart}
              />
            ))}
        </div>

        {!loading && (
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        )}
      </main>

      <CartPanel open={cartOpen} onClose={() => setCartOpen(false)} />

      <AiChatPanel
        open={aiOpen}
        onClose={() => setAiOpen(false)}
        messages={chat.messages}
        typing={chat.typing}
        onSend={chat.sendMessage}
        onAddToCart={handleAddToCart}
      />

      <ToastViewport toasts={toasts.toasts} onDismiss={toasts.dismiss} />
    </div>
  )
}

export default App
