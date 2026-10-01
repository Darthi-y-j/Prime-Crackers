import { Bell, BellOff, Loader2, Smartphone } from 'lucide-react'
import { useAdminPush } from '@/contexts/AdminPushContext'
import { cn } from '@/lib/utils'

export function AdminEnquiryPushBanner() {
  const { supported, configured, permission, subscribed, busy, enablePush, disablePush } = useAdminPush()

  if (!supported) {
    return (
      <div className="border-b border-amber-200/80 bg-amber-50 px-4 py-2.5 text-center text-xs text-amber-900 sm:px-6">
        <Smartphone className="mr-1 inline h-3.5 w-3.5" />
        Use Chrome on Android or add this site to your iPhone Home Screen for enquiry alerts.
      </div>
    )
  }

  if (!configured) return null

  if (permission === 'granted' && subscribed) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-200/80 bg-emerald-50/90 px-4 py-2 sm:px-6">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-emerald-900">
          <Bell className="h-3.5 w-3.5" />
          Enquiry alerts on this device
        </p>
        <button
          type="button"
          disabled={busy}
          onClick={() => void disablePush()}
          className="inline-flex items-center gap-1 rounded-lg border border-emerald-300/80 bg-white px-2.5 py-1 text-[11px] font-bold text-emerald-800 transition hover:bg-emerald-50 disabled:opacity-50"
        >
          {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : <BellOff className="h-3 w-3" />}
          Turn off
        </button>
      </div>
    )
  }

  if (permission === 'denied') {
    return (
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-center text-xs text-slate-600 sm:px-6">
        Notifications blocked — open browser settings for this site and allow notifications, then refresh.
      </div>
    )
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#004D55]/10 bg-[#FFF8E1]/80 px-4 py-2.5 sm:px-6">
      <p className="max-w-md text-xs leading-snug text-[#004D55]">
        <span className="font-bold">Get notified on your phone</span> when a customer sends an enquiry (works in
        background after you allow).
      </p>
      <button
        type="button"
        disabled={busy}
        onClick={() => void enablePush()}
        className={cn(
          'inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[#004D55] px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white shadow-sm transition hover:bg-[#006670] disabled:opacity-50',
        )}
      >
        {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Bell className="h-3.5 w-3.5 text-[#FFC107]" />}
        Enable alerts
      </button>
    </div>
  )
}
