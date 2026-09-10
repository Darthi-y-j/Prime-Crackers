/** Canonical production site URL — used for SEO meta tags and sitemap generation. */
export const SITE_URL = 'https://www.primecracker.com'

export const SITE_NAME = 'Prime Crackers'

/** Freelance / agency credit shown in the site footer. */
export const DEVELOPER_CREDIT = {
  label: 'Website designed & developed by',
  name: 'IHTRAD TECHNOLOGIES',
  url: 'https://www.ihtrad.com',
} as const

export const DEFAULT_DESCRIPTION =
  'Prime Crackers — We Bring Festivals. Buy Diwali crackers wholesale & retail from Sivakasi. Fancy items, rockets, sparklers & more. All-India delivery.'

/** Homepage document title — ~50 chars, aligned with on-page H1 keywords. */
export const HOME_PAGE_TITLE = 'Prime Crackers | Diwali Crackers Wholesale Sivakasi'

/** OG image dimensions (public/og-image.png). */
export const OG_IMAGE_WIDTH = 4167
export const OG_IMAGE_HEIGHT = 4167

/** Homepage meta description — natural brand + product intent without keyword stuffing. */
export const HOME_PAGE_DESCRIPTION =
  'Prime Crackers — We Bring Festivals. Buy Diwali crackers from Sivakasi at up to 50% off. Wholesale & retail fireworks with all-India delivery.'

/** Bump when favicon assets change — busts aggressive browser favicon cache. */
export const FAVICON_VERSION = '3'

/** Brand logo for navbar (circular PNG in /public). */
export const SITE_LOGO_FILE = '/prime-logo.png'
export const SITE_LOGO_PATH = `${SITE_LOGO_FILE}?v=${FAVICON_VERSION}`

/** Brand wordmark — same circular logo */
export const SITE_WORDMARK_FILE = '/prime-logo.png'
export const SITE_WORDMARK_PATH = `${SITE_WORDMARK_FILE}?v=${FAVICON_VERSION}`

/** Trimmed favicons generated from SITE_LOGO_FILE — use for browser tab / PWA. */
export const FAVICON_PATH = `/favicon.png?v=${FAVICON_VERSION}`
export const FAVICON_32_PATH = `/favicon-32x32.png?v=${FAVICON_VERSION}`
export const FAVICON_192_PATH = `/favicon-192x192.png?v=${FAVICON_VERSION}`
export const APPLE_TOUCH_ICON_PATH = `/apple-touch-icon.png?v=${FAVICON_VERSION}`
export const OG_IMAGE_PATH = '/og-image.png'
export const FAVICON_ICO_PATH = `/favicon.ico?v=${FAVICON_VERSION}`
export const FAVICON_URL = `${SITE_URL}${FAVICON_PATH.split('?')[0]}`
export const DEFAULT_OG_IMAGE = `${SITE_URL}${OG_IMAGE_PATH}`

/** Public social profiles for Organization schema (sameAs). */
export const BRAND_SOCIAL_PROFILES = [
  'https://www.instagram.com/primecrackers',
  'https://www.youtube.com/@primecrackers',
] as const

/** Static public routes included in the sitemap (no auth/admin/user-only pages). */
export const SITEMAP_STATIC_ROUTES = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/about', changefreq: 'monthly', priority: '0.8' },
  { path: '/contact', changefreq: 'monthly', priority: '0.8' },
  { path: '/faq', changefreq: 'monthly', priority: '0.7' },
  { path: '/delivery', changefreq: 'monthly', priority: '0.7' },
  { path: '/safety', changefreq: 'monthly', priority: '0.7' },
  { path: '/privacy', changefreq: 'yearly', priority: '0.5' },
  { path: '/terms', changefreq: 'yearly', priority: '0.5' },
] as const
