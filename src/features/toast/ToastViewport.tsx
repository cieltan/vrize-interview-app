import type { Toast } from './useToasts'

interface ToastViewportProps {
  toasts: Toast[]
  onDismiss: (id: number) => void
}

export function ToastViewport({ toasts, onDismiss }: ToastViewportProps) {
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className="toast-in pointer-events-auto flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-lg"
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-semibold text-green-700">
            ✓
          </span>
          <p className="text-sm font-medium text-gray-900">{t.message}</p>
          <button
            type="button"
            onClick={() => onDismiss(t.id)}
            aria-label="Dismiss notification"
            className="ml-1 cursor-pointer text-gray-400 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}
