import { PRIME_BRAND } from '@/lib/primeBrand'
import { assetWithWebp, preloadImage } from '@/lib/optimizedAssets'

const AUTH_PATH_PREFIXES = ['/login', '/register', '/forgot-password', '/reset-password', '/account']
const AUTH_IMAGE_PATHS = [PRIME_BRAND.loginBg, PRIME_BRAND.loginCardBg, PRIME_BRAND.accountBg]

/** Hero uses OptimizedBackground preload — avoid duplicate fetches. */
const HOME_PRIORITY_PATHS = [PRIME_BRAND.festiveHeaderBg]

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

