# Admin enquiry Web Push (PWA)

Admins get **phone notifications** when a customer submits an enquiry. Works on **Android Chrome** and **iPhone Safari** (add site to Home Screen, then allow notifications).

## 1. Run database migration

In Supabase **SQL Editor**, run:

`supabase/migrations/026_admin_push_subscriptions.sql`  
`supabase/migrations/029_upsert_admin_push_subscription_rpc.sql` (fixes “alerts not registered” after 026)

Optional (in-app toast when admin tab is open): **Database → Publications → `supabase_realtime`** → enable **`enquiries`**.

## 2. Generate VAPID keys

On your PC:

```bash
npm install
node scripts/generate-vapid-keys.mjs
```

- **Vercel** (or hosting): add `VITE_VAPID_PUBLIC_KEY` = public key → redeploy.
- **Supabase Edge Function secrets** (`enquiry-push`) — **Project Settings → Edge Functions → Secrets**:
  - `VAPID_PUBLIC_KEY`
  - `VAPID_PRIVATE_KEY`
  - `VAPID_SUBJECT` = `mailto:primecrackerssivakasi@gmail.com`
  - `SITE_URL` = `https://www.primecracker.com`
  - `ENQUIRY_PUSH_HOOK_SECRET` = long random string (same value in webhook header)

  **Do not** create secrets whose names start with `SUPABASE_` (dashboard blocks them).  
  **Do not** add `SUPABASE_SERVICE_ROLE_KEY` manually — Supabase injects `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` into edge functions automatically.

  Only if push fails with “not configured” and logs show no service role, add a secret named **`SERVICE_ROLE_KEY`** (no `SUPABASE_` prefix) with your project’s **service_role** key from **Settings → API**.

## 3. Deploy Edge Function

From project root (with [Supabase CLI](https://supabase.com/docs/guides/cli) linked to your project):

```bash
supabase functions deploy enquiry-push --no-verify-jwt
```

`--no-verify-jwt` is required when the caller is a **Database Webhook** with a custom secret header (not a user JWT).

## 4. Trigger push on every new enquiry

### Recommended: database trigger (if webhooks fail)

If **Create webhook** shows `schema "supabase_functions" does not exist`, **skip the webhook UI** and use this instead.

1. In **SQL Editor**, run:
   - `supabase/migrations/027_enquiry_push_pg_net_trigger.sql`
2. Run `supabase/enquiry-push-set-secret.sql` after replacing `PASTE_YOUR_...` with your **`ENQUIRY_PUSH_HOOK_SECRET`** (same value as in Edge Function secrets).

That calls `enquiry-push` automatically after each `enquiries` insert.

### Optional: Dashboard webhook

Only if webhook creation works on your project:

**Database → Webhooks → Create** → table `enquiries`, event **Insert**, HTTP POST to  
`https://pewmmipyxxqfbbgqyffg.supabase.co/functions/v1/enquiry-push`  
with header `x-enquiry-push-secret` = your hook secret.

Submit a test enquiry from the cart — admins who enabled alerts should get a notification.

## 5. Admin usage (mobile)

1. Open **https://www.primecracker.com/admin** and log in.
2. Tap **Enable alerts** (banner) or **Alerts** in the header.
3. Allow notifications when the browser asks.
4. **iPhone**: Safari → Share → **Add to Home Screen**, open admin from the icon, then enable alerts (iOS 16.4+).

Each admin device registers separately; all subscribed devices receive new enquiry pushes.

## Quick checklist when no notification arrives

1. **Admin banner** shows green “Enquiry alerts on this device” (not amber Retry).
2. **Supabase → Table Editor → `admin_push_subscriptions`** has at least one row after enabling.
3. **Cart test** total is **₹3,000+** (below minimum the enquiry is **not saved**, so no push).
4. **`enquiry_push_settings`**: `hook_secret` length &gt; 0 and matches Edge secret `ENQUIRY_PUSH_HOOK_SECRET`.
5. Migrations **026**, **027**, and **028** ran; `enquiry-push-set-secret.sql` updated (hook + **anon** key).
6. Edge Function **`enquiry-push`** deployed (`supabase functions deploy enquiry-push`).
7. **Vercel** `VITE_VAPID_PUBLIC_KEY` matches Supabase `VAPID_PUBLIC_KEY` / private pair.
8. **Supabase → Edge Functions → enquiry-push → Logs** after a test enquiry (`sent: 0` = no devices; `401` = hook/anon key).

Run `supabase/enquiry-push-diagnose.sql` in SQL Editor for trigger + `net._http_response` status codes.

## Troubleshooting

| Issue | Fix |
|--------|-----|
| No banner / “VAPID key missing” | Set `VITE_VAPID_PUBLIC_KEY` on Vercel and redeploy |
| Enable works but no push | Run migration 027 + `enquiry-push-set-secret.sql`; check Edge Function logs |
| Webhook: `supabase_functions` does not exist | Use migration **027** (trigger) instead of Dashboard webhook |
| iPhone no push | Must use Home Screen PWA + notification permission |
| 401 on function | Match `x-enquiry-push-secret` with `ENQUIRY_PUSH_HOOK_SECRET` |
| Secret name rejected (`SUPABASE_` prefix) | Use only the names above; skip service role unless you need `SERVICE_ROLE_KEY` |
