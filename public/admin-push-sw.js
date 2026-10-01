/* Admin enquiry Web Push — scope: site root */
self.addEventListener('push', (event) => {
  let payload = { title: 'New enquiry', body: 'Open admin to view details.', data: { url: '/admin/orders' } }
  try {
    if (event.data) {
      const parsed = event.data.json()
      payload = { ...payload, ...parsed }
    }
  } catch {
    const text = event.data?.text()
    if (text) payload.body = text
  }

  const url = payload.data?.url || '/admin/orders'
  const options = {
    body: payload.body,
    icon: '/favicon-192x192.png?v=3',
    badge: '/favicon-32x32.png?v=3',
    tag: payload.tag || 'prime-enquiry',
    renotify: true,
    data: { url, enquiryId: payload.data?.enquiryId },
  }

  event.waitUntil(self.registration.showNotification(payload.title, options))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const path = event.notification.data?.url || '/admin/orders'
  const enquiryId = event.notification.data?.enquiryId
  const targetUrl = enquiryId
    ? `${self.location.origin}${path}?enquiry=${encodeURIComponent(enquiryId)}`
    : `${self.location.origin}${path}`

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (!client.url.startsWith(self.location.origin) || !('focus' in client)) continue
        if (typeof client.navigate === 'function') {
          return client.navigate(targetUrl).then(() => client.focus())
        }
        return client.focus()
      }
      if (self.clients.openWindow) return self.clients.openWindow(targetUrl)
    }),
  )
})
