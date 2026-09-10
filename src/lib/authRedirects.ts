import { SITE_URL } from '@/lib/siteConfig'

/** Where Supabase sends users after they click the signup confirmation link. */
export function getAuthConfirmRedirectUrl(): string {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/auth/confirm`
  }
  return `${SITE_URL}/auth/confirm`
}

/** Where Supabase sends users after they click the password reset link. */
export function getPasswordResetRedirectUrl(): string {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/reset-password`
  }
  return `${SITE_URL}/reset-password`
}
