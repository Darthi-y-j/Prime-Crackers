import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { PrimeFilterDrawer } from '@/components/prime/PrimeFilterDrawer'
import { usePrimeShop } from '@/contexts/PrimeShopContext'
import { getCategories, getCachedCatalogueCategories } from '@/services/categories'
import type { Category } from '@/types/database'

function isElementInView(el: Element, topInset = 72): boolean {
  const rect = el.getBoundingClientRect()
  return rect.top < window.innerHeight && rect.bottom > topInset
}

export function PrimeCategoryTab() {
  const location = useLocation()
  const isHome = location.pathname === '/' || location.pathname === '/home'
  const {
    activeCategory,
    setActiveCategory,
    categoryDrawerOpen,
    setCategoryDrawerOpen,
    scrollToCategory,
    scrollToShop,
  } = usePrimeShop()
  const [categories, setCategories] = useState<Category[]>(() => getCachedCatalogueCategories() ?? [])
  const [shopVisible, setShopVisible] = useState(false)

  useEffect(() => {
    void getCategories()
      .then(setCategories)
      .catch(() => undefined)
  }, [])

  useEffect(() => {
    if (!isHome) {
      setShopVisible(false)
      return
    }

    let observer: IntersectionObserver | null = null
    let pollId: number | undefined
    let cancelled = false

    const getTarget = () => document.getElementById('shop-table') ?? document.getElementById('shop')

    const attachObserver = () => {
      const target = getTarget()
      if (!target || cancelled) return false

      observer?.disconnect()
      observer = new IntersectionObserver(
        ([entry]) => {
          if (!cancelled) setShopVisible(entry.isIntersecting)
        },
        { threshold: 0, rootMargin: '-72px 0px 0px 0px' },
      )
      observer.observe(target)
      setShopVisible(isElementInView(target))
      return true
    }

    if (!attachObserver()) {
      let attempts = 0
      pollId = window.setInterval(() => {
        attempts += 1
        if (attachObserver() || attempts >= 60) {
          window.clearInterval(pollId)
        }
      }, 100)
    }

    return () => {
      cancelled = true
      if (pollId) window.clearInterval(pollId)
      observer?.disconnect()
    }
  }, [isHome, location.pathname])

  useEffect(() => {
    if (!shopVisible && categoryDrawerOpen) {
      setCategoryDrawerOpen(false)
    }
  }, [shopVisible, categoryDrawerOpen, setCategoryDrawerOpen])

  const handleSelectCategory = (categoryId: string) => {
    if (!categoryId) {
      setActiveCategory('')
      scrollToShop()
      return
    }
    scrollToCategory(categoryId)
  }

  return (
    <PrimeFilterDrawer
      open={categoryDrawerOpen}
      onOpenChange={setCategoryDrawerOpen}
      categories={categories}
      activeCategory={activeCategory}
      onSelectCategory={handleSelectCategory}
      showTab={isHome && shopVisible}
    />
  )
}
