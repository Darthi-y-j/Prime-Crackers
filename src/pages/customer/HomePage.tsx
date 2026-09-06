import { SEO } from '@/components/shared/SEO'
import { JsonLd } from '@/components/shared/JsonLd'
import { PrimeHero } from '@/components/prime/PrimeHero'
import { PrimeServiceBar } from '@/components/prime/PrimeServiceBar'
import { PrimeCategoryGrid } from '@/components/prime/PrimeCategoryGrid'
import { PrimeShopCatalog } from '@/components/prime/PrimeShopCatalog'
import { PrimeWhyChooseBar } from '@/components/prime/PrimeWhyChooseBar'
import { useSettings } from '@/contexts/SettingsContext'
import { HOME_PAGE_DESCRIPTION, HOME_PAGE_TITLE } from '@/lib/siteConfig'
import { buildHomePageSchema } from '@/lib/structuredData'

export function HomePage() {
  const { settings } = useSettings()

  return (
    <>
      <SEO title={HOME_PAGE_TITLE} description={HOME_PAGE_DESCRIPTION} url="/" titleIsFull />
      <JsonLd data={buildHomePageSchema(settings)} />
      <PrimeHero />
      <PrimeServiceBar />
      <PrimeCategoryGrid />
      <PrimeWhyChooseBar />
      <PrimeShopCatalog />
    </>
  )
}
