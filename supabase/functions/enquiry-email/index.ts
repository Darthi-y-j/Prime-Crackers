// Order enquiry email — same Gmail SMTP as Supabase Auth (see company-smtp-setup.sql).

import nodemailer from 'npm:nodemailer@6.9.16'

type EnquiryItem = {
  product_name?: string
  quantity?: number
  price?: number | null
}

type EnquiryRecord = {
  enquiry_number: string
  customer_name: string
  customer_phone: string
  customer_email?: string | null
  customer_message?: string | null
  product_name?: string
  enquiry_type?: string | null
  items?: EnquiryItem[]
  referral_code?: string | null
}

type WebhookBody = {
  record?: EnquiryRecord
}

const DEFAULT_TO = 'primecrackerssivakasi@gmail.com'

function isCartOrOrder(record: EnquiryRecord): boolean {
  const t = (record.enquiry_type || 'cart').toLowerCase()
  return t === 'cart' || t === 'order'
}

function formatInr(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

function buildEmailText(record: EnquiryRecord): string {
  const items = Array.isArray(record.items) ? record.items : []
  const lines: string[] = [
    'New order enquiry — Prime Crackers',
    '',
    `Enquiry number: ${record.enquiry_number}`,
    '',
    '— Items —',
  ]

  if (items.length > 0) {
    items.forEach((item, index) => {
      const price =
        item.price != null && item.price > 0 ? ` @ ${formatInr(item.price)}` : ''
      lines.push(
        `${index + 1}. ${item.product_name || 'Product'} — Qty: ${item.quantity ?? 1}${price}`,
      )
    })
  } else {
    lines.push(record.product_name || '(open admin for details)')
  }

  lines.push('', '— Customer —', `Name: ${record.customer_name}`, `Phone: ${record.customer_phone}`)

  if (record.customer_email?.trim()) {
    lines.push(`Email: ${record.customer_email.trim()}`)
  }
  if (record.customer_message?.trim()) {
    lines.push('', record.customer_message.trim())
  }
  if (record.referral_code?.trim()) {
    lines.push('', `Referral code: ${record.referral_code.trim()}`)
  }

  lines.push('', 'View in admin: https://www.primecracker.com/admin/orders')
  return lines.join('\n')
}

async function sendMail(subject: string, text: string): Promise<void> {
  const host = Deno.env.get('SMTP_HOST') || 'smtp.gmail.com'
  const port = Number(Deno.env.get('SMTP_PORT') || '587')
  const user = Deno.env.get('SMTP_USER') || DEFAULT_TO
  const pass = Deno.env.get('SMTP_PASS')
  const fromName = Deno.env.get('SMTP_FROM_NAME') || 'Prime Crackers'
  const to = Deno.env.get('ENQUIRY_NOTIFY_TO') || DEFAULT_TO

  if (!pass?.trim()) {
    throw new Error(
      'SMTP_PASS is not set on enquiry-email. Use the same Gmail app password as Authentication → SMTP.',
    )
  }

  const transport = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    ...(port === 587 ? { requireTLS: true } : {}),
  })

  await transport.sendMail({
    from: `"${fromName}" <${user}>`,
    to,
    subject,
    text,
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*' } })
  }
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 })
  }

  const hookSecret = Deno.env.get('ENQUIRY_EMAIL_HOOK_SECRET')?.trim()
  if (hookSecret) {
    const header = req.headers.get('x-enquiry-email-secret')?.trim() ?? ''
    if (header !== hookSecret) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }
  }

  let body: WebhookBody
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 })
  }

  const record = body.record
  if (!record?.enquiry_number || !record.customer_name) {
    return new Response(JSON.stringify({ error: 'Missing enquiry record' }), { status: 400 })
  }

  if (!isCartOrOrder(record)) {
    return new Response(JSON.stringify({ ok: true, skipped: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const subject = `New order enquiry ${record.enquiry_number} — ${record.customer_name}`
    await sendMail(subject, buildEmailText(record))
    return new Response(JSON.stringify({ ok: true, emailed: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('enquiry-email error:', message)
    return new Response(JSON.stringify({ error: message }), { status: 500 })
  }
})
