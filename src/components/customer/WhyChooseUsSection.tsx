import type { LucideIcon } from 'lucide-react'
import { Award, Package, IndianRupee, Headphones, Shield, Truck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SectionHeader } from './SectionHeader'
import { TitleHighlight } from './TitleHighlight'
import { AnimateIn } from './AnimateIn'

const items: {
  icon: LucideIcon
  title: string
  description: string
  stat: string
  image?: string
  imageFallback?: string
  imagePosition?: string
}[] = [
  {
    icon: Award,
    title: 'Premium Quality',
    description: 'Sourced from trusted manufacturers with strict quality checks before every sale.',
    stat: '100%',
  },
  {
    icon: Package,
    title: 'Wide Variety',
    description: 'From sparklers to aerial shells — find everything you need in one catalogue.',
    stat: '50+',
    image: '/wide-variety-card.webp',
    imageFallback: '/wide-variety-card.png',
    imagePosition: 'object-[center_45%]',
  },
  {
    icon: IndianRupee,
    title: 'Competitive Pricing',
    description: 'Best value for premium quality fireworks with transparent enquiry-based quotes.',
    stat: 'Best',
    image: '/competitive-pricing-card.webp',
    imageFallback: '/competitive-pricing-card.png',
    imagePosition: 'object-[65%_center]',
  },
  {
    icon: Headphones,
    title: 'Customer Support',
    description: 'Dedicated team ready to assist via WhatsApp and phone during business hours.',
    stat: '24/7',
    image: '/customer-support-card.webp',
    imageFallback: '/customer-support-card.png',
    imagePosition: 'object-[72%_center]',
  },
  {
    icon: Shield,
    title: 'Trusted Service',
    description: 'Years of experience serving celebrations safely across the region.',
    stat: '4+ Yrs',
    image: '/trusted-service-card.webp',
    imageFallback: '/trusted-service-card.png',
    imagePosition: 'object-[68%_center]',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Reliable dispatch and delivery across the region during peak festival season.',
    stat: 'Quick',
    image: '/fast-delivery-card.webp',
    imageFallback: '/fast-delivery-card.png',
    imagePosition: 'object-[70%_center]',
  },
]

const PREMIUM_QUALITY_IMAGE = '/premium-quality-card.webp'
const PREMIUM_QUALITY_IMAGE_FALLBACK = '/premium-quality-card.png'

function FeatureCard({
  item,
  featured = false,
  className,
}: {
  item: (typeof items)[number]
  featured?: boolean
  className?: string
}) {
  const Icon = item.icon
  const hasSideImage = !featured && item.image && item.imageFallback

  return (
    <div
      className={cn(
        'group relative h-full overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1',
        featured
          ? 'border-gold-400/25 shadow-[0_8px_32px_rgba(0,0,0,0.35)] hover:border-gold-400/40 hover:shadow-[0_16px_48px_rgba(0,0,0,0.45)]'
          : 'border-white/[0.08] bg-[#12100e] shadow-[0_8px_32px_rgba(0,0,0,0.35)] hover:border-gold-400/20 hover:shadow-[0_16px_40px_rgba(251,191,36,0.1)]',
        hasSideImage && 'min-h-[160px] sm:min-h-[170px]',
        className,
      )}
    >
      {featured && (
        <>
          <picture className="absolute inset-0">
            <source srcSet={PREMIUM_QUALITY_IMAGE} type="image/webp" />
            <img
              src={PREMIUM_QUALITY_IMAGE_FALLBACK}
              alt=""
              loading="lazy"
              decoding="async"
              fetchPriority="low"
              className="h-full w-full object-cover object-[center_35%]"
            />
          </picture>
          <div
            className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/10"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/35"
            aria-hidden="true"
          />
        </>
      )}

      {hasSideImage && (
        <div className="absolute inset-y-0 right-0 w-[38%] overflow-hidden sm:w-[40%]">
          <picture className="block h-full w-full">
            <source srcSet={item.image} type="image/webp" />
            <img
              src={item.imageFallback}
              alt=""
              loading="lazy"
              decoding="async"
              fetchPriority="low"
              className={cn(
                'h-full w-full object-cover transition-[filter,transform] duration-500 group-hover:scale-[1.04] group-hover:brightness-110',
                item.imagePosition ?? 'object-center',
              )}
            />
          </picture>
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#12100e] via-[#12100e]/55 to-transparent"
            aria-hidden="true"
          />
        </div>
      )}

      <div
        className={cn(
          'relative z-[1] flex h-full flex-col p-5 sm:p-6',
          hasSideImage && 'max-w-[64%]',
        )}
      >
      <div className="relative flex items-start justify-between gap-3">
        <div
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 sm:h-11 sm:w-11',
            featured
              ? 'bg-white/15 ring-white/25 backdrop-blur-sm'
              : 'bg-gold-500/15 ring-gold-400/25',
          )}
        >
          <Icon className={cn('h-5 w-5', featured ? 'text-gold-300' : 'text-gold-400')} />
        </div>
        <span
          className={cn(
            'rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ring-1',
            featured
              ? 'bg-gold-500/35 text-white ring-gold-300/40'
              : 'bg-gold-500/15 text-gold-300 ring-gold-400/25',
          )}
        >
          {item.stat}
        </span>
      </div>

      <h3 className="mt-4 font-display text-lg font-bold sm:mt-5 sm:text-xl">
        {featured ? (
          <span className="text-gold-300 drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]">{item.title}</span>
        ) : (
          <TitleHighlight variant="dark">{item.title}</TitleHighlight>
        )}
      </h3>
      <p
        className={cn(
          'mt-2 text-sm leading-relaxed',
          featured
            ? 'text-white/90 drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)]'
            : 'text-cream-100/70',
        )}
      >
        {item.description}
      </p>
      </div>
    </div>
  )
}

export function WhyChooseUsSection() {
  const [featured, second, third, fourth, fifth, sixth] = items

  return (
    <section className="relative overflow-hidden bg-white pb-10 pt-2 sm:pb-14 sm:pt-4">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(251,191,36,0.06),transparent_60%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/20 to-transparent"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <SectionHeader label="Why Us" title="Why Choose Us" align="center" />

        <div className="mt-8 sm:mt-12">
          {/* Mobile & tablet */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:hidden">
            {items.map((item, i) => (
              <AnimateIn key={item.title} animation="fade-up" delay={i * 35}>
                <FeatureCard item={item} featured={i === 0} />
              </AnimateIn>
            ))}
          </div>

          {/* Desktop bento */}
          <div className="hidden lg:grid lg:grid-cols-12 lg:grid-rows-2 lg:gap-5">
            <AnimateIn animation="fade-up" delay={100} className="lg:col-span-5 lg:row-span-2">
              <FeatureCard item={featured} featured className="min-h-[340px]" />
            </AnimateIn>
            <AnimateIn animation="fade-up" delay={160} className="lg:col-span-7">
              <FeatureCard item={second} className="min-h-[160px]" />
            </AnimateIn>
            <AnimateIn animation="fade-up" delay={200} className="lg:col-span-4">
              <FeatureCard item={third} className="min-h-[160px]" />
            </AnimateIn>
            <AnimateIn animation="fade-up" delay={240} className="lg:col-span-3">
              <FeatureCard item={fourth} className="min-h-[160px]" />
            </AnimateIn>
          </div>

          <div className="mt-5 hidden lg:grid lg:grid-cols-2 lg:gap-5">
            <AnimateIn animation="fade-up" delay={280}>
              <FeatureCard item={fifth} className="min-h-[140px]" />
            </AnimateIn>
            <AnimateIn animation="fade-up" delay={320}>
              <FeatureCard item={sixth} className="min-h-[140px]" />
            </AnimateIn>
          </div>
        </div>
      </div>
    </section>
  )
}
