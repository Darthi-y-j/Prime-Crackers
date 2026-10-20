/** IDs from removed embedded catalogue fallback — not valid Prime Supabase products. */
export function isEmbeddedCatalogProductId(productId: string | null | undefined): boolean {
  if (!productId) return false
  return productId.startsWith('static-prod-') || productId.startsWith('static-cat-')
}
