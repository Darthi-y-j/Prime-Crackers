import { memo } from 'react'
import { Eye, Minus, Plus, ShoppingCart } from 'lucide-react'
import type { Product } from '@/types/database'
import { getImageUrl, IMAGE_WIDTH, cn, truncate } from '@/lib/utils'
import { getDisplayBrand } from '@/lib/brand'
import { useProductCartState } from '@/hooks/useProductCartState'
import { WishlistButton } from '@/components/customer/WishlistButton'
import { ProductHighlightBadges } from '@/components/customer/ProductHighlightBadges'
import { ProductLink } from '@/components/customer/ProductLink'

function PrimeProductCardInner({ product }: { product: Product }) {
  const { inCart, quantity, price, originalPrice, handleQuantityChange, handleAddToCart } =
    useProductCartState(product)
  const brand = getDisplayBrand(product.brand)
  const hasDiscount = product.discount_percentage != null && product.discount_percentage > 0
  const available = product.is_available

  return (
    <article
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-[0_4px_20px_rgba(0,77,85,0.07)] ring-1 ring-slate-200/80 transition duration-300 sm:rounded-2xl hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,77,85,0.12)]',
        inCart && 'ring-2 ring-[#FFC107]',
      )}
    >
      <div className="relative overflow-hidden">
        <ProductLink product={product} className="block">
          <img
            src={getImageUrl(product.image_url, '/placeholder-product.svg', IMAGE_WIDTH.card)}
            alt=""
            className="aspect-[5/4] w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </ProductLink>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#004D55]/60 via-[#004D55]/10 to-transparent" />

        {hasDiscount && (
          <span className="absolute left-2 top-2 z-10 rounded-full bg-[#E65100] px-1.5 py-0.5 text-[9px] font-extrabold tracking-wide text-white shadow-md sm:left-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-[10px]">
            {product.discount_percentage}% OFF
          </span>
        )}

        <div className="absolute left-2 top-9 z-10 max-w-[calc(100%-3.5rem)] sm:left-3 sm:top-11">
          <ProductHighlightBadges product={product} compact />
        </div>

        <div className="absolute right-2 top-2 sm:right-2.5 sm:top-2.5">
          <WishlistButton
            product={product}
            size="sm"
            className="h-7 w-7 rounded-full bg-white/90 shadow-lg backdrop-blur-sm sm:h-8 sm:w-8"
          />
        </div>

        <ProductLink
          product={product}
          className="absolute bottom-2 right-2 inline-flex items-center gap-0.5 rounded-full bg-white/95 px-2 py-0.5 text-[9px] font-bold text-[#004D55] shadow-md backdrop-blur-sm transition hover:bg-[#004D55] hover:text-white sm:bottom-2.5 sm:right-2.5 sm:gap-1 sm:px-2.5 sm:py-1 sm:text-[10px]"
        >
          <Eye className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
          View
        </ProductLink>

        {!available && (
          <span className="absolute bottom-2.5 left-3 rounded-full bg-black/70 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
            Sold out
          </span>
        )}
      </div>

      <div className="relative flex flex-1 flex-col bg-gradient-to-b from-[#FFF8E1]/45 via-white to-white p-2.5 sm:p-4">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FFC107]/70 to-transparent"
          aria-hidden="true"
        />

        <ProductLink product={product} className="block">
          <h3 className="line-clamp-2 font-display text-[13px] font-extrabold leading-snug text-[#004D55] transition group-hover:text-[#006670] sm:text-[15px]">
            {product.name}
          </h3>
        </ProductLink>

        {(brand || product.pieces != null) && (
          <div className="mt-2 flex min-w-0 items-center gap-1.5 sm:mt-2.5 sm:flex-wrap sm:gap-2">
            {brand && (
              <span className="min-w-0 truncate rounded-full border border-[#FFC107]/60 bg-[#FFF8E1] px-2 py-0.5 text-[10px] font-bold text-[#004D55] sm:text-[11px]">
                {brand}
              </span>
            )}
            {product.pieces != null && (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#004D55] px-2 py-0.5 text-[9px] font-extrabold text-[#FFC107] shadow-sm sm:text-[10px]">
                <span className="h-1 w-1 rounded-full bg-[#FFC107]" aria-hidden="true" />
                {product.pieces} pcs
              </span>
            )}
          </div>
        )}

        {product.description?.trim() && (
          <p className="mt-2 hidden line-clamp-2 rounded-lg border-l-2 border-[#FFC107]/80 bg-white/80 px-2 py-1.5 text-[10px] leading-relaxed text-slate-600 sm:mt-2.5 sm:block sm:text-xs">
            {truncate(product.description, 100)}
          </p>
        )}

        <div className="relative mt-2.5 overflow-hidden rounded-xl border border-[#FFC107]/35 bg-gradient-to-br from-[#FFF8E1] via-white to-[#E8F5F6]/60 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] sm:mt-4 sm:p-3">
          <div
            className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full bg-[#FFC107]/15 blur-xl"
            aria-hidden="true"
          />

          <div className="relative flex items-end justify-between gap-1 sm:gap-2">
            <div className="min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#004D55]/55 sm:text-[10px]">
                Offer price
              </p>
              <div className="mt-0.5 flex min-w-0 flex-nowrap items-baseline gap-1.5 sm:gap-2">
                {originalPrice && (
                  <span className="shrink-0 text-[11px] font-semibold tabular-nums text-slate-400 line-through sm:text-sm">
                    {originalPrice}
                  </span>
                )}
                <span className="shrink-0 text-lg font-extrabold tabular-nums leading-none text-[#E65100] sm:text-2xl">
                  {price ?? 'Enquire'}
                </span>
              </div>
            </div>
            {hasDiscount && (
              <span className="shrink-0 rounded-full bg-gradient-to-r from-[#E65100] to-[#FF8C00] px-2 py-1 text-[9px] font-extrabold uppercase tracking-wide text-white shadow-sm sm:px-2.5 sm:text-[10px]">
                Save {product.discount_percentage}%
              </span>
            )}
          </div>

          <div className="relative mt-2 sm:mt-3">
            {!available && !inCart ? (
              <div className="flex h-9 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 text-[10px] font-semibold text-slate-500 sm:h-10 sm:text-xs">
                Not available right now
              </div>
            ) : inCart ? (
              <div className="flex h-9 items-center overflow-hidden rounded-lg bg-white shadow-[0_2px_10px_rgba(0,77,85,0.12)] ring-1 ring-[#004D55]/15 sm:h-10">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className="flex h-full w-9 items-center justify-center text-[#004D55] transition hover:bg-[#004D55]/5 sm:w-11"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
                <span className="flex h-full flex-1 items-center justify-center border-x border-[#004D55]/10 text-xs font-extrabold tabular-nums text-[#004D55] sm:text-sm">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="flex h-full w-9 items-center justify-center bg-gradient-to-r from-[#004D55] to-[#006670] text-white transition hover:from-[#006670] hover:to-[#00838f] sm:w-11"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-[#004D55] via-[#005a64] to-[#006670] text-xs font-extrabold uppercase tracking-wide text-white shadow-[0_4px_14px_rgba(0,77,85,0.28)] transition hover:shadow-[0_6px_18px_rgba(0,77,85,0.35)] sm:h-10 sm:gap-2 sm:text-sm"
              >
                <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Add to cart
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

export const PrimeProductCard = memo(PrimeProductCardInner)
