import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Check,
  Copy,
  Link2,
  MapPin,
  Package,
  Percent,
  Share2,
  Shield,
  Sparkles,
  Truck,
} from 'lucide-react'
import { AnimateIn } from '@/components/customer/AnimateIn'
import { OptimizedBackground } from '@/components/customer/OptimizedBackground'
import { useToast } from '@/contexts/ToastContext'
import { PRIME_CRACKERS_GOOGLE_MAPS_URL } from '@/lib/maps'
import { PRIME_BRAND } from '@/lib/primeBrand'
import { BRAND_SOCIAL_PROFILES, SITE_URL } from '@/lib/siteConfig'
import { cn } from '@/lib/utils'

const PESO_SAFETY_URL = 'https://peso.gov.in/web/en/fireworks'
const SIVAKASI_WIKI_URL = 'https://en.wikipedia.org/wiki/Sivakasi'
const CELEBRATION_IMG = '/about-celebration-sparkler.webp'

const HIGHLIGHTS = [
  {
    icon: Shield,
    title: 'Licensed Quality',
    desc: 'Original Sivakasi fireworks with strict checks.',
  },
  {
    icon: Truck,
    title: 'All-India Delivery',
    desc: 'Festival-season dispatch across India.',
  },
  {
    icon: Package,
    title: 'Wholesale & Retail',
    desc: 'Transparent pricing for every order size.',
  },
] as const

const QUICK_LINKS = [
  { to: '/#shop', label: 'Shop', icon: Package },
  { to: '/about', label: 'About', icon: Sparkles },
  { to: '/contact', label: 'Contact', icon: MapPin },
  { to: '/faq', label: 'FAQ', icon: Sparkles },
  { to: '/safety', label: 'Safety', icon: Shield },
  { to: '/delivery', label: 'Delivery', icon: Truck },
  { to: '/cart', label: 'Cart', icon: Package },
  { to: '/gift-box', label: 'Gift Boxes', icon: Package },
] as const

function buildWhatsAppShareUrl(): string {
  const pageUrl = encodeURIComponent(SITE_URL)
  const text = encodeURIComponent(
    `${PRIME_BRAND.displayName} — ${PRIME_BRAND.tagline}. Sivakasi Diwali fireworks wholesale with up to 50% off.`,
  )
  return `https://wa.me/?text=${text}%20${pageUrl}`
}

export function HomeSeoSection() {
  const { showToast } = useToast()
  const [copied, setCopied] = useState(false)
  const [instagramUrl, youtubeUrl] = BRAND_SOCIAL_PROFILES

  const copyPageUrl = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(SITE_URL)
      setCopied(true)
      showToast('Page link copied!', 'success')
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      showToast('Could not copy link', 'error')
    }
  }, [showToast])

  const nativeShare = useCallback(async () => {
    if (!navigator.share) return
    try {
      await navigator.share({
        title: PRIME_BRAND.displayName,
        text: `${PRIME_BRAND.displayName} — Sivakasi Diwali fireworks wholesale.`,
        url: SITE_URL,
      })
    } catch {
      /* user cancelled */
    }
  }, [])

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-b from-white via-[#FFF8E1]/25 to-white py-10 sm:py-14 lg:py-16"
      aria-labelledby="home-seo-heading"
    >
      <div
        className="pointer-events-none absolute -left-24 top-8 h-72 w-72 rounded-full bg-[#FFC107]/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-[#004D55]/8 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <AnimateIn animation="fade-up">
          <div className="mx-auto max-w-3xl text-center">
            <p className="inline-flex items-center gap-1.5 rounded-full border border-[#FFC107]/40 bg-[#FFC107]/10 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#E65100]">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              Sivakasi Fireworks Wholesale
            </p>
            <h2
              id="home-seo-heading"
              className="mt-4 font-display text-2xl font-extrabold leading-tight text-[#004D55] sm:text-3xl lg:text-4xl"
            >
              Shop Diwali Fireworks Online
            </h2>
            <div className="mx-auto mt-4 flex items-center justify-center gap-2" aria-hidden="true">
              <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#FFC107]/60" />
              <span className="h-1.5 w-14 rounded-full bg-gradient-to-r from-[#004D55] via-[#FFC107] to-[#004D55]" />
              <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#FFC107]/60" />
            </div>
          </div>
        </AnimateIn>

        <div className="mt-8 grid gap-5 lg:grid-cols-12 lg:gap-6 lg:mt-10">
          {/* Visual panel */}
          <AnimateIn animation="fade-up" delay={80} className="lg:col-span-5">
            <div className="group relative min-h-[280px] overflow-hidden rounded-2xl border border-[#004D55]/10 shadow-[0_16px_48px_rgba(0,77,85,0.12)] sm:min-h-[340px] lg:h-full lg:min-h-[420px]">
              <OptimizedBackground src={CELEBRATION_IMG} priority={false} />
              <div
                className="absolute inset-0 bg-gradient-to-t from-[#003840]/90 via-[#004D55]/35 to-[#004D55]/10"
                aria-hidden="true"
              />

              <div className="absolute left-4 top-4 flex items-center gap-2 rounded-2xl border border-[#FFC107]/40 bg-black/35 px-3 py-2 backdrop-blur-md">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFC107]">
                  <Percent className="h-4 w-4 text-[#004D55]" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/70">Up to</p>
                  <p className="font-display text-xl font-extrabold leading-none text-[#FFC107]">50% OFF</p>
                </div>
              </div>

              <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/15 bg-black/40 p-3 backdrop-blur-md">
                <div className="flex items-start gap-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FFC107]/20">
                    <MapPin className="h-4 w-4 text-[#FFC107]" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#FFC107]">
                      Based in Sivakasi
                    </p>
                    <p className="mt-0.5 text-xs leading-snug text-white/85">
                      Alamarathupatti — India&apos;s fireworks capital
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </AnimateIn>

          {/* Content panel */}
          <AnimateIn animation="fade-up" delay={140} className="lg:col-span-7">
            <div className="flex h-full flex-col rounded-2xl border border-[#004D55]/10 bg-white/80 p-5 shadow-[0_8px_32px_rgba(0,77,85,0.08)] backdrop-blur-sm sm:p-6 lg:p-7">
              <div className="space-y-4 text-sm leading-relaxed text-slate-600 sm:text-[15px]">
                <p>
                  <strong className="text-[#004D55]">{PRIME_BRAND.displayName}</strong> — We Bring
                  Festivals. Buy premium <strong>Sivakasi Diwali fireworks wholesale</strong> and
                  retail at up to 50% off — fancy crackers, sparklers, rockets, chakras, and gift
                  boxes with reliable all-India delivery.
                </p>

                <h3 className="font-display text-lg font-bold text-[#004D55]">Why Prime Crackers</h3>
                <p>
                  Licensed originals from trusted manufacturers, tamper-proof packaging, and
                  responsive support.{' '}
                  <Link
                    to="/about"
                    className="font-semibold text-[#004D55] underline decoration-[#FFC107]/70 underline-offset-2 hover:text-[#006670]"
                  >
                    Learn our story
                  </Link>
                  .
                </p>

                <h3 className="font-display text-lg font-bold text-[#004D55]">Safety &amp; Delivery</h3>
                <p>
                  Review our{' '}
                  <Link
                    to="/safety"
                    className="font-semibold text-[#004D55] underline decoration-[#FFC107]/70 underline-offset-2 hover:text-[#006670]"
                  >
                    Safety Guide
                  </Link>{' '}
                  and{' '}
                  <Link
                    to="/delivery"
                    className="font-semibold text-[#004D55] underline decoration-[#FFC107]/70 underline-offset-2 hover:text-[#006670]"
                  >
                    Delivery Info
                  </Link>
                  . Follow{' '}
                  <a
                    href={PESO_SAFETY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#004D55] underline decoration-[#FFC107]/70 underline-offset-2 hover:text-[#006670]"
                  >
                    PESO guidance
                  </a>
                  , find us on{' '}
                  <a
                    href={PRIME_CRACKERS_GOOGLE_MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#004D55] underline decoration-[#FFC107]/70 underline-offset-2 hover:text-[#006670]"
                  >
                    Google Maps
                  </a>
                  , and explore the{' '}
                  <a
                    href={SIVAKASI_WIKI_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#004D55] underline decoration-[#FFC107]/70 underline-offset-2 hover:text-[#006670]"
                  >
                    Sivakasi industry
                  </a>
                  . Follow{' '}
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#004D55] underline decoration-[#FFC107]/70 underline-offset-2 hover:text-[#006670]"
                  >
                    Instagram
                  </a>{' '}
                  &amp;{' '}
                  <a
                    href={youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#004D55] underline decoration-[#FFC107]/70 underline-offset-2 hover:text-[#006670]"
                  >
                    YouTube
                  </a>
                  .
                </p>
              </div>

              <div className="mt-5 grid gap-2.5 sm:grid-cols-3">
                {HIGHLIGHTS.map(({ icon: Icon, title, desc }) => (
                  <div
                    key={title}
                    className="rounded-xl border border-[#004D55]/8 bg-[#FFF8E1]/40 p-3"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#004D55]/10">
                      <Icon className="h-4 w-4 text-[#004D55]" aria-hidden="true" />
                    </div>
                    <p className="mt-2 text-xs font-bold text-[#004D55]">{title}</p>
                    <p className="mt-0.5 text-[11px] leading-snug text-slate-500">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </AnimateIn>
        </div>

        {/* Quick links rail */}
        <AnimateIn animation="fade-up" delay={220}>
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

        {/* CTA + share strip */}
        <AnimateIn animation="fade-up" delay={280}>
          <div className="mt-5 overflow-hidden rounded-2xl border border-[#004D55]/10 bg-gradient-to-r from-[#004D55] via-[#003840] to-[#004D55] shadow-[0_12px_40px_rgba(0,77,85,0.2)] lg:mt-6">
            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div>
                <p className="font-display text-lg font-bold text-white sm:text-xl">
                  Ready to celebrate?
                </p>
                <p className="mt-1 text-sm text-white/75">
                  Browse the catalogue or share Prime Crackers with friends &amp; family.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  to="/#shop"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FFC107] px-5 py-2.5 text-sm font-bold text-[#004D55] shadow-lg transition hover:bg-[#FFD54F]"
                >
                  Browse Shop
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <a
                  href={buildWhatsAppShareUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#25D366]/50 bg-[#25D366]/15 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#25D366]/25"
                >
                  <Share2 className="h-4 w-4" aria-hidden="true" />
                  Share
                </a>
                <button
                  type="button"
                  onClick={copyPageUrl}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/15"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-[#FFC107]" aria-hidden="true" />
                  ) : (
                    <Copy className="h-4 w-4" aria-hidden="true" />
                  )}
                  Copy Link
                </button>
                {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
                  <button
                    type="button"
                    onClick={nativeShare}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/15"
                  >
                    <Link2 className="h-4 w-4" aria-hidden="true" />
                    More
                  </button>
                )}
              </div>
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  )
}
