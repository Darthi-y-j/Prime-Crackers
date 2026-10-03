import type { ReactNode } from 'react'
import { OptimizedBackground } from '@/components/customer/OptimizedBackground'
import { PRIME_BRAND } from '@/lib/primeBrand'
import { cn } from '@/lib/utils'

/** Panoramic fireworks skyline (legacy). */
export const HERO_HEADER_BG = PRIME_BRAND.aboutHeaderBg

/** Festive Diwali illustration — default for all page heroes. */
export const FESTIVE_HEADER_BG = PRIME_BRAND.festiveHeaderBg

/** Pull page heroes under the fixed Prime header. */
export const PAGE_HEADER_UNDER_NAV =
  '-mt-[4.25rem] pt-[4.25rem] sm:-mt-[5.5rem] sm:pt-[5.5rem]'

interface PageHeaderBackgroundProps {
  imageOpacity?: number
  imageSrc?: string
  overlayClassName?: string
  className?: string
  withVignette?: boolean
}

/** Festive header art — no color wash by default (image stays clear). */
export function PageHeaderBackground({
  imageOpacity = 1,
  imageSrc = FESTIVE_HEADER_BG,
  overlayClassName,
  className,
  withVignette = false,
}: PageHeaderBackgroundProps) {
  return (
    <>
      <OptimizedBackground
        src={imageSrc}
        priority
        style={{ opacity: imageOpacity }}
        className={className}
      />
      {overlayClassName ? (
        <div className={cn('absolute inset-0', overlayClassName)} aria-hidden="true" />
      ) : null}
      {withVignette ? (
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_40%,rgba(0,77,85,0.25),transparent_65%)]"
          aria-hidden="true"
        />
      ) : null}
    </>
  )
}

interface PageHeaderProps {
  children: ReactNode
  className?: string
  contentClassName?: string
  as?: 'header' | 'section'
  imageOpacity?: number
  imageSrc?: string
  overlayClassName?: string
  withVignette?: boolean
}

export function PageHeader({
  children,
  className,
  contentClassName,
  as = 'header',
  imageOpacity,
  imageSrc,
  overlayClassName,
  withVignette,
}: PageHeaderProps) {
  const Tag = as

  return (
    <Tag
      className={cn(
        'relative overflow-hidden border-b-2 border-[#004D55]',
        PAGE_HEADER_UNDER_NAV,
        className,
      )}
    >
      <PageHeaderBackground
        imageOpacity={imageOpacity}
        imageSrc={imageSrc}
        overlayClassName={overlayClassName}
        withVignette={withVignette}
      />
      <div className={cn('relative', contentClassName)}>{children}</div>
    </Tag>
  )
}
