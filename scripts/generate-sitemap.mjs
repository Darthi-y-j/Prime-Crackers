/**
 * Generates public/sitemap.xml from Supabase (when configured) or the local aura catalog fallback.
 * Run automatically before production builds via npm run build.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const SITE_URL = 'https://www.auracrackers.com'

const STATIC_ROUTES = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/products', changefreq: 'daily', priority: '0.9' },
  { path: '/categories', changefreq: 'weekly', priority: '0.9' },
  { path: '/about', changefreq: 'monthly', priority: '0.7' },
  { path: '/contact', changefreq: 'monthly', priority: '0.7' },
  { path: '/faq', changefreq: 'monthly', priority: '0.7' },
  { path: '/safety', changefreq: 'monthly', priority: '0.7' },
  { path: '/privacy', changefreq: 'yearly', priority: '0.5' },
  { path: '/terms', changefreq: 'yearly', priority: '0.5' },
  { path: '/gift-box', changefreq: 'monthly', priority: '0.7' },
]

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function readCatalogProductSlugs() {
  const catalogPath = path.join(ROOT, 'src/data/auraCatalog.ts')
  const source = fs.readFileSync(catalogPath, 'utf8')
  const productsSection = source.split('export const AURA_CATALOG_PRODUCTS')[1] ?? ''
  const slugs = [...productsSection.matchAll(/"slug": "([^"]+)"/g)].map((match) => match[1])
  return [...new Set(slugs)]
}

async function fetchSupabaseProductSlugs() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey || supabaseKey === 'your-anon-key-here') {
    return null
  }

  const headers = {
    apikey: supabaseKey,
    Authorization: `Bearer ${supabaseKey}`,
  }

  const endpoints = [
    `${supabaseUrl}/rest/v1/products?select=slug&is_active=eq.true&is_archived=eq.false&order=sort_order.asc`,
    `${supabaseUrl}/rest/v1/products?select=slug&is_active=eq.true&order=sort_order.asc`,
  ]

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, { headers })
      if (!response.ok) continue

      const rows = await response.json()
      if (!Array.isArray(rows) || rows.length === 0) continue

      const slugs = rows.map((row) => row.slug).filter(Boolean)
      if (slugs.length > 0) return [...new Set(slugs)]
    } catch {
      // Try next endpoint or fall back to catalog.
    }
  }

  return null
}

function buildSitemap(staticRoutes, productSlugs) {
  const lastmod = new Date().toISOString().slice(0, 10)

  const urlEntries = [
    ...staticRoutes.map(({ path: routePath, changefreq, priority }) => ({
      loc: routePath === '/' ? `${SITE_URL}/` : `${SITE_URL}${routePath}`,
      changefreq,
      priority,
    })),
    ...productSlugs.map((slug) => ({
      loc: `${SITE_URL}/products/${slug}`,
      changefreq: 'weekly',
      priority: '0.8',
    })),
  ]

  const body = urlEntries
    .map(
      ({ loc, changefreq, priority }) => `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`,
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`
}

async function main() {
  const supabaseSlugs = await fetchSupabaseProductSlugs()
  const productSlugs = supabaseSlugs ?? readCatalogProductSlugs()
  const source = supabaseSlugs ? 'Supabase' : 'aura catalog fallback'

  const xml = buildSitemap(STATIC_ROUTES, productSlugs)
  const outputPath = path.join(ROOT, 'public/sitemap.xml')
  fs.writeFileSync(outputPath, xml, 'utf8')

  console.log(
    `Generated sitemap with ${STATIC_ROUTES.length} static routes and ${productSlugs.length} product URLs (${source}).`,
  )
  console.log(`Written to ${outputPath}`)
}

main().catch((error) => {
  console.error('Failed to generate sitemap:', error)
  process.exit(1)
})
