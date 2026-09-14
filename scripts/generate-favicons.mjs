import sharp from 'sharp'
import path from 'node:path'
import fs from 'node:fs'

const publicDir = path.resolve('public')
const source = path.join(publicDir, 'prime-logo.png')

/** Trim padding, then export crisp tab/PWA icons from the Prime logo. */
async function buildFavicon(size, outputName, trim = true) {
  let pipeline = sharp(source)
  if (trim) {
    pipeline = pipeline.trim({ threshold: 12 })
  }

  await pipeline
    .resize(size, size, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toFile(path.join(publicDir, outputName))

  console.log(`Wrote ${outputName} (${size}x${size})`)
}

await buildFavicon(32, 'favicon-32x32.png')
await buildFavicon(32, 'favicon.png')
await buildFavicon(192, 'favicon-192x192.png')
await buildFavicon(512, 'apple-touch-icon.png')

// Legacy browsers look for /favicon.ico at the site root.
const favicon32 = path.join(publicDir, 'favicon-32x32.png')
const faviconIco = path.join(publicDir, 'favicon.ico')
fs.copyFileSync(favicon32, faviconIco)
console.log('Wrote favicon.ico (copied from favicon-32x32.png)')

/** WhatsApp / Facebook share card — 1200×630 with the Prime logo (not a leftover brand). */
const OG_WIDTH = 1200
const OG_HEIGHT = 630
const OG_LOGO = 420
const logoBuffer = await sharp(source)
  .resize(OG_LOGO, OG_LOGO, {
    fit: 'contain',
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png()
  .toBuffer()

const ogCard = await sharp({
  create: {
    width: OG_WIDTH,
    height: OG_HEIGHT,
    channels: 3,
    background: { r: 0, g: 77, b: 85 },
  },
})
  .composite([
    {
      input: Buffer.from(
        `<svg width="${OG_WIDTH}" height="${OG_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="0" width="${OG_WIDTH}" height="12" fill="#FFC107"/>
          <rect x="0" y="${OG_HEIGHT - 12}" width="${OG_WIDTH}" height="12" fill="#FFC107"/>
        </svg>`,
      ),
      top: 0,
      left: 0,
    },
    { input: logoBuffer, gravity: 'centre' },
  ])
  .png()
  .toBuffer()

await sharp(ogCard).toFile(path.join(publicDir, 'og-share.png'))
console.log('Wrote og-share.png (1200x630 Prime share card)')

console.log('Favicon generation complete.')
