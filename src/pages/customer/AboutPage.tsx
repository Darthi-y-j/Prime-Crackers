import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BadgeCheck,
  MapPin,
  MessageCircle,
  Package,
  ShieldCheck,
  Sparkles,
  Truck,
} from 'lucide-react'
import { SEO } from '@/components/shared/SEO'
import { useSettings } from '@/contexts/SettingsContext'
import { getBusinessPolicies } from '@/lib/businessInfo'
import { PRIME_BRAND, SERVICE_HIGHLIGHTS, WHY_CHOOSE } from '@/lib/primeBrand'
import { SITE_LOGO_PATH } from '@/lib/siteConfig'

const STOREFRONT_BG = '/prime-storefront-bg.png'

const STATS = [
  { value: '90%', label: 'Wholesale savings', accent: '#FFC107' },
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
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('${STOREFRONT_BG}')` }}
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-gradient-to-b from-[#004D55]/80 via-[#004D55]/70 to-[#004D55]/85"
            aria-hidden="true"
          />

          <div className="relative mx-auto max-w-7xl px-4 py-8 text-center sm:px-6 sm:py-10" data-reveal="fade-up">
            <img
              src={SITE_LOGO_PATH}
              alt=""
              className="mx-auto h-20 w-20 rounded-full border-2 border-[#FFC107] shadow-lg sm:h-24 sm:w-24"
            />
            <p className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-[#FFC107]/40 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#FFC107] backdrop-blur-sm">
              <Sparkles className="h-3 w-3" />
              About us
            </p>
            <h1 className="mt-4 font-display text-3xl font-extrabold uppercase tracking-wide text-white sm:text-4xl lg:text-5xl">
              {settings.business_name}
            </h1>
            <p className="font-script mt-2 text-2xl text-[#FFC107] sm:text-3xl">{PRIME_BRAND.tagline}</p>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">
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
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                <MessageCircle className="h-4 w-4" />
                Contact Us
              </Link>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="relative z-10 -mt-4 mx-auto max-w-5xl px-4 sm:px-6" data-reveal="fade-up">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-[#004D55]/10 bg-white px-2 py-3 text-center shadow-[0_4px_20px_rgba(0,77,85,0.06)] sm:px-3 sm:py-3.5"
              >
                <p className="font-display text-xl font-extrabold sm:text-2xl" style={{ color: stat.accent }}>
                  {stat.value}
                </p>
                <p className="mt-1 text-[11px] font-semibold text-slate-600 sm:text-xs">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Story + visit — single card, no column gap */}
        <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8" data-reveal="fade-up">
          <div className="overflow-hidden rounded-2xl border border-[#004D55]/10 bg-white shadow-[0_8px_32px_rgba(0,77,85,0.08)]">
            <div className="grid lg:grid-cols-2">
              <div className="flex flex-col p-5 sm:p-6 lg:p-7">
                <h2 className="font-display text-xl font-extrabold text-[#004D55] sm:text-2xl">Our Story</h2>
                <div className="mt-1.5 h-1 w-12 rounded-full bg-[#FFC107]" aria-hidden="true" />
                <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-700">
                  <p>{aboutText}</p>
                  <p>
                    Browse products, add to cart, and send your enquiry on WhatsApp — we confirm pricing,
                    stock, and delivery.
                  </p>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {WHY_CHOOSE.map((item) => (
                    <div
                      key={item.title}
                      className="flex items-center gap-2 rounded-lg border border-[#FFC107]/30 bg-[#FFF8E1]/70 px-2.5 py-2"
                    >
                      <span className="text-base" aria-hidden="true">
                        {item.icon}
                      </span>
                      <p className="text-[11px] font-semibold leading-tight text-[#004D55] sm:text-xs">
                        {item.title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative min-h-[200px] border-t border-[#004D55]/8 lg:min-h-0 lg:border-l lg:border-t-0">
                <img
                  src={STOREFRONT_BG}
                  alt="Prime Crackers storefront"
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#004D55]/95 via-[#004D55]/40 to-[#004D55]/15" />
                <div className="relative flex h-full flex-col justify-end p-5 text-white sm:p-6">
                  <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#FFC107] sm:text-xs">
                    <MapPin className="h-3.5 w-3.5" />
                    Visit us
                  </p>
                  <p className="mt-1.5 whitespace-pre-line text-xs leading-relaxed text-white/90 sm:text-sm">
                    {settings.address}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 divide-x divide-[#004D55]/8 border-t border-[#004D55]/8 bg-[#FFF8E1]/50 sm:grid-cols-4">
              {[
                { label: 'Happy customers', value: policies.happy_customers, color: '#E65100' },
                { label: 'Delivery', value: policies.delivery_areas, color: '#004D55' },
                { label: 'Support', value: policies.whatsapp_response, color: '#006670' },
                { label: 'Experience', value: policies.years_in_business, color: '#E65100' },
              ].map((item) => (
                <div key={item.label} className="px-3 py-3 text-center sm:px-4 sm:py-3.5">
                  <p className="text-[10px] font-semibold text-slate-600 sm:text-xs">{item.label}</p>
                  <p
                    className="mt-0.5 font-display text-sm font-extrabold sm:text-base"
                    style={{ color: item.color }}
                  >
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust + how it works — one compact block */}
        <section className="mx-auto max-w-6xl px-4 pb-6 sm:px-6 sm:pb-8" data-reveal="fade-up">
          <div className="overflow-hidden rounded-2xl bg-[#004D55]">
            <div className="border-b border-white/10 px-5 py-5 sm:px-6">
              <h2 className="font-display text-xl font-extrabold text-white sm:text-2xl">Why Customers Trust Us</h2>
              <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
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

            <div className="bg-white px-5 py-5 sm:px-6">
              <h2 className="font-display text-lg font-extrabold text-[#004D55] sm:text-xl">How It Works</h2>
              <div className="mt-3 grid gap-2 md:grid-cols-3">
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

        {/* CTA */}
        <section className="mx-auto max-w-6xl px-4 pb-8 sm:px-6 sm:pb-10" data-reveal="fade-up">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#004D55] to-[#006670] px-5 py-7 text-center sm:px-8 sm:py-8">
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_120%,rgba(255,193,7,0.2),transparent_60%)]"
              aria-hidden="true"
            />
            <ShieldCheck className="relative mx-auto h-8 w-8 text-[#FFC107]" />
            <h2 className="relative mt-3 font-display text-xl font-extrabold text-white sm:text-2xl">
              Ready to celebrate?
            </h2>
            <p className="relative mx-auto mt-1.5 max-w-lg text-sm text-white/80">
              Explore our catalogue and send your enquiry on WhatsApp.
            </p>
            <Link
              to="/#shop"
              className="relative mt-4 inline-flex items-center gap-2 rounded-xl bg-[#FFC107] px-6 py-3 text-sm font-bold text-[#004D55] shadow-lg transition hover:bg-[#FFD54F]"
            >
              Start Shopping
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}
