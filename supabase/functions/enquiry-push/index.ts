import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'
import webpush from 'npm:web-push@3.6.7'

type EnquiryRecord = {
  id: string
  enquiry_number: string
  customer_name: string
  customer_phone: string
  product_name: string
  enquiry_type: string | null
  items?: unknown[]
}

type WebhookBody = {
  type?: string
  table?: string
  record?: EnquiryRecord
  old_record?: EnquiryRecord
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-enquiry-push-secret',
  }
}

function adminPathForEnquiry(record: EnquiryRecord): string {
  const type = record.enquiry_type || 'cart'
  if (type === 'order' || type === 'cart') return '/admin/orders'
  return '/admin/enquiries'
}

function buildNotification(record: EnquiryRecord, siteUrl: string) {
  const path = adminPathForEnquiry(record)
  const itemCount = Array.isArray(record.items) ? record.items.length : 0
  const itemsHint = itemCount > 0 ? ` · ${itemCount} item${itemCount === 1 ? '' : 's'}` : ''
  return {
    title: 'New enquiry — Prime Crackers',
    body: `${record.customer_name} · ${record.enquiry_number}${itemsHint}`,
    tag: `enquiry-${record.id}`,
    data: {
      url: path,
      enquiryId: record.id,
      siteUrl,
    },
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders() })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
    })
  }

  const hookSecret = Deno.env.get('ENQUIRY_PUSH_HOOK_SECRET')
  if (hookSecret) {
    const headerSecret = req.headers.get('x-enquiry-push-secret')
    if (headerSecret !== hookSecret) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
      })
    }
  }

  const vapidPublic = Deno.env.get('VAPID_PUBLIC_KEY')
  const vapidPrivate = Deno.env.get('VAPID_PRIVATE_KEY')
  const vapidSubject = Deno.env.get('VAPID_SUBJECT') || 'mailto:primecrackerssivakasi@gmail.com'
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  const siteUrl = (Deno.env.get('SITE_URL') || 'https://www.primecracker.com').replace(/\/$/, '')

  if (!vapidPublic || !vapidPrivate || !supabaseUrl || !serviceRoleKey) {
    return new Response(JSON.stringify({ error: 'Server not configured for push' }), {
      status: 500,
      headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
    })
  }

  let body: WebhookBody
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
    })
  }

  const record = body.record
  if (!record?.id || !record.customer_name) {
    return new Response(JSON.stringify({ error: 'Missing enquiry record' }), {
      status: 400,
      headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
    })
  }

  webpush.setVapidDetails(vapidSubject, vapidPublic, vapidPrivate)

  const supabase = createClient(supabaseUrl, serviceRoleKey)
  const { data: subscriptions, error: loadError } = await supabase
    .from('admin_push_subscriptions')
    .select('id, endpoint, p256dh, auth_key')

  if (loadError) {
    return new Response(JSON.stringify({ error: loadError.message }), {
      status: 500,
      headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
    })
  }

  if (!subscriptions?.length) {
    return new Response(JSON.stringify({ ok: true, sent: 0, message: 'No admin subscriptions' }), {
      headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
    })
  }

  const payload = JSON.stringify(buildNotification(record, siteUrl))
  let sent = 0
  const staleIds: string[] = []

  for (const sub of subscriptions) {
    try {
      await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.p256dh, auth: sub.auth_key },
        },
        payload,
      )
      sent += 1
    } catch (err) {
      const status = (err as { statusCode?: number }).statusCode
      if (status === 404 || status === 410) {
        staleIds.push(sub.id)
      }
      console.error('Push failed', sub.endpoint, err)
    }
  }

  if (staleIds.length) {
    await supabase.from('admin_push_subscriptions').delete().in('id', staleIds)
  }

  return new Response(JSON.stringify({ ok: true, sent, removed: staleIds.length }), {
    headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
  })
})
