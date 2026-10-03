import { useEffect } from 'react'
import { SEO } from '@/components/shared/SEO'
import { JsonLd } from '@/components/shared/JsonLd'
import { LazySection } from '@/components/customer/LazySection'
import { PrimeHero } from '@/components/prime/PrimeHero'
import { PrimeServiceBar } from '@/components/prime/PrimeServiceBar'
import { HomeSeoSection } from '@/components/prime/HomeSeoSection'
import { PrimeCategoryGrid } from '@/components/prime/PrimeCategoryGrid'
import { PrimeShopCatalog } from '@/components/prime/PrimeShopCatalog'
import { PrimeWhyChooseBar } from '@/components/prime/PrimeWhyChooseBar'
import { useSettings } from '@/contexts/SettingsContext'
import { HOME_PAGE_DESCRIPTION, HOME_PAGE_TITLE } from '@/lib/siteConfig'
import { buildHomePageSchema } from '@/lib/structuredData'
import { getCategories } from '@/services/categories'
import { getProducts } from '@/services/products'

export function HomePage() {
  const { settings } = useSettings()

  useEffect(() => {
    void getCategories()
    void getProducts({ sortBy: 'sort_order', lite: true })
  }, [])

  return (
    <>
      <SEO title={HOME_PAGE_TITLE} description={HOME_PAGE_DESCRIPTION} url="/" titleIsFull />
      <JsonLd data={buildHomePageSchema(settings)} />
      <PrimeHero />
      <PrimeServiceBar />
      <PrimeCategoryGrid />
      <PrimeShopCatalog />
      <LazySection minHeight="320px" rootMargin="200px 0px">
        <HomeSeoSection />
      </LazySection>
      <PrimeWhyChooseBar />
    </>
  )
}
