import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { CSSProperties } from 'react'
import type { Product } from '@/types/database'
import { usePauseWhenHidden } from '@/hooks/usePauseWhenHidden'
import { cn } from '@/lib/utils'
import {
  HERO_SELECTION_CTA,
  HERO_SELECTION_LABEL,
} from '@/lib/heroSelection'
import { SectionHeader } from './SectionHeader'
import { ProductCard } from './ProductCard'

interface FeaturedProductsShowcaseProps {
  products: Product[]
  variant?: 'default' | 'hero'
}

export function FeaturedProductsShowcase({
  products,
  variant = 'default',
}: FeaturedProductsShowcaseProps) {
  const { ref, paused } = usePauseWhenHidden<HTMLElement>()
  const loopProducts = useMemo(() => [...products, ...products], [products])

  if (products.length === 0) return null

  const isHero = variant === 'hero'
  const shouldPauseMarquee = !isHero && paused
  const marqueeStyle = {
    '--marquee-duration': `${Math.max(products.length * (isHero ? 4 : 6), isHero ? 28 : 36)}s`,
  } as CSSProperties

  if (isHero) {
    return (
      <section
        ref={ref}
        className={cn('relative w-full overflow-hidden', shouldPauseMarquee && 'marquee-paused')}
        aria-label={HERO_SELECTION_LABEL}
      >
        <div className="mb-2.5 flex items-center justify-between gap-3 px-4 sm:mb-3 sm:px-6 lg:px-8">
          <span className="inline-flex items-center rounded-full bg-gradient-to-r from-gold-400 to-festive-500 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-navy-950 shadow-[0_2px_12px_rgba(245,158,11,0.45)] sm:text-[11px]">
            {HERO_SELECTION_LABEL}
          </span>
          <Link
            to="/products"
            className="inline-flex shrink-0 items-center gap-1 rounded-full border-2 border-white/50 bg-white/20 px-2.5 py-1 text-[10px] font-bold text-white shadow-[0_2px_10px_rgba(0,0,0,0.35)] backdrop-blur-md transition-colors hover:border-white/70 hover:bg-white/30 sm:px-3 sm:py-1.5 sm:text-[11px]"
          >
            {HERO_SELECTION_CTA}
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="hero-featured-marquee featured-marquee" style={marqueeStyle}>
          <div className="featured-marquee-track gap-2.5 pl-4 sm:gap-3 sm:pl-6 lg:pl-8">
            {loopProducts.map((product, i) => (
              <div
                key={`${product.id}-${i}`}
                className="w-[128px] shrink-0 self-start sm:w-[142px]"
              >
                <ProductCard
                  product={product}
                  variant="featured"
                  compact
                  showQuickAdd
                  index={i % products.length}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section ref={ref} className={cn('relative overflow-hidden bg-white pb-6 pt-2 sm:pb-8 sm:pt-4', shouldPauseMarquee && 'marquee-paused')}>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/20 to-transparent"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
          <SectionHeader
            label="Featured"
            title="Featured Products"
            description="Handpicked selections for your celebrations"
            showAccent={false}
          />
          <Link
            to="/products"
            className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full border border-gold-500/25 bg-cream-50 px-4 py-2 text-xs font-semibold text-festive-500 transition-colors hover:border-gold-500/40 hover:bg-gold-500/10 sm:self-end sm:gap-2 sm:px-5 sm:py-2.5 sm:text-sm"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="featured-marquee mt-6 sm:mt-8" style={marqueeStyle}>
        <div className="featured-marquee-track gap-4 px-3 sm:gap-5 sm:px-6">
          {loopProducts.map((product, i) => (
            <div
              key={`${product.id}-${i}`}
              className="w-[240px] shrink-0 self-start sm:w-[260px] lg:w-[280px]"
            >
              <ProductCard product={product} variant="featured" index={i % products.length} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
