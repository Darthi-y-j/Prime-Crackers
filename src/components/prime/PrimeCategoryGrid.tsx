import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { getCategories, getCachedCatalogueCategories } from '@/services/categories'
import { getSquareImageUrl, IMAGE_WIDTH, cn } from '@/lib/utils'
import { usePrimeShop } from '@/contexts/PrimeShopContext'
import { usePauseWhenHidden } from '@/hooks/usePauseWhenHidden'
import type { Category } from '@/types/database'

/** Shrink long category names so 2-line titles match single-line card height */
function getCategoryTitleClass(name: string): string {
  const len = name.trim().length
  const words = name.trim().split(/\s+/).length

  if (len > 28 || words >= 4) {
    return 'text-[8px] leading-[1.15] sm:text-[10px] sm:leading-[1.2]'
  }
  if (len > 18 || words >= 3) {
    return 'text-[9px] leading-[1.2] sm:text-[11px] sm:leading-[1.25]'
  }
  return 'text-[11px] leading-tight sm:text-base sm:leading-snug'
}

function Sparkle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M12 2l1.4 4.3H18l-3.5 2.5 1.4 4.3L12 10.6 8.1 13.1l1.4-4.3L6 6.3h4.6L12 2z" />
      <path d="M19 14l.8 2.4H22l-2 1.5.8 2.4L19 18.3l-1.8 1.3.8-2.4-2-1.5h2.2L19 14z" opacity="0.7" />
    </svg>
  )
}

function CategoryCard({ cat, onShop }: { cat: Category; onShop: () => void }) {
  return (
    <article className="group flex h-full w-[11rem] shrink-0 flex-col overflow-hidden rounded-xl bg-white shadow-[0_4px_20px_rgba(0,77,85,0.1)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_8px_28px_rgba(0,77,85,0.15)] sm:w-[13.5rem] lg:w-[15rem]">
      <div className="relative aspect-[4/4] w-full overflow-hidden bg-[#141414]">
        <img
          src={getSquareImageUrl(cat.image_url, '/placeholder-category.svg', IMAGE_WIDTH.card)}
          alt={cat.name}
          className="block h-full w-full object-contain object-center transition duration-300 group-hover:scale-[1.02]"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="flex flex-1 flex-col items-center border-t border-slate-100 px-2 pb-3 pt-2 text-center sm:px-3 sm:pb-4 sm:pt-3">
        <div className="flex h-9 w-full items-center justify-center sm:h-10">
          <h3
            className={cn(
              'line-clamp-2 font-display font-bold uppercase tracking-wide text-[#1e3a5f]',
              getCategoryTitleClass(cat.name),
            )}
          >
            {cat.name}
          </h3>
        </div>
        <button
          type="button"
          onClick={onShop}
          className="mt-2 w-full shrink-0 rounded-md bg-[#004D55] px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white transition hover:bg-[#006670] sm:mt-2.5 sm:px-3 sm:py-2.5 sm:text-[11px]"
        >
          Shop Now
        </button>
      </div>
    </article>
  )
}

export function PrimeCategoryGrid() {
  const { scrollToCategory } = usePrimeShop()
  const { ref, paused } = usePauseWhenHidden<HTMLElement>()
  const [categories, setCategories] = useState<Category[]>(() => getCachedCatalogueCategories() ?? [])

  useEffect(() => {
    void getCategories()
      .then((cats) => setCategories(cats))
      .catch(() => undefined)
  }, [])

  const loopCategories = useMemo(() => [...categories, ...categories], [categories])

  const marqueeStyle = {
    '--marquee-duration': `${Math.max(categories.length * 5, 32)}s`,
  } as CSSProperties

  if (categories.length === 0) return null

  return (
    <section
      ref={ref}
      className={cn('relative overflow-hidden bg-white pt-3 pb-4 sm:pt-5 sm:pb-8', paused && 'marquee-paused')}
      aria-label="Shop by category"
    >
      <div
        className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full opacity-[0.07]"
        style={{ background: 'radial-gradient(circle, #FFC107 0%, transparent 70%)' }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-20 -right-16 h-56 w-56 rounded-full opacity-[0.06]"
        style={{ background: 'radial-gradient(circle, #FFC107 0%, transparent 70%)' }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-1/4 top-8 h-24 w-24 rounded-full opacity-[0.05]"
        style={{ background: 'radial-gradient(circle, #FF8C00 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-center gap-3 sm:gap-4">
          <Sparkle className="h-5 w-5 text-[#FF8C00] sm:h-6 sm:w-6" />
          <h2 className="font-display text-xl font-extrabold uppercase tracking-[0.12em] text-[#1e3a5f] sm:text-2xl lg:text-[1.65rem]">
            Shop by Category
          </h2>
          <Sparkle className="h-5 w-5 text-[#FF8C00] sm:h-6 sm:w-6" />
        </div>
      </div>

      <div className="featured-marquee mt-3 sm:mt-4" style={marqueeStyle}>
        <div className="featured-marquee-track gap-3 px-3 sm:gap-4 sm:px-4">
          {loopCategories.map((cat, i) => (
            <CategoryCard key={`${cat.id}-${i}`} cat={cat} onShop={() => scrollToCategory(cat.id)} />
          ))}
        </div>
      </div>
    </section>
  )
}
