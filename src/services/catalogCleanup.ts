import { clearAllCatalog, importAuraCatalog } from '@/services/catalogImport'

export interface CatalogCleanupResult {
  synced: number
  removedProducts: number
  removedCategories: number
  errors: string[]
}

/** Deletes all existing products/categories, then imports the Excel master catalogue. */
export async function applyCatalogCleanup(): Promise<CatalogCleanupResult> {
  const result = await importAuraCatalog({ force: true, replace: true })

  return {
    synced: result.productCount,
    removedProducts: result.removedProducts,
    removedCategories: result.removedCategories,
    errors: result.error ? [result.error] : [],
  }
}

/** Permanently deletes every product and category (empty catalogue). */
export async function clearCatalogOnly(): Promise<CatalogCleanupResult> {
  const result = await clearAllCatalog()

  return {
    synced: 0,
    removedProducts: result.removedProducts,
    removedCategories: result.removedCategories,
    errors: result.error ? [result.error] : [],
  }
}
