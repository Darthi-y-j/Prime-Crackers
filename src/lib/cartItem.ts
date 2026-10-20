import type { CartItem, Product } from '@/types/database'
import { isEmbeddedCatalogProductId } from '@/lib/catalogIds'

export function buildCartItemFromProduct(
  product: Product,
  quantity: number,
  price: number | null,
): CartItem {
  if (isEmbeddedCatalogProductId(product.id)) {
    throw new Error('Invalid product — refresh the page and add items from the live catalogue.')
  }
  return {
    productId: product.id,
    productName: product.name,
    slug: product.slug,
    imageUrl: product.image_url,
    price,
    pieces: product.pieces ?? null,
    description: product.description,
    quantity,
  }
}
