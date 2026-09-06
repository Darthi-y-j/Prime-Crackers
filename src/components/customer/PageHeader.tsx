import type { ReactNode } from 'react'
import { PRIME_BRAND } from '@/lib/primeBrand'
import { cn } from '@/lib/utils'

/** Storefront photo — used in content sections (e.g. About "Visit us"). */
export const PAGE_HEADER_BG = PRIME_BRAND.pageHeaderBg

/** Panoramic fireworks skyline (legacy). */
export const HERO_HEADER_BG = PRIME_BRAND.aboutHeaderBg

/** Festive Diwali illustration — default for all page heroes. */
export const FESTIVE_HEADER_BG = PRIME_BRAND.festiveHeaderBg

export const HERO_HEADER_OVERLAY =
  'bg-gradient-to-b from-[#004D55]/45 via-[#002830]/35 to-[#004D55]/55'

interface PageHeaderBackgroundProps {
  imageOpacity?: number
  imageSrc?: string
  overlayClassName?: string
  className?: string
  withVignette?: boolean
}

/** Fireworks skyline + Prime teal overlay — use behind page heroes. */
export function PageHeaderBackground({
  imageOpacity = 1,
  imageSrc = FESTIVE_HEADER_BG,
  overlayClassName = HERO_HEADER_OVERLAY,
  className,
  withVignette = true,
}: PageHeaderBackgroundProps) {
  return (
    <>
      <div
        className={cn('absolute inset-0 bg-cover bg-center bg-no-repeat', className)}
        style={{ backgroundImage: `url('${imageSrc}')`, opacity: imageOpacity }}
        aria-hidden="true"
      />
      <div className={cn('absolute inset-0', overlayClassName)} aria-hidden="true" />
      {withVignette && (
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_40%,rgba(0,77,85,0.25),transparent_65%)]"
          aria-hidden="true"
        />
      )}
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
    <Tag className={cn('relative overflow-hidden border-b-2 border-[#004D55]', className)}>
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
