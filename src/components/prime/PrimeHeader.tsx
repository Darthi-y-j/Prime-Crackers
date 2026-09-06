import { useState, type FormEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShoppingCart, Search, User, Menu, X, Heart } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { useWishlist } from '@/contexts/WishlistContext'
import { usePrimeShop } from '@/contexts/PrimeShopContext'
import { SITE_LOGO_PATH } from '@/lib/siteConfig'
import { PRIME_BRAND } from '@/lib/primeBrand'
import { cn } from '@/lib/utils'

const NAV = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact Us' },
] as const

export function PrimeHeader() {
  const { isAdmin, isCustomer, user } = useAuth()
  const { itemCount } = useCart()
  const { itemCount: likedCount } = useWishlist()
  const { search, setSearch, scrollToShop } = usePrimeShop()
  const location = useLocation()
  const [headerSearch, setHeaderSearch] = useState(search)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    setSearch(headerSearch)
    scrollToShop()
    setMobileMenuOpen(false)
  }

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname === path

  const navLinkClass = (path: string) =>
    cn(
      'rounded-md px-3 py-2 text-sm font-semibold transition',
      isActive(path)
        ? 'bg-[#004D55]/10 text-[#004D55]'
        : 'text-slate-600 hover:bg-slate-50 hover:text-[#004D55]',
    )

  const accountPath = isAdmin ? '/admin' : user && isCustomer ? '/account' : '/login'
  const accountLabel = isAdmin ? 'Admin' : user && isCustomer ? 'Account' : 'Login'

  return (
    <header className="prime-header sticky top-0 z-50 border-b-2 border-[#004D55] bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-3 py-2 sm:px-6 sm:py-4">
        <div className="flex items-center gap-2 sm:gap-4">
          <Link to="/" className="flex min-w-0 flex-1 items-center gap-2 sm:flex-none sm:gap-3">
            <img
              src={SITE_LOGO_PATH}
              alt={PRIME_BRAND.displayName}
              className="h-10 w-10 shrink-0 rounded-full border-2 border-[#FFC107] object-cover sm:h-16 sm:w-16"
            />
            <div className="min-w-0">
              <p className="truncate font-display text-sm font-extrabold uppercase leading-tight text-[#004D55] sm:text-base lg:text-lg">
                {PRIME_BRAND.displayName}
              </p>
              <p className="hidden font-script text-base text-[#004D55]/80 sm:block lg:text-lg">
                {PRIME_BRAND.tagline}
              </p>
            </div>
          </Link>

          <form onSubmit={handleSearch} className="hidden min-w-0 flex-1 md:flex">
            <div className="flex w-full max-w-md overflow-hidden rounded-full border border-slate-200 lg:max-w-lg xl:max-w-xl">
              <input
                type="search"
                value={headerSearch}
                onChange={(e) => setHeaderSearch(e.target.value)}
                placeholder="Search crackers..."
                className="min-w-0 flex-1 px-4 py-2 text-sm outline-none"
              />
              <button
                type="submit"
                className="flex items-center gap-1 bg-[#004D55] px-4 py-2 text-sm font-semibold text-white hover:bg-[#006670]"
              >
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>
          </form>

          <div className="flex shrink-0 items-center gap-0.5 sm:gap-2">
            <nav className="hidden items-center gap-1 lg:flex">
              {NAV.map((link) => (
                <Link key={link.to} to={link.to} className={navLinkClass(link.to)}>
                  {link.label}
                </Link>
              ))}
            </nav>
            <Link
              to="/wishlist"
              className="relative rounded-md p-1.5 text-[#004D55] hover:bg-slate-50 sm:p-2"
              aria-label={`Liked products${likedCount > 0 ? `, ${likedCount} items` : ''}`}
            >
              <Heart className={cn('h-5 w-5 sm:h-6 sm:w-6', likedCount > 0 && 'fill-[#E65100] text-[#E65100]')} />
              {likedCount > 0 && (
                <span className="absolute right-0 top-0 flex h-5 min-w-5 -translate-y-1/4 translate-x-1/4 items-center justify-center rounded-full bg-[#FFC107] px-1 text-[10px] font-bold text-[#004D55]">
                  {likedCount > 99 ? '99+' : likedCount}
                </span>
              )}
            </Link>
            <Link
              to="/cart"
              className="relative rounded-md p-1.5 text-[#004D55] hover:bg-slate-50 sm:p-2"
              aria-label={`My Cart${itemCount > 0 ? `, ${itemCount} items` : ''}`}
            >
              <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
              {itemCount > 0 && (
                <span className="absolute right-0 top-0 flex h-5 min-w-5 -translate-y-1/4 translate-x-1/4 items-center justify-center rounded-full bg-[#FFC107] px-1 text-[10px] font-bold text-[#004D55]">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>
            <Link
              to={accountPath}
              title={accountLabel}
              className="relative z-10 flex items-center gap-1.5 rounded-md border border-transparent px-1.5 py-1.5 text-[#004D55] hover:border-[#004D55]/15 hover:bg-slate-50 sm:px-2.5 sm:py-2"
              aria-label={accountLabel}
            >
              <User className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" />
              <span className="hidden text-xs font-bold uppercase tracking-wide sm:inline">{accountLabel}</span>
            </Link>
            <button
              type="button"
              className="rounded-md p-1.5 text-[#004D55] hover:bg-slate-50 sm:p-2 lg:hidden"
              onClick={() => setMobileMenuOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="mt-3 border-t border-slate-100 pt-3 lg:hidden">
            <form onSubmit={handleSearch} className="mb-3 md:hidden">
              <div className="flex overflow-hidden rounded-full border border-slate-200">
                <input
                  type="search"
                  value={headerSearch}
                  onChange={(e) => setHeaderSearch(e.target.value)}
                  placeholder="Search crackers..."
                  className="min-w-0 flex-1 px-4 py-2.5 text-sm outline-none"
                />
                <button
                  type="submit"
                  className="bg-[#004D55] px-4 text-white"
                  aria-label="Search"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </form>
            <nav className="flex flex-col gap-1">
              {NAV.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={navLinkClass(link.to)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className={navLinkClass('/wishlist')}
              >
                Liked{likedCount > 0 ? ` (${likedCount})` : ''}
              </Link>
              <Link
                to={accountPath}
                onClick={() => setMobileMenuOpen(false)}
                className={navLinkClass(accountPath)}
              >
                {accountLabel}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
