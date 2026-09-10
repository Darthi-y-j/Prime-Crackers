import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BadgeCheck,
  MapPin,
  MessageCircle,
  Package,
  Sparkles,
  Truck,
} from 'lucide-react'
import { SEO } from '@/components/shared/SEO'
import { useSettings } from '@/contexts/SettingsContext'
import { getBusinessPolicies, getWhatsAppNumbers } from '@/lib/businessInfo'
import { buildWhatsAppContactUrl } from '@/lib/whatsapp'
import { PRIME_BRAND, SERVICE_HIGHLIGHTS, WHY_CHOOSE } from '@/lib/primeBrand'
import { FESTIVE_HEADER_BG, PageHeaderBackground } from '@/components/customer/PageHeader'
import { OptimizedBackground } from '@/components/customer/OptimizedBackground'
import { SITE_LOGO_PATH } from '@/lib/siteConfig'
import { AboutIntroSection } from '@/components/prime/AboutIntroSection'
import { cn } from '@/lib/utils'

const OUR_STORY_BG = '/about-our-story-bg.jpg'

const STATS = [
  { value: '50%', label: 'Wholesale savings', accent: '#FFC107' },
  { value: '10+', label: 'Years in business', accent: '#004D55' },
  { value: '24/7', label: 'WhatsApp support', accent: '#006670' },
  { value: 'All India', label: 'Delivery available', accent: '#E65100' },
] as const

const STEPS = [
  {
    step: '01',
    title: 'Browse & add to cart',
    desc: 'Explore categories on the home page and add crackers you like.',
  },
  {
    step: '02',
    title: 'Send WhatsApp enquiry',
    desc: 'Share your list in one message — no online payment needed.',
  },
  {
    step: '03',
    title: 'We confirm & deliver',
    desc: 'Our team confirms price, stock, and delivery across India.',
  },
] as const

const SERVICE_ICONS = {
  badge: BadgeCheck,
  package: Package,
  truck: Truck,
  headphones: MessageCircle,
} as const

export function AboutPage() {
  const { settings } = useSettings()
  const policies = getBusinessPolicies(settings)
  const whatsapp = getWhatsAppNumbers(settings)[0]
  const aboutText =
    settings.about_text ||
    'Prime Crackers brings festivals to life with quality crackers from Sivakasi. We offer wholesale & retail fireworks at great discounts for Diwali, weddings, and every celebration — with delivery across India.'

  return (
    <>
      <SEO
        title="About Us"
        description={`About ${settings.business_name} — We Bring Festivals with quality fireworks from Sivakasi.`}
        url="/about"
      />

      <div className="bg-gradient-to-b from-[#FFF8E1]/50 to-white">
        <section className="relative min-h-[280px] overflow-hidden border-b-2 border-[#004D55] sm:min-h-[320px]">
          <PageHeaderBackground />
          <div className="relative mx-auto max-w-7xl px-4 py-10 text-center sm:px-6 sm:py-14 lg:py-16" data-reveal="fade-up">
            <img
              src={SITE_LOGO_PATH}
              alt=""
              className="mx-auto h-20 w-20 rounded-full border-2 border-[#FFC107] shadow-[0_8px_32px_rgba(0,0,0,0.35)] sm:h-24 sm:w-24"
            />
            <p className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-[#FFC107]/50 bg-black/25 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#FFC107] backdrop-blur-sm">
              <Sparkles className="h-3 w-3" />
              About us
            </p>
            <h1 className="mt-5 font-display text-3xl font-extrabold uppercase tracking-wide text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.4)] sm:text-4xl lg:text-5xl">
              {settings.business_name}
            </h1>
            <p className="font-script mt-3 text-2xl text-[#FFC107] drop-shadow-sm sm:text-3xl">{PRIME_BRAND.tagline}</p>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/90 drop-shadow-sm sm:text-base">
              Your trusted fireworks partner from Alamarathupatti, Sivakasi — wholesale & retail with all-India
              delivery.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/#shop"
                className="inline-flex items-center gap-2 rounded-xl bg-[#FFC107] px-6 py-3 text-sm font-bold text-[#004D55] shadow-lg transition hover:bg-[#FFD54F]"
              >
                Browse Products
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-black/20 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/15"
              >
                <MessageCircle className="h-4 w-4" />
                Contact Us
              </Link>
            </div>
          </div>
        </section>

        {/* Full-bleed stats ribbon */}
        <section className="relative z-10 -mt-5 w-full" data-reveal="fade-up">
          <div className="grid grid-cols-2 bg-white shadow-[0_8px_32px_rgba(0,77,85,0.08)] sm:grid-cols-4">
            {STATS.map((stat, index) => (
              <div
                key={stat.label}
                className={cn(
                  'group relative overflow-hidden px-4 py-5 text-center transition hover:bg-[#FFF8E1]/60 sm:px-6 sm:py-7',
                  index % 2 === 0 && 'border-r border-[#004D55]/8 sm:border-r',
                  index < 2 && 'border-b border-[#004D55]/8 sm:border-b-0',
                  index < STATS.length - 1 && 'sm:border-r sm:border-[#004D55]/8',
                )}
              >
                <div
                  className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-0 transition group-hover:opacity-100"
                  style={{ backgroundColor: `${stat.accent}18` }}
                  aria-hidden="true"
                />
                <p className="font-display text-2xl font-extrabold sm:text-3xl lg:text-4xl" style={{ color: stat.accent }}>
                  {stat.value}
                </p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600 sm:text-xs">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        <AboutIntroSection />

        {/* Full-bleed story + visit — asymmetric split */}
        <section className="w-full overflow-hidden py-0" data-reveal="fade-up">
          <div className="grid w-full lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:min-h-[min(52vh,520px)]">
            {/* Our Story — wider column */}
            <div className="relative flex min-w-0 flex-col justify-center overflow-hidden">
              <OptimizedBackground src={OUR_STORY_BG} />
              <div
                className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/88 to-white/55 lg:to-white/35"
                aria-hidden="true"
              />
              <div className="relative px-5 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-12 xl:px-16">
                <div className="max-w-2xl rounded-2xl border border-[#004D55]/10 bg-white/95 p-5 shadow-[0_8px_32px_rgba(0,77,85,0.12)] backdrop-blur-md sm:p-7">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#E65100]">Since Sivakasi</p>
                  <h2 className="mt-1 font-display text-2xl font-extrabold text-[#004D55] sm:text-3xl lg:text-4xl">
                    Our Story
                  </h2>
                  <div className="mt-2 h-1 w-16 rounded-full bg-[#FFC107]" aria-hidden="true" />
                  <div className="mt-5 space-y-3 text-sm font-medium leading-relaxed text-[#004D55]/90 sm:text-base">
                    <p>{aboutText}</p>
                    <p>
                      Browse products, add to cart, and send your enquiry on WhatsApp — we confirm pricing,
                      stock, and delivery.
                    </p>
                  </div>
                </div>
                <div className="mt-6 grid max-w-3xl gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4 lg:max-w-none">
                  {WHY_CHOOSE.map((item) => (
                    <div
                      key={item.title}
                      className="flex items-center gap-2 rounded-xl border border-[#004D55]/12 bg-white px-3 py-2.5 shadow-md transition hover:-translate-y-0.5 hover:border-[#FFC107]/50 hover:shadow-lg"
                    >
                      <span className="text-lg" aria-hidden="true">{item.icon}</span>
                      <p className="text-[11px] font-semibold leading-tight text-[#004D55] sm:text-xs">
                        {item.title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Visit us */}
            <div className="relative min-h-[300px] min-w-0 overflow-hidden bg-[#003840] lg:min-h-0">
              <OptimizedBackground src={FESTIVE_HEADER_BG} />
              <div className="relative flex h-full min-h-[300px] flex-col items-center justify-center px-6 py-10 text-center lg:min-h-full lg:px-10">
                <p className="inline-flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#FFC107] sm:text-xs">
                  <MapPin className="h-4 w-4" />
                  Visit us
                </p>
                <p className="mt-3 max-w-xs whitespace-pre-line text-sm leading-relaxed text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] sm:max-w-sm sm:text-base">
                  {settings.address}
                </p>
                <Link
                  to="/contact"
                  className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#FFC107] px-4 py-2 text-xs font-bold text-[#004D55] transition hover:bg-[#FFD54F] sm:text-sm"
                >
                  Get directions
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Full-width policy metrics strip */}
          <div className="grid grid-cols-2 border-y border-[#004D55]/10 bg-gradient-to-r from-[#FFF8E1] via-white to-[#FFF8E1] sm:grid-cols-4">
            {[
              { label: 'Happy customers', value: policies.happy_customers, color: '#E65100' },
              { label: 'Delivery', value: policies.delivery_areas, color: '#004D55' },
              { label: 'Support', value: policies.whatsapp_response, color: '#006670' },
              { label: 'Experience', value: policies.years_in_business, color: '#E65100' },
            ].map((item, index) => (
              <div
                key={item.label}
                className={cn(
                  'px-4 py-4 text-center sm:px-6 sm:py-5',
                  index % 2 === 0 && 'border-r border-[#004D55]/8 sm:border-r',
                  index < 2 && 'border-b border-[#004D55]/8 sm:border-b-0',
                  index < 3 && 'sm:border-r sm:border-[#004D55]/8',
                )}
              >
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 sm:text-xs">
                  {item.label}
                </p>
                <p className="mt-1 font-display text-base font-extrabold sm:text-lg lg:text-xl" style={{ color: item.color }}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Trust + how it works — full width */}
        <section className="w-full px-0 pb-6 sm:pb-8" data-reveal="fade-up">
          <div className="overflow-hidden bg-[#004D55]">
            <div className="border-b border-white/10 px-5 py-8 sm:px-10 lg:px-16">
              <h2 className="font-display text-xl font-extrabold text-white sm:text-2xl lg:text-3xl">
                Why Customers Trust Us
              </h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {SERVICE_HIGHLIGHTS.map((item) => {
                  const Icon = SERVICE_ICONS[item.icon]
                  return (
                    <div
                      key={item.title}
                      className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FFC107]/15">
                        <Icon className="h-4 w-4 text-[#FFC107]" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xs font-bold text-white sm:text-sm">{item.title}</h3>
                        <p className="text-[10px] text-white/60 sm:text-xs">{item.desc}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="bg-white px-5 py-8 sm:px-10 lg:px-16">
              <h2 className="font-display text-lg font-extrabold text-[#004D55] sm:text-xl lg:text-2xl">How It Works</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {STEPS.map((item) => (
                  <div
                    key={item.step}
                    className="rounded-xl border border-[#004D55]/10 bg-[#FFF8E1]/40 px-3 py-3 sm:px-4 sm:py-3.5"
                  >
                    <span className="font-display text-lg font-extrabold text-[#FFC107]">{item.step}</span>
                    <h3 className="mt-1 text-sm font-bold text-[#004D55]">{item.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA — edge-to-edge celebration band */}
        <section className="relative w-full overflow-hidden" data-reveal="fade-up">
          <OptimizedBackground src={FESTIVE_HEADER_BG} priority={false} />
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#004D55]/96 via-[#003840]/92 to-[#004D55]/88"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_120%_at_0%_50%,rgba(255,193,7,0.18),transparent_55%)]"
            aria-hidden="true"
          />

          <div className="relative flex w-full flex-col gap-8 px-6 py-12 sm:px-10 sm:py-14 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:px-14 xl:px-20">
            <div className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left">
              <p className="inline-flex items-center gap-1.5 rounded-full border border-[#FFC107]/40 bg-black/25 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#FFC107]">
                <Sparkles className="h-3 w-3" />
                Festival season
              </p>
              <h2 className="mt-4 font-display text-2xl font-extrabold uppercase tracking-wide text-white sm:text-3xl lg:text-4xl">
                Ready to <span className="text-[#FFC107]">Celebrate?</span>
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/90 sm:text-base">
                Browse crackers, build your cart, and send one WhatsApp enquiry — we confirm price, stock &amp;
                delivery across India.
              </p>
            </div>

            <div className="flex w-full shrink-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center lg:w-auto lg:min-w-[240px] lg:flex-col">
              <Link
                to="/#shop"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FFC107] px-6 py-3.5 text-sm font-bold text-[#004D55] shadow-lg transition hover:bg-[#FFD54F]"
              >
                <Package className="h-4 w-4" />
                Browse Shop
              </Link>
              {whatsapp && (
                <a
                  href={buildWhatsAppContactUrl(whatsapp, 'Hi Prime Crackers, I would like to enquire about your products.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[#25D366] bg-[#25D366]/15 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-[#25D366]/30"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp Enquiry
                </a>
              )}
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/35 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                <MapPin className="h-4 w-4" />
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
