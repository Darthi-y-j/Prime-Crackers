import sharp from 'sharp'
import path from 'node:path'

const publicDir = path.resolve('public')
const source = path.join(publicDir, 'prime-logo.png')

/** Trim padding, then export crisp tab/PWA icons from the wolf logo. */
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

console.log('Favicon generation complete.')
