import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle, ShoppingCart, X } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useSettings } from '@/contexts/SettingsContext'
import { useToast } from '@/contexts/ToastContext'
import { formatPrice } from '@/lib/utils'
import { buildWhatsAppContactUrl } from '@/lib/whatsapp'

export function PrimeCartBar() {
  const { items, itemCount, clearCart } = useCart()
  const { settings } = useSettings()
  const { showToast } = useToast()
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  if (items.length === 0) return null

  const total = items.reduce((sum, item) => sum + (item.price ?? 0) * item.quantity, 0)

  const lines = [
    'Hello, I would like to enquire about the following crackers:',
    '',
    ...items.map((item, i) => {
      const priceStr = item.price != null ? ` @ ${formatPrice(item.price)}` : ''
      return `${i + 1}. ${item.productName} × ${item.quantity}${priceStr}`
    }),
    '',
    'Please share availability and delivery details.',
  ]

  const whatsappUrl = buildWhatsAppContactUrl(
    settings.whatsapp_number || '916369773883',
    lines.join('\n'),
  )

  const handleClearCart = () => {
    clearCart()
    setShowClearConfirm(false)
    showToast('Cart cleared', 'success')
  }

  return (
    <div className="prime-cart-bar fixed bottom-0 left-0 right-0 z-40 border-t-4 border-[#FFC107] bg-[#004D55] shadow-[0_-4px_24px_rgba(0,0,0,0.2)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-3 sm:px-6">
        {showClearConfirm ? (
          <>
            <p className="min-w-0 text-sm font-semibold text-white">
              Remove all {itemCount} item{itemCount !== 1 ? 's' : ''} from cart?
            </p>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="rounded-full border border-white/30 px-3 py-2 text-xs font-bold text-white hover:bg-white/10 sm:px-4 sm:text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleClearCart}
                className="rounded-full bg-red-500 px-3 py-2 text-xs font-bold text-white hover:bg-red-400 sm:px-4 sm:text-sm"
              >
                Clear cart
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setShowClearConfirm(true)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/25 text-white/80 transition hover:border-red-400/60 hover:bg-red-500/15 hover:text-red-300"
                aria-label="Clear cart"
                title="Clear cart"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#FFC107]">
                  {itemCount} item{itemCount !== 1 ? 's' : ''} selected
                </p>
                <p className="font-display text-lg font-bold text-white">
                  {total > 0 ? formatPrice(total) : 'Enquiry cart'}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Link
                to="/cart"
                className="inline-flex items-center gap-1.5 rounded-full border-2 border-[#FFC107] bg-transparent px-3 py-2.5 text-sm font-bold text-[#FFC107] hover:bg-[#FFC107]/10 sm:px-4"
              >
                <ShoppingCart className="h-4 w-4" />
                <span className="hidden sm:inline">View Cart</span>
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#FFC107] px-3 py-2.5 text-sm font-bold text-[#004D55] hover:bg-[#FFD54F] sm:px-4"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
