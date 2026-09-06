import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Star, Package, Truck } from 'lucide-react'
import { WaveDividerWhite } from '@/components/customer/WaveDivider'
import { AnimateIn } from '@/components/customer/AnimateIn'
import { PRIME_BRAND, HERO_TRUST } from '@/lib/primeBrand'
import { usePrimeShop } from '@/contexts/PrimeShopContext'

const TRUST_ICONS = [Shield, Star, Package, Truck]

const TRUST_MOBILE_LINES: Record<string, [string, string]> = {
  'Safe & Legal': ['Safe &', 'Legal'],
  'Premium Quality': ['Premium', 'Quality'],
  'Safe Packing': ['Safe', 'Packing'],
  'Fast Delivery': ['Fast', 'Delivery'],
}

function HeroTrustBar() {
  return (
    <div className="mt-5 grid grid-cols-4 overflow-hidden rounded-xl border border-white/20 bg-black/40 shadow-[0_8px_32px_rgba(0,0,0,0.25)] backdrop-blur-sm sm:mt-6 sm:max-w-xl">
      {HERO_TRUST.map((item, i) => {
        const Icon = TRUST_ICONS[i]
        const mobileLines = TRUST_MOBILE_LINES[item.label]
        return (
          <div
            key={item.label}
            className={`flex flex-col items-center px-1 py-2.5 text-center sm:px-2 sm:py-3 ${
              i > 0 ? 'border-l border-white/10' : ''
            }`}
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FFC107]/15 sm:h-8 sm:w-8">
              <Icon className="h-3.5 w-3.5 text-[#FFC107] sm:h-4 sm:w-4" aria-hidden="true" />
            </div>
            <p className="mt-1.5 text-[8px] font-bold leading-tight text-white/90 sm:text-[10px] sm:font-semibold sm:text-white">
              <span className="sm:hidden">
                <span className="block">{mobileLines[0]}</span>
                <span className="block">{mobileLines[1]}</span>
              </span>
              <span className="hidden sm:inline">{item.label}</span>
            </p>
          </div>
        )
      })}
    </div>
  )
}

export function PrimeHero() {
  const { scrollToShop } = usePrimeShop()

  return (
    <section className="relative min-h-[440px] overflow-hidden sm:min-h-[500px] lg:min-h-[580px]">
      <img
        src={PRIME_BRAND.heroImage}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
        fetchPriority="high"
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 bg-gradient-to-r from-[#003840]/72 via-[#004D55]/25 to-transparent"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-[#001a1c]/50 via-transparent to-transparent"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex max-w-7xl flex-col justify-center px-4 py-14 sm:px-6 sm:py-16 lg:py-20">
        <div className="max-w-xl lg:max-w-2xl">
          <AnimateIn animation="fade-down" delay={80}>
            <p className="inline-flex items-center gap-2 rounded-full border border-[#FFC107]/35 bg-[#FFC107]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#FFC107] sm:text-xs">
              Celebrate every moment
            </p>
          </AnimateIn>

          <AnimateIn animation="fade-up" delay={140}>
            <h1 className="mt-4 font-display text-[2.35rem] font-extrabold uppercase leading-[1.05] text-[#FFC107] drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] sm:text-5xl lg:text-[3.5rem]">
              {PRIME_BRAND.displayName}
            </h1>
          </AnimateIn>

          <AnimateIn animation="fade-up" delay={200}>
            <p className="font-script mt-2 text-2xl text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)] sm:mt-3 sm:text-3xl lg:text-4xl">
              {PRIME_BRAND.tagline}
            </p>
          </AnimateIn>

          <AnimateIn animation="fade-up" delay={260}>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.55)] sm:text-base">
              Wholesale &amp; retail crackers from Sivakasi. Up to{' '}
              <span className="font-bold text-[#FFC107]">90% OFF</span> — browse, add to cart, and
              order on WhatsApp.
            </p>
          </AnimateIn>

          <AnimateIn animation="fade-up" delay={320}>
            <div className="mt-6 flex flex-col gap-3 sm:mt-7 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={scrollToShop}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FFC107] px-7 py-3.5 text-sm font-extrabold uppercase tracking-wide text-[#004D55] shadow-[0_8px_24px_rgba(255,193,7,0.35)] transition hover:bg-[#FFD54F] sm:px-8"
              >
                Shop Now
                <ArrowRight className="h-5 w-5" />
              </button>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 bg-white/5 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition hover:border-white/60 hover:bg-white/10"
              >
                Contact Us
              </Link>
            </div>
          </AnimateIn>

          <AnimateIn animation="fade-up" delay={400}>
            <HeroTrustBar />
          </AnimateIn>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10">
        <WaveDividerWhite />
      </div>
    </section>
  )
}
