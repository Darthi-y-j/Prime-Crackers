# Order enquiry email (simple setup)

When a customer sends a **cart enquiry on WhatsApp**, you get an email at **primecrackerssivakasi@gmail.com** — same Gmail account you use for login emails.

You do **not** need Web Push for this.

---

## Part A — On your computer (one time)

### 1. Deploy without installing `supabase` (Windows — use `npx`)

Open PowerShell in your project folder (`E:\crackers\Prime crackers`).

**Log in** (browser opens):

```powershell
npx supabase@latest login
```

**Link your project** (one time):

```powershell
npx supabase@latest link --project-ref pewmmipyxxqfbbgqyffg
```

**Deploy the email function**:

```powershell
npx supabase@latest functions deploy enquiry-email --no-verify-jwt
```

Or from npm:

```powershell
npm run supabase:deploy-enquiry-email
```

If you prefer a global CLI: `npm install -g supabase`, then use `supabase` instead of `npx supabase@latest`.

### 3. Add secrets (same Gmail as login mail)

Supabase Dashboard → **Edge Functions** → **Secrets** (or per function `enquiry-email`):

| Secret name | What to put |
|-------------|-------------|
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | `primecrackerssivakasi@gmail.com` |
| `SMTP_PASS` | Your **Gmail app password** (same one as **Authentication → SMTP** in Supabase) |
| `SMTP_FROM_NAME` | `Prime Crackers` |
| `ENQUIRY_NOTIFY_TO` | `primecrackerssivakasi@gmail.com` |
| `ENQUIRY_EMAIL_HOOK_SECRET` | Any long random text you invent (example: `PrimeEmailHook-2026-abc123xyz`) |

**Do not** use names starting with `SUPABASE_`.

If you don’t know the app password: Google Account → Security → App passwords → create one for “Supabase”.

---

## Part B — In Supabase website (SQL)

### 4. Run the database script

**SQL Editor** → New query → paste and run:

- `supabase/migrations/030_enquiry_email_notify.sql`

### 5. Turn on the trigger password

Open `supabase/enquiry-email-set-secret.sql`:

- Replace `PASTE_A_LONG_RANDOM_SECRET_HERE` with the **same** string as `ENQUIRY_EMAIL_HOOK_SECRET` above.
- Replace `PASTE_YOUR_SUPABASE_ANON...` with your **anon / publishable** key (Dashboard → Settings → API).

Run that SQL.

---

## Part C — Test

1. On the website, add products so the cart is **₹3,000 or more**.
2. Fill details and tap **Send on WhatsApp**.
3. Check **primecrackerssivakasi@gmail.com** (and Spam).
4. If no mail: **Edge Functions → enquiry-email → Logs** (read the error).

---

## Checklist (print this)

- [ ] Gmail app password works for login emails already  
- [ ] `enquiry-email` deployed  
- [ ] All SMTP secrets added  
- [ ] `ENQUIRY_EMAIL_HOOK_SECRET` set  
- [ ] SQL `030` run  
- [ ] `enquiry-email-set-secret.sql` run with matching secret + anon key  
- [ ] Test enquiry ≥ ₹3,000  

---

Run migration **031** (`031_drop_enquiry_push_trigger.sql`) if you previously enabled Web Push so only the email trigger runs.
