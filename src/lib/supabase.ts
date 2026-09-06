import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== 'https://your-project.supabase.co' &&
    supabaseAnonKey !== 'your-anon-key-here'
)

const supabaseFetch: typeof fetch = (input, init) => {
  const timeoutMs = 12_000
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  const cleanup = () => clearTimeout(timer)

  if (init?.signal) {
    init.signal.addEventListener('abort', () => controller.abort(), { once: true })
  }

  return fetch(input, { ...init, signal: controller.signal })
    .finally(cleanup)
    .catch((error) => {
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new Error('Supabase request timed out')
      }
      throw error
    })
}

export const supabase: SupabaseClient = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      global: { fetch: supabaseFetch },
    })
  : createClient('https://placeholder.supabase.co', 'placeholder-key')

export function getSupabaseErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String((error as { message: string }).message)
  }
  return 'An unexpected error occurred'
}

/** True when PostgREST/Supabase reports a column missing from the schema cache. */
export function isMissingColumnError(error: unknown, column?: string): boolean {
  const message = getSupabaseErrorMessage(error).toLowerCase()
  const code = (error as { code?: string })?.code
  const missingColumn =
    code === 'PGRST204' || message.includes('schema cache') || message.includes('could not find')
  if (!missingColumn) return false
  if (!column) return true
  return message.includes(column.toLowerCase())
}
