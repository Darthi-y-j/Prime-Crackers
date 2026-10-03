/** Routes whose top hero/header image should show behind the fixed navbar. */
export function pathnameHasHeroUnderNav(pathname: string): boolean {
  if (pathname === '/' || pathname === '/home') return true
  if (pathname.startsWith('/account')) return true
  const exact = new Set([
    '/about',
    '/contact',
    '/safety',
    '/delivery',
    '/faq',
    '/wishlist',
    '/cart',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/privacy',
    '/terms',
    '/why-no-online-payment',
  ])

  return exact.has(pathname)
}
