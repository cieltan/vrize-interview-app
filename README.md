# Vrize Store — Product Listing & Cart

A small e-commerce product listing page: browse a catalog, add items to a cart, and see a
live running total in a side panel. Built with React + TypeScript + Vite, styled with
Tailwind CSS v4, with a global cart store in Zustand.

## Running it

```bash
pnpm install
pnpm dev
```

Then open the printed local URL. `pnpm build` produces a production bundle; `pnpm lint`
runs Oxlint.

## What's here

- **Hero + product grid** — a full-bleed hero with a random `picsum.photos` image (seeded
  once per session) sits under a sticky header that hides on scroll-down and reveals on
  scroll-up. Below it, a tight, borderless tiled grid (`ProductCard.tsx`, Bose "New
  Arrivals" style): each card has a tag pill from the product's `tags`, a wishlist heart
  toggle, name, brand, a 5-star rating graphic, price (with strikethrough original + green
  "Save $X" on sale), and a stock badge for `in_stock` / `low_stock` (units left) /
  `out_of_stock` (card dims, button disabled).
- **Toasts** (`features/toast`) — adding to cart fires a clean auto-dismissing toast; the
  add action only toasts when a unit was actually added (`useCart.addToCart` returns a
  boolean so the stock cap doesn't produce false confirmations).
- **Cart** (`features/cart/` — a global Zustand store + `CartButton`/`CartPanel`) — a
  slide-over side panel triggered from a header button. Shows line items with a quantity
  stepper (capped at available stock), a remove link, and a live subtotal. The header
  button itself is a compact badge showing item count + running total, so the total is
  visible even with the panel closed. Both the grid and the AI chat add into the same store.
- **Search** (`SearchField.tsx`, composed by `SearchBar.tsx`) — a regex search box
  (case-insensitive, matches name/brand/category) that runs **only on Enter** (or the ↵
  Enter button); applying shows a brief spinner + "Searching…" hint. Invalid patterns fall
  back to showing everything with an inline hint.
- **AI Search chat** (`features/ai-search/`) — the "Enable AI Search" button (rainbow
  glowing gradient) opens a left-side chat panel. The assistant is a mock: paste a **product
  image URL** (or a SKU) and it returns the matching products; ask for the **biggest
  discounts** ("on sale", "best deal") and it returns on-sale items sorted by discount %;
  otherwise it does a loose keyword lookup. Results render as detailed cards (image, brand,
  rating, sale pricing, stock, Add). No real AI/backend — matching is local.
- **Toolbar** (`Toolbar.tsx`) — sort by price / rating / **biggest discount**, an "on sale
  only" filter, and a result count.
- **Pagination** (`Pagination.tsx`) — the grid pages at 6 items with prev/next + page
  numbers; the page resets/clamps as filters change.
- **Loading state** — data fetch is simulated with a short delay (`useProducts.ts`) so
  there's something to show; the grid renders skeleton cards while it "loads."
- **Empty state** — if a filter combination yields zero results, an empty state with a
  "clear filters" action shows instead of a blank grid.

## Key decisions & trade-offs

- **Organized by feature folder.** Code lives under `src/features/*`, each feature owning
  its components/hooks/helpers behind a barrel `index.ts`. The AI search chat is its own
  feature (`features/ai-search`), separate from the product catalog (`features/products`);
  cross-feature primitives (the `Product` type, `formatCurrency`, `StarRating`,
  `StockBadge`, `discountPercent`, …) are re-exported from the `products` barrel. This
  keeps the AI surface decoupled and easy to grow or pull out later.
- **The "AI Search" is a deliberate mock, and that's the main trade-off.** It reproduces
  the *interaction* (a chat that returns image-URL matches, discount rankings, and keyword
  results) but all matching runs locally over the bundled JSON. Making most of this
  genuinely "AI" would require real infrastructure that's well out of scope here:
  - **Metadata tagging / enrichment** — reliable attributes (materials, use-cases, visual
    tags, normalized categories) so queries can be understood; today's `tags` are sparse
    and inconsistent.
  - **Embeddings + a vector store** for semantic search, and **image embeddings** (e.g. a
    CLIP-style model) for real "find products like this image" rather than exact-URL
    matching.
  - **An LLM** for natural-language understanding/ranking, plus **model training or
    fine-tuning / evaluation** on catalog data to keep results relevant and safe.
  - **Serving infrastructure** — an API, latency/cost budgets, caching, and guardrails.
  The mock is structured so this could be swapped in behind `useAiChat` without touching
  the UI.
- **Cart as a side panel, not just a badge.** The header button gives an always-visible
  running total, but the panel (with quantities/remove) only renders when opened. This
  keeps the main grid uncluttered while still supporting the quantity-stepper stretch
  goal.
- **Cart is a global Zustand store** (`features/cart/store.ts`), since it's read/written
  from the header, cart panel, product grid, and AI chat. The store holds `quantities` plus
  a `catalog` (hydrated from the loaded products) so its actions — `addToCart` (with the
  stock cap), `setQuantity`, `removeFromCart` — are self-contained; `CartButton`/`CartPanel`
  subscribe directly instead of receiving cart props. `App` still wraps `addToCart` to fire
  the add-to-cart toast, keeping the grid/AI cards decoupled from the cart feature.
- **"On sale" is derived, not read from a flag.** A product counts as on sale when
  `originalPrice != null && originalPrice > price`, rather than trusting the `sale` tag —
  keeps the UI logic consistent even if tagging is inconsistent in the source data.
- **Stock updates live as items are added.** Cards show *remaining* stock
  (`stockCount − quantityInCart`); an item can drop to "low stock" and then to a disabled
  "Max in cart" state as the cart fills. Adding beyond available stock is blocked both by
  the disabled button and by a cap inside `useCart`, so the cart never exceeds `stockCount`.
- **Simulated network latency** for the initial load (600ms) purely so the loading
  skeleton has a moment to be visible — the data is bundled JSON, not a real fetch.
- **Long product names** are clamped to two lines (`line-clamp-2`) with a `title` tooltip
  for the full name, rather than truncating with an ellipsis inline, so the card grid
  stays visually aligned.

## Assumptions

- Currency: all data is USD, so `Intl.NumberFormat` is hardcoded to `USD` rather than
  reading `product.currency` per-line in the cart subtotal (it is used per-card).
- "Add to cart" is additive (clicking repeatedly increments quantity) rather than
  navigating anywhere or opening the cart automatically — the cart badge updating live is
  meant to be enough feedback.
- No routing, accounts, or checkout flow — "Checkout" in the cart panel is a disabled-when-empty
  visual endpoint only, per the stated scope.

## With more time

- Persist cart to `localStorage` so it survives a refresh (explicitly out of scope here,
  but the natural next step).
- Category/brand filtering in the toolbar, in addition to sort + sale-only.
- Basic unit tests for `useCart` (totals, quantity clamping, removal) and the sale-price
  derivation logic.
- Keyboard/focus trapping in the cart panel (currently closes on backdrop click and an
  explicit close button, but doesn't trap focus for screen reader / keyboard-only users).
