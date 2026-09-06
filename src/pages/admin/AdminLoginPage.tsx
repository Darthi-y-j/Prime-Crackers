import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Lock } from 'lucide-react'
import { isSupabaseConfigured } from '@/lib/supabase'
import { SITE_LOGO_PATH } from '@/lib/siteConfig'
import { PRIME_BRAND } from '@/lib/primeBrand'

export function AdminLoginPage() {
  const navigate = useNavigate()
  const { signIn, user, isAdmin, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#004D55]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#FFC107] border-t-transparent" />
      </div>
    )
  }

  if (user && isAdmin) {
    return <Navigate to="/admin" replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    const { error: signInError } = await signIn(email.trim(), password)

    if (signInError) {
      setError(signInError)
      setSubmitting(false)
      return
    }

    navigate('/admin', { replace: true })
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${PRIME_BRAND.loginBg}')` }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-white/50 via-white/30 to-[#004D55]/35"
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto flex w-fit max-w-full items-center gap-3">
            <img
              src={SITE_LOGO_PATH}
              alt={PRIME_BRAND.displayName}
              className="h-14 w-14 shrink-0 rounded-full border-2 border-[#FFC107] object-cover shadow-md sm:h-16 sm:w-16"
            />
            <div className="text-left">
              <p className="font-display text-xl font-extrabold uppercase tracking-wide text-[#004D55] sm:text-2xl">
                {PRIME_BRAND.displayName}
              </p>
              <p className="font-script text-base text-[#E65100] sm:text-lg">{PRIME_BRAND.tagline}</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-[#004D55]/70">Sign in to manage your store</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-card border border-white/60 bg-white/92 p-8 shadow-[0_12px_40px_rgba(0,77,85,0.15)] backdrop-blur-md">
          <div className="mb-5 flex items-center gap-2 text-sm font-semibold text-[#004D55]">
            <Lock className="h-4 w-4 text-[#FFC107]" />
            Secure login
          </div>

          {error && (
            <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200/80">{error}</div>
          )}

          {!isSupabaseConfigured && (
            <div className="mb-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900 ring-1 ring-amber-200/80">
              Supabase is not configured. Add <code className="text-xs">VITE_SUPABASE_URL</code> and{' '}
              <code className="text-xs">VITE_SUPABASE_ANON_KEY</code> to your <code className="text-xs">.env</code>{' '}
              file, then restart the dev server.
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#004D55]">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="admin-input w-full"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#004D55]">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="admin-input w-full"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || !isSupabaseConfigured}
            className="admin-btn-primary mt-6 w-full disabled:opacity-60"
          >
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="mt-5 text-center text-xs text-[#004D55]/60">
            Admin accounts are created in Supabase by the store owner — there is no public sign-up for
            the control panel.
          </p>
        </form>
      </div>
    </div>
  )
}
