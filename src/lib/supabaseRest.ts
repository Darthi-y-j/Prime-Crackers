import { isSupabaseConfigured } from '@/lib/supabase'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const REST_TIMEOUT_MS = 12_000

export async function supabaseRestGet<T>(table: string, query: string): Promise<T> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured')
  }

  const url = `${supabaseUrl}/rest/v1/${table}?${query}`
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), REST_TIMEOUT_MS)

  try {
    const response = await fetch(url, {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
        Accept: 'application/json',
      },
      signal: controller.signal,
    })

    if (!response.ok) {
      const body = await response.text()
      throw new Error(body || `Supabase request failed (${response.status})`)
    }

    return (await response.json()) as T
  } finally {
    window.clearTimeout(timer)
  }
}
