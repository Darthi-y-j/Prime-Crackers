import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { SEO } from '@/components/shared/SEO'
import { CatalogueHero, CatalogueOverlap, CatalogueCountBadge, CataloguePanel } from '@/components/customer/CatalogueHero'
import { SearchBar } from '@/components/customer/SearchBar'
import { ProductCatalogue } from '@/components/customer/ProductCatalogue'
import { LoadingState } from '@/components/customer/LoadingState'
import { useProductViewMode } from '@/hooks/useProductViewMode'
import { getProducts, getCachedCatalogueProducts } from '@/services/products'
import { filterProductsByQuery } from '@/lib/productSearch'
import type { Product } from '@/types/database'

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [localQuery, setLocalQuery] = useState(query)
  const [catalogue, setCatalogue] = useState<Product[]>(() => getCachedCatalogueProducts() ?? [])
  const [loading, setLoading] = useState(() => !getCachedCatalogueProducts()?.length)
  const [view, setView] = useProductViewMode()

  useEffect(() => {
    setLocalQuery(query)
  }, [query])

  useEffect(() => {
    let cancelled = false

    void getProducts({ sortBy: 'sort_order', lite: true })
      .then((data) => {
        if (!cancelled) setCatalogue(data)
      })
      .catch(() => {
        if (!cancelled && !getCachedCatalogueProducts()?.length) setCatalogue([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const products = useMemo(() => {
    if (!query.trim()) return []
    return filterProductsByQuery(catalogue, query)
  }, [catalogue, query])

  const handleSearch = () => {
    setSearchParams(localQuery.trim() ? { q: localQuery } : {})
  }

  return (
    <>
      <SEO title="Search" description="Search our fireworks and crackers catalogue" noIndex />

      <CatalogueHero tall>
        <div className="max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-500/10 px-3.5 py-1">
            <Search className="h-3.5 w-3.5 text-gold-400" />
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold-400">
              Find Fireworks
            </span>
          </div>
          <h1 className="font-display text-3xl font-bold leading-tight text-cream-50 sm:text-4xl">
            Search{' '}
            <span className="bg-gradient-to-r from-gold-300 via-gold-400 to-festive-400 bg-clip-text text-transparent">
              Products
            </span>
          </h1>
          <p className="mt-3 text-base leading-relaxed text-cream-100/60">
            Look up crackers, sparklers, shells and more across our full catalogue.
          </p>
        </div>

        <div className="mt-6 max-w-xl">
          <SearchBar
            value={localQuery}
            onChange={setLocalQuery}
            onSubmit={handleSearch}
            variant="dark"
          />
        </div>
      </CatalogueHero>

      <CatalogueOverlap>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CataloguePanel>
            {query && !loading && (
              <CatalogueCountBadge>
                {products.length} result{products.length !== 1 ? 's' : ''}
              </CatalogueCountBadge>
            )}

            {loading ? (
              <LoadingState message="Searching..." />
            ) : query ? (
              <ProductCatalogue
                products={products}
                view={view}
                onViewChange={setView}
                columns={3}
                emptyTitle="No results found"
                emptyDescription={`No products match "${query}". Try a different spelling or a shorter keyword.`}
              />
            ) : (
              <p className="text-navy-700/70">Enter a search term to find products.</p>
            )}
          </CataloguePanel>
        </div>
      </CatalogueOverlap>
    </>
  )
}
