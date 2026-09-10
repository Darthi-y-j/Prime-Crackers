import { PRIME_BRAND } from '@/lib/primeBrand'
import { assetWithWebp, preloadImage } from '@/lib/optimizedAssets'

const AUTH_PATH_PREFIXES = ['/login', '/register', '/forgot-password', '/reset-password', '/account']
const AUTH_IMAGE_PATHS = [PRIME_BRAND.loginBg, PRIME_BRAND.loginCardBg, PRIME_BRAND.accountBg]

const HOME_PRIORITY_PATHS = [PRIME_BRAND.heroImage, PRIME_BRAND.festiveHeaderBg]

const DEFERRED_SITE_PATHS = [
  PRIME_BRAND.pageHeaderBg,
  PRIME_BRAND.contactCtaBg,
  PRIME_BRAND.safetyDosDontsBg,
  '/why-choose-bg.png',
  '/how-it-works-bg.png',
  '/premium-quality-card.png',
  '/wide-variety-card.png',
  '/browse-products-step-bg.png',
]

let bootPreloadStarted = false

function preloadPaths(paths: string[]): void {
  for (const path of paths) {
    preloadImage(assetWithWebp(path).webp)
  }
}

/** Run synchronously in main.tsx before React paints — uses current URL only. */
export function preloadRouteImages(pathname: string): void {
  if (pathname.startsWith('/admin/login')) {
    preloadPaths([PRIME_BRAND.loginBg])
    return
  }

  if (AUTH_PATH_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    preloadPaths(AUTH_IMAGE_PATHS)
    return
  }

  if (pathname === '/' || pathname === '/home') {
    preloadPaths(HOME_PRIORITY_PATHS)
  }
}

/** Warm cache after first paint — avoids competing with the current page's hero. */
export function preloadSiteImagesDeferred(pathname: string): void {
  if (bootPreloadStarted || typeof document === 'undefined') return
  bootPreloadStarted = true

  const isAuthRoute = AUTH_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )

  const runDeferred = () => {
    if (isAuthRoute) {
      preloadPaths(DEFERRED_SITE_PATHS)
      return
    }

    preloadPaths(DEFERRED_SITE_PATHS)
  }

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(runDeferred, { timeout: 4000 })
  } else {
    setTimeout(runDeferred, 1500)
  }
}
