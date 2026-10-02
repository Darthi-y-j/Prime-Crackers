import { getAdminPushRegistration, getVapidPublicKey, urlBase64ToUint8Array } from '@/lib/pushUtils'

export async function subscribeForAdminPush(): Promise<{
  subscription: PushSubscription | null
  error?: string
}> {
  const vapidKey = getVapidPublicKey()
  if (!vapidKey) {
    return { subscription: null, error: 'VAPID public key missing in this build (Vercel env + redeploy).' }
  }

  const { registration, error: regError } = await getAdminPushRegistration()
  if (!registration) {
    return {
      subscription: null,
      error: regError || 'Could not register service worker. Use HTTPS and Chrome/Safari.',
    }
  }

  await navigator.serviceWorker.ready

  const appServerKey = urlBase64ToUint8Array(vapidKey) as BufferSource

  const trySubscribe = async () =>
    registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: appServerKey,
    })

  try {
    const existing = await registration.pushManager.getSubscription()
    if (existing) return { subscription: existing }

    const subscription = await trySubscribe()
    return { subscription }
  } catch {
    try {
      const stale = await registration.pushManager.getSubscription()
      if (stale) await stale.unsubscribe()
      const subscription = await trySubscribe()
      return { subscription }
    } catch (secondErr) {
      const message = secondErr instanceof Error ? secondErr.message : String(secondErr)
      const hint =
        message.includes('applicationServerKey') || message.toLowerCase().includes('vapid')
          ? 'VAPID key problem — VITE_VAPID_PUBLIC_KEY on Vercel must match Supabase VAPID pair.'
          : message
      return { subscription: null, error: hint }
    }
  }
}
