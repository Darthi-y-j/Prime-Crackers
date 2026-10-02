import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { supabase } from '@/lib/supabase'
import {
  getAdminPushRegistration,
  getVapidPublicKey,
  isWebPushSupported,
  subscriptionToRow,
  urlBase64ToUint8Array,
} from '@/lib/pushUtils'
import {
  countMyAdminPushSubscriptions,
  deleteAdminPushSubscription,
  upsertAdminPushSubscription,
} from '@/services/adminPushSubscriptions'

type PushPermission = NotificationPermission | 'unsupported'

interface AdminPushContextValue {
  supported: boolean
  configured: boolean
  permission: PushPermission
  subscribed: boolean
  registrationError: string | null
  busy: boolean
  enablePush: () => Promise<void>
  disablePush: () => Promise<void>
}

const AdminPushContext = createContext<AdminPushContextValue | null>(null)

export function AdminPushProvider({ children }: { children: ReactNode }) {
  const { user, isAdmin } = useAuth()
  const { showToast } = useToast()
  const [permission, setPermission] = useState<PushPermission>(() =>
    isWebPushSupported() ? Notification.permission : 'unsupported',
  )
  const [subscribed, setSubscribed] = useState(false)
  const [registrationError, setRegistrationError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const supported = isWebPushSupported()
  const configured = Boolean(getVapidPublicKey())

  const syncSubscription = useCallback(async (): Promise<{ ok: boolean; error?: string }> => {
    if (!user || !isAdmin || !supported || !configured) {
      return { ok: false, error: !configured ? 'VAPID public key missing in this build.' : undefined }
    }
    if (Notification.permission !== 'granted') return { ok: false }

    const vapidKey = getVapidPublicKey()
    if (!vapidKey) return { ok: false, error: 'VAPID public key missing in this build.' }

    const registration = await getAdminPushRegistration()
    if (!registration) {
      return { ok: false, error: 'Could not register service worker. Use HTTPS and try Chrome.' }
    }

    await navigator.serviceWorker.ready

    let subscription = await registration.pushManager.getSubscription()
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey) as BufferSource,
      })
    }

    const row = subscriptionToRow(user.id, subscription)
    if (!row) return { ok: false, error: 'Invalid push subscription from browser.' }

    const { error } = await upsertAdminPushSubscription(row)
    if (error) {
      setRegistrationError(error)
      console.warn('Push subscription save failed', error)
      return { ok: false, error }
    }

    const { count, error: countError } = await countMyAdminPushSubscriptions()
    if (countError) {
      setRegistrationError(countError)
      return { ok: false, error: countError }
    }
    if (count < 1) {
      const msg = 'Subscription was not saved. Run migration 026 in Supabase SQL Editor.'
      setRegistrationError(msg)
      return { ok: false, error: msg }
    }

    setRegistrationError(null)
    setSubscribed(true)
    return { ok: true }
  }, [user, isAdmin, supported, configured])

  useEffect(() => {
    if (!isAdmin || !user) {
      setSubscribed(false)
      return
    }
    if (Notification.permission === 'granted' && configured) {
      void syncSubscription().then((result) => {
        if (!result.ok) {
          setSubscribed(false)
          if (result.error) setRegistrationError(result.error)
        }
      })
    }
  }, [isAdmin, user, configured, syncSubscription])

  useEffect(() => {
    if (!isAdmin || !user) return

    const channel = supabase
      .channel(`admin-enquiries-${user.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'enquiries' },
        (payload) => {
          const row = payload.new as { customer_name?: string; enquiry_number?: string }
          const name = row.customer_name || 'Customer'
          const num = row.enquiry_number ? ` (${row.enquiry_number})` : ''
          showToast(`New enquiry: ${name}${num}`, 'info')
        },
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [isAdmin, user, showToast])

  const enablePush = useCallback(async () => {
    if (!supported) {
      showToast('This browser does not support push notifications.', 'error')
      return
    }
    if (!configured) {
      showToast('Push is not configured on the server yet (VAPID key missing).', 'error')
      return
    }

    setBusy(true)
    try {
      const perm = await Notification.requestPermission()
      setPermission(perm)
      if (perm !== 'granted') {
        showToast('Allow notifications in your browser settings to get enquiry alerts.', 'error')
        return
      }
      const sync = await syncSubscription()
      if (sync.ok) {
        showToast('Enquiry alerts enabled on this device.', 'success')
      } else {
        showToast(
          sync.error ||
            'Could not register for push. Check VITE_VAPID_PUBLIC_KEY on Vercel, migration 026, and try Chrome or iPhone Home Screen.',
          'error',
        )
      }
    } finally {
      setBusy(false)
    }
  }, [supported, configured, syncSubscription, showToast])

  const disablePush = useCallback(async () => {
    setBusy(true)
    try {
      const registration = await getAdminPushRegistration()
      const subscription = await registration?.pushManager.getSubscription()
      if (subscription) {
        const endpoint = subscription.endpoint
        await subscription.unsubscribe()
        await deleteAdminPushSubscription(endpoint)
      }
      setSubscribed(false)
      showToast('Enquiry alerts turned off on this device.', 'success')
    } finally {
      setBusy(false)
    }
  }, [showToast])

  const value = useMemo(
    () => ({
      supported,
      configured,
      permission,
      subscribed,
      registrationError,
      busy,
      enablePush,
      disablePush,
    }),
    [supported, configured, permission, subscribed, registrationError, busy, enablePush, disablePush],
  )

  return <AdminPushContext.Provider value={value}>{children}</AdminPushContext.Provider>
}

export function useAdminPush() {
  const ctx = useContext(AdminPushContext)
  if (!ctx) throw new Error('useAdminPush must be used within AdminPushProvider')
  return ctx
}
