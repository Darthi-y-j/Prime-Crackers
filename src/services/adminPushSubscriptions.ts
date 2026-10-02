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

function isUpsertRpcMissing(error: unknown): boolean {
  const message = getSupabaseErrorMessage(error).toLowerCase()
  const code = (error as { code?: string })?.code
  return (
    code === 'PGRST202' ||
    code === '42883' ||
    message.includes('upsert_admin_push_subscription') ||
    message.includes('could not find the function')
  )
}

export async function upsertAdminPushSubscription(row: {
  user_id: string
  endpoint: string
  p256dh: string
  auth_key: string
  user_agent: string | null
}): Promise<{ error: string | null }> {
  const rpcResult = await supabase.rpc('upsert_admin_push_subscription', {
    p_endpoint: row.endpoint,
    p_p256dh: row.p256dh,
    p_auth_key: row.auth_key,
    p_user_agent: row.user_agent,
  })

  if (!rpcResult.error) return { error: null }

  if (!isUpsertRpcMissing(rpcResult.error)) {
    return { error: getSupabaseErrorMessage(rpcResult.error) }
  }

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

  if (error) {
    const msg = getSupabaseErrorMessage(error)
    if (msg.toLowerCase().includes('row-level security')) {
      return {
        error: `${msg} — run migrations 026 and 029 in Supabase SQL Editor.`,
      }
    }
    return { error: msg }
  }
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

export async function countMyAdminPushSubscriptions(): Promise<{ count: number; error: string | null }> {
  const { count, error } = await supabase
    .from('admin_push_subscriptions')
    .select('id', { count: 'exact', head: true })

  if (error) return { count: 0, error: getSupabaseErrorMessage(error) }
  return { count: count ?? 0, error: null }
}
