/** Shared SEO constants for build scripts (keep in sync with src/lib/siteConfig.ts). */
export const SITE_URL = 'https://www.primecracker.com'

/** Public indexable routes only — no auth, admin, or redirect-only paths. */
export const SITEMAP_STATIC_ROUTES = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/about', changefreq: 'monthly', priority: '0.8' },
  { path: '/contact', changefreq: 'monthly', priority: '0.8' },
  { path: '/faq', changefreq: 'monthly', priority: '0.7' },
  { path: '/delivery', changefreq: 'monthly', priority: '0.7' },
  { path: '/safety', changefreq: 'monthly', priority: '0.7' },
  { path: '/privacy', changefreq: 'yearly', priority: '0.5' },
  { path: '/terms', changefreq: 'yearly', priority: '0.5' },
]
