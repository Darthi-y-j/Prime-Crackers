import { supabase, getSupabaseErrorMessage } from '@/lib/supabase'

export type AdminPushSubscriptionRow = {
  id: string
  user_id: string
  endpoint: string
  p256dh: string
  auth_key: string
  user_agent: string | null
  created_at: string
}

export async function upsertAdminPushSubscription(row: {
  user_id: string
  endpoint: string
  p256dh: string
  auth_key: string
  user_agent: string | null
}): Promise<{ error: string | null }> {
  const { error } = await supabase.from('admin_push_subscriptions').upsert(
    {
      user_id: row.user_id,
      endpoint: row.endpoint,
      p256dh: row.p256dh,
      auth_key: row.auth_key,
      user_agent: row.user_agent,
    },
    { onConflict: 'user_id,endpoint' },
  )

  if (error) return { error: getSupabaseErrorMessage(error) }
  return { error: null }
}

export async function deleteAdminPushSubscription(endpoint: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('admin_push_subscriptions').delete().eq('endpoint', endpoint)
  if (error) return { error: getSupabaseErrorMessage(error) }
  return { error: null }
}

export async function deleteAllAdminPushSubscriptionsForUser(userId: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('admin_push_subscriptions').delete().eq('user_id', userId)
  if (error) return { error: getSupabaseErrorMessage(error) }
  return { error: null }
}
