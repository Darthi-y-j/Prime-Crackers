import { useEffect, type CSSProperties } from 'react'
import { assetWithWebp, preloadImage } from '@/lib/optimizedAssets'
import { cn } from '@/lib/utils'

interface OptimizedBackgroundProps {
  src: string
  alt?: string
  /** Above-the-fold backgrounds — eager load + high fetch priority */
  priority?: boolean
  className?: string
  imgClassName?: string
  style?: CSSProperties
}

/**
 * Decorative full-bleed background using WebP with PNG/JPG fallback.
 * Prefer this over CSS background-image for faster decode and browser prioritization.
 */
export function OptimizedBackground({
  src,
  alt = '',
  priority = false,
  className,
  imgClassName,
  style,
}: OptimizedBackgroundProps) {
  const { webp, fallback } = assetWithWebp(src)

  useEffect(() => {
    if (priority) preloadImage(webp)
  }, [priority, webp])

  return (
    <div
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
      aria-hidden={!alt}
      style={style}
    >
      <picture>
        <source type="image/webp" srcSet={webp} />
        <img
          src={fallback}
          alt={alt}
          decoding={priority ? 'sync' : 'async'}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          className={cn('h-full w-full object-cover object-center', imgClassName)}
        />
      </picture>
    </div>
  )
}
