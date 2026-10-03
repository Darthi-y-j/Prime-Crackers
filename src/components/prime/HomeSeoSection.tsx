import { useCallback, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Check, Copy, MapPin, Percent, Share2, Shield, Sparkles, Truck } from 'lucide-react'
import { AnimateIn } from '@/components/customer/AnimateIn'
import { useToast } from '@/contexts/ToastContext'
import { PRIME_CRACKERS_GOOGLE_MAPS_URL } from '@/lib/maps'
import { PRIME_BRAND } from '@/lib/primeBrand'
import { BRAND_SOCIAL_PROFILES, SITE_URL } from '@/lib/siteConfig'
import { cn } from '@/lib/utils'

const PESO_SAFETY_URL = 'https://peso.gov.in/web/en/fireworks'
const SIVAKASI_WIKI_URL = 'https://en.wikipedia.org/wiki/Sivakasi'
const CELEBRATION_IMG = '/about-celebration-sparkler.webp'
const SECTION_BG_WEBP = '/home-seo-festive-bg.webp'
const SECTION_BG_FALLBACK = '/home-seo-festive-bg.webp'

const PAGE_LINKS = [
  { to: '/#shop', label: 'Shop' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
  { to: '/faq', label: 'FAQ' },
  { to: '/safety', label: 'Safety' },
  { to: '/delivery', label: 'Delivery' },
  { to: '/cart', label: 'Cart' },
] as const

function buildWhatsAppShareUrl(): string {
  const pageUrl = encodeURIComponent(SITE_URL)
  const text = encodeURIComponent(
    `${PRIME_BRAND.displayName} — Sivakasi Diwali fireworks wholesale with up to 50% off.`,
  )
  return `https://wa.me/?text=${text}%20${pageUrl}`
}

function TextLink({
  to,
  href,
  children,
  className,
}: {
  to?: string
  href?: string
  children: ReactNode
  className?: string
}) {
  const linkClass = cn(
    'font-semibold text-[#004D55] underline decoration-[#FFC107]/60 underline-offset-[3px] hover:text-[#006670]',
    className,
  )

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
        {children}
      </a>
    )
  }

  return (
    <Link to={to!} className={linkClass}>
      {children}
    </Link>
  )
}

export function HomeSeoSection() {
  const { showToast } = useToast()
  const [copied, setCopied] = useState(false)
  const [instagramUrl, youtubeUrl] = BRAND_SOCIAL_PROFILES

  const copyPageUrl = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(SITE_URL)
      setCopied(true)
      showToast('Link copied!', 'success')
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      showToast('Could not copy link', 'error')
    }
  }, [showToast])

  return (
    <section
      className="relative isolate overflow-hidden py-8 sm:py-10 [content-visibility:auto]"
      aria-labelledby="home-seo-heading"
    >
      <picture className="pointer-events-none absolute inset-0 z-0">
        <source srcSet={SECTION_BG_WEBP} type="image/webp" />
        <img
          src={SECTION_BG_FALLBACK}
          alt=""
          aria-hidden="true"
          decoding="async"
          loading="lazy"
          fetchPriority="low"
          className="h-full w-full object-cover object-[center_42%]"
        />
      </picture>

      <div className="absolute inset-0 z-[1] bg-[#FFF8E1]/55" aria-hidden="true" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6">
        <AnimateIn animation="fade-up">
          <div className="mx-auto overflow-hidden rounded-2xl bg-white shadow-[0_10px_40px_rgba(0,77,85,0.18)] ring-1 ring-[#004D55]/10">
            <div
              className="h-1 bg-gradient-to-r from-[#004D55] via-[#FFC107] to-[#004D55]"
              aria-hidden="true"
            />

            <div className="grid items-stretch md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
              <div className="relative flex min-h-[320px] flex-col gap-2 overflow-hidden p-3 sm:min-h-[340px] sm:p-4 md:min-h-full">
                <picture className="pointer-events-none absolute inset-0 z-0" aria-hidden>
                  <source srcSet={CELEBRATION_IMG} type="image/webp" />
                  <img
                    src={CELEBRATION_IMG}
                    alt=""
                    decoding="async"
                    loading="lazy"
                    className="h-full w-full scale-105 object-cover object-center blur-[2px] brightness-[0.88] sm:blur-sm"
                  />
                </picture>
                <div
                  className="absolute inset-0 z-[1] bg-gradient-to-br from-[#003840]/55 via-[#003840]/40 to-[#001f24]/50"
                  aria-hidden="true"
                />

                <div className="relative z-10 w-fit rounded-lg bg-[#FFC107] px-2.5 py-1.5 shadow-md">
                  <p className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wide text-[#004D55]">
                    <Percent className="h-3 w-3" aria-hidden="true" />
                    Up to 50% off
                  </p>
                </div>

                <div className="relative z-10 mt-auto grid gap-2">
                  <div className="rounded-xl border border-white/25 bg-[#003840]/65 p-2.5 backdrop-blur-[2px] sm:p-3">
                    <div className="flex items-start gap-2">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FFC107]/20 sm:h-9 sm:w-9">
                        <MapPin className="h-3.5 w-3.5 text-[#FFC107] sm:h-4 sm:w-4" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#FFC107]">
                          Based in Sivakasi
                        </p>
                        <p className="mt-0.5 text-[10px] leading-snug text-white sm:text-[11px]">
                          Alamarathupatti — heart of India&apos;s fireworks industry
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-xl border border-white/25 bg-[#003840]/65 p-2.5 backdrop-blur-[2px] sm:p-3">
                    <div className="flex items-start gap-2">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FFC107]/20 sm:h-9 sm:w-9">
                        <Shield className="h-3.5 w-3.5 text-[#FFC107] sm:h-4 sm:w-4" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#FFC107]">
                          Why Prime Crackers
                        </h3>
                        <p className="mt-0.5 text-[10px] leading-snug text-white sm:text-[11px]">
                          Licensed originals &amp; safe packaging.{' '}
                          <TextLink
                            to="/about"
                            className="text-[10px] text-[#FFC107] decoration-[#FFC107]/70 hover:text-white sm:text-[11px]"
                          >
                            Our story
                          </TextLink>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-xl border border-white/25 bg-[#003840]/65 p-2.5 backdrop-blur-[2px] sm:p-3">
                    <div className="flex items-start gap-2">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FFC107]/20 sm:h-9 sm:w-9">
                        <Truck className="h-3.5 w-3.5 text-[#FFC107] sm:h-4 sm:w-4" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#FFC107]">
                          Safety &amp; Delivery
                        </h3>
                        <p className="mt-0.5 text-[10px] leading-snug text-white sm:text-[11px]">
                          <TextLink
                            to="/safety"
                            className="text-[10px] text-[#FFC107] decoration-[#FFC107]/70 hover:text-white sm:text-[11px]"
                          >
                            Safety
                          </TextLink>
                          {' · '}
                          <TextLink
                            to="/delivery"
                            className="text-[10px] text-[#FFC107] decoration-[#FFC107]/70 hover:text-white sm:text-[11px]"
                          >
                            Delivery
                          </TextLink>
                          {' · '}
                          <TextLink
                            href={PESO_SAFETY_URL}
                            className="text-[10px] text-[#FFC107] decoration-[#FFC107]/70 hover:text-white sm:text-[11px]"
                          >
                            PESO
                          </TextLink>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex min-h-[320px] flex-col gap-3 px-4 py-4 sm:min-h-[340px] sm:px-5 sm:py-5 md:min-h-full">
                <h2
                  id="home-seo-heading"
                  className="font-display text-lg font-extrabold leading-snug text-[#004D55] sm:text-xl"
                >
                  Shop Diwali Fireworks Online
                </h2>

                <div className="rounded-lg border border-[#FFC107]/25 bg-gradient-to-br from-[#FFF8E1] to-[#FFF8E1]/50 p-3">
                  <p className="text-xs leading-[1.65] text-slate-700 sm:text-[13px]">
                    <strong className="font-semibold text-[#004D55]">{PRIME_BRAND.displayName}</strong>{' '}
                    brings premium <strong>Sivakasi Diwali fireworks wholesale</strong> and retail —
                    sparklers, rockets, fancy items, chakras, and gift boxes at up to 50% off with
                    all-India delivery.
                  </p>
                </div>

                <p className="text-[11px] leading-relaxed text-slate-500 sm:text-xs">
                  Find us on{' '}
                  <TextLink href={PRIME_CRACKERS_GOOGLE_MAPS_URL}>Google Maps</TextLink>, explore the{' '}
                  <TextLink href={SIVAKASI_WIKI_URL}>Sivakasi industry</TextLink>,{' '}
                  <TextLink href={instagramUrl}>Instagram</TextLink> &amp;{' '}
                  <TextLink href={youtubeUrl}>YouTube</TextLink>.
                </p>

                <nav
                  className="flex flex-wrap gap-1.5"
                  aria-label="Quick page links"
                >
                  <span className="mr-1 flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-[#004D55]/50">
                    <Sparkles className="h-2.5 w-2.5 text-[#FFC107]" aria-hidden="true" />
                    Explore
                  </span>
                  {PAGE_LINKS.map(({ to, label }) => (
                    <Link
                      key={to}
                      to={to}
                      className="rounded-full border border-[#004D55]/10 bg-[#004D55]/5 px-2 py-0.5 text-[10px] font-semibold text-[#004D55] transition hover:border-[#FFC107]/40 hover:bg-[#FFF8E1]"
                    >
                      {label}
                    </Link>
                  ))}
                </nav>

                <div className="mt-auto flex flex-wrap items-center gap-2 rounded-lg bg-gradient-to-r from-[#004D55] to-[#003840] px-3 py-2.5">
                  <Link
                    to="/#shop"
                    className="inline-flex items-center rounded-full bg-[#FFC107] px-4 py-1.5 text-[11px] font-bold text-[#004D55] transition hover:bg-[#FFD54F] sm:text-xs"
                  >
                    Browse Shop
                  </Link>
                  <a
                    href={buildWhatsAppShareUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-[#25D366]/30"
                    aria-label="Share on WhatsApp"
                  >
                    <Share2 className="h-3.5 w-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={copyPageUrl}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
                    aria-label="Copy page link"
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5 text-[#FFC107]" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  )
}
