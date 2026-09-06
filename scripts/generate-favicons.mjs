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

console.log('Favicon generation complete.')
