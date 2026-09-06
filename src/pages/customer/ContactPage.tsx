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
import { useSettings } from '@/contexts/SettingsContext'
import { formatDisplayPhone, getBusinessPolicies, getWhatsAppNumbers } from '@/lib/businessInfo'
import { buildWhatsAppContactUrl, buildTelUrl, buildMailtoUrl } from '@/lib/whatsapp'
import { PRIME_CRACKERS_GOOGLE_MAPS_URL, PRIME_CRACKERS_MAP_EMBED_URL } from '@/lib/maps'
import { PRIME_BRAND } from '@/lib/primeBrand'
import { cleanPhone, cn } from '@/lib/utils'

const STOREFRONT_BG = '/prime-storefront-bg.png'

const WHATSAPP_GREETING = 'Hi Prime Crackers, I would like to enquire about your products.'

function ContactTile({
  label,
  value,
  href,
  icon: Icon,
  accent,
  className,
}: {
  label: string
  value: string
  href?: string | null
  icon: typeof Phone
  accent: string
  className?: string
}) {
  const content = (
    <>
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-inner"
        style={{ backgroundColor: `${accent}18` }}
      >
        <Icon className="h-5 w-5" style={{ color: accent }} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#004D55]/55">{label}</p>
        <p className="mt-0.5 text-sm font-bold leading-snug text-[#004D55]">{value}</p>
      </div>
      {href && <ArrowRight className="h-4 w-4 shrink-0 text-[#004D55]/30 transition group-hover:translate-x-0.5 group-hover:text-[#FFC107]" />}
    </>
  )

  const tileClass = cn(
    'group flex items-center gap-3 rounded-2xl border border-[#004D55]/10 bg-white p-4 shadow-sm transition hover:border-[#FFC107]/50 hover:shadow-md',
    className,
  )

  if (href) {
    return (
      <a href={href} className={tileClass}>
        {content}
      </a>
    )
  }

  return <div className={tileClass}>{content}</div>
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

  const showPhone =
    settings.phone &&
    (!primaryWhatsapp || cleanPhone(settings.phone) !== cleanPhone(primaryWhatsapp))

  const extraWhatsapp = whatsappNumbers.filter(
    (n) => !primaryWhatsapp || cleanPhone(n) !== cleanPhone(primaryWhatsapp),
  )

  return (
    <>
      <SEO
        title="Contact Us"
        description={`Contact ${settings.business_name} via WhatsApp, phone, or visit our store in Sivakasi.`}
        url="/contact"
      />

      <div className="overflow-hidden bg-white">
        {/* Hero */}
        <section className="relative">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${STOREFRONT_BG}')` }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#004D55]/95 via-[#003840]/90 to-[#001a1d]/95" aria-hidden="true" />
          <div
            className="pointer-events-none absolute -right-20 top-10 h-64 w-64 rounded-full bg-[#FFC107]/20 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-[#25D366]/15 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative mx-auto max-w-6xl px-4 py-10 text-center sm:px-6 sm:py-12">
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
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/70">
                Send your cart on WhatsApp — our team replies with prices, stock, and delivery across India.
              </p>
            </div>
          </div>
        </section>

        {/* Bento grid */}
        <section className="relative mx-auto max-w-6xl bg-white px-4 pb-10 pt-6 sm:px-6 sm:pb-12">
          <div className="grid gap-4 lg:grid-cols-12 lg:grid-rows-[auto_auto]">
            {/* Map — large tile */}
            <div
              className="relative overflow-hidden rounded-3xl border border-[#004D55]/10 shadow-lg lg:col-span-7 lg:row-span-2"
              data-reveal="fade-up"
            >
              <iframe
                title="Prime Crackers location"
                src={PRIME_CRACKERS_MAP_EMBED_URL}
                className="h-[260px] w-full border-0 sm:h-[320px] lg:absolute lg:inset-0 lg:h-full lg:min-h-[380px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
              <a
                href={PRIME_CRACKERS_GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 rounded-xl border border-[#004D55]/15 bg-white/95 px-4 py-3 text-[#004D55] shadow-md backdrop-blur-sm transition hover:border-[#FFC107]/60 sm:left-auto sm:right-4 sm:max-w-xs"
              >
                <span className="flex items-center gap-2 text-sm font-bold">
                  <Navigation className="h-4 w-4 text-[#FFC107]" />
                  Open in Google Maps
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-[#FFC107]" />
              </a>
            </div>

            {/* Contact tiles */}
            <div className="grid gap-3 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1" data-reveal="fade-up">
              {showPhone && settings.phone && (
                <ContactTile
                  label="Call us"
                  value={formatDisplayPhone(settings.phone)}
                  href={buildTelUrl(settings.phone)}
                  icon={Phone}
                  accent="#29B6F6"
                />
              )}
              {settings.email && (
                <ContactTile
                  label="Email"
                  value={settings.email}
                  href={buildMailtoUrl(settings.email)}
                  icon={Mail}
                  accent="#FFC107"
                />
              )}
              <ContactTile label="Open hours" value={hours} icon={Clock} accent="#FF8C00" />
              {settings.address && (
                <ContactTile
                  label="Store address"
                  value={settings.address.replace(/\n/g, ', ')}
                  icon={MapPin}
                  accent="#E65100"
                  className="sm:col-span-2 lg:col-span-1"
                />
              )}
            </div>

            {/* Extra WhatsApp numbers */}
            {extraWhatsapp.length > 0 && (
              <div className="flex flex-wrap gap-2 lg:col-span-5" data-reveal="fade-up">
                {extraWhatsapp.map((number) => (
                  <a
                    key={number}
                    href={buildWhatsAppContactUrl(number, WHATSAPP_GREETING)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 rounded-full border border-[#25D366]/40 bg-[#25D366]/10 px-4 py-2.5 text-[#25D366] transition hover:bg-[#25D366]/20"
                  >
                    <MessageCircle className="h-4 w-4 shrink-0" />
                    <span className="text-left leading-tight">
                      <span className="block text-xs font-extrabold uppercase tracking-wide">Chatting</span>
                      <span className="block text-[11px] font-semibold opacity-80">{formatDisplayPhone(number)}</span>
                    </span>
                  </a>
                ))}
              </div>
            )}

            {/* Trust strip */}
            <div
              className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-[#FFC107]/30 bg-[#FFC107]/20 shadow-sm lg:col-span-12"
              data-reveal="fade-up"
            >
              {[
                { icon: Truck, label: 'Delivery', value: policies.delivery_areas, color: '#E65100' },
                { icon: MessageCircle, label: 'Support', value: policies.whatsapp_response, color: '#25D366' },
                { icon: Sparkles, label: 'Customers', value: policies.happy_customers, color: '#004D55' },
              ].map(({ icon: Icon, label, value, color }) => (
                <div
                  key={label}
                  className="flex flex-col items-center bg-white px-3 py-4 text-center sm:flex-row sm:justify-center sm:gap-3 sm:py-5"
                >
                  <Icon className="h-5 w-5" style={{ color }} />
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#004D55]/50">{label}</p>
                    <p className="text-sm font-extrabold text-[#004D55] sm:text-base">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shop CTA */}
          <div
            className="relative mt-6 overflow-hidden rounded-2xl border border-[#FFC107]/30 bg-gradient-to-r from-[#004D55] to-[#006670] px-6 py-6 text-center sm:flex sm:items-center sm:justify-between sm:text-left"
            data-reveal="fade-up"
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-30"
              style={{ backgroundImage: `url('${STOREFRONT_BG}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              aria-hidden="true"
            />
            <div className="relative">
              <p className="font-display text-lg font-extrabold text-white sm:text-xl">
                Not sure what to order?
              </p>
              <p className="mt-1 text-sm text-white/75">Browse our catalogue, then message us on WhatsApp.</p>
            </div>
            <Link
              to="/#shop"
              className="relative mt-4 inline-flex items-center gap-2 rounded-xl bg-[#FFC107] px-6 py-3 text-sm font-bold text-[#004D55] shadow-lg transition hover:bg-[#FFD54F] sm:mt-0"
            >
              Explore Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}
