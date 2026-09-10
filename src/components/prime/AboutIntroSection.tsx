import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  MapPin,
  Package,
  Percent,
  Shield,
  Share2,
  Sparkles,
  Truck,
} from 'lucide-react'
import { AnimateIn } from '@/components/customer/AnimateIn'
import { OptimizedBackground } from '@/components/customer/OptimizedBackground'
import { SITE_URL } from '@/lib/siteConfig'
import { PRIME_BRAND } from '@/lib/primeBrand'
import { cn } from '@/lib/utils'

const PESO_SAFETY_URL = 'https://peso.gov.in/web/en/fireworks'
const SIVAKASI_WIKI_URL = 'https://en.wikipedia.org/wiki/Sivakasi'
const CELEBRATION_IMG = '/about-celebration-sparkler.webp'

const PRODUCT_TAGS = [
  'Sparklers',
  'Rockets',
  'Fancy Items',
  'Gift Boxes',
  'Chakras',
  'Bombs',
] as const

const QUICK_LINKS = [
  { to: '/#shop', label: 'Shop', icon: Package },
  { to: '/delivery', label: 'Delivery', icon: Truck },
  { to: '/faq', label: 'FAQ', icon: Sparkles },
  { to: '/safety', label: 'Safety', icon: Shield },
  { to: '/contact', label: 'Contact', icon: MapPin },
] as const

const HIGHLIGHTS = [
  {
    icon: Shield,
    title: 'Licensed & Original',
    desc: 'Sourced from trusted Sivakasi manufacturers with strict quality checks.',
    accent: '#004D55',
  },
  {
    icon: Package,
    title: 'Safe Packaging',
    desc: 'Tamper-proof packing for every order — wholesale or retail.',
    accent: '#E65100',
  },
  {
    icon: Truck,
    title: 'All-India Delivery',
    desc: 'Reliable festival-season dispatch across India via WhatsApp orders.',
    accent: '#006670',
  },
] as const

function buildWhatsAppShareUrl(): string {
  const pageUrl = encodeURIComponent(SITE_URL)
  const text = encodeURIComponent(
    `${PRIME_BRAND.displayName} — ${PRIME_BRAND.tagline}. Best Diwali crackers from Sivakasi.`,
  )
  return `https://wa.me/?text=${text}%20${pageUrl}`
}

function InlineLink({
  to,
  href,
  children,
}: {
  to?: string
  href?: string
  children: ReactNode
}) {
  const className =
    'font-semibold text-[#004D55] underline decoration-[#FFC107]/70 underline-offset-2 transition hover:text-[#006670] hover:decoration-[#FFC107]'

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    )
  }

  return (
    <Link to={to!} className={className}>
      {children}
    </Link>
  )
}

export function AboutIntroSection() {
  return (
    <section
      className="relative overflow-hidden bg-gradient-to-b from-white via-[#FFF8E1]/30 to-white py-12 sm:py-16 lg:py-20"
      aria-labelledby="about-intro-heading"
    >
      {/* Decorative ambience */}
      <div
        className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#FFC107]/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-[#004D55]/8 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FFC107]/40 to-transparent"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section header */}
        <AnimateIn animation="fade-up">
          <div className="mx-auto max-w-3xl text-center">
            <p className="inline-flex items-center gap-1.5 rounded-full border border-[#FFC107]/40 bg-[#FFC107]/10 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#E65100]">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              Sivakasi Fireworks
            </p>
            <h2
              id="about-intro-heading"
              className="mt-4 font-display text-2xl font-extrabold leading-tight text-[#004D55] sm:text-3xl lg:text-4xl"
            >
              Buy Diwali Crackers from Sivakasi
              <span className="mt-1 block text-[#FFC107] drop-shadow-[0_1px_0_rgba(0,77,85,0.15)] sm:inline sm:ml-2">
                — Wholesale &amp; Retail
              </span>
            </h2>
            <div className="mx-auto mt-4 flex items-center justify-center gap-2" aria-hidden="true">
              <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#FFC107]/60" />
              <span className="h-1.5 w-14 rounded-full bg-gradient-to-r from-[#004D55] via-[#FFC107] to-[#004D55]" />
              <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#FFC107]/60" />
            </div>
          </div>
        </AnimateIn>

        {/* Main bento grid */}
        <div className="mt-10 grid gap-5 lg:grid-cols-12 lg:gap-6 lg:mt-12">
          {/* Visual panel */}
          <AnimateIn animation="fade-up" delay={80} className="lg:col-span-5">
            <div className="group relative h-full min-h-[320px] overflow-hidden rounded-2xl border border-[#004D55]/10 shadow-[0_16px_48px_rgba(0,77,85,0.12)] sm:min-h-[380px]">
              <OptimizedBackground src={CELEBRATION_IMG} priority={false} />
              <div
                className="absolute inset-0 bg-gradient-to-t from-[#003840]/90 via-[#004D55]/35 to-[#004D55]/10"
                aria-hidden="true"
              />

              {/* Floating discount badge */}
              <div className="absolute left-4 top-4 flex items-center gap-2 rounded-2xl border border-[#FFC107]/40 bg-black/35 px-3 py-2 backdrop-blur-md">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFC107]">
                  <Percent className="h-4 w-4 text-[#004D55]" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/70">Up to</p>
                  <p className="font-display text-xl font-extrabold leading-none text-[#FFC107]">50% OFF</p>
                </div>
              </div>

              {/* Location chip */}
              <div className="absolute bottom-2 left-4 right-4 rounded-xl border border-white/15 bg-black/40 p-3 sm:bottom-1.5">
                <div className="flex items-start gap-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FFC107]/20">
                    <MapPin className="h-4 w-4 text-[#FFC107]" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#FFC107]">
                      Based in Sivakasi
                    </p>
                    <p className="mt-0.5 text-xs leading-snug text-white/85">
                      Alamarathupatti — heart of India&apos;s fireworks industry
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </AnimateIn>

          {/* Primary content card */}
          <AnimateIn animation="fade-up" delay={140} className="lg:col-span-7">
            <div className="flex h-full flex-col rounded-2xl border border-[#004D55]/10 bg-white p-5 shadow-[0_8px_32px_rgba(0,77,85,0.08)] sm:p-7">
              <p className="text-sm leading-relaxed text-slate-700 sm:text-base">
                <strong className="text-[#004D55]">{PRIME_BRAND.displayName}</strong> is your trusted
                online store for premium <strong>Diwali crackers</strong> and fireworks from{' '}
                <InlineLink href={SIVAKASI_WIKI_URL}>Sivakasi, Tamil Nadu</InlineLink> — India&apos;s
                renowned hub for licensed cracker manufacturing. Whether you need{' '}
                <strong>wholesale crackers</strong> for retail resale or retail packs for family
                celebrations, we offer fancy items, sparklers, rockets, bombs, chakras, and gift boxes
                at competitive prices with discounts up to 50% off.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {PRODUCT_TAGS.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[#004D55]/12 bg-[#FFF8E1]/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[#004D55] sm:text-[11px]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-6 rounded-xl border border-[#004D55]/8 bg-gradient-to-br from-[#FFF8E1]/60 to-white p-4 sm:p-5">
                <h3 className="flex items-center gap-2 font-display text-base font-bold text-[#004D55] sm:text-lg">
                  <Package className="h-4 w-4 text-[#FFC107]" aria-hidden="true" />
                  Premium Quality Fireworks with Safe Packaging
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-[15px]">
                  Our Sivakasi crackers are sourced from licensed manufacturers and shipped with safe,
                  tamper-proof packaging. Browse our full{' '}
                  <InlineLink to="/#shop">product catalogue</InlineLink>, add items to your cart, and
                  complete your order conveniently via WhatsApp. Read our{' '}
                  <InlineLink to="/delivery">delivery information</InlineLink> for coverage details
                  and dispatch timelines.
                </p>
              </div>
            </div>
          </AnimateIn>
        </div>

        {/* Highlight cards */}
        <div className="mt-5 grid gap-3 sm:grid-cols-3 sm:gap-4 lg:mt-6">
          {HIGHLIGHTS.map((item, i) => {
            const Icon = item.icon
            return (
              <AnimateIn key={item.title} animation="fade-up" delay={180 + i * 60}>
                <div
                  className="group relative overflow-hidden rounded-2xl border border-[#004D55]/10 bg-white p-4 shadow-[0_4px_20px_rgba(0,77,85,0.06)] transition hover:-translate-y-0.5 hover:border-[#FFC107]/40 hover:shadow-[0_12px_32px_rgba(0,77,85,0.1)] sm:p-5"
                >
                  <div
                    className="pointer-events-none absolute -right-4 -top-4 h-16 w-16 rounded-full opacity-0 transition group-hover:opacity-100"
                    style={{ backgroundColor: `${item.accent}12` }}
                    aria-hidden="true"
                  />
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${item.accent}14` }}
                  >
                    <Icon className="h-5 w-5" style={{ color: item.accent }} aria-hidden="true" />
                  </div>
                  <h3 className="mt-3 font-display text-sm font-bold text-[#004D55] sm:text-base">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600 sm:text-sm">
                    {item.desc}
                  </p>
                </div>
              </AnimateIn>
            )
          })}
        </div>

        {/* Trust + CTA strip */}
        <AnimateIn animation="fade-up" delay={320}>
          <div className="mt-5 overflow-hidden rounded-2xl border border-[#004D55]/10 bg-gradient-to-r from-[#004D55] via-[#003840] to-[#004D55] shadow-[0_12px_40px_rgba(0,77,85,0.2)] lg:mt-6">
            <div className="grid lg:grid-cols-[1fr_auto]">
              <div className="p-5 sm:p-6 lg:p-7">
                <h3 className="font-display text-lg font-bold text-white sm:text-xl">
                  Why Thousands Choose Prime Crackers
                </h3>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-[15px]">
                  We combine premium quality fireworks with transparent pricing, dedicated customer
                  support, and fast delivery. Explore our{' '}
                  <Link to="/faq" className="font-semibold text-[#FFC107] underline-offset-2 hover:underline">
                    FAQ
                  </Link>
                  , review our{' '}
                  <Link to="/safety" className="font-semibold text-[#FFC107] underline-offset-2 hover:underline">
                    safety guidelines
                  </Link>
                  , and follow{' '}
                  <a
                    href={PESO_SAFETY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#FFC107] underline-offset-2 hover:underline"
                  >
                    PESO safety guidance
                  </a>{' '}
                  before celebrating.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-white/70">
                  Ready to shop?{' '}
                  <Link to="/contact" className="font-semibold text-[#FFC107] underline-offset-2 hover:underline">
                    Contact us
                  </Link>{' '}
                  for bulk wholesale enquiries or personalised Diwali cracker assistance.
                </p>
              </div>

              <div className="flex flex-col justify-center gap-3 border-t border-white/10 bg-black/15 p-5 sm:flex-row sm:items-center lg:border-l lg:border-t-0 lg:p-6">
                <Link
                  to="/#shop"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FFC107] px-5 py-3 text-sm font-bold text-[#004D55] shadow-lg transition hover:bg-[#FFD54F]"
                >
                  Browse Shop
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <a
                  href={buildWhatsAppShareUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#25D366]/50 bg-[#25D366]/15 px-5 py-3 text-sm font-bold text-white transition hover:bg-[#25D366]/25"
                >
                  <Share2 className="h-4 w-4" aria-hidden="true" />
                  Share on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </AnimateIn>

        {/* Quick links rail */}
        <AnimateIn animation="fade-up" delay={380}>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-3 lg:mt-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Explore
            </span>
            {QUICK_LINKS.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full border border-[#004D55]/12 bg-white px-3.5 py-1.5 text-[11px] font-bold text-[#004D55] shadow-sm transition',
                  'hover:border-[#FFC107]/50 hover:bg-[#FFF8E1] hover:text-[#003840]',
                )}
              >
                <Icon className="h-3.5 w-3.5 text-[#FFC107]" aria-hidden="true" />
                {label}
              </Link>
            ))}
          </div>
        </AnimateIn>
      </div>
    </section>
  )
}
