import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Gift, Plus, Minus, Trash2, Search, ArrowRight, ShoppingBag, Sparkles, Package, PartyPopper } from 'lucide-react'
import { SEO } from '@/components/shared/SEO'
import { CatalogueHero, CatalogueOverlap } from '@/components/customer/CatalogueHero'
import { LoadingState } from '@/components/customer/LoadingState'
import { EmptyState } from '@/components/customer/EmptyState'
import { ProductBrandBadge } from '@/components/customer/ProductBrandBadge'
import { useCart } from '@/contexts/CartContext'
import { useToast } from '@/contexts/ToastContext'
import { getProducts, getCachedCatalogueProducts } from '@/services/products'
import { getCategories, getCachedCatalogueCategories } from '@/services/categories'
import { resolveProductPrice } from '@/lib/pricing'
import { filterProductsByQuery } from '@/lib/productSearch'
import { createGiftBoxCartItem, giftBoxItemCount, giftBoxLineTotal } from '@/lib/giftBox'
import { formatPrice, getImageUrl, IMAGE_WIDTH, cn } from '@/lib/utils'
import type { Category, GiftBoxContentItem, Product } from '@/types/database'

const DRAFT_KEY = 'prime-gift-box-draft'

const STEPS = [
  { icon: Search, title: 'Pick products', text: 'Search and add your favourite crackers' },
  { icon: Gift, title: 'Pack the box', text: 'Review items in your gift box panel' },
  { icon: ShoppingBag, title: 'Send enquiry', text: 'Add to cart and checkout on WhatsApp' },
] as const

function loadDraft(): GiftBoxContentItem[] {
  try {
    const stored = localStorage.getItem(DRAFT_KEY)
    return stored ? (JSON.parse(stored) as GiftBoxContentItem[]) : []
  } catch {
    return []
  }
}

function saveDraft(items: GiftBoxContentItem[]) {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(items))
}

function GiftBoxProductRow({
  product,
  inBoxQty,
  onAdd,
}: {
  product: Product
  inBoxQty: number
  onAdd: () => void
}) {
  const price = resolveProductPrice(product)
  const hasDiscount = product.discount_percentage != null && product.discount_percentage > 0

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-gold-500/12 bg-gradient-to-r from-navy-950 via-navy-950 to-[#1a120e] p-3 shadow-[0_8px_28px_rgba(0,0,0,0.28)] transition duration-300 hover:border-gold-400/30 hover:shadow-[0_12px_36px_rgba(245,158,11,0.12)] sm:p-3.5">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/50 to-transparent opacity-70" aria-hidden="true" />

      <div className="flex items-center gap-3 sm:gap-4">
        <div className="relative shrink-0 overflow-hidden rounded-xl bg-[#1a120e] ring-1 ring-white/10">
          <img
            src={getImageUrl(product.image_url, '/placeholder-product.svg', IMAGE_WIDTH.thumb)}
            alt=""
            className="h-16 w-16 object-cover transition duration-300 group-hover:scale-105 sm:h-[4.5rem] sm:w-[4.5rem]"
          />
          {hasDiscount && (
            <span className="absolute inset-x-0 top-0 bg-gradient-to-r from-festive-500 to-gold-500 py-0.5 text-center text-[8px] font-bold text-navy-950">
              {product.discount_percentage}% OFF
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-product-name truncate text-sm font-bold text-cream-100 sm:text-base">{product.name}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            {product.category?.name && (
              <span className="text-[10px] font-semibold uppercase tracking-wider text-gold-400/55">
                {product.category.name}
              </span>
            )}
            {product.brand?.trim() ? (
              <ProductBrandBadge brand={product.brand} variant="overlay" className="h-5 px-1.5 text-[8px]" />
            ) : null}
            {product.pieces != null && product.pieces >= 1 ? (
              <span className="text-[10px] text-white/35">{product.pieces} pcs</span>
            ) : null}
          </div>
          <p className="mt-1.5 text-sm font-bold tabular-nums text-gold-300 sm:text-base">
            {formatPrice(price) || (
              <span className="bg-gradient-to-r from-gold-300 to-amber-400 bg-clip-text text-transparent">Enquire</span>
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={onAdd}
          className={cn(
            'inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all active:scale-95 sm:px-4 sm:text-sm',
            inBoxQty > 0
              ? 'bg-gold-500/20 text-gold-300 ring-1 ring-gold-400/40 hover:bg-gold-500/30'
              : 'bg-gradient-to-r from-festive-500 to-gold-500 text-navy-950 shadow-[0_4px_16px_rgba(234,88,12,0.35)] hover:brightness-110',
          )}
        >
          <Plus className="h-4 w-4" />
          {inBoxQty > 0 ? `In box · ${inBoxQty}` : 'Add'}
        </button>
      </div>
    </article>
  )
}

export function GiftBoxPage() {
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { showToast } = useToast()
  const [products, setProducts] = useState<Product[]>(() => getCachedCatalogueProducts() ?? [])
  const [categories, setCategories] = useState<Category[]>(() => getCachedCatalogueCategories() ?? [])
  const [loading, setLoading] = useState(() => !getCachedCatalogueProducts()?.length)
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [boxItems, setBoxItems] = useState<GiftBoxContentItem[]>(loadDraft)

  useEffect(() => {
    let cancelled = false
    void getCategories()
      .then((cats) => {
        if (!cancelled) setCategories(cats)
      })
      .catch(() => {
        if (!cancelled && !getCachedCatalogueCategories()?.length) setCategories([])
      })

    void getProducts({ sortBy: 'sort_order', lite: true })
      .then((prods) => {
        if (!cancelled) setProducts(prods)
      })
      .catch(() => {
        if (!cancelled && !getCachedCatalogueProducts()?.length) setProducts([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    saveDraft(boxItems)
  }, [boxItems])

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => product.is_available)
    if (categoryId) result = result.filter((product) => product.category_id === categoryId)
    if (search.trim()) result = filterProductsByQuery(result, search)
    return result
  }, [products, categoryId, search])

  const boxCount = giftBoxItemCount(boxItems)
  const boxTotal = giftBoxLineTotal(boxItems)

  const addToBox = (product: Product) => {
    const price = resolveProductPrice(product)
    setBoxItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id)
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }
      return [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          quantity: 1,
          price,
          imageUrl: product.image_url,
        },
      ]
    })
    showToast(`Added ${product.name} to gift box`, 'success')
  }

  const updateBoxQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      setBoxItems((prev) => prev.filter((item) => item.productId !== productId))
      return
    }
    setBoxItems((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, quantity } : item)),
    )
  }

  const addBoxToCart = () => {
    if (boxItems.length === 0) {
      showToast('Add at least one product to the gift box.', 'error')
      return
    }
    addItem(createGiftBoxCartItem(boxItems), 1)
    setBoxItems([])
    saveDraft([])
    showToast('Gift box added to cart', 'success')
    navigate('/cart')
  }

  return (
    <>
      <SEO
        title="Build a Gift Box"
        description="Create a custom fireworks gift box. Choose your products, review the box, and send an enquiry on WhatsApp."
        url="/gift-box"
      />

      <CatalogueHero withWave>
        <div className="max-w-2xl pb-8 sm:pb-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold-500/50 bg-black/20 px-4 py-1 backdrop-blur-sm">
            <Gift className="h-3.5 w-3.5 text-gold-400" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-400">
              Custom Gift Box
            </span>
          </div>
          <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl">
            <span className="text-white">Build Your </span>
            <span className="bg-gradient-to-r from-gold-300 via-gold-400 to-festive-400 bg-clip-text text-transparent">
              Gift Box
            </span>
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70 sm:text-base">
            Pick the fireworks you want, pack them into a gift box, and add it to your enquiry cart.
          </p>
        </div>
      </CatalogueHero>

      <CatalogueOverlap>
        <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          {loading ? (
            <LoadingState message="Loading products..." />
          ) : products.length === 0 ? (
            <EmptyState
              title="No products available"
              description="Add products in admin to start building gift boxes."
              action={
                <Link to="/products" className="rounded-lg bg-gold-500 px-6 py-2.5 text-sm font-semibold text-navy-950">
                  Browse Products
                </Link>
              }
            />
          ) : (
            <>
              <div className="mb-6 grid gap-3 sm:grid-cols-3">
                {STEPS.map(({ icon: Icon, title, text }, index) => (
                  <div
                    key={title}
                    className="relative overflow-hidden rounded-2xl border border-gold-500/15 bg-gradient-to-br from-cream-50 via-white to-amber-50/40 p-4 shadow-[0_4px_20px_rgba(12,8,6,0.05)]"
                  >
                    <span className="absolute right-3 top-2 font-display text-3xl font-bold text-gold-500/10">
                      {index + 1}
                    </span>
                    <div className="flex items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-festive-500/15 to-gold-500/20 ring-1 ring-gold-400/25">
                        <Icon className="h-5 w-5 text-festive-600" />
                      </span>
                      <div>
                        <p className="font-display text-sm font-bold text-navy-900">{title}</p>
                        <p className="mt-0.5 text-xs leading-relaxed text-navy-700/60">{text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid items-start gap-6 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_380px]">
                <div className="order-2 min-w-0 lg:order-1">
                  <div className="mb-4 overflow-hidden rounded-2xl border border-navy-900/8 bg-white p-3 shadow-[0_4px_20px_rgba(12,8,6,0.05)] sm:p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <Package className="h-4 w-4 text-festive-500" />
                      <h2 className="font-display text-base font-bold text-navy-900 sm:text-lg">Choose products</h2>
                      <span className="ml-auto rounded-full bg-navy-900/5 px-2.5 py-0.5 text-[10px] font-bold tabular-nums text-navy-700/55">
                        {filteredProducts.length} available
                      </span>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <div className="relative min-w-0 flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-700/35" />
                        <input
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          placeholder="Search products to add..."
                          className="w-full rounded-xl border border-navy-900/10 bg-cream-50/80 py-2.5 pl-9 pr-3 text-sm text-navy-900 placeholder:text-navy-700/40 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/20"
                        />
                      </div>
                      <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className="rounded-xl border border-navy-900/10 bg-cream-50/80 px-3 py-2.5 text-sm text-navy-900 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/20"
                      >
                        <option value="">All Categories</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {filteredProducts.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-navy-900/15 bg-cream-50/50 px-4 py-12 text-center">
                        <PartyPopper className="mx-auto h-8 w-8 text-navy-700/25" />
                        <p className="mt-3 text-sm font-medium text-navy-700/60">No matching products.</p>
                      </div>
                    ) : (
                      filteredProducts.map((product) => {
                        const inBox = boxItems.find((item) => item.productId === product.id)
                        return (
                          <GiftBoxProductRow
                            key={product.id}
                            product={product}
                            inBoxQty={inBox?.quantity ?? 0}
                            onAdd={() => addToBox(product)}
                          />
                        )
                      })
                    )}
                  </div>
                </div>

                <aside className="order-1 lg:sticky lg:top-24 lg:order-2">
                  <div className="overflow-hidden rounded-2xl border border-gold-500/20 bg-white shadow-[0_12px_40px_rgba(12,8,6,0.12)]">
                    <div className="relative overflow-hidden border-b border-gold-500/15 bg-navy-950 px-4 py-4 sm:px-5">
                      <div
                        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_100%_at_0%_0%,rgba(245,158,11,0.2),transparent_60%)]"
                        aria-hidden="true"
                      />
                      <div className="relative flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-gold-400/20 to-festive-500/15 ring-1 ring-gold-400/35 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
                          <Gift className="h-5 w-5 text-gold-400" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <h2 className="font-display text-lg font-bold text-cream-50">Your Gift Box</h2>
                          <p className="text-xs text-cream-100/55">
                            {boxCount > 0
                              ? `${boxCount} item${boxCount === 1 ? '' : 's'} packed and ready`
                              : 'Waiting for your picks'}
                          </p>
                        </div>
                        {boxCount > 0 && (
                          <span className="flex h-8 min-w-8 items-center justify-center rounded-full bg-gold-500 text-xs font-bold text-navy-950">
                            {boxCount}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="max-h-[28rem] overflow-y-auto bg-gradient-to-b from-cream-50/80 to-white p-4">
                      {boxItems.length === 0 ? (
                        <div className="flex flex-col items-center rounded-xl border border-dashed border-gold-500/25 bg-gold-500/[0.04] px-4 py-10 text-center">
                          <Sparkles className="h-8 w-8 text-gold-500/40" />
                          <p className="mt-3 text-sm font-semibold text-navy-900">Your box is empty</p>
                          <p className="mt-1 max-w-[14rem] text-xs leading-relaxed text-navy-700/55">
                            Tap Add on any product to start building a custom gift box.
                          </p>
                        </div>
                      ) : (
                        <ul className="space-y-2.5">
                          {boxItems.map((item) => (
                            <li
                              key={item.productId}
                              className="flex gap-3 rounded-xl border border-navy-900/8 bg-white p-2.5 shadow-sm"
                            >
                              <img
                                src={getImageUrl(item.imageUrl, '/placeholder-product.svg', IMAGE_WIDTH.thumb)}
                                alt=""
                                className="h-12 w-12 shrink-0 rounded-lg object-cover ring-1 ring-navy-900/8"
                              />
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-navy-900">{item.productName}</p>
                                <p className="text-xs font-bold tabular-nums text-festive-600">
                                  {formatPrice(item.price) || 'Enquire'}
                                </p>
                                <div className="mt-1.5 flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => updateBoxQuantity(item.productId, item.quantity - 1)}
                                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-navy-900/10 bg-cream-50 text-navy-800 transition hover:border-gold-400/40"
                                    aria-label="Decrease"
                                  >
                                    <Minus className="h-3 w-3" />
                                  </button>
                                  <span className="min-w-6 text-center text-sm font-bold tabular-nums text-navy-900">
                                    {item.quantity}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => updateBoxQuantity(item.productId, item.quantity + 1)}
                                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-navy-900/10 bg-cream-50 text-navy-800 transition hover:border-gold-400/40"
                                    aria-label="Increase"
                                  >
                                    <Plus className="h-3 w-3" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => updateBoxQuantity(item.productId, 0)}
                                    className="ml-auto rounded-lg p-1 text-navy-700/35 transition hover:bg-red-50 hover:text-red-500"
                                    aria-label={`Remove ${item.productName}`}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="border-t border-navy-900/8 bg-white p-4 sm:p-5">
                      <div className="mb-4 flex items-end justify-between gap-3 rounded-xl bg-gradient-to-r from-cream-50 to-amber-50/50 px-3.5 py-3 ring-1 ring-gold-500/15">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-navy-700/50">
                            Estimated total
                          </p>
                          <p className="font-display text-xl font-bold tabular-nums text-navy-900 sm:text-2xl">
                            {formatPrice(boxTotal) || 'Enquire'}
                          </p>
                        </div>
                        <Gift className="h-8 w-8 text-gold-500/25" aria-hidden="true" />
                      </div>
                      <button
                        type="button"
                        onClick={addBoxToCart}
                        disabled={boxItems.length === 0}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-festive-500 to-gold-500 py-3.5 text-sm font-bold text-navy-950 shadow-[0_6px_20px_rgba(234,88,12,0.3)] transition hover:brightness-110 disabled:opacity-50 disabled:shadow-none"
                      >
                        <ShoppingBag className="h-4 w-4" />
                        Add gift box to cart
                        <ArrowRight className="h-4 w-4" />
                      </button>
                      {boxItems.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setBoxItems([])}
                          className="mt-2.5 w-full text-center text-xs font-medium text-navy-700/45 transition hover:text-red-600"
                        >
                          Clear box
                        </button>
                      )}
                    </div>
                  </div>
                </aside>
              </div>
            </>
          )}
        </div>
      </CatalogueOverlap>
    </>
  )
}
