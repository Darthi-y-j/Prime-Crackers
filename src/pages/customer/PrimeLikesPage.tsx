import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, Trash2 } from 'lucide-react'
import { SEO } from '@/components/shared/SEO'
import { EmptyState } from '@/components/customer/EmptyState'
import { PageHeader } from '@/components/customer/PageHeader'
import { useWishlist } from '@/contexts/WishlistContext'
import { useCart } from '@/contexts/CartContext'
import { useToast } from '@/contexts/ToastContext'
import { formatPrice, getImageUrl, IMAGE_WIDTH } from '@/lib/utils'
import type { WishlistItem } from '@/types/database'

export function PrimeLikesPage() {
  const { items, removeItem, clearWishlist } = useWishlist()
  const { setCartItem } = useCart()
  const { showToast } = useToast()

  const handleAddToCart = (item: WishlistItem) => {
    setCartItem({
      productId: item.productId,
      productName: item.productName,
      slug: item.slug,
      imageUrl: item.imageUrl,
      price: item.price,
      quantity: 1,
    })
    showToast(`Added ${item.productName} to cart`, 'success')
  }

  const handleAddAllToCart = () => {
    for (const item of items) {
      setCartItem({
        productId: item.productId,
        productName: item.productName,
        slug: item.slug,
        imageUrl: item.imageUrl,
        price: item.price,
        quantity: 1,
      })
    }
    showToast(`Added ${items.length} item${items.length !== 1 ? 's' : ''} to cart`, 'success')
  }

  return (
    <>
      <SEO title="Liked Products" description="Your saved favourite crackers." noIndex />
      <PageHeader contentClassName="mx-auto max-w-7xl px-3 py-8 sm:px-6 sm:py-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 fill-[#FFC107] text-[#FFC107]" />
            <h1 className="font-display text-2xl font-extrabold uppercase tracking-wide text-white sm:text-3xl">
              Liked Products
            </h1>
          </div>
          {items.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleAddAllToCart}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#FFC107] px-4 py-2 text-sm font-bold text-[#004D55] hover:bg-[#FFD54F]"
              >
                <ShoppingCart className="h-4 w-4" />
                Add all to cart
              </button>
              <button
                type="button"
                onClick={clearWishlist}
                className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/20"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </PageHeader>
      <section className="mx-auto max-w-7xl px-3 py-8 sm:px-6 sm:py-10">
        {items.length === 0 ? (
          <EmptyState
            title="No liked products yet"
            description="Tap the heart on any product in the shop to save it here."
            action={
              <Link
                to="/#shop"
                className="inline-flex rounded-full bg-[#004D55] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#006670]"
              >
                Browse products
              </Link>
            }
          />
        ) : (
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <li
                key={item.productId}
                className="flex gap-3 rounded-xl border border-[#004D55]/15 bg-white p-3 shadow-sm"
              >
                <img
                  src={getImageUrl(item.imageUrl, '/placeholder-product.svg', IMAGE_WIDTH.thumb)}
                  alt=""
                  className="h-20 w-20 shrink-0 rounded-md border-2 border-[#FFC107] object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-[#1A1A1A]">{item.productName}</p>
                  <p className="mt-1 text-sm font-bold text-[#004D55]">
                    {item.price != null ? formatPrice(item.price) : 'Enquire'}
                  </p>
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleAddToCart(item)}
                      className="inline-flex flex-1 items-center justify-center gap-1 rounded-full bg-[#FFC107] px-3 py-1.5 text-xs font-bold text-[#004D55] hover:bg-[#FFD54F]"
                    >
                      <ShoppingCart className="h-3.5 w-3.5" />
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                      aria-label={`Remove ${item.productName} from liked`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  )
}
