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
  deleteAdminPushSubscription,
  upsertAdminPushSubscription,
} from '@/services/adminPushSubscriptions'

type PushPermission = NotificationPermission | 'unsupported'

interface AdminPushContextValue {
  supported: boolean
  configured: boolean
  permission: PushPermission
  subscribed: boolean
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
  const [busy, setBusy] = useState(false)

  const supported = isWebPushSupported()
  const configured = Boolean(getVapidPublicKey())

  const syncSubscription = useCallback(async (): Promise<boolean> => {
    if (!user || !isAdmin || !supported || !configured) return false
    if (Notification.permission !== 'granted') return false

    const vapidKey = getVapidPublicKey()
    if (!vapidKey) return false

    const registration = await getAdminPushRegistration()
    if (!registration) return false

    await navigator.serviceWorker.ready

    let subscription = await registration.pushManager.getSubscription()
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey) as BufferSource,
      })
    }

    const row = subscriptionToRow(user.id, subscription)
    if (!row) return false

    const { error } = await upsertAdminPushSubscription(row)
    if (error) {
      console.warn('Push subscription save failed', error)
      return false
    }

    setSubscribed(true)
    return true
  }, [user, isAdmin, supported, configured])

  useEffect(() => {
    if (!isAdmin || !user) {
      setSubscribed(false)
      return
    }
    if (Notification.permission === 'granted' && configured) {
      void syncSubscription()
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
      const result = await Notification.requestPermission()
      setPermission(result)
      if (result !== 'granted') {
        showToast('Allow notifications in your browser settings to get enquiry alerts.', 'error')
        return
      }
      const ok = await syncSubscription()
      if (ok) {
        showToast('Enquiry alerts enabled on this device.', 'success')
      } else {
        showToast('Could not register for push. Try again or use Chrome/Safari (Add to Home Screen on iPhone).', 'error')
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
      busy,
      enablePush,
      disablePush,
    }),
    [supported, configured, permission, subscribed, busy, enablePush, disablePush],
  )

  return <AdminPushContext.Provider value={value}>{children}</AdminPushContext.Provider>
}

export function useAdminPush() {
  const ctx = useContext(AdminPushContext)
  if (!ctx) throw new Error('useAdminPush must be used within AdminPushProvider')
  return ctx
}
