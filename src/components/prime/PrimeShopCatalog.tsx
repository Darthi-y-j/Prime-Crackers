import { useEffect, useMemo, useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { PrimeProductGroupedViews } from './PrimeProductGroupedViews'
import { PrimeViewToggle } from './PrimeViewToggle'
import { LoadingState } from '@/components/customer/LoadingState'
import { groupProductsByCategory } from '@/components/customer/CategoryGroupedProducts'
import { getProducts, getCachedCatalogueProducts } from '@/services/products'
import { getCategories, getCachedCatalogueCategories } from '@/services/categories'
import { filterProductsByQuery } from '@/lib/productSearch'
import { logLandingPageApi } from '@/lib/landingPageApiLog'
import { PRODUCT_SORT_OPTIONS, sortProducts, type ProductSortOption } from '@/lib/productSort'
import { usePrimeShop } from '@/contexts/PrimeShopContext'
import { usePrimeProductViewMode } from '@/hooks/usePrimeProductViewMode'
import type { Category, Product } from '@/types/database'

function Sparkle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M12 2l1.4 4.3H18l-3.5 2.5 1.4 4.3L12 10.6 8.1 13.1l1.4-4.3L6 6.3h4.6L12 2z" />
    </svg>
  )
}

export function PrimeShopCatalog() {
  const { search, activeCategory, setCategoryDrawerOpen } = usePrimeShop()
  const [products, setProducts] = useState<Product[]>(() => getCachedCatalogueProducts() ?? [])
  const [categories, setCategories] = useState<Category[]>(() => getCachedCatalogueCategories() ?? [])
  const [loading, setLoading] = useState(() => !getCachedCatalogueProducts()?.length)
  const [sortBy, setSortBy] = useState<ProductSortOption>('sort_order')
  const [view, setView] = usePrimeProductViewMode('table')

  useEffect(() => {
    let cancelled = false
    logLandingPageApi('PrimeShopCatalog:fetch:start', {
      initialCategories: getCachedCatalogueCategories()?.length ?? 0,
      initialProducts: getCachedCatalogueProducts()?.length ?? 0,
    })
    void Promise.all([
      getCategories().catch(() => [] as Category[]),
      getProducts({ sortBy: 'sort_order', lite: true }).catch(() => [] as Product[]),
    ]).then(([cats, prods]) => {
      if (cancelled) return
      logLandingPageApi('PrimeShopCatalog:fetch:done', {
        categories: cats.length,
        products: prods.length,
      })
      setCategories(cats)
      setProducts(prods)
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!activeCategory || loading) return
    const timer = window.setTimeout(() => {
      document.getElementById(`category-${activeCategory}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }, 150)
    return () => window.clearTimeout(timer)
  }, [activeCategory, loading])

  const filteredProducts = useMemo(() => {
    let list = products
    if (search.trim()) list = filterProductsByQuery(list, search.trim())
    if (activeCategory) list = list.filter((p) => p.category_id === activeCategory)
    return sortProducts(list, sortBy)
  }, [products, search, activeCategory, sortBy])

  const groups = useMemo(
    () => groupProductsByCategory(filteredProducts, categories),
    [filteredProducts, categories],
  )

  const totalProducts = filteredProducts.length
  const activeCategoryName = categories.find((c) => c.id === activeCategory)?.name

  return (
    <section id="shop" className="relative scroll-mt-44 bg-white py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-2 sm:px-6">
        <div className="text-center" data-reveal>
          <div className="flex items-center justify-center gap-3">
            <Sparkle className="h-5 w-5 text-[#FF8C00]" />
            <h2 className="font-display text-2xl font-extrabold uppercase tracking-[0.12em] text-[#004D55] sm:text-3xl">
              All Products
            </h2>
            <Sparkle className="h-5 w-5 text-[#FF8C00]" />
          </div>
          <p className="mt-2 text-sm text-slate-500">
            Select quantity and add to cart — order via WhatsApp
          </p>
        </div>

        <div className="mt-5 rounded-lg border border-[#004D55]/10 bg-[#FFF8E1]/25 px-2 py-2 sm:mt-6 sm:rounded-xl sm:px-4 sm:py-3">
          <div className="flex w-full items-stretch gap-2">
            <p className="hidden shrink-0 text-sm text-slate-600 sm:block">
              Showing{' '}
              <span className="font-bold text-[#004D55]">{totalProducts}</span> product
              {totalProducts === 1 ? '' : 's'}
              {activeCategoryName && (
                <span>
                  {' '}
                  in <span className="font-semibold text-[#004D55]">{activeCategoryName}</span>
                </span>
              )}
            </p>

            <div className="flex min-w-0 flex-1 items-stretch gap-2 sm:ml-auto sm:flex-none sm:items-center">
              <PrimeViewToggle value={view} onChange={setView} className="shrink-0" />

              <button
                type="button"
                onClick={() => setCategoryDrawerOpen(true)}
                className="hidden items-center gap-2 rounded-lg border border-[#004D55]/20 bg-white px-3 py-2 text-sm font-semibold text-[#004D55] shadow-sm hover:bg-[#FFF8E1] sm:inline-flex"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Categories
              </button>

              <select
                id="prime-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as ProductSortOption)}
                aria-label="Sort products"
                className="min-w-0 flex-1 rounded-lg border border-[#004D55]/20 bg-white px-2.5 py-2 text-xs font-semibold text-[#004D55] shadow-sm outline-none focus:border-[#004D55] focus:ring-2 focus:ring-[#004D55]/15 sm:flex-none sm:px-3 sm:text-sm"
              >
                {PRODUCT_SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {(search.trim() || activeCategoryName) && (
            <p className="mt-1 truncate text-[10px] text-slate-500 sm:mt-0.5 sm:text-xs">
              {search.trim() && (
                <span>
                  Search: &ldquo;{search.trim()}&rdquo;
                  {activeCategoryName ? ' · ' : ''}
                </span>
              )}
              {activeCategoryName && (
                <span className="sm:hidden">
                  Category: <span className="font-semibold text-[#004D55]">{activeCategoryName}</span>
                </span>
              )}
            </p>
          )}
        </div>

        <div id="shop-table" className="mt-6">
          {loading ? (
            <LoadingState message="Loading products..." />
          ) : (
            <PrimeProductGroupedViews
              groups={groups}
              view={view}
              showCategoryHeaders={!activeCategory}
            />
          )}
        </div>
      </div>
    </section>
  )
}
