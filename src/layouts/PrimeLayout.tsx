import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { PrimeHeader } from '@/components/prime/PrimeHeader'
import { PrimeFooter } from '@/components/prime/PrimeFooter'
import { PrimeCartBar } from '@/components/prime/PrimeCartBar'
import { PrimeCategoryTab } from '@/components/prime/PrimeCategoryTab'
import { PrimeShopProvider } from '@/contexts/PrimeShopContext'
import { RouteSEO } from '@/components/shared/RouteSEO'
import { ToastContainer } from '@/components/customer/Toast'
import { ImportantNoticeModal } from '@/components/customer/ImportantNoticeModal'
import { getCategories } from '@/services/categories'
import { getProducts } from '@/services/products'
import { ScrollRevealInit } from '@/components/shared/ScrollRevealInit'
import { FloatingActionButtons } from '@/components/customer/FloatingActionButtons'
import { preloadSiteImagesDeferred } from '@/lib/preloadSiteImages'
import { cn } from '@/lib/utils'

export function PrimeLayout() {
  const location = useLocation()
  const isHome = location.pathname === '/' || location.pathname === '/home'
  const isCartPage = location.pathname === '/cart'
  const showCartBar =
    !isCartPage &&
    (isHome || location.pathname === '/wishlist' || location.pathname.startsWith('/products/'))

  useEffect(() => {
    preloadSiteImagesDeferred(location.pathname)
    void getCategories().catch(() => undefined)
    void getProducts({ sortBy: 'sort_order', lite: true }).catch(() => undefined)
  }, [location.pathname])

  useEffect(() => {
    if (location.hash === '#shop') {
      requestAnimationFrame(() => {
        document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })
      })
    }
  }, [location.hash])

  return (
    <PrimeShopProvider>
      <ScrollRevealInit />
      <div className="prime-shop flex min-h-screen flex-col bg-white">
        <RouteSEO />
        <ImportantNoticeModal />
        <PrimeHeader />
        <PrimeCategoryTab />
        <main className={cn('flex-1', showCartBar && 'pb-20')}>
          <Outlet />
        </main>
        <PrimeFooter />
        {showCartBar && <PrimeCartBar />}
        <FloatingActionButtons className={showCartBar ? 'bottom-24 sm:bottom-28' : undefined} />
        <ToastContainer />
      </div>
    </PrimeShopProvider>
  )
}
