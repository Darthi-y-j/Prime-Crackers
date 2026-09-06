import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, MessageCircle, Clock } from 'lucide-react'
import { useSettings } from '@/contexts/SettingsContext'
import { buildWhatsAppContactUrl, buildTelUrl, buildMailtoUrl } from '@/lib/whatsapp'
import { formatDisplayPhone, getWhatsAppNumbers } from '@/lib/businessInfo'
import { DEVELOPER_CREDIT } from '@/lib/siteConfig'

export function Footer() {
  const { settings } = useSettings()
  const currentYear = new Date().getFullYear()
  const whatsappNumbers = getWhatsAppNumbers(settings)

  return (
    <footer className="bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="relative h-14 w-44 max-w-full sm:h-16 sm:w-52">
              <img
                src="/prime-logo.svg"
                alt={settings.business_name}
                className="pointer-events-none absolute left-0 top-1/2 h-full w-auto max-w-full -translate-y-1/2 object-contain select-none"
                draggable={false}
              />
            </div>
            {settings.tagline && (
              <p className="mt-2 text-sm text-white/60">{settings.tagline}</p>
            )}
            {settings.address && (
              <div className="mt-4 flex items-start gap-2 text-sm text-white/70">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
                <span className="whitespace-pre-line">{settings.address}</span>
              </div>
            )}
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gold-400">Quick Links</h4>
            <ul className="mt-4 space-y-2">
              {[
                { to: '/products', label: 'Products' },
                { to: '/gift-box', label: 'Gift Box' },
                { to: '/about', label: 'About Us' },
                { to: '/contact', label: 'Contact' },
                { to: '/faq', label: 'FAQ' },
                { to: '/safety', label: 'Safety Guide' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-white/70 transition hover:text-gold-400">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gold-400">Contact</h4>
            <ul className="mt-4 space-y-3">
              {settings.phone && (
                <li>
                  <a href={buildTelUrl(settings.phone)} className="flex items-center gap-2 text-sm text-white/70 transition hover:text-gold-400">
                    <Phone className="h-4 w-4 text-gold-500" />
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
                    className="flex items-center gap-2 text-sm text-white/70 transition hover:text-gold-400"
                  >
                    <MessageCircle className="h-4 w-4 text-gold-500" />
                    WhatsApp {formatDisplayPhone(number)}
                  </a>
                </li>
              ))}
              {settings.email && (
                <li>
                  <a href={buildMailtoUrl(settings.email)} className="flex items-center gap-2 text-sm text-white/70 transition hover:text-gold-400">
                    <Mail className="h-4 w-4 text-gold-500" />
                    {settings.email}
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gold-400">Business Hours</h4>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gold-500" />
                Open 24/7
              </li>
              {settings.business_hours.weekdays && (
                <li>{settings.business_hours.weekdays}</li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-10 space-y-4 border-t border-white/10 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-white/50">
              &copy; {currentYear} {settings.business_name}. All rights reserved.
            </p>
            <div className="flex gap-4 text-sm text-white/50">
              <Link to="/privacy" className="hover:text-gold-400">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-gold-400">Terms &amp; Conditions</Link>
            </div>
          </div>
          <p className="text-center text-xs text-white/35 sm:text-left">
            {DEVELOPER_CREDIT.label}{' '}
            {DEVELOPER_CREDIT.url ? (
              <a
                href={DEVELOPER_CREDIT.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-white/50 transition hover:text-gold-400/80"
              >
                {DEVELOPER_CREDIT.name}
              </a>
            ) : (
              <span className="font-semibold text-white/50">{DEVELOPER_CREDIT.name}</span>
            )}
          </p>
        </div>
      </div>
    </footer>
  )
}
