# Admin enquiry Web Push (PWA)

Admins get **phone notifications** when a customer submits an enquiry. Works on **Android Chrome** and **iPhone Safari** (add site to Home Screen, then allow notifications).

## 1. Run database migration

In Supabase **SQL Editor**, run:

`supabase/migrations/026_admin_push_subscriptions.sql`

Optional (in-app toast when admin tab is open): **Database → Publications → `supabase_realtime`** → enable **`enquiries`**.

## 2. Generate VAPID keys

On your PC:

```bash
npm install
node scripts/generate-vapid-keys.mjs
```

- **Vercel** (or hosting): add `VITE_VAPID_PUBLIC_KEY` = public key → redeploy.
- **Supabase Edge Function secrets** (`enquiry-push`):
  - `VAPID_PUBLIC_KEY`
  - `VAPID_PRIVATE_KEY`
  - `VAPID_SUBJECT` = `mailto:primecrackerssivakasi@gmail.com`
  - `SUPABASE_URL` (auto in Supabase)
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `SITE_URL` = `https://www.primecracker.com`
  - `ENQUIRY_PUSH_HOOK_SECRET` = long random string (same value in webhook header)

## 3. Deploy Edge Function

From project root (with [Supabase CLI](https://supabase.com/docs/guides/cli) linked to your project):

```bash
supabase functions deploy enquiry-push --no-verify-jwt
```

`--no-verify-jwt` is required when the caller is a **Database Webhook** with a custom secret header (not a user JWT).

## 4. Database Webhook (fires push on every new enquiry)

Supabase Dashboard → **Database → Webhooks → Create**:

| Field | Value |
|--------|--------|
| Name | `enquiry-push` |
| Table | `enquiries` |
| Events | **Insert** |
| Type | Supabase Edge Function |
| Function | `enquiry-push` |
| HTTP Headers | `x-enquiry-push-secret` = same as `ENQUIRY_PUSH_HOOK_SECRET` |

Save. Submit a test enquiry from the cart — admins who enabled alerts should get a notification.

## 5. Admin usage (mobile)

1. Open **https://www.primecracker.com/admin** and log in.
2. Tap **Enable alerts** (banner) or **Alerts** in the header.
3. Allow notifications when the browser asks.
4. **iPhone**: Safari → Share → **Add to Home Screen**, open admin from the icon, then enable alerts (iOS 16.4+).

Each admin device registers separately; all subscribed devices receive new enquiry pushes.

## Troubleshooting

| Issue | Fix |
|--------|-----|
| No banner / “VAPID key missing” | Set `VITE_VAPID_PUBLIC_KEY` on Vercel and redeploy |
| Enable works but no push | Check webhook + edge function logs; confirm migration ran |
| iPhone no push | Must use Home Screen PWA + notification permission |
| 401 on function | Match `x-enquiry-push-secret` with `ENQUIRY_PUSH_HOOK_SECRET` |
