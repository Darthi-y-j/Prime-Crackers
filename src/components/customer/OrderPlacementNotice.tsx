import { useSettings } from '@/contexts/SettingsContext'
import {
  getOrderPlacementPauseMessage,
  isOrderPlacementPaused,
} from '@/lib/orderPlacement'

/** Site-wide banner when admin pauses new orders. */
export function OrderPlacementNotice() {
  const { settings } = useSettings()

  if (!isOrderPlacementPaused(settings)) return null

  return (
    <div
      className="border-b border-amber-700/30 bg-gradient-to-r from-amber-600 to-amber-700 px-4 py-2.5 text-center text-sm font-medium leading-snug text-white shadow-sm"
      role="status"
    >
      {getOrderPlacementPauseMessage(settings)}
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
    </div>
  )
}
