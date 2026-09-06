import { Link } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import { ArrowRight, Package, IndianRupee, Search, MessageCircle, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SectionHeader } from './SectionHeader'
import { TitleHighlight } from './TitleHighlight'
import { AnimateIn } from './AnimateIn'

const steps: {
  step: number
  title: string
  description: string
  icon: LucideIcon
  image?: string
  imageFallback?: string
}[] = [
  {
    step: 1,
    title: 'Browse Products',
    description: 'Explore our catalogue of premium fireworks and crackers.',
    icon: Search,
    image: '/browse-products-step-bg.webp',
    imageFallback: '/browse-products-step-bg.png',
  },
  {
    step: 2,
    title: 'Add to Cart',
    description: 'Select products and quantities you need.',
    icon: Package,
    image: '/add-to-cart-step-bg.webp',
    imageFallback: '/add-to-cart-step-bg.png',
  },
  {
    step: 3,
    title: 'Review Cart',
    description: 'Check your selected items in the cart.',
    icon: IndianRupee,
    image: '/review-cart-step-bg.webp',
    imageFallback: '/review-cart-step-bg.png',
  },
  {
    step: 4,
    title: 'WhatsApp Enquiry',
    description: 'Send all selected products in one WhatsApp message.',
    icon: MessageCircle,
    image: '/whatsapp-enquiry-step-bg.webp',
    imageFallback: '/whatsapp-enquiry-step-bg.png',
  },
  {
    step: 5,
    title: 'We Contact You',
    description: 'Our team confirms availability, pricing, and delivery.',
    icon: Phone,
    image: '/we-contact-you-step-bg.webp',
    imageFallback: '/we-contact-you-step-bg.png',
  },
]

const HOW_IT_WORKS_BG = '/how-it-works-bg.webp'
const HOW_IT_WORKS_BG_FALLBACK = '/how-it-works-bg.png'

function StepCard({ item }: { item: (typeof steps)[number] }) {
  const Icon = item.icon
  const hasImage = item.image && item.imageFallback

  return (
    <div
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-1.5 hover:border-gold-400/30 hover:shadow-[0_20px_50px_rgba(251,191,36,0.15)]',
        hasImage ? 'bg-cream-50' : 'bg-white',
      )}
    >
      <div
        className="h-1 shrink-0 bg-gradient-to-r from-festive-500 via-gold-400 to-festive-500"
        aria-hidden="true"
      />

      {hasImage && (
        <picture className="pointer-events-none absolute inset-0">
          <source srcSet={item.image} type="image/webp" />
          <img
            src={item.imageFallback}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </picture>
      )}

      {hasImage ? (
        <div className="relative z-[1] flex flex-1 flex-col items-center px-4 pb-6 pt-5 text-center sm:px-5 sm:pb-7 sm:pt-6">
          <div className="relative">
            <div
              className="absolute inset-0 scale-150 rounded-full bg-[#2a1a12]/30 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100"
              aria-hidden="true"
            />
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3d2a1f] via-[#2a1a12] to-[#1a100c] shadow-[0_6px_20px_rgba(26,16,12,0.4)] ring-1 ring-[#5c4a3a]/40 sm:h-16 sm:w-16">
              <Icon className="h-6 w-6 text-gold-300 sm:h-7 sm:w-7" strokeWidth={2} />
            </div>
          </div>

          <h3 className="mt-5 font-display text-base font-bold leading-snug sm:mt-6 sm:text-lg">
            <TitleHighlight>{item.title}</TitleHighlight>
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-[#5c4a3a]">{item.description}</p>
        </div>
      ) : (
        <div className="relative z-[1] flex flex-1 flex-col items-center px-4 pb-6 pt-5 text-center sm:px-5 sm:pb-7 sm:pt-6">
          <div className="relative">
            <div
              className="absolute inset-0 scale-150 rounded-full bg-gold-400/20 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100"
              aria-hidden="true"
            />
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-festive-500/15 to-gold-500/25 ring-1 ring-festive-500/20 sm:h-16 sm:w-16">
              <Icon className="h-6 w-6 text-festive-600 sm:h-7 sm:w-7" strokeWidth={2} />
            </div>
          </div>

          <h3 className="mt-5 font-display text-base font-bold leading-snug sm:mt-6 sm:text-lg">
            <TitleHighlight>{item.title}</TitleHighlight>
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-[#5c4a3a]">{item.description}</p>
        </div>
      )}
    </div>
  )
}

export function HowItWorksSection() {
  return (
    <section className="relative overflow-hidden py-12 sm:py-20">
      <picture className="pointer-events-none absolute inset-0">
        <source srcSet={HOW_IT_WORKS_BG} type="image/webp" />
        <img
          src={HOW_IT_WORKS_BG_FALLBACK}
          alt=""
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          className="h-full w-full object-cover object-[center_35%]"
        />
      </picture>
      <div
        className="pointer-events-none absolute inset-0 bg-black/55"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/75 via-black/60 to-black/80"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_20%,rgba(234,88,12,0.12),transparent_55%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/40 to-transparent"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <SectionHeader
          label="How It Works"
          title="Simple Steps to Order"
          description="Browse, add to cart, and send enquiry on WhatsApp"
          align="center"
          theme="dark"
        />

        {/* Desktop & tablet grid */}
        <div className="relative mt-10 sm:mt-14">
          <div
            className="pointer-events-none absolute left-[6%] right-[6%] top-[3.75rem] hidden h-px bg-gradient-to-r from-transparent via-gold-400/35 to-transparent lg:block"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
            {steps.map((item, i) => (
              <AnimateIn key={item.step} delay={i * 40} animation="fade-up">
                <StepCard item={item} />
              </AnimateIn>
            ))}
          </div>
        </div>

        <AnimateIn animation="fade-up" delay={200} className="mt-10 text-center sm:mt-12">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-festive-500 via-festive-500 to-gold-400 px-7 py-3 text-sm font-bold text-white shadow-[0_8px_32px_rgba(234,88,12,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(234,88,12,0.45)] sm:px-8 sm:py-3.5 sm:text-base"
          >
            Start Shopping
            <ArrowRight className="h-4 w-4" />
          </Link>
        </AnimateIn>
      </div>
    </section>
  )
}
