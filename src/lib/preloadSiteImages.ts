import { PRIME_BRAND } from '@/lib/primeBrand'
import { assetWithWebp, preloadImage } from '@/lib/optimizedAssets'

/** Key decorative assets — warm the cache as soon as the app boots. */
const SITE_IMAGE_PATHS = [
  PRIME_BRAND.heroImage,
  PRIME_BRAND.festiveHeaderBg,
  PRIME_BRAND.pageHeaderBg,
  PRIME_BRAND.accountBg,
  PRIME_BRAND.loginBg,
  PRIME_BRAND.loginCardBg,
  PRIME_BRAND.contactCtaBg,
  PRIME_BRAND.safetyDosDontsBg,
  '/why-choose-bg.png',
  '/how-it-works-bg.png',
  '/premium-quality-card.png',
  '/wide-variety-card.png',
  '/browse-products-step-bg.png',
]

let started = false

export function preloadSiteImages(): void {
  if (started || typeof document === 'undefined') return
  started = true

  for (const path of SITE_IMAGE_PATHS) {
    preloadImage(assetWithWebp(path).webp)
  }
}
