import type { Product } from '../products'
import { isOnSale, discountPercent } from '../products'

// URL param that turns the app into the full "all results for a query" page (opened in a
// new tab from the chat's "show all" button).
export const RESULTS_QUERY_PARAM = 'results'

export function buildResultsUrl(query: string): string {
  const url = new URL(window.location.href)
  url.search = ''
  url.searchParams.set(RESULTS_QUERY_PARAM, query)
  return url.toString()
}

export interface MatchResult {
  /** Human-facing label for the result set (used as the assistant's reply text). */
  label: string
  /** All products that matched — full list; the chat only previews a couple. */
  products: Product[]
}

// Mock "AI" matching. In order: match by image URL / SKU, surface the biggest discounts on
// a deal-shaped request, then fall back to a loose keyword lookup. Pure so the chat and the
// full results page can share it.
export function matchProducts(text: string, products: Product[]): MatchResult {
  const trimmed = text.trim()

  const byImage = products.filter(
    (p) => trimmed.includes(p.imageUrl) || new RegExp(p.id, 'i').test(trimmed),
  )
  if (byImage.length > 0) {
    return {
      label:
        byImage.length === 1
          ? 'Found it — this is the product using that image:'
          : `Found ${byImage.length} products using that image:`,
      products: byImage,
    }
  }

  if (/https?:\/\/\S+/i.test(trimmed)) {
    return {
      label:
        "I couldn't match that image URL to anything in the catalog. Try one of the image links from a product card.",
      products: [],
    }
  }

  if (/discount|deal|on sale|sale|% off|percent off|cheap|biggest|best price/i.test(trimmed)) {
    const deals = products
      .filter(isOnSale)
      .sort((a, b) => discountPercent(b) - discountPercent(a))
    if (deals.length > 0) {
      return { label: 'Here are the biggest discounts right now, best first:', products: deals }
    }
  }

  const tokens = trimmed.toLowerCase().split(/\s+/).filter(Boolean)
  const matches = tokens.length
    ? products.filter((p) => {
        const hay = `${p.name} ${p.brand} ${p.category} ${p.tags.join(' ')}`.toLowerCase()
        return tokens.some((t) => hay.includes(t))
      })
    : []

  if (matches.length > 0) {
    return {
      label: `Here ${matches.length === 1 ? 'is a match' : `are ${matches.length} matches`} I found:`,
      products: matches,
    }
  }

  return {
    label:
      'I couldn’t find anything for that. Try a category like “audio”, ask for the biggest discounts, or paste a product image URL.',
    products: [],
  }
}
