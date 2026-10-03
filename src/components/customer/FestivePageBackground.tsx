import type { ReactNode } from 'react'
import { OptimizedBackground } from '@/components/customer/OptimizedBackground'
import { PRIME_BRAND } from '@/lib/primeBrand'
import { cn } from '@/lib/utils'

interface FestivePageBackgroundProps {
  children: ReactNode
  className?: string
}

export function FestivePageBackground({ children, className }: FestivePageBackgroundProps) {
  return (
    <div className={cn('relative min-h-[calc(100vh-10rem)]', className)}>
      <OptimizedBackground src={PRIME_BRAND.accountBg} priority />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
