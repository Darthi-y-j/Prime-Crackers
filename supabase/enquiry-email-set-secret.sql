-- Run AFTER migration 030 and after deploying enquiry-email Edge Function.
-- Use any long random password for hook_secret (same idea as push hook).
-- Do not commit real secrets. Paste them only in the Supabase SQL Editor.

UPDATE public.enquiry_email_settings
SET
  hook_secret = 'PASTE_YOUR_ENQUIRY_EMAIL_HOOK_SECRET_HERE',
  invoke_api_key = 'PASTE_YOUR_SUPABASE_PUBLISHABLE_KEY_HERE'
WHERE id = 1;
