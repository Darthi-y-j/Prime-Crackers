-- Web Push subscriptions for admin enquiry alerts (PWA / mobile browsers).

CREATE TABLE IF NOT EXISTS public.admin_push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth_key TEXT NOT NULL,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, endpoint)
);

CREATE INDEX IF NOT EXISTS idx_admin_push_subscriptions_user_id
  ON public.admin_push_subscriptions(user_id);

ALTER TABLE public.admin_push_subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage own push subscriptions" ON public.admin_push_subscriptions;
CREATE POLICY "Admins manage own push subscriptions" ON public.admin_push_subscriptions
  FOR ALL TO authenticated
  USING (is_admin() AND user_id = auth.uid())
  WITH CHECK (is_admin() AND user_id = auth.uid());

GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_push_subscriptions TO authenticated;

-- Optional: in Supabase Dashboard → Database → Publications → supabase_realtime, add `enquiries`
-- so the admin app can show in-app toasts when a tab is open.
