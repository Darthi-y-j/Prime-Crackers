const SW_PATH = '/admin-push-sw.js'

export function isWebPushSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  )
}

export function getVapidPublicKey(): string | null {
  const key = import.meta.env.VITE_VAPID_PUBLIC_KEY as string | undefined
  if (!key || key.includes('your-')) return null
  return key.trim()
}

export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(base64)
  const output = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; i++) output[i] = raw.charCodeAt(i)
  return output
}

export async function getAdminPushRegistration(): Promise<ServiceWorkerRegistration | null> {
  if (!isWebPushSupported()) return null
  try {
    const existing = await navigator.serviceWorker.getRegistration('/')
    if (existing?.active?.scriptURL.includes('admin-push-sw')) return existing
    return await navigator.serviceWorker.register(SW_PATH, { scope: '/' })
  } catch {
    return null
  }
}

export function subscriptionToRow(
  userId: string,
  sub: PushSubscription,
): {
  user_id: string
  endpoint: string
  p256dh: string
  auth_key: string
  user_agent: string | null
} | null {
  const json = sub.toJSON()
  const keys = json.keys
  if (!json.endpoint || !keys?.p256dh || !keys?.auth) return null
  return {
    user_id: userId,
    endpoint: json.endpoint,
    p256dh: keys.p256dh,
    auth_key: keys.auth,
    user_agent: typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 512) : null,
  }
}
