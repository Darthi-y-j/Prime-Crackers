-- Reliable save for admin Web Push devices (avoids RLS edge cases on direct upsert).

CREATE OR REPLACE FUNCTION public.upsert_admin_push_subscription(
  p_endpoint text,
  p_p256dh text,
  p_auth_key text,
  p_user_agent text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not signed in';
  END IF;

  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Admin only';
  END IF;

  INSERT INTO public.admin_push_subscriptions (user_id, endpoint, p256dh, auth_key, user_agent)
  VALUES (auth.uid(), p_endpoint, p_p256dh, p_auth_key, NULLIF(btrim(p_user_agent), ''))
  ON CONFLICT (user_id, endpoint) DO UPDATE SET
    p256dh = EXCLUDED.p256dh,
    auth_key = EXCLUDED.auth_key,
    user_agent = EXCLUDED.user_agent;

  RETURN TRUE;
END;
$$;

GRANT EXECUTE ON FUNCTION public.upsert_admin_push_subscription(text, text, text, text) TO authenticated;
