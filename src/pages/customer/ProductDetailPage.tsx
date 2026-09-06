import { useEffect, useState } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import { ChevronRight, Sparkles } from 'lucide-react'
import { SEO } from '@/components/shared/SEO'
import { JsonLd } from '@/components/shared/JsonLd'
import { ProductDetails } from '@/components/customer/ProductDetails'
import { ProductGrid } from '@/components/customer/ProductGrid'
import { LoadingState } from '@/components/customer/LoadingState'
import { EmptyState } from '@/components/customer/EmptyState'
import { getProductBySlug, getProductsByCategory } from '@/services/products'
import { readProductLinkState, preloadProductImage } from '@/lib/productLink'
import { formatPrice } from '@/lib/utils'
import { resolveProductPrice } from '@/lib/pricing'
import { SITE_NAME } from '@/lib/siteConfig'
import { buildProductPageSchema } from '@/lib/structuredData'
import type { Product } from '@/types/database'

const PRODUCT_DETAIL_BG = '/contact-section-bg.webp'
const PRODUCT_DETAIL_BG_FALLBACK = '/contact-section-bg.png'

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const location = useLocation()
  const previewProduct = readProductLinkState(location.state)
  const hasPreview = previewProduct?.slug === slug

  const [product, setProduct] = useState<Product | null>(hasPreview ? previewProduct : null)
  const [related, setRelated] = useState<Product[]>([])
  const [loading, setLoading] = useState(!hasPreview)

  useEffect(() => {
    if (hasPreview && previewProduct) {
      preloadProductImage(previewProduct.image_url)
    }
  }, [hasPreview, previewProduct])

  useEffect(() => {
    async function load() {
      if (!slug) return

      const cachedPreview = readProductLinkState(location.state)
      const canShowPreview = cachedPreview?.slug === slug
      if (!canShowPreview) {
        setProduct(null)
        setLoading(true)
      }

      try {
        const data = await getProductBySlug(slug)
        setProduct(data)

        if (data?.category_id) {
          getProductsByCategory(data.category_id)
            .then((relatedProducts) => {
              setRelated(relatedProducts.filter((p) => p.id !== data.id).slice(0, 4))
            })
            .catch(() => setRelated([]))
        } else {
          setRelated([])
        }
      } catch {
        if (!canShowPreview) setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [slug, location.state])

  if (loading && !product) {
    return <LoadingState fullPage message="Loading product..." />
  }

  if (!product) {
    return (
      <EmptyState
        title="Product Not Found"
        description="The product you're looking for doesn't exist or has been removed."
        action={
          <Link to="/products" className="rounded-lg bg-gold-500 px-6 py-2.5 text-sm font-semibold text-navy-950">
            Browse Products
          </Link>
        }
      />
    )
  }

  return (
    <>
      <SEO
        title={product.name}
        description={
          product.description?.trim() ||
          (() => {
            const price = resolveProductPrice(product)
            const priceText = price != null ? formatPrice(price) : null
            return priceText
              ? `${product.name} — ${priceText} at ${SITE_NAME}. Premium fireworks from Sivakasi.`
              : `${product.name} — premium fireworks from ${SITE_NAME}. Enquire on WhatsApp.`
          })()
        }
        image={product.image_url || undefined}
        url={`/products/${slug}`}
        type="website"
      />
      <JsonLd data={buildProductPageSchema(product, slug ?? product.slug)} />

      <div className="relative overflow-hidden pb-24 pt-14 sm:pt-[4.25rem] lg:pb-0">
        <picture className="pointer-events-none absolute inset-0">
          <source srcSet={PRODUCT_DETAIL_BG} type="image/webp" />
          <img
            src={PRODUCT_DETAIL_BG_FALLBACK}
            alt=""
            loading="eager"
            decoding="async"
            className="h-full w-full object-cover object-center"
          />
        </picture>
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy-950/70 via-navy-950/55 to-navy-950/75"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_40%,rgba(12,8,6,0.35),transparent_65%)]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_35%,rgba(245,158,11,0.12),transparent_60%)]"
          aria-hidden="true"
        />

        <div className="relative border-b border-white/10">
          <div className="mx-auto flex max-w-7xl items-center gap-1.5 px-4 py-3.5 text-xs sm:px-6 lg:px-8">
            <Link to="/products" className="font-medium text-cream-100/55 transition hover:text-gold-300">
              Products
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-gold-500/40" />
            {product.category && (
              <>
                <Link
                  to={`/products?category=${product.category.id}`}
                  className="truncate font-medium text-cream-100/55 transition hover:text-gold-300"
                >
                  {product.category.name}
                </Link>
                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-gold-500/40" />
              </>
            )}
            <span className="truncate font-semibold text-gold-300">{product.name}</span>
          </div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-gold-500/35 bg-gold-500/10 px-2.5 py-0.5">
            <Sparkles className="h-3 w-3 text-gold-400" />
            <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-gold-300">
              Product Details
            </span>
          </div>

          <ProductDetails product={product} />
        </div>
      </div>

      {related.length > 0 && (
        <section className="bg-white py-12 pb-24 sm:py-14 lg:pb-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-festive-500">
              You may also like
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold text-navy-900 sm:text-3xl">
              Related Products
            </h2>
            <div className="mt-6">
              <ProductGrid products={related} columns={4} />
            </div>
          </div>
        </section>
      )}
    </>
  )
}
