import { useEffect, type CSSProperties } from 'react'
import { assetWithWebp, preloadImage } from '@/lib/optimizedAssets'
import { cn } from '@/lib/utils'

interface OptimizedBackgroundProps {
  src: string
  alt?: string
  /** Eager load + preload (default true — backgrounds should appear without pop-in). */
  priority?: boolean
  className?: string
  imgClassName?: string
  style?: CSSProperties
}

/**
 * Decorative full-bleed background using WebP with PNG/JPG fallback.
 * Always renders at full opacity — no lazy fade-in.
 */
export function OptimizedBackground({
  src,
  alt = '',
  priority = true,
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
