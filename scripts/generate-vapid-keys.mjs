/**
 * Generate VAPID key pair for Web Push.
 * Run: node scripts/generate-vapid-keys.mjs
 *
 * Add to .env:
 *   VITE_VAPID_PUBLIC_KEY=<publicKey>
 *
 * Add to Supabase Edge Function secrets (enquiry-push):
 *   VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT=mailto:you@example.com
 */
import webpush from 'web-push'

const keys = webpush.generateVAPIDKeys()
console.log('Add these to your environment:\n')
console.log(`VITE_VAPID_PUBLIC_KEY=${keys.publicKey}`)
console.log(`VAPID_PUBLIC_KEY=${keys.publicKey}`)
console.log(`VAPID_PRIVATE_KEY=${keys.privateKey}`)
console.log('\nVAPID_SUBJECT=mailto:primecrackerssivakasi@gmail.com')
