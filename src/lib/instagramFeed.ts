export interface InstagramFeedImage {
  src: string
  alt: string
}

export const INSTAGRAM_FEED_IMAGES: InstagramFeedImage[] = [
  { src: '/about-celebration-sparkler.jpg', alt: 'Festive sparkler celebration' },
  { src: '/premium-quality-card.webp', alt: 'Premium quality fireworks' },
  { src: '/wide-variety-card.webp', alt: 'Wide variety of crackers' },
  { src: '/special-colors-skyshot-bg.png', alt: 'Colour skyshot display' },
  { src: '/about-quality-products.png', alt: 'Prime Crackers product showcase' },
]

export function getInstagramHandle(instagramUrl?: string): string {
  if (!instagramUrl) return '@prime_crackers'
  const match = instagramUrl.match(/instagram\.com\/([^/?#]+)/i)
  if (match?.[1]) return `@${match[1]}`
  return instagramUrl.startsWith('@') ? instagramUrl : `@${instagramUrl}`
}
