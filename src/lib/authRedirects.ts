/** Where Supabase sends users after they click the signup confirmation link. */
export function getAuthConfirmRedirectUrl(): string {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/auth/confirm`
  }
  return 'https://www.primecrackers.in/auth/confirm'
}
