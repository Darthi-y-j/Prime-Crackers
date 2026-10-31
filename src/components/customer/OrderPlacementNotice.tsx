import { MessageCircle, Phone } from 'lucide-react'
import { useSettings } from '@/contexts/SettingsContext'
import { formatDisplayPhone } from '@/lib/businessInfo'
import {
  getOrderPlacementPauseMessage,
  isOrderPlacementPaused,
} from '@/lib/orderPlacement'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import { cleanPhone, cn } from '@/lib/utils'

/** Site-wide banner when admin pauses new orders. */
export function OrderPlacementNotice() {
  const { settings } = useSettings()

  if (!isOrderPlacementPaused(settings)) return null

  const whatsapp = settings.whatsapp_number?.trim()

  return (
    <div
      className="border-b border-amber-700/30 bg-gradient-to-r from-amber-600 to-amber-700 px-4 py-2.5 text-center text-sm font-medium leading-snug text-white shadow-sm"
      role="status"
    >
      <p>{getOrderPlacementPauseMessage(settings)}</p>
      {whatsapp ? (
        <a
          href={buildWhatsAppUrl(
            whatsapp,
            'Hi Prime Crackers, I know orders are paused — I have an urgent query.',
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1.5 inline-block text-sm font-bold underline decoration-white/50 underline-offset-2 hover:decoration-white"
        >
          WhatsApp {formatDisplayPhone(whatsapp)}
        </a>
      ) : null}
    </div>
  )
}

function OrderPlacementContactPanel({ className }: { className?: string }) {
  const { settings } = useSettings()
  const whatsapp = settings.whatsapp_number?.trim()
  const phone = settings.phone?.trim()
  const callTarget = phone || whatsapp

  if (!whatsapp && !callTarget) return null

  const whatsappMessage =
    'Hi Prime Crackers, I know orders are paused — I have an urgent query.'

  return (
    <div
      className={cn(
        'mt-4 overflow-hidden rounded-xl border-2 border-[#004D55]/15 bg-white shadow-sm',
        className,
      )}
    >
      <p className="bg-[#004D55] px-4 py-2 text-center text-[11px] font-bold uppercase tracking-[0.18em] text-[#FFC107]">
        Contact us
      </p>

      <div className="space-y-3 px-4 py-4">
        {whatsapp ? (
          <a
            href={buildWhatsAppUrl(whatsapp, whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 rounded-xl border-2 border-[#25D366]/35 bg-[#25D366]/10 px-4 py-4 text-center transition hover:bg-[#25D366]/15"
          >
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#128C7E]">
              <MessageCircle className="h-4 w-4" aria-hidden />
              WhatsApp this number
            </span>
            <span className="font-display text-[1.65rem] font-extrabold leading-none tracking-tight text-[#004D55] sm:text-3xl">
              {formatDisplayPhone(whatsapp)}
            </span>
          </a>
        ) : null}

        {phone && cleanPhone(phone) !== cleanPhone(whatsapp ?? '') ? (
          <a
            href={`tel:${cleanPhone(phone)}`}
            className="flex flex-col items-center gap-1 rounded-xl border border-[#004D55]/15 bg-[#FFF8E1]/80 px-4 py-3 text-center transition hover:bg-[#FFF8E1]"
          >
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#004D55]/70">
              <Phone className="h-4 w-4" aria-hidden />
              Or call
            </span>
            <span className="text-xl font-extrabold tabular-nums text-[#004D55]">
              {formatDisplayPhone(phone)}
            </span>
          </a>
        ) : null}

        {!whatsapp && callTarget ? (
          <a
            href={`tel:${cleanPhone(callTarget)}`}
            className="flex flex-col items-center gap-2 rounded-xl border-2 border-[#004D55]/20 bg-[#FFF8E1] px-4 py-4 text-center"
          >
            <span className="text-xs font-bold uppercase tracking-wide text-[#004D55]/70">Call us</span>
            <span className="font-display text-[1.65rem] font-extrabold text-[#004D55] sm:text-3xl">
              {formatDisplayPhone(callTarget)}
            </span>
          </a>
        ) : null}
      </div>
    </div>
  )
}

export function OrderPlacementPauseAlert({ className }: { className?: string }) {
  const { settings } = useSettings()
  if (!isOrderPlacementPaused(settings)) return null

  return (
    <div
      className={
        className ??
        'rounded-xl border border-amber-300/80 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-950'
      }
      role="alert"
    >
      <p className="font-bold text-amber-900">Orders paused temporarily</p>
      <p className="mt-1">{getOrderPlacementPauseMessage(settings)}</p>
      <OrderPlacementContactPanel />
    </div>
  )
}
