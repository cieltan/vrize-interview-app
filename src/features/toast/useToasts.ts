import { useCallback, useRef, useState } from 'react'

export interface Toast {
  id: number
  message: string
}

export function useToasts(durationMs = 2600) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const idRef = useRef(0)

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const add = useCallback(
    (message: string) => {
      const id = ++idRef.current
      setToasts((prev) => [...prev, { id, message }])
      window.setTimeout(() => dismiss(id), durationMs)
    },
    [durationMs, dismiss],
  )

  return { toasts, add, dismiss }
}
