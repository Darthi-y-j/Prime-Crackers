import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SEO } from '@/components/shared/SEO'
import { JsonLd } from '@/components/shared/JsonLd'
import { CatalogueHero, CatalogueOverlap } from '@/components/customer/CatalogueHero'
import { CategoryCard } from '@/components/customer/CategoryCard'
import { LoadingState } from '@/components/customer/LoadingState'
import { EmptyState } from '@/components/customer/EmptyState'
import { getCategories } from '@/services/categories'
import { buildBreadcrumbPageSchema } from '@/lib/structuredData'
import type { Category } from '@/types/database'

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <SEO
        title="Categories"
        description="Browse all fireworks and cracker categories at Prime Crackers — sparklers, rockets, aerial crackers, and more."
        url="/categories"
      />
      <JsonLd
        data={buildBreadcrumbPageSchema([
          { name: 'Home', path: '/' },
          { name: 'Categories', path: '/categories' },
        ])}
      />

      <CatalogueHero withWave>
        <div className="max-w-2xl pb-8 sm:pb-10">
          <div className="mb-4 inline-flex rounded-full border border-gold-500/50 px-4 py-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-400">
              {loading ? 'Browse' : `${categories.length} Types`}
            </span>
          </div>
          <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-[3.25rem]">
            <span className="text-white">All </span>
            <span className="text-gold-400">Categories</span>
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70 sm:text-base">
            Pick a category to explore products — sparklers, rockets, chakkars, and more.
          </p>
        </div>
      </CatalogueHero>

      <CatalogueOverlap>
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          {loading ? (
            <LoadingState message="Loading categories..." />
          ) : categories.length === 0 ? (
            <EmptyState
              title="No categories yet"
              description="Check back soon — we're updating our catalogue."
              action={
                <Link
                  to="/products"
                  className="rounded-lg bg-gold-500 px-6 py-2.5 text-sm font-semibold text-navy-950 hover:bg-gold-400"
                >
                  Browse Products
                </Link>
              }
            />
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 lg:gap-6">
              {categories.map((cat) => (
                <CategoryCard key={cat.id} category={cat} />
              ))}
            </div>
          )}
        </div>
      </CatalogueOverlap>
    </>
  )
}
