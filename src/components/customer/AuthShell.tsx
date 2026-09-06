import type { ReactNode } from 'react'
import { PRIME_BRAND } from '@/lib/primeBrand'

export function AuthPageShell({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return (
    <div className="relative flex min-h-[calc(100vh-10rem)] items-center justify-center overflow-hidden px-4 py-8 sm:px-6 sm:py-10">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${PRIME_BRAND.loginBg}')` }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/25 to-[#004D55]/15"
        aria-hidden="true"
      />
      <div className={wide ? 'relative z-10 w-full max-w-2xl' : 'relative z-10 w-full max-w-md'}>{children}</div>
    </div>
  )
}

export function AuthCard({ children, compact = false }: { children: ReactNode; compact?: boolean }) {
  return (
    <div className="relative mt-4 overflow-hidden rounded-2xl border border-[#004D55]/10 shadow-[0_12px_40px_rgba(0,77,85,0.12)] sm:mt-5">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${PRIME_BRAND.loginCardBg}')` }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.88)_35%,rgba(255,255,255,0.55)_100%)]"
        aria-hidden="true"
      />
      <div className={compact ? 'relative p-5 sm:p-6' : 'relative p-6 sm:p-8'}>{children}</div>
    </div>
  )
}

export const authInputClass =
  'w-full rounded-lg border border-[#004D55]/15 bg-white px-3 py-2 text-sm focus:border-[#FFC107] focus:outline-none focus:ring-2 focus:ring-[#FFC107]/30'
