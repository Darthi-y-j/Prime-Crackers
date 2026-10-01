-- Fire enquiry-push Edge Function on new enquiries (alternative when Dashboard webhooks fail:
-- "schema supabase_functions does not exist").

CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

CREATE TABLE IF NOT EXISTS public.enquiry_push_settings (
  id int PRIMARY KEY DEFAULT 1,
  function_url text NOT NULL,
  hook_secret text NOT NULL DEFAULT '',
  CONSTRAINT enquiry_push_settings_one_row CHECK (id = 1)
);

INSERT INTO public.enquiry_push_settings (id, function_url, hook_secret)
VALUES (
  1,
  'https://pewmmipyxxqfbbgqyffg.supabase.co/functions/v1/enquiry-push',
  ''
)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.enquiry_push_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin read enquiry push settings" ON public.enquiry_push_settings;
CREATE POLICY "Admin read enquiry push settings" ON public.enquiry_push_settings
  FOR SELECT TO authenticated
  USING (is_admin());

DROP POLICY IF EXISTS "Admin update enquiry push settings" ON public.enquiry_push_settings;
CREATE POLICY "Admin update enquiry push settings" ON public.enquiry_push_settings
  FOR UPDATE TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE OR REPLACE FUNCTION public.notify_enquiry_push_via_http()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  settings public.enquiry_push_settings;
  request_id bigint;
BEGIN
  SELECT * INTO settings FROM public.enquiry_push_settings WHERE id = 1;

  IF settings.hook_secret IS NULL OR btrim(settings.hook_secret) = '' THEN
    RETURN NEW;
  END IF;

  SELECT net.http_post(
    url := settings.function_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-enquiry-push-secret', settings.hook_secret
    ),
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
