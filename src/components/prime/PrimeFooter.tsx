import { Link } from 'react-router-dom'
import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { useSettings } from '@/contexts/SettingsContext'
import { buildMailtoUrl, buildTelUrl, buildWhatsAppContactUrl } from '@/lib/whatsapp'
import { formatDisplayPhone, getWhatsAppNumbers } from '@/lib/businessInfo'
import { DEVELOPER_CREDIT, SITE_LOGO_PATH } from '@/lib/siteConfig'
import { PRIME_BRAND } from '@/lib/primeBrand'

const QUICK_LINKS = [
  { to: '/#shop', label: 'Products' },
  { to: '/categories', label: 'Categories' },
  { to: '/gift-box', label: 'Gift Boxes' },
  { to: '/cart', label: 'Cart' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' },
  { to: '/faq', label: 'FAQ' },
  { to: '/safety', label: 'Safety Guide' },
  { to: '/delivery', label: 'Delivery' },
] as const

export function PrimeFooter() {
  const { settings } = useSettings()
  const year = new Date().getFullYear()
  const whatsappNumbers = getWhatsAppNumbers(settings)
  const tagline =
    settings.tagline?.trim() ||
    'Premium Fireworks & Crackers for Every Celebration'
  const hours =
    settings.business_hours?.weekdays ||
    settings.business_hours?.saturday ||
    '24/7 — Always Open'

  return (
    <footer className="bg-[#0a1f22] text-white" data-reveal="fade-in">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <img
                src={SITE_LOGO_PATH}
                alt=""
                className="h-10 w-10 shrink-0 rounded-full border-2 border-[#FFC107] shadow-md"
              />
              <p className="font-display text-base font-extrabold uppercase leading-tight tracking-wide text-[#FFC107]">
                {settings.business_name || PRIME_BRAND.displayName}
              </p>
            </div>
            <p className="mt-2 text-xs leading-snug text-white/65">{tagline}</p>
            {(settings.social_links.instagram || settings.social_links.youtube) && (
              <div className="mt-3 flex flex-wrap gap-2">
                {settings.social_links.instagram && (
                  <a
                    href={settings.social_links.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-white/80 transition hover:border-[#FFC107]/40 hover:text-[#FFC107]"
                  >
                    Instagram
                  </a>
                )}
                {settings.social_links.youtube && (
                  <a
                    href={settings.social_links.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-white/80 transition hover:border-[#FFC107]/40 hover:text-[#FFC107]"
                  >
                    YouTube
                  </a>
                )}
              </div>
            )}
            {settings.address && (
              <div className="mt-2 flex items-start gap-1.5 text-xs leading-snug text-white/70">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#FFC107]" aria-hidden="true" />
                <span className="whitespace-pre-line">{settings.address}</span>
              </div>
            )}
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.12em] text-[#FFC107]">Quick Links</h4>
            <ul className="mt-2 space-y-1">
              {QUICK_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-xs text-white/70 transition hover:text-[#FFC107]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.12em] text-[#FFC107]">Contact</h4>
            <ul className="mt-2 space-y-1.5">
              {settings.phone && (
                <li>
                  <a
                    href={buildTelUrl(settings.phone)}
                    className="flex items-center gap-1.5 text-xs text-white/70 transition hover:text-[#FFC107]"
                  >
                    <Phone className="h-3.5 w-3.5 shrink-0 text-[#FFC107]" aria-hidden="true" />
                    {formatDisplayPhone(settings.phone)}
                  </a>
                </li>
              )}
              {whatsappNumbers.map((number) => (
                <li key={number}>
                  <a
                    href={buildWhatsAppContactUrl(number)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-white/70 transition hover:text-[#FFC107]"
                  >
                    <MessageCircle className="h-3.5 w-3.5 shrink-0 text-[#FFC107]" aria-hidden="true" />
                    WhatsApp {formatDisplayPhone(number)}
                  </a>
                </li>
              ))}
              {settings.email && (
                <li>
                  <a
                    href={buildMailtoUrl(settings.email)}
                    className="flex items-center gap-1.5 text-xs text-white/70 transition hover:text-[#FFC107]"
                  >
                    <Mail className="h-3.5 w-3.5 shrink-0 text-[#FFC107]" aria-hidden="true" />
                    {settings.email}
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Business hours */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.12em] text-[#FFC107]">Business Hours</h4>
            <ul className="mt-2 space-y-1 text-xs text-white/70">
              <li className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 shrink-0 text-[#FFC107]" aria-hidden="true" />
                Open 24/7
              </li>
              <li>{hours}</li>
            </ul>
          </div>
        </div>

        <div className="mt-5 space-y-2 border-t border-white/10 pt-4">
          <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
            <p className="text-center text-xs text-white/50 sm:text-left">
              © {year} {settings.business_name || PRIME_BRAND.displayName}. All rights reserved.
            </p>
            <div className="flex gap-3 text-xs text-white/50">
              <Link to="/privacy" className="transition hover:text-[#FFC107]">Privacy Policy</Link>
              <Link to="/terms" className="transition hover:text-[#FFC107]">Terms &amp; Conditions</Link>
            </div>
          </div>
          <p className="text-center text-xs text-white/40 sm:text-left">
            {DEVELOPER_CREDIT.label}{' '}
            <a
              href={DEVELOPER_CREDIT.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-white/55 transition hover:text-[#FFC107]"
            >
              {DEVELOPER_CREDIT.name}
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
