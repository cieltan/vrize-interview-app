import { useState } from 'react'
import type { Product } from '../../products'
import { isOnSale, discountPercent } from '../../products'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
  products?: Product[]
}

let idCounter = 0
const nextId = () => `m${++idCounter}`

const GREETING: ChatMessage = {
  id: 'greeting',
  role: 'assistant',
  text: "Hi! I'm the Vrize shopping assistant. Tell me what you're after, ask for the biggest discounts, or paste a product image URL and I'll pull up the matching item.",
}

// Mock "AI" reply. Behaviours, in order: match by image URL / SKU, surface the biggest
// discounts on a deal-shaped request, then fall back to a loose keyword lookup.
function buildReply(text: string, products: Product[]): ChatMessage {
  const trimmed = text.trim()

  const byImage = products.filter(
    (p) => trimmed.includes(p.imageUrl) || new RegExp(p.id, 'i').test(trimmed),
  )
  if (byImage.length > 0) {
    return {
      id: nextId(),
      role: 'assistant',
      text:
        byImage.length === 1
          ? 'Found it — this is the product using that image:'
          : `Found ${byImage.length} products using that image:`,
      products: byImage,
    }
  }

  if (/https?:\/\/\S+/i.test(trimmed)) {
    return {
      id: nextId(),
      role: 'assistant',
      text: "I couldn't match that image URL to anything in the catalog. Try one of the image links from a product card.",
    }
  }

  if (/discount|deal|on sale|sale|% off|percent off|cheap|biggest|best price/i.test(trimmed)) {
    const deals = products
      .filter(isOnSale)
      .sort((a, b) => discountPercent(b) - discountPercent(a))
    if (deals.length > 0) {
      return {
        id: nextId(),
        role: 'assistant',
        text: 'Here are the biggest discounts right now, best first:',
        products: deals,
      }
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
      id: nextId(),
      role: 'assistant',
      text: `Here ${matches.length === 1 ? 'is a match' : `are ${matches.length} matches`} I found:`,
      products: matches.slice(0, 5),
    }
  }

  return {
    id: nextId(),
    role: 'assistant',
    text: 'I couldn’t find anything for that. Try a category like “audio”, ask for the biggest discounts, or paste a product image URL.',
  }
}

export function useAiChat(products: Product[]) {
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING])
  const [typing, setTyping] = useState(false)

  function sendMessage(text: string) {
    const trimmed = text.trim()
    if (!trimmed) return

    setMessages((prev) => [...prev, { id: nextId(), role: 'user', text: trimmed }])
    setTyping(true)

    // Fake the assistant "thinking" before it replies.
    window.setTimeout(() => {
      setMessages((prev) => [...prev, buildReply(trimmed, products)])
      setTyping(false)
    }, 700)
  }

  return { messages, typing, sendMessage }
}
