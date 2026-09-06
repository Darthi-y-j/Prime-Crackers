import type { ReactNode } from 'react'
import { PRIME_BRAND } from '@/lib/primeBrand'
import { cn } from '@/lib/utils'

interface FestivePageBackgroundProps {
  children: ReactNode
  className?: string
}

export function FestivePageBackground({ children, className }: FestivePageBackgroundProps) {
  return (
    <div className={cn('relative min-h-[calc(100vh-10rem)]', className)}>
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${PRIME_BRAND.accountBg}')` }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/72 via-white/58 to-white/78"
        aria-hidden="true"
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
