-- Run in Supabase SQL Editor to debug enquiry push.

-- 1) Trigger + settings
SELECT tgname, tgenabled
FROM pg_trigger
WHERE tgrelid = 'public.enquiries'::regclass
  AND NOT tgisinternal;

SELECT
  function_url,
  length(hook_secret) AS hook_secret_len,
  length(invoke_api_key) AS api_key_len
FROM public.enquiry_push_settings;

-- 2) Admin devices registered for push
SELECT id, user_id, left(endpoint, 48) AS endpoint_prefix, created_at
FROM public.admin_push_subscriptions
ORDER BY created_at DESC
LIMIT 10;

-- 3) Recent pg_net HTTP calls (after a test enquiry)
SELECT id, status_code, error_msg, created, left(content, 200) AS content_preview
FROM net._http_response
ORDER BY created DESC
LIMIT 5;
