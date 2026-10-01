-- Run in Supabase SQL Editor AFTER migrations 026 + 027.
-- Use the SAME string as Edge Function secret ENQUIRY_PUSH_HOOK_SECRET.

UPDATE public.enquiry_push_settings
SET hook_secret = 'PASTE_YOUR_ENQUIRY_PUSH_HOOK_SECRET_HERE'
WHERE id = 1;

-- Optional: change function URL if project ref differs
-- UPDATE public.enquiry_push_settings
-- SET function_url = 'https://YOUR_PROJECT.supabase.co/functions/v1/enquiry-push'
-- WHERE id = 1;
