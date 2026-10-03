-- Email primecrackerssivakasi@gmail.com when a cart/order enquiry is saved (WhatsApp send flow).

CREATE EXTENSION IF NOT EXISTS pg_net;

CREATE TABLE IF NOT EXISTS public.enquiry_email_settings (
  id int PRIMARY KEY DEFAULT 1,
  function_url text NOT NULL,
  hook_secret text NOT NULL DEFAULT '',
  invoke_api_key text NOT NULL DEFAULT '',
  CONSTRAINT enquiry_email_settings_one_row CHECK (id = 1)
);

INSERT INTO public.enquiry_email_settings (id, function_url, hook_secret, invoke_api_key)
VALUES (
  1,
  'https://pewmmipyxxqfbbgqyffg.supabase.co/functions/v1/enquiry-email',
  '',
  ''
)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.enquiry_email_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin read enquiry email settings" ON public.enquiry_email_settings;
CREATE POLICY "Admin read enquiry email settings" ON public.enquiry_email_settings
  FOR SELECT TO authenticated
  USING (is_admin());

CREATE OR REPLACE FUNCTION public.notify_enquiry_email_via_http()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, net, extensions
AS $$
DECLARE
  settings public.enquiry_email_settings;
  request_id bigint;
  req_headers jsonb;
  enquiry_type text;
BEGIN
  enquiry_type := lower(coalesce(NEW.enquiry_type, 'cart'));
  IF enquiry_type NOT IN ('cart', 'order') THEN
    RETURN NEW;
  END IF;

  SELECT * INTO settings FROM public.enquiry_email_settings WHERE id = 1;

  IF settings.hook_secret IS NULL OR btrim(settings.hook_secret) = '' THEN
    RAISE WARNING 'enquiry email skipped: hook_secret not set in enquiry_email_settings';
    RETURN NEW;
  END IF;

  req_headers := jsonb_build_object(
    'Content-Type', 'application/json',
    'x-enquiry-email-secret', btrim(settings.hook_secret)
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
    RAISE WARNING 'notify_enquiry_email_via_http: %', SQLERRM;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enquiries_notify_email ON public.enquiries;
CREATE TRIGGER trg_enquiries_notify_email
  AFTER INSERT ON public.enquiries
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_enquiry_email_via_http();
