import { useEffect, useRef, useState } from 'react'
import type { ChatMessage } from '../hooks/useAiChat'
import { buildResultsUrl } from '../match'
import { ChatProductCard } from './ChatProductCard'

// Show at most a couple of results inline; the rest live on the "show all" results page.
const CHAT_PREVIEW_COUNT = 2

interface AiChatPanelProps {
  open: boolean
  onClose: () => void
  messages: ChatMessage[]
  typing: boolean
  onSend: (text: string) => void
  onAddToCart: (productId: string) => void
}

export function AiChatPanel({ open, onClose, messages, typing, onSend, onAddToCart }: AiChatPanelProps) {
  const [draft, setDraft] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, typing])

  const submit = () => {
    if (!draft.trim()) return
    onSend(draft)
    setDraft('')
  }

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
        className={`fixed left-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="dialog"
        aria-label="AI search chat"
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">✨ AI Search</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close AI chat"
            className="cursor-pointer rounded-full p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
          >
            ✕
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
          <ul className="flex flex-col gap-3">
            {messages.map((m) => (
              <li key={m.id} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                <div className="max-w-[90%]">
                  <div
                    className={`rounded-lg px-3 py-2 text-sm ${
                      m.role === 'user' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {m.text}
                  </div>

                  {m.products && m.products.length > 0 && (
                    <div className="mt-2 flex flex-col gap-2">
                      {m.products.slice(0, CHAT_PREVIEW_COUNT).map((p) => (
                        <ChatProductCard key={p.id} product={p} onAddToCart={onAddToCart} />
                      ))}
                      {m.products.length > CHAT_PREVIEW_COUNT && m.query && (
                        <button
                          type="button"
                          onClick={() => window.open(buildResultsUrl(m.query!), '_blank', 'noopener')}
                          className="w-full cursor-pointer rounded-sm border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-800 transition hover:bg-gray-50"
                        >
                          Show all {m.products.length} results ↗
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </li>
            ))}

            {typing && (
              <li className="flex justify-start">
                <div className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-2.5">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.2s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.1s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
                </div>
              </li>
            )}
          </ul>
        </div>

        <div className="border-t border-gray-200 p-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') submit()
              }}
              placeholder="Ask, or paste a product image URL…"
              aria-label="Message the AI assistant"
              className="flex-1 rounded-sm border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none"
            />
            <button
              type="button"
              onClick={submit}
              disabled={!draft.trim()}
              className="cursor-pointer rounded-sm bg-gray-900 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
            >
              Send
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
