import sharp from 'sharp'
import path from 'node:path'
import fs from 'node:fs'

const publicDir = path.resolve('public')

/** Large decorative backgrounds — resized + WebP for faster page loads. */
const PAGE_BACKGROUNDS = [
  'hero-fireworks-bg.png',
  'contact-cta-bg.png',
  'page-header-bg.png',
  'about-header-bg.png',
  'festive-header-bg.png',
  'login-bg.png',
  'login-card-bg.png',
  'account-bg.png',
  'safety-dos-donts-bg.png',
  'why-choose-bg.png',
  'prime-storefront-bg.png',
  'about-our-story-bg.jpg',
  'about-visit-us-bg.jpg',
]

const MAX_WIDTH = 1920
const WEBP_QUALITY = 82

async function optimizeImage(filename) {
  const input = path.join(publicDir, filename)
  if (!fs.existsSync(input)) {
    console.warn(`Skip (missing): ${filename}`)
    return
  }

  const webpName = filename.replace(/\.(png|jpe?g)$/i, '.webp')
  const output = path.join(publicDir, webpName)
  const before = fs.statSync(input).size

  await sharp(input)
    .resize(MAX_WIDTH, null, { withoutEnlargement: true, fit: 'inside' })
    .webp({ quality: WEBP_QUALITY, effort: 4 })
    .toFile(output)

  const after = fs.statSync(output).size
  const saved = Math.round((1 - after / before) * 100)
  console.log(`Wrote ${webpName} (${formatKb(before)} → ${formatKb(after)}, −${saved}%)`)
}

function formatKb(bytes) {
  return `${Math.round(bytes / 1024)} KB`
}

for (const file of PAGE_BACKGROUNDS) {
  await optimizeImage(file)
}

console.log('Page background WebP optimization complete.')
