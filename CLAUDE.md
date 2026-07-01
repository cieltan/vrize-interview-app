# Vrize Store — Product Listing & Cart

A product listing page for an e-commerce store: browse a bundled product catalog and add
items to a cart with a live running total. Built for the Vrize Frontend / UX Engineer
exercise.

## Stack

- **React 19 + TypeScript**, bundled with **Vite**.
- **Tailwind CSS v4** (via `@tailwindcss/vite`) for styling — utility classes only, no
  component library.
- **Oxlint** for linting.
- Commands: `pnpm dev`, `pnpm build`, `pnpm lint`.

## Objectives (what the page must do)

- **Responsive product grid** — each product is a card showing image, name, price, rating,
  and stock status.
- **Clear pricing** — when an item is on sale (has an `originalPrice`), show the sale price
  and the original price together, and make the discount obvious.
- **Stock states** — visually distinguish `in_stock`, `low_stock`, and `out_of_stock`.
- **Add to cart** — an action on each card, disabled for out-of-stock items.
- **Cart summary** — a header badge and side panel showing item count and running total,
  updating live as items are added.
- **A non-happy-path state** — a loading state while data "loads" (plus an empty state for
  filtered-to-zero results).
- **Stretch (done):** per-item quantity stepper in the cart; sort (price/rating) and an
  "on sale only" filter in the toolbar.

## Core decisions

- **Data is treated like an API response.** `products.json` is bundled but loaded through a
  `useProducts` hook with a simulated ~600ms latency so the loading skeleton is real and
  visible. The UI derives everything it needs from the raw data.
- **"On sale" is derived, not tag-driven.** A product is on sale when
  `originalPrice != null && originalPrice > price`, rather than trusting the `sale` tag —
  keeps pricing UI consistent regardless of tagging.
- **Cart state is local to `App` via `useCart(products)`**, keyed by product id
  (`Record<id, quantity>`). No global store or context — the app is small enough that this
  is simpler and clearer. Line items, totals, and item count are derived via `useMemo`.
- **Cart is a side panel, not just a badge.** The header button always shows count +
  running total; the slide-over panel (quantities, remove, subtotal) renders on demand to
  keep the grid uncluttered.
- **Stock updates live as items are added.** The grid shows *remaining* stock
  (`stockCount − quantityInCart`), derived in `stock.ts`. As the cart fills, an in-stock
  item can drop to "low stock" and then to depleted; at that point the card shows a
  disabled "Max in cart" button (distinct from a genuinely out-of-stock item, which stays
  "Out of stock"). Adding is blocked once the cart holds all available units — enforced
  both by the disabled button and by a cap inside `useCart` (`addToCart` / `setQuantity`),
  so the cart can never exceed `stockCount`.
- **Pagination** (`Pagination.tsx`) — the grid pages at `PAGE_SIZE` (6) items. The current
  page clamps back into range when filtering shrinks the result set, and resets to page 1
  when the search/sort/filter changes.
- **Regex search runs only on Enter** (`SearchBar.tsx` → `SearchField.tsx`). Typing just
  updates the live `query`; the applied value (`appliedQuery`) only changes when the user
  presses **Enter** or the ↵ Enter button (or clears via ✕). Applying kicks off a short
  (~500ms) spinner + "Searching…" hint before results settle, purely for feel. The query
  is compiled to a case-insensitive `RegExp` tested against name/brand/category; invalid
  patterns fall back to showing everything with an inline hint. `SearchField` is the input
  on its own; `SearchBar` composes it with the AI toggle button.
- **"Enable AI Search" opens a left-side chat panel** (`AiChatPanel.tsx`, mirroring the
  right-side cart). The rainbow glowing gradient button (animated `.ai-rainbow-bg` in
  `index.css`, respecting `prefers-reduced-motion`) toggles it. The assistant is a mock
  (`useAiChat.ts`) with a fake "typing" delay:
  - If a message contains a **product image URL** (or a SKU id), it returns the products
    using that image.
  - On a **deal/discount** request ("biggest discounts", "on sale", etc.) it returns the
    on-sale products sorted by discount %, best first — mirroring the page's "Biggest
    discount" sort.
  - Otherwise it does a loose keyword lookup across name/brand/category/tags.
  Results render as detailed `ChatProductCard`s (image, brand, rating, sale pricing +
  discount %, stock, Add). There's no real AI/backend; matching is local, and chat "Add"
  buttons reuse `cart.addToCart`.
- **Sort** includes `discount_desc` ("Biggest discount"), computed via `discountPercent`
  in `products/pricing.ts` (shared by the card, the page sort, and the AI mock).
- **Add-to-cart toasts** (`features/toast`) — `App` wraps the add action in
  `handleAddToCart`, which fires a toast only when a unit was actually added. `useCart`'s
  `addToCart` returns a boolean for this (false at the stock cap). Toasts render via
  `ToastViewport` (bottom-right, auto-dismiss ~2.6s, `toast-in` keyframe in `index.css`).
- **Hero + header** — a full-bleed hero uses a random `picsum.photos` image seeded once per
  session. The sticky header hides on scroll-down past ~160px and reveals on scroll-up
  (`headerHidden` state + a scroll listener in `App`).
- **Currency:** all data is USD; `Intl.NumberFormat` is used for formatting.
- **Cards are large/bold and laid out as a tight, square grid** (2-col, 3-col at `lg`,
  small `gap-2` gutters, hairline borders, no rounding/shadow — Bose "New Arrivals" style)
  with an image zoom on hover. Long names are clamped to two lines with a `title` tooltip
  so the grid stays aligned.

## Structure

Code is organized by **feature folder** under `src/features/*`. Each feature owns its
components, hooks, and helpers, and exposes a single barrel `index.ts`; other code imports
from the barrel, never deep paths.

```
src/
  App.tsx                     — page composition, filter/sort/panel state
  features/
    products/                 — catalog, cart, search bar, toolbar, pagination
      index.ts                — barrel (also re-exports shared primitives below)
      types.ts                — Product / StockStatus types
      format.ts               — currency formatting
      pricing.ts              — isOnSale / discountPercent
      stock.ts                — remaining-stock + status derivation
      products.json           — bundled catalog (the mock "API" data)
      hooks/
        useProducts.ts        — simulated data load + loading state
        useCart.ts            — cart state, line items, totals
      components/
        ProductCard.tsx, ProductCardSkeleton.tsx, StockBadge.tsx, StarRating.tsx,
        SearchField.tsx, SearchBar.tsx, Toolbar.tsx, Pagination.tsx,
        CartButton.tsx, CartPanel.tsx, EmptyState.tsx
    ai-search/                — the AI search chat (its own feature)
      index.ts                — barrel
      hooks/
        useAiChat.ts          — mock AI (image-URL / discount / keyword lookup)
      components/
        AiChatPanel.tsx       — left-side slide-over chat
        ChatProductCard.tsx   — detailed product result card
    toast/                    — cross-cutting toast notifications
      index.ts                — barrel
      useToasts.ts            — toast state + auto-dismiss
      ToastViewport.tsx       — bottom-right toast stack
```

## Conventions

- **Separate concerns into their own feature folder under `src/features/*`.** A feature =
  its own components/hooks/helpers + a barrel `index.ts`. The AI search chat lives in
  `features/ai-search`, distinct from the product catalog in `features/products`; add new
  distinct areas as new feature folders rather than piling into `products`.
- **Import from a feature's barrel** (`./features/<name>`), not deep file paths.
- **Cross-feature sharing goes through the owning barrel.** `products` re-exports the
  primitives other features reuse (`Product`, `formatCurrency`, `StarRating`, `StockBadge`,
  `isOnSale`, `discountPercent`, `deriveStock`); `ai-search` imports those from
  `../products`.
- Buttons/inputs that are clickable use `cursor-pointer` (Tailwind v4 defaults buttons to
  the default cursor); disabled states use `cursor-not-allowed`.
