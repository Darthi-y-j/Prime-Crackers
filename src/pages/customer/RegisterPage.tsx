import { useState, type ReactNode } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Mail, UserPlus } from 'lucide-react'
import { SEO } from '@/components/shared/SEO'
import { useAuth } from '@/contexts/AuthContext'
import { validatePhone } from '@/lib/utils'
import { COMPANY_EMAIL, COMPANY_EMAIL_SENDER_NAME, getAuthEmailSenderHint } from '@/lib/companyEmail'
import { AuthCard, AuthPageShell, authInputClass } from '@/components/customer/AuthShell'

function Field({
  label,
  children,
  className,
}: {
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <label className="mb-1 block text-sm font-medium text-[#004D55]">{label}</label>
      {children}
    </div>
  )
}

export function RegisterPage() {
  const { signUpCustomer, resendConfirmationEmail, user, isAdmin, isCustomer, loading } = useAuth()
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [resending, setResending] = useState(false)
  const [resendInfo, setResendInfo] = useState('')

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
    return <Navigate to="/account" replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setResendInfo('')

    if (!fullName.trim()) {
      setError('Please enter your full name')
      return
    }

    if (!validatePhone(phone)) {
      setError('Please enter a valid phone number')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setSubmitting(true)

    const { error: signUpError, needsEmailConfirmation } = await signUpCustomer(
      email.trim(),
      password,
      fullName.trim(),
      phone,
    )

    setSubmitting(false)

    if (signUpError) {
      setError(signUpError)
      return
    }

    if (!needsEmailConfirmation) {
      navigate('/account', { replace: true })
      return
    }

    setRegisteredEmail(email.trim())
    setSuccess(true)
  }

  const handleResend = async () => {
    if (!registeredEmail) return
    setResending(true)
    setResendInfo('')
    const { error: resendError } = await resendConfirmationEmail(registeredEmail)
    setResending(false)
    if (resendError) {
      setResendInfo(resendError)
      return
    }
    setResendInfo(`Confirmation email sent again to ${registeredEmail} from ${COMPANY_EMAIL}. Check inbox and spam.`)
  }

  if (success) {
    return (
      <>
        <SEO title="Register" description="Create your Prime Crackers account." noIndex />
        <AuthPageShell>
          <div className="text-center">
            <h1 className="font-display text-2xl font-extrabold text-[#004D55] drop-shadow-sm sm:text-3xl">
              Check your email
            </h1>
            <p className="mt-2 text-sm text-[#004D55]/85 drop-shadow-sm">One more step to activate your account</p>
          </div>

          <AuthCard>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50">
                <Mail className="h-6 w-6 text-emerald-600" />
              </div>
              <p className="mt-4 text-sm leading-relaxed text-[#004D55]/80">
                We sent a confirmation link to{' '}
                <span className="font-semibold text-[#004D55]">{registeredEmail}</span> from{' '}
                <span className="font-semibold text-[#004D55]">{COMPANY_EMAIL_SENDER_NAME}</span> (
                {COMPANY_EMAIL}). Open that email and click <strong>Confirm</strong> to activate your account.
              </p>
              <p className="mt-2 text-xs text-[#004D55]/60">{getAuthEmailSenderHint()}</p>
              {resendInfo && (
                <p className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{resendInfo}</p>
              )}
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="mt-5 inline-flex items-center gap-2 rounded-lg border border-[#004D55]/15 bg-white px-4 py-2.5 text-sm font-semibold text-[#004D55] transition hover:bg-[#FFF8E1] disabled:opacity-60"
              >
                {resending ? 'Sending…' : 'Resend confirmation email'}
              </button>
              <Link
                to="/login"
                className="mt-4 inline-flex w-full justify-center rounded-xl bg-[#FFC107] px-6 py-3 text-sm font-bold text-[#004D55] shadow-md transition hover:bg-[#FFD54F]"
              >
                Go to Login
              </Link>
            </div>
          </AuthCard>
        </AuthPageShell>
      </>
    )
  }

  return (
    <>
      <SEO title="Register" description="Create your Prime Crackers account to send enquiries." noIndex />

      <AuthPageShell wide>
        <div className="text-center">
          <h1 className="font-display text-xl font-extrabold text-[#004D55] drop-shadow-sm sm:text-2xl">
            Create Account
          </h1>
          <p className="mt-1.5 text-xs text-[#004D55]/85 drop-shadow-sm sm:text-sm">
            Register with your email — we&apos;ll send a confirmation link from {COMPANY_EMAIL}
          </p>
        </div>

        <AuthCard compact>
          <form onSubmit={handleSubmit}>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#004D55]">
              <UserPlus className="h-4 w-4 text-[#FFC107]" />
              New customer
            </div>

            {error && (
              <div className="mb-3 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</div>
            )}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-3">
              <Field label="Full Name">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={authInputClass}
                />
              </Field>

              <Field label="Phone Number">
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className={authInputClass}
                />
              </Field>

              <Field label="Email" className="sm:col-span-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={authInputClass}
                />
              </Field>

              <Field label="Password">
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={authInputClass}
                />
              </Field>

              <Field label="Confirm Password">
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={authInputClass}
                />
              </Field>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-4 w-full rounded-xl bg-[#FFC107] py-2.5 text-sm font-bold text-[#004D55] shadow-md transition hover:bg-[#FFD54F] disabled:opacity-60"
            >
              {submitting ? 'Creating account...' : 'Create Account'}
            </button>

            <p className="mt-3 text-center text-sm text-[#004D55]/70">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-[#E65100] hover:text-[#FF8C00]">
                Sign in
              </Link>
            </p>
          </form>
        </AuthCard>
      </AuthPageShell>
    </>
  )
}
