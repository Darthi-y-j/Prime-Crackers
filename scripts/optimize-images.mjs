import sharp from 'sharp'
import { readdir } from 'node:fs/promises'
import path from 'node:path'

const publicDir = path.resolve('public')

const targets = [
  { name: 'image-of-website-mobile.png', maxWidth: 828 },
  { name: 'image-of-website.png', maxWidth: 1920 },
  { name: 'how-it-works-bg.png', maxWidth: 1600 },
  { name: 'premium-quality-card.png', maxWidth: 960 },
  { name: 'products-hero.png', maxWidth: 1600 },
]

for (const { name, maxWidth } of targets) {
  const input = path.join(publicDir, name)
  const output = path.join(publicDir, name.replace(/\.png$/i, '.webp'))

  const info = await sharp(input)
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality: 82, effort: 4 })
    .toFile(output)

  console.log(`${name} -> ${path.basename(output)} (${Math.round(info.size / 1024)} KB)`)
}
