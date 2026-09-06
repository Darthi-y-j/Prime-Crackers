import { MessageCircle, Phone, Mail, MapPin, Clock, ExternalLink } from 'lucide-react'
import { useSettings } from '@/contexts/SettingsContext'
import { buildWhatsAppContactUrl, buildTelUrl, buildMailtoUrl } from '@/lib/whatsapp'
import { formatDisplayPhone, getWhatsAppNumbers } from '@/lib/businessInfo'
import { PRIME_CRACKERS_GOOGLE_MAPS_URL, PRIME_CRACKERS_MAP_EMBED_URL } from '@/lib/maps'
import { TitleHighlight } from './TitleHighlight'

const CONTACT_BG = '/contact-section-bg.webp'
const CONTACT_BG_FALLBACK = '/contact-section-bg.png'

export function ContactSection() {
  const { settings } = useSettings()
  const whatsappNumbers = getWhatsAppNumbers(settings)

  return (
    <section className="relative overflow-hidden py-16 sm:py-20">
      <picture className="pointer-events-none absolute inset-0">
        <source srcSet={CONTACT_BG} type="image/webp" />
        <img
          src={CONTACT_BG_FALLBACK}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-center"
        />
      </picture>
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy-950/60 via-navy-950/40 to-navy-950/65"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_45%,rgba(12,8,6,0.28),transparent_65%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_40%,rgba(245,158,11,0.11),transparent_60%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/30 to-transparent"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            <span className="text-cream-50">Get in </span>
            <TitleHighlight variant="dark">Touch</TitleHighlight>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-gold-300/80 sm:text-base">
            Have questions? Reach out to us — we&apos;re open 24/7 on WhatsApp for your celebration needs.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:items-stretch lg:gap-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col rounded-xl border border-white/12 bg-navy-950/48 p-6 backdrop-blur-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366]/20 ring-1 ring-[#25D366]/30">
                <MessageCircle className="h-6 w-6 text-[#25D366]" />
              </div>
              <h3 className="mt-4 font-semibold text-white">WhatsApp</h3>
              <p className="mt-1 text-xs text-white/55">Available 24/7</p>
              <ul className="mt-3 space-y-2">
                {whatsappNumbers.map((number) => (
                  <li key={number}>
                    <a
                      href={buildWhatsAppContactUrl(number, 'Hello! I would like to get in touch.')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gold-300/90 transition hover:text-gold-300"
                    >
                      {formatDisplayPhone(number)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {settings.address && (
              <div className="flex flex-col rounded-xl border border-white/12 bg-navy-950/48 p-6 backdrop-blur-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-navy-900/60 ring-1 ring-white/10">
                  <MapPin className="h-6 w-6 text-gold-400" />
                </div>
                <h3 className="mt-4 font-semibold text-white">Address</h3>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-white/60">
                  {settings.address}
                </p>
              </div>
            )}

            {settings.phone && (
              <a
                href={buildTelUrl(settings.phone)}
                className="flex flex-col items-center rounded-xl border border-white/12 bg-navy-950/48 p-6 text-center backdrop-blur-sm transition hover:border-gold-400/28 hover:bg-navy-950/58"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-500/20 ring-1 ring-gold-400/30">
                  <Phone className="h-6 w-6 text-gold-400" />
                </div>
                <h3 className="mt-4 font-semibold text-white">Phone</h3>
                <p className="mt-1 text-sm text-white/60">{formatDisplayPhone(settings.phone)}</p>
              </a>
            )}

            {settings.email && (
              <a
                href={buildMailtoUrl(settings.email)}
                className="flex flex-col items-center rounded-xl border border-white/12 bg-navy-950/48 p-6 text-center backdrop-blur-sm transition hover:border-gold-400/28 hover:bg-navy-950/58"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-festive-500/20 ring-1 ring-festive-400/30">
                  <Mail className="h-6 w-6 text-festive-400" />
                </div>
                <h3 className="mt-4 font-semibold text-white">Email</h3>
                <p className="mt-1 text-sm text-white/60">{settings.email}</p>
              </a>
            )}
          </div>

          <div className="flex min-h-[320px] flex-col overflow-hidden rounded-2xl border border-white/12 bg-navy-950/48 shadow-[0_12px_40px_rgba(0,0,0,0.25)] backdrop-blur-sm lg:min-h-[420px]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-5">
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-500/20 ring-1 ring-gold-400/30">
                  <MapPin className="h-4 w-4 text-gold-400" />
                </span>
                <div className="min-w-0 text-left">
                  <p className="truncate font-semibold text-white">
                    {settings.business_name || 'Prime Crackers'}
                  </p>
                  {settings.address ? (
                    <p className="truncate text-xs text-white/55">{settings.address.split('\n')[0]}</p>
                  ) : (
                    <p className="text-xs text-white/55">Sivakasi, Tamil Nadu</p>
                  )}
                </div>
              </div>
              <a
                href={PRIME_CRACKERS_GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-gold-400/30 bg-gold-500/10 px-4 py-2 text-xs font-semibold text-gold-300 transition-colors hover:border-gold-400/45 hover:bg-gold-500/15 sm:text-sm"
              >
                Open in Google Maps
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            <div className="relative min-h-[260px] flex-1">
              <iframe
                title="Prime Crackers location on Google Maps"
                src={PRIME_CRACKERS_MAP_EMBED_URL}
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-navy-950/40 px-5 py-3 text-sm text-gold-300/80 backdrop-blur-md">
            <Clock className="h-4 w-4 text-gold-400" />
            <span>Open 24/7 — including weekends &amp; festivals</span>
          </div>
        </div>
      </div>
    </section>
  )
}
