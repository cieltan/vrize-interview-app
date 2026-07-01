import { useState } from 'react'
import type { Product } from '../../products'
import { matchProducts } from '../match'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
  products?: Product[]
  /** The user query that produced these results (drives the "show all" results page). */
  query?: string
}

let idCounter = 0
const nextId = () => `m${++idCounter}`

const GREETING: ChatMessage = {
  id: 'greeting',
  role: 'assistant',
  text: "Hi! I'm the Vrize shopping assistant. Tell me what you're after, ask for the biggest discounts, or paste a product image URL and I'll pull up the matching item.",
}

function buildReply(text: string, products: Product[]): ChatMessage {
  const { label, products: matched } = matchProducts(text, products)
  return { id: nextId(), role: 'assistant', text: label, products: matched, query: text }
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
