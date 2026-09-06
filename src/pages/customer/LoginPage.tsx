import { useState, useEffect } from 'react'
import { Link, Navigate, useLocation, useSearchParams } from 'react-router-dom'
import { LogIn, Mail } from 'lucide-react'
import { SEO } from '@/components/shared/SEO'
import { useAuth } from '@/contexts/AuthContext'
import { COMPANY_EMAIL_SENDER_NAME, getAuthEmailSenderHint } from '@/lib/companyEmail'

function isEmailNotConfirmedError(message: string): boolean {
  const lower = message.toLowerCase()
  return lower.includes('email not confirmed') || lower.includes('confirm your email')
}

export function LoginPage() {
  const { signInCustomer, resendConfirmationEmail, user, isAdmin, isCustomer, loading } = useAuth()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const from = (location.state as { from?: string } | null)?.from || '/account'
  const emailVerified = searchParams.get('verified') === '1'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState(
    emailVerified
      ? 'Your email is confirmed. Sign in with the same email and password you used to register.'
      : '',
  )
  const [submitting, setSubmitting] = useState(false)
  const [resending, setResending] = useState(false)

  useEffect(() => {
    if (emailVerified) {
      setInfo('Your email is confirmed. Sign in with the same email and password you used to register.')
    }
  }, [emailVerified])

  const emailNotConfirmed = isEmailNotConfirmedError(error)

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold-500 border-t-transparent" />
      </div>
    )
  }

  if (user && isAdmin) {
    return <Navigate to="/admin" replace />
  }

  if (user && isCustomer) {
    return <Navigate to={from} replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setInfo('')
    setSubmitting(true)

    const { error: signInError } = await signInCustomer(email, password)

    if (signInError) {
      setError(signInError)
    }

    setSubmitting(false)
  }

  const handleResendConfirmation = async () => {
    if (!email.trim()) {
      setError('Enter your email address first, then resend the confirmation link.')
      return
    }

    setResending(true)
    setInfo('')

    const { error: resendError } = await resendConfirmationEmail(email.trim())

    setResending(false)

    if (resendError) {
      setError(resendError)
      return
    }

    setError('')
    setInfo(`Confirmation email sent to ${email.trim()}. Check your inbox and spam folder, then sign in again.`)
  }

  return (
    <>
      <SEO title="Login" description="Sign in to your Prime Crackers account to send enquiries." noIndex />

      <div className="mx-auto max-w-md px-4 py-12 sm:px-6 sm:py-16">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-900">
            <LogIn className="h-7 w-7 text-gold-400" />
          </div>
          <h1 className="mt-5 font-display text-3xl font-bold text-navy-900">Welcome Back</h1>
          <p className="mt-2 text-sm text-navy-700/70">Sign in to send and track your enquiries</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 rounded-2xl border border-navy-900/10 bg-white p-6 shadow-sm sm:p-8">
          {info && (
            <div className="mb-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{info}</div>
          )}

          {error && !emailNotConfirmed && (
            <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          )}

          {emailNotConfirmed && (
            <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              <p className="font-semibold">Please confirm your email first</p>
              <p className="mt-1 text-amber-800/90">
                We sent a confirmation link from {COMPANY_EMAIL_SENDER_NAME} when you registered.
                Open that email and click the link, then come back here to sign in.
              </p>
              <p className="mt-2 text-xs text-amber-800/80">{getAuthEmailSenderHint()}</p>
              <button
                type="button"
                onClick={handleResendConfirmation}
                disabled={resending}
                className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-white px-3 py-2 text-xs font-semibold text-amber-900 transition hover:bg-amber-100 disabled:opacity-60"
              >
                <Mail className="h-3.5 w-3.5" />
                {resending ? 'Sending...' : 'Resend confirmation email'}
              </button>
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
                className="w-full rounded-lg border border-navy-900/10 bg-navy-900/[0.03] px-3.5 py-2.5 text-sm focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/25"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy-800">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-navy-900/10 bg-navy-900/[0.03] px-3.5 py-2.5 text-sm focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/25"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full rounded-lg bg-gold-500 py-3 text-sm font-bold text-navy-950 transition hover:bg-gold-400 disabled:opacity-60"
          >
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="mt-5 text-center text-sm text-navy-700/70">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-semibold text-gold-600 hover:text-gold-500">
              Create one
            </Link>
          </p>

          <p className="mt-3 text-center text-xs text-navy-600/60">
            Store owner?{' '}
            <Link to="/admin/login" className="font-semibold text-gold-600 hover:text-gold-500">
              Admin login
            </Link>
          </p>
        </form>
      </div>
    </>
  )
}
