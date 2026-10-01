/**
 * Generate VAPID key pair for Web Push.
 * Run: npm run vapid:keys
 */
import { randomBytes } from 'node:crypto'
import webpush from 'web-push'

const keys = webpush.generateVAPIDKeys()
const hookSecret = randomBytes(32).toString('base64url')

console.log('')
console.log('=== COPY EACH FULL LINE (no line breaks in the middle) ===')
console.log('')
console.log('--- Vercel + local .env (public only) ---')
console.log(`VITE_VAPID_PUBLIC_KEY=${keys.publicKey}`)
console.log('')
console.log('--- Supabase Edge Function secrets (enquiry-push) ---')
console.log(`VAPID_PUBLIC_KEY=${keys.publicKey}`)
console.log(`VAPID_PRIVATE_KEY=${keys.privateKey}`)
console.log('VAPID_SUBJECT=mailto:primecrackerssivakasi@gmail.com')
console.log('SITE_URL=https://www.primecracker.com')
console.log(`ENQUIRY_PUSH_HOOK_SECRET=${hookSecret}`)
console.log('')
console.log('--- Database webhook HTTP header (same as hook secret) ---')
console.log(`Header name: x-enquiry-push-secret`)
console.log(`Header value: ${hookSecret}`)
console.log('')
console.log('Never commit VAPID_PRIVATE_KEY or ENQUIRY_PUSH_HOOK_SECRET to git.')
console.log('')
