import { DEVELOPER_CREDIT } from '@/lib/siteConfig'
import { PRIME_BRAND } from '@/lib/primeBrand'
import { Link } from 'react-router-dom'

const STOREFRONT_BG = '/prime-storefront-bg.png'

export function PrimeFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-slate-200 bg-white" data-reveal="fade-in">
      <div className="relative overflow-hidden px-4 py-8 text-center text-white">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${STOREFRONT_BG}')` }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#004D55]/72 via-[#004D55]/58 to-[#004D55]/48"
          aria-hidden="true"
        />

        <div className="relative z-10">
          <img
            src="/prime-logo.png?v=2"
            alt=""
            className="mx-auto h-16 w-16 rounded-full border-2 border-[#FFC107] shadow-lg"
          />
          <p className="font-display mt-3 text-lg font-extrabold uppercase tracking-wide text-[#FFC107] drop-shadow-sm">
            {PRIME_BRAND.displayName}
          </p>
          <p className="font-script mt-1 text-xl drop-shadow-sm">{PRIME_BRAND.tagline}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm font-medium">
            <Link to="/" className="transition hover:text-[#FFC107]">
              Home
            </Link>
            <Link to="/#shop" className="transition hover:text-[#FFC107]">
              Shop
            </Link>
            <Link to="/about" className="transition hover:text-[#FFC107]">
              About
            </Link>
            <Link to="/contact" className="transition hover:text-[#FFC107]">
              Contact
            </Link>
          </div>
        </div>
      </div>
      <div className="px-4 py-4">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 text-center text-sm text-slate-600 sm:flex-row sm:text-left">
          <p>
            © {year} {PRIME_BRAND.displayName} · Sivakasi, Tamil Nadu
          </p>
          <p className="text-xs text-slate-500">
            {DEVELOPER_CREDIT.label}{' '}
            <a href={DEVELOPER_CREDIT.url} target="_blank" rel="noopener noreferrer" className="text-[#004D55] hover:underline">
              {DEVELOPER_CREDIT.name}
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
