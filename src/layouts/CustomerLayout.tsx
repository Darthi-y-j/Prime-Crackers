import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from '@/components/customer/Navbar'
import { Footer } from '@/components/customer/Footer'
import { RouteSEO } from '@/components/shared/RouteSEO'
import { ToastContainer } from '@/components/customer/Toast'
import { CollectiveCartBar } from '@/components/customer/CollectiveCartBar'
import { Chatbot } from '@/components/customer/Chatbot'
import { ImportantNoticeModal } from '@/components/customer/ImportantNoticeModal'
import { HeroSlideProvider } from '@/contexts/HeroSlideContext'
import { getCategories } from '@/services/categories'
import { getProducts } from '@/services/products'
import { cn } from '@/lib/utils'

export function CustomerLayout() {
  const location = useLocation()

  useEffect(() => {
    if (location.pathname === '/') return
    void getCategories().catch(() => undefined)
    void getProducts({ sortBy: 'sort_order', lite: true }).catch(() => undefined)
  }, [location.pathname])
  const isCataloguePage = location.pathname === '/products'
  const isProductDetailPage = /^\/products\/[^/]+$/.test(location.pathname)
  const isCartPage = location.pathname === '/cart'
  const isHeroPage =
    location.pathname === '/' ||
    isCataloguePage ||
    location.pathname === '/gift-box' ||
    isProductDetailPage
  const hideChatbot = isCataloguePage || isProductDetailPage || isCartPage

  return (
    <HeroSlideProvider>
      <RouteSEO />
      <div className="flex min-h-screen min-w-0 flex-col overflow-x-clip">
        <ImportantNoticeModal />
        <Navbar />
        <main
          className={cn(
            'flex-1 min-w-0 overflow-x-clip',
            !isHeroPage && 'pt-14 sm:pt-[4.25rem]',
            isCataloguePage && 'pb-20 sm:pb-24',
            isProductDetailPage && 'pb-0',
            !isCataloguePage && !isProductDetailPage && 'pb-4',
          )}
        >
          <Outlet />
        </main>
        {!isCataloguePage && <Footer />}
        {!isProductDetailPage && !isCartPage && <CollectiveCartBar />}
        {!hideChatbot && <Chatbot />}
        <ToastContainer />
      </div>
    </HeroSlideProvider>
  )
}
