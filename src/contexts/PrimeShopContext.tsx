import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

interface PrimeShopContextValue {
  search: string
  setSearch: (value: string) => void
  activeCategory: string
  setActiveCategory: (id: string) => void
  categoryDrawerOpen: boolean
  setCategoryDrawerOpen: (open: boolean) => void
  scrollToShop: () => void
  scrollToCategory: (categoryId: string) => void
}

const PrimeShopContext = createContext<PrimeShopContextValue | undefined>(undefined)

export function PrimeShopProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('')
  const [categoryDrawerOpen, setCategoryDrawerOpen] = useState(false)

  const scrollToShop = useCallback(() => {
    const isHome = location.pathname === '/' || location.pathname === '/home'
    if (!isHome) {
      navigate('/#shop')
      return
    }
    document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [location.pathname, navigate])

  const scrollToCategory = useCallback(
    (categoryId: string) => {
      setActiveCategory(categoryId)
      const isHome = location.pathname === '/' || location.pathname === '/home'
      if (!isHome) {
        navigate('/#shop')
        return
      }
      scrollToShop()
      if (categoryId) {
        requestAnimationFrame(() => {
          document.getElementById(`category-${categoryId}`)?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
        })
      }
    },
    [location.pathname, navigate, scrollToShop],
  )

  return (
    <PrimeShopContext.Provider
      value={{
        search,
        setSearch,
        activeCategory,
        setActiveCategory,
        categoryDrawerOpen,
        setCategoryDrawerOpen,
        scrollToShop,
        scrollToCategory,
      }}
    >
      {children}
    </PrimeShopContext.Provider>
  )
}

export function usePrimeShop() {
  const ctx = useContext(PrimeShopContext)
  if (!ctx) throw new Error('usePrimeShop must be used within PrimeShopProvider')
  return ctx
}
