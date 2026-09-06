import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { WaveDividerWhite } from './WaveDivider'

export const PRODUCTS_HERO_IMAGE = '/products-hero.webp'
export const PRODUCTS_HERO_IMAGE_FALLBACK = '/products-hero.png'

interface CatalogueHeroProps {
  children: ReactNode
  className?: string
  /** Slightly less top padding — for breadcrumb pages */
  compactTop?: boolean
  /** Extra bottom space when hero has search or multiple rows */
  tall?: boolean
  /** Smooth wave transition into light content below */
  withWave?: boolean
}

export function CatalogueHero({ children, className, compactTop, tall, withWave }: CatalogueHeroProps) {
  return (
    <section
      className={cn(
        'relative bg-navy-950',
        withWave ? 'overflow-visible pb-0' : 'overflow-hidden',
        !withWave && (tall ? 'pb-28 sm:pb-32' : 'pb-20 sm:pb-24'),
        compactTop ? 'pt-6 sm:pt-8' : 'pt-20 sm:pt-24',
        className,
      )}
    >
      <picture className="absolute inset-0">
        <source srcSet={PRODUCTS_HERO_IMAGE} type="image/webp" />
        <img
          src={PRODUCTS_HERO_IMAGE_FALLBACK}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          className="h-full w-full object-cover object-top opacity-45"
        />
      </picture>
      <div className="absolute inset-0 bg-navy-950/72" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_50%_-10%,rgba(245,158,11,0.15),transparent_55%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>

      {withWave && <WaveDividerWhite />}
    </section>
  )
}

interface CatalogueOverlapProps {
  children: ReactNode
  className?: string
}

/** Catalogue section — clean white, no image fade */
export function CatalogueOverlap({ children, className }: CatalogueOverlapProps) {
  return (
    <section className={cn('relative bg-white pb-14 pt-2', className)}>
      {children}
    </section>
  )
}

/** Shared catalogue content panel — white with soft outer glow, no border line */
export function CataloguePanel({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('relative', className)}>
      <div
        className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-gold-400/25 blur-2xl sm:-inset-5"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -inset-2 rounded-[1.85rem] bg-festive-500/15 blur-xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -inset-1 rounded-[1.75rem] bg-navy-900/5 blur-md"
        aria-hidden="true"
      />
      <div className="relative rounded-3xl bg-white p-5 shadow-[0_20px_60px_rgba(12,8,6,0.07)] sm:p-6">
        {children}
      </div>
    </div>
  )
}

interface CatalogueCountBadgeProps {
  children: ReactNode
  className?: string
}

/** Small count chip pinned to the top edge of a catalogue panel */
export function CatalogueCountBadge({ children, className }: CatalogueCountBadgeProps) {
  return (
    <span
      className={cn(
        'absolute -top-3 right-4 z-10 rounded-full border border-gold-400/30 bg-navy-950 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-gold-300 shadow-[0_4px_16px_rgba(12,8,6,0.25)] sm:right-6',
        className,
      )}
    >
      {children}
    </span>
  )
}
