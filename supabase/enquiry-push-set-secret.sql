-- Run in Supabase SQL Editor AFTER migrations 026 + 027.
-- Use the SAME string as Edge Function secret ENQUIRY_PUSH_HOOK_SECRET.
-- Do not commit real secrets. Paste them only in the Supabase SQL Editor.

UPDATE public.enquiry_push_settings
SET
  hook_secret = 'PASTE_YOUR_ENQUIRY_PUSH_HOOK_SECRET_HERE',
  -- Project Settings → API → anon / publishable key (helps Edge Function gateway accept pg_net calls)
  invoke_api_key = 'PASTE_YOUR_SUPABASE_PUBLISHABLE_KEY_HERE'
WHERE id = 1;

-- Optional: change function URL if project ref differs
-- UPDATE public.enquiry_push_settings
-- SET function_url = 'https://YOUR_PROJECT.supabase.co/functions/v1/enquiry-push'
-- WHERE id = 1;
