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
      <div className="flex min-h-screen items-center justify-center bg-navy-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold-400 border-t-transparent" />
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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-navy-950 px-4">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(245,158,11,0.18),transparent_55%)]"
        aria-hidden
      />
      <div className="pointer-events-none absolute -right-24 top-1/3 h-64 w-64 rounded-full bg-festive-500/10 blur-3xl" aria-hidden />

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto flex w-fit max-w-full items-center gap-3">
            <img
              src={SITE_LOGO_PATH}
              alt={PRIME_BRAND.displayName}
              className="h-14 w-14 shrink-0 rounded-full border-2 border-gold-400/40 object-cover sm:h-16 sm:w-16"
            />
            <div className="text-left">
              <p className="font-display text-xl font-bold text-cream-50 sm:text-2xl">
                {PRIME_BRAND.displayName}
              </p>
              <p className="font-script text-base text-gold-300/90 sm:text-lg">{PRIME_BRAND.tagline}</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-cream-100/60">Sign in to manage your store</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-card p-8">
          <div className="mb-5 flex items-center gap-2 text-sm font-semibold text-navy-800">
            <Lock className="h-4 w-4 text-gold-600" />
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
              <label className="mb-1.5 block text-sm font-medium text-navy-800">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="admin-input w-full"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy-800">Password</label>
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

          <p className="mt-5 text-center text-xs text-navy-600/70">
            Admin accounts are created in Supabase by the store owner — there is no public sign-up for
            the control panel.
          </p>
        </form>
      </div>
    </div>
  )
}
