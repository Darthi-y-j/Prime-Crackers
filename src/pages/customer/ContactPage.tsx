import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Sparkles,
  Truck,
} from 'lucide-react'
import { SEO } from '@/components/shared/SEO'
import { FestivePageBackground } from '@/components/customer/FestivePageBackground'
import { useSettings } from '@/contexts/SettingsContext'
import { formatDisplayPhone, getBusinessPolicies, getWhatsAppNumbers } from '@/lib/businessInfo'
import { buildWhatsAppContactUrl, buildTelUrl, buildMailtoUrl } from '@/lib/whatsapp'
import { PRIME_CRACKERS_GOOGLE_MAPS_URL, PRIME_CRACKERS_MAP_EMBED_URL } from '@/lib/maps'
import { PRIME_BRAND } from '@/lib/primeBrand'
import { PageHeaderBackground } from '@/components/customer/PageHeader'
import { cleanPhone, cn } from '@/lib/utils'

const WHATSAPP_GREETING = 'Hi Prime Crackers, I would like to enquire about your products.'

function ContactCard({
  label,
  value,
  href,
  icon: Icon,
  accent,
}: {
  label: string
  value: string
  href?: string | null
  icon: typeof Phone
  accent: string
}) {
  const className = cn(
    'group flex h-full flex-col gap-3 rounded-2xl border p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5',
  )
  const style = {
    backgroundColor: `${accent}10`,
    borderColor: `${accent}28`,
  }

  const inner = (
    <>
      <div
        className="flex h-11 w-11 items-center justify-center rounded-xl shadow-inner"
        style={{ backgroundColor: `${accent}20` }}
      >
        <Icon className="h-5 w-5" style={{ color: accent }} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#004D55]/55">{label}</p>
        <p className="mt-1 text-sm font-bold leading-snug text-[#004D55] sm:text-base">{value}</p>
      </div>
      {href && (
        <ArrowRight
          className="h-4 w-4 text-[#004D55]/25 transition group-hover:translate-x-0.5 group-hover:text-[#FFC107]"
        />
      )}
    </>
  )

  if (href) {
    const external = href.startsWith('http')
    return (
      <a
        href={href}
        className={className}
        style={style}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {inner}
      </a>
    )
  }

  return (
    <div className={className} style={style}>
      {inner}
    </div>
  )
}

export function ContactPage() {
  const { settings } = useSettings()
  const whatsappNumbers = getWhatsAppNumbers(settings)
  const policies = getBusinessPolicies(settings)
  const primaryWhatsapp = whatsappNumbers[0]
  const hours =
    settings.business_hours?.weekdays ||
    settings.business_hours?.saturday ||
    '24/7 — Always Open'

  const extraWhatsapp = whatsappNumbers.filter(
    (n) => !primaryWhatsapp || cleanPhone(n) !== cleanPhone(primaryWhatsapp),
  )

  const displayPhone = settings.phone || primaryWhatsapp
  const phoneCard = displayPhone
    ? {
        label: settings.phone ? 'Phone number' : 'WhatsApp number',
        value: formatDisplayPhone(displayPhone),
        href: settings.phone
          ? buildTelUrl(settings.phone)
          : buildWhatsAppContactUrl(primaryWhatsapp!, WHATSAPP_GREETING),
        icon: Phone,
        accent: '#29B6F6',
      }
    : null

  const contactCards = [
    phoneCard,
    settings.email
      ? {
          label: 'Email',
          value: settings.email,
          href: buildMailtoUrl(settings.email),
          icon: Mail,
          accent: '#FFC107',
        }
      : null,
    {
      label: 'Open hours',
      value: hours,
      href: null,
      icon: Clock,
      accent: '#FF8C00',
    },
    settings.address
      ? {
          label: 'Store address',
          value: settings.address.replace(/\n/g, ', '),
          href: PRIME_CRACKERS_GOOGLE_MAPS_URL,
          icon: MapPin,
          accent: '#E65100',
        }
      : null,
  ].filter(Boolean) as Array<{
    label: string
    value: string
    href: string | null
    icon: typeof Phone
    accent: string
  }>

  const stats = [
    { icon: Truck, label: 'Delivery', value: policies.delivery_areas, color: '#E65100' },
    { icon: MessageCircle, label: 'Support', value: policies.whatsapp_response, color: '#25D366' },
    { icon: Sparkles, label: 'Customers', value: policies.happy_customers, color: '#004D55' },
  ]

  return (
    <>
      <SEO
        title="Contact Us"
        description={`Contact ${settings.business_name} via WhatsApp, phone, or visit our store in Sivakasi.`}
        url="/contact"
      />

      <div className="overflow-hidden">
        {/* Hero */}
        <section className="relative overflow-hidden border-b-2 border-[#004D55]">
          <PageHeaderBackground />
          <div
            className="pointer-events-none absolute -right-20 top-10 h-64 w-64 rounded-full bg-[#FFC107]/20 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-[#25D366]/15 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative px-4 py-10 text-center sm:px-6 sm:py-12 lg:px-14">
            <div data-reveal="fade-up">
              <p className="inline-flex items-center gap-1.5 rounded-full border border-[#FFC107]/35 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#FFC107]">
                <Sparkles className="h-3 w-3" />
                We&apos;re here to help
              </p>
              <h1 className="mt-3 font-display text-3xl font-extrabold uppercase tracking-wide text-white sm:text-4xl lg:text-[2.75rem]">
                Let&apos;s Light Up
                <span className="block text-[#FFC107]">Your Festival</span>
              </h1>
              <p className="font-script mt-2 text-xl text-white/80 sm:text-2xl">{PRIME_BRAND.tagline}</p>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-white/70">
                Send your cart on WhatsApp — our team replies with prices, stock, and delivery across India.
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="grid w-full grid-cols-3 border-y border-[#004D55]/10" data-reveal="fade-up">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={cn(
                'px-4 py-5 sm:px-6 sm:py-6',
                index < 2 && 'border-r border-[#004D55]/10',
              )}
              style={{ backgroundColor: `${stat.color}12` }}
            >
              <div className="flex flex-col items-center justify-center gap-1 text-center sm:flex-row sm:gap-3">
                <stat.icon className="h-5 w-5 shrink-0" style={{ color: stat.color }} />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[#004D55]/50">
                    {stat.label}
                  </p>
                  <p className="text-sm font-extrabold text-[#004D55] sm:text-base">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </section>

        <FestivePageBackground className="pb-0">
          <div className="space-y-8 px-5 py-10 sm:px-10 sm:py-12 lg:px-14 xl:px-20">
            {/* WhatsApp primary CTA */}
            {primaryWhatsapp && (
              <div
                className="relative overflow-hidden rounded-2xl border border-[#25D366]/40 p-5 shadow-lg sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-6"
                data-reveal="fade-up"
              >
                <div
                  className="absolute inset-0 bg-gradient-to-r from-[#25D366] to-[#1da851]"
                  aria-hidden="true"
                />
                <div className="relative flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                    <MessageCircle className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/80">
                      Fastest way to reach us
                    </p>
                    <p className="font-display text-xl font-extrabold text-white sm:text-2xl">
                      Chat on WhatsApp
                    </p>
                    <p className="mt-1 text-sm text-white/85">{formatDisplayPhone(primaryWhatsapp)}</p>
                  </div>
                </div>
                <a
                  href={buildWhatsAppContactUrl(primaryWhatsapp, WHATSAPP_GREETING)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#25D366] shadow-md transition hover:bg-[#FFF8E1] sm:mt-0 sm:w-auto"
                >
                  Start WhatsApp Chat
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            )}

            {/* Contact cards */}
            <div data-reveal="fade-up">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#004D55]/55">
                Other ways to reach us
              </p>
              <div
                className={cn(
                  'mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4',
                )}
              >
                {contactCards.map((card) => (
                  <ContactCard key={card.label} {...card} />
                ))}
              </div>

              {extraWhatsapp.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {extraWhatsapp.map((number) => (
                    <a
                      key={number}
                      href={buildWhatsAppContactUrl(number, WHATSAPP_GREETING)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-[#25D366]/40 bg-[#25D366]/10 px-4 py-2 text-xs font-semibold text-[#1da851] transition hover:bg-[#25D366]/20"
                    >
                      <MessageCircle className="h-3.5 w-3.5 shrink-0" />
                      WhatsApp {formatDisplayPhone(number)}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Map */}
            <div
              className="relative overflow-hidden rounded-2xl border border-[#004D55]/15 shadow-lg"
              data-reveal="fade-up"
            >
              <div className="relative min-h-[320px] sm:min-h-[400px] lg:min-h-[440px]">
                <iframe
                  title="Prime Crackers location"
                  src={PRIME_CRACKERS_MAP_EMBED_URL}
                  className="absolute inset-0 h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#004D55]/10 bg-white/95 px-4 py-4 backdrop-blur-sm sm:px-6">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-[#E65100]" />
                  <p className="text-sm font-semibold text-[#004D55]">
                    {settings.business_name || PRIME_BRAND.displayName} — Sivakasi
                  </p>
                </div>
                <a
                  href={PRIME_CRACKERS_GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#FFC107] px-4 py-2.5 text-sm font-bold text-[#004D55] transition hover:bg-[#FFD54F]"
                >
                  <Navigation className="h-4 w-4" />
                  Open in Google Maps
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </FestivePageBackground>

        {/* Bottom CTA */}
        <section className="relative w-full overflow-hidden" data-reveal="fade-up">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${PRIME_BRAND.contactCtaBg}')` }}
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#004D55]/85 via-[#003840]/78 to-[#004D55]/82"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_120%_at_0%_50%,rgba(255,193,7,0.18),transparent_55%)]"
            aria-hidden="true"
          />

          <div className="relative flex w-full flex-col gap-6 px-6 py-10 sm:px-10 sm:py-12 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:px-14 xl:px-20">
            <div className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left">
              <h2 className="font-display text-xl font-extrabold text-white sm:text-2xl lg:text-3xl">
                Not sure what to order?
              </h2>
              <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/85 sm:text-base">
                Browse our catalogue, add to cart, then message us on WhatsApp — we confirm price, stock &amp;
                delivery.
              </p>
            </div>
            <div className="flex w-full shrink-0 flex-col gap-3 sm:flex-row sm:justify-center lg:w-auto lg:flex-col">
              <Link
                to="/#shop"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FFC107] px-6 py-3.5 text-sm font-bold text-[#004D55] shadow-lg transition hover:bg-[#FFD54F]"
              >
                Explore Products
                <ArrowRight className="h-4 w-4" />
              </Link>
              {primaryWhatsapp && (
                <a
                  href={buildWhatsAppContactUrl(primaryWhatsapp, WHATSAPP_GREETING)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[#25D366] bg-[#25D366]/15 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-[#25D366]/30"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp Enquiry
                </a>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
