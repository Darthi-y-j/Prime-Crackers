import { Link } from 'react-router-dom'
import { ArrowRight, Gift, ShieldCheck, ShoppingCart, Tag, Truck } from 'lucide-react'
import { OptimizedBackground } from '@/components/customer/OptimizedBackground'
import { usePrimeShop } from '@/contexts/PrimeShopContext'

const WHY_CHOOSE_BG = '/why-choose-courtyard.webp'

const FEATURE_STRIP = [
  {
    icon: Truck,
    title: 'Wide Range of Crackers',
    subtitle: 'All Categories',
  },
  {
    icon: ShieldCheck,
    title: 'Trusted & Safe',
    subtitle: 'Quality Assured',
  },
  {
    icon: Tag,
    title: 'Best Prices',
    subtitle: 'Value for Money',
  },
  {
    icon: Gift,
    title: 'Perfect for Every Occasion',
    subtitle: 'Festivals & Functions',
  },
] as const

function FeatureStripItem({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: (typeof FEATURE_STRIP)[number]['icon']
  title: string
  subtitle: string
}) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-2.5 border-white/15 px-2 py-2 sm:gap-3 sm:border-l sm:px-4 sm:py-3 first:sm:border-l-0">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFC107]/15 sm:h-11 sm:w-11">
        <Icon className="h-4 w-4 text-[#FFC107] sm:h-5 sm:w-5" aria-hidden />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-bold leading-tight text-white sm:text-sm">{title}</p>
        <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-white/65 sm:text-[10px]">
          {subtitle}
        </p>
      </div>
    </div>
  )
}

export function PrimeWhyChooseBar() {
  const { scrollToShop } = usePrimeShop()

  return (
    <section className="relative overflow-hidden">
      <OptimizedBackground
        src={WHY_CHOOSE_BG}
        priority={false}
        style={{ backgroundPosition: 'center 42%' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#001a1c]/25 via-transparent to-[#001f24]/55" aria-hidden />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-0 pt-8 sm:px-6 sm:pt-10 md:pt-12 lg:pt-14">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          <div className="max-w-xl pl-2 sm:pl-4 md:pl-8">
            <p className="font-script text-2xl text-[#FFC107] drop-shadow-md sm:text-3xl md:text-4xl">
              Celebrate Every Moment
            </p>
            <h2
              className="mt-1 font-display text-2xl font-extrabold uppercase leading-tight tracking-wide text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.5)] sm:text-3xl md:text-4xl lg:text-[2.65rem]"
            >
              With Premium Crackers
            </h2>
            <p
              className="mt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/90 sm:text-xs md:text-sm"
            >
              Safety <span className="text-[#FFC107]">•</span> Quality{' '}
              <span className="text-[#FFC107]">•</span> Brighter Celebrations
            </p>
          </div>

          <Link
            to="/#shop"
            onClick={scrollToShop}
            className="group flex w-full max-w-md shrink-0 items-center gap-3 self-center rounded-full bg-gradient-to-r from-[#FFEB3B] via-[#FFC107] to-[#FF9800] px-3 py-2.5 shadow-[0_12px_32px_rgba(255,152,0,0.4)] transition hover:from-[#FFF59D] hover:via-[#FFD54F] hover:to-[#FB8C00] sm:px-4 sm:py-3 lg:max-w-lg lg:self-auto"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FF9800]/35 sm:h-12 sm:w-12">
              <ShoppingCart className="h-5 w-5 text-[#003840]" aria-hidden />
            </div>
            <div className="min-w-0 flex-1 text-left">
              <p className="text-sm font-extrabold uppercase leading-tight tracking-wide text-[#1a2e2a] sm:text-base">
                Explore Crackers
              </p>
              <p className="text-[11px] font-semibold text-[#003840]/85 sm:text-xs">Shop by Category</p>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#003840] text-white transition group-hover:bg-[#004D55] sm:h-11 sm:w-11">
              <ArrowRight className="h-5 w-5" aria-hidden />
            </div>
          </Link>
        </div>
      </div>

      <div className="relative z-10 mt-6 border-t border-white/10 bg-[#003840]/72 backdrop-blur-md sm:mt-8">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-1 px-2 py-2 sm:flex sm:px-4 sm:py-1 lg:px-6">
          {FEATURE_STRIP.map((item) => (
            <FeatureStripItem key={item.title} {...item} />
          ))}
        </div>
      </div>
    </section>
  )
}
