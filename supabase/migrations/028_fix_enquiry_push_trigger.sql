-- Fix enquiry push trigger: pg_net in `net` schema + optional API key for Edge Function gateway.

CREATE EXTENSION IF NOT EXISTS pg_net;

ALTER TABLE public.enquiry_push_settings
  ADD COLUMN IF NOT EXISTS invoke_api_key text NOT NULL DEFAULT '';

CREATE OR REPLACE FUNCTION public.notify_enquiry_push_via_http()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, net, extensions
AS $$
DECLARE
  settings public.enquiry_push_settings;
  request_id bigint;
  req_headers jsonb;
BEGIN
  SELECT * INTO settings FROM public.enquiry_push_settings WHERE id = 1;

  IF settings.hook_secret IS NULL OR btrim(settings.hook_secret) = '' THEN
    RAISE WARNING 'enquiry push skipped: hook_secret not set in enquiry_push_settings';
    RETURN NEW;
  END IF;

  req_headers := jsonb_build_object(
    'Content-Type', 'application/json',
    'x-enquiry-push-secret', btrim(settings.hook_secret)
  );

  IF settings.invoke_api_key IS NOT NULL AND btrim(settings.invoke_api_key) <> '' THEN
    req_headers := req_headers || jsonb_build_object(
      'Authorization', 'Bearer ' || btrim(settings.invoke_api_key),
      'apikey', btrim(settings.invoke_api_key)
    );
  END IF;

  SELECT net.http_post(
    url := settings.function_url,
    headers := req_headers,
    body := jsonb_build_object(
      'type', 'INSERT',
      'table', 'enquiries',
      'schema', 'public',
      'record', to_jsonb(NEW)
    )
  ) INTO request_id;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'notify_enquiry_push_via_http: %', SQLERRM;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enquiries_notify_push ON public.enquiries;
CREATE TRIGGER trg_enquiries_notify_push
  AFTER INSERT ON public.enquiries
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_enquiry_push_via_http();
