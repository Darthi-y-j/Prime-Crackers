import { useMemo } from 'react'
import type { CSSProperties } from 'react'
import { Award } from 'lucide-react'
import { usePauseWhenHidden } from '@/hooks/usePauseWhenHidden'
import { cn } from '@/lib/utils'
import { TitleHighlight } from './TitleHighlight'

const BRANDS = [
  { name: 'Vadivel', src: '/brands/vadivel.png', dark: false },
  { name: 'Spnka', src: '/brands/spnka.png', dark: true },
  { name: "Ayyan's", src: '/brands/ayyans.jpg', dark: false },
  { name: "Doctor's", src: '/brands/doctors.jpg', dark: true },
  { name: 'Sri Chakra', src: '/brands/sri-chakra.jpg', dark: false },
  { name: 'Doctors Fireworks', src: '/brands/doctors-sivakasi.jpg', dark: true },
  { name: 'Cheeta Pandyan', src: '/brands/cheeta-pandyan.jpg', dark: false },
  { name: 'Reshma Fireworks', src: '/brands/reshma.png', dark: true, scale: 1.3 },
  { name: 'Mothers', src: '/brands/mothers.png', dark: false },
  { name: 'Rajavel', src: '/brands/rajavel.png', dark: false },
  { name: 'Prime Fireworks', src: '/brands/prime-fireworks.jpg', dark: false, scale: 1.18 },
  { name: "Selvi's", src: '/brands/selvis.jpg', dark: false },
  { name: 'RR', src: '/brands/rr.jpg', dark: false },
] as const

function BrandLogo({
  brand,
  index,
}: {
  brand: (typeof BRANDS)[number]
  index: number
}) {
  const scale = 'scale' in brand ? brand.scale : 1

  return (
    <div
      className={cn(
        'group relative flex h-[72px] w-[150px] shrink-0 items-center justify-center overflow-hidden rounded-2xl border sm:h-[80px] sm:w-[168px]',
        'shadow-[0_8px_20px_rgba(26,16,12,0.06)] transition-[border-color,box-shadow,transform] duration-300',
        'hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(245,158,11,0.18)]',
        brand.dark
          ? 'border-gold-400/25 bg-[#16110e] hover:border-gold-400/55'
          : 'border-gold-500/20 bg-white hover:border-gold-400/50',
      )}
    >
      <span
        className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-gold-300/70 to-transparent"
        aria-hidden="true"
      />
      <span
        className="flex items-center justify-center"
        style={scale !== 1 ? { transform: `scale(${scale})` } : undefined}
      >
        <img
          src={brand.src}
          alt={`${brand.name} brand logo`}
          className="max-h-[46px] max-w-[78%] object-contain transition-transform duration-300 group-hover:scale-105 sm:max-h-[52px]"
          loading={index < 3 ? 'eager' : 'lazy'}
          decoding="async"
        />
      </span>
    </div>
  )
}

export function BrandMarquee() {
  const { ref, paused } = usePauseWhenHidden<HTMLElement>()
  const loopBrands = useMemo(() => [...BRANDS, ...BRANDS], [])
  const marqueeStyle = {
    '--marquee-duration': `${Math.max(BRANDS.length * 3.2, 28)}s`,
  } as CSSProperties

  return (
    <section ref={ref} className={cn('relative overflow-hidden bg-cream-50 py-7 sm:py-9', paused && 'marquee-paused')}>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/30 to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_0%,rgba(245,158,11,0.10),transparent_55%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-1.5 px-4 text-center sm:flex-row sm:justify-center sm:gap-4 sm:px-6 lg:px-8">
        <p className="inline-flex items-center gap-1.5 rounded-full border border-festive-500/25 bg-gradient-to-r from-festive-500/12 via-gold-500/10 to-gold-400/12 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-festive-600 sm:text-xs">
          <Award className="h-3.5 w-3.5 text-festive-500" strokeWidth={2.5} />
          Partners
        </p>
        <h2 className="font-display text-2xl font-bold leading-none sm:text-[1.75rem]">
          <TitleHighlight>Our Brands</TitleHighlight>
        </h2>
        <span className="hidden h-4 w-px bg-gold-500/30 sm:block" aria-hidden="true" />
        <p className="text-xs text-navy-700/70 sm:text-sm">
          Trusted Sivakasi manufacturers
        </p>
      </div>

      <div className="relative mt-5 sm:mt-6" style={marqueeStyle}>
        <div
          className="pointer-events-none absolute inset-x-0 top-1/2 h-[1px] -translate-y-1/2 bg-gradient-to-r from-transparent via-gold-400/25 to-transparent"
          aria-hidden="true"
        />
        <div className="featured-marquee">
          <div className="featured-marquee-track gap-3 px-3 sm:gap-4 sm:px-5">
            {loopBrands.map((brand, i) => (
              <BrandLogo key={`${brand.src}-${i}`} brand={brand} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
