import { CATALOG_CATEGORIES, CATALOG_PRODUCTS } from '@/data/catalog'
import type { Category, Product } from '@/types/database'

function categoryId(slug: string): string {
  return `static-cat-${slug}`
}

function productId(slug: string): string {
  return `static-prod-${slug}`
}

/** Offline / API-failure fallback — same data as `src/data/catalog.ts`. */
export function getStaticCatalogCategories(): Category[] {
  const now = new Date(0).toISOString()
  return CATALOG_CATEGORIES.map((c) => ({
    id: categoryId(c.slug),
    name: c.name,
    slug: c.slug,
    description: c.description,
    image_url: null,
    sort_order: c.sort_order,
    is_active: true,
    is_archived: false,
    archived_at: null,
    created_at: now,
    updated_at: now,
  }))
}

export function getStaticCatalogProducts(): Product[] {
  const categories = getStaticCatalogCategories()
  const bySlug = new Map(categories.map((c) => [c.slug, c]))
  const now = new Date(0).toISOString()

  return CATALOG_PRODUCTS.filter((p) => p.is_available).map((p) => {
    const category = bySlug.get(p.category_slug)
    const category_id = category?.id ?? null
    return {
      id: productId(p.slug),
      category_id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      specifications: p.specifications,
      price: p.price,
      original_price: p.original_price,
      discount_percentage: p.discount_percentage,
      pieces: p.pieces,
      brand: p.brand,
      tag: p.tag,
      image_url: null,
      gallery_urls: null,
      video_url: null,
      youtube_url: null,
      stock_quantity: p.stock_quantity,
      stock_alert_limit: p.stock_alert_limit,
      is_available: p.is_available,
      is_featured: p.is_featured,
      is_recommended: p.is_recommended,
      is_best_seller: p.is_best_seller,
      is_archived: false,
      archived_at: null,
      sort_order: p.sort_order,
      created_at: now,
      updated_at: now,
      category: category ?? undefined,
    }
  })
}
