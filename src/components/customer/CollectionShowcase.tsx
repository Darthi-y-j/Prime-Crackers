import { useEffect, useRef, useState } from 'react'
import { AnimateIn } from './AnimateIn'
import { TitleHighlight } from './TitleHighlight'
import { cn } from '@/lib/utils'

interface CollectionItem {
  emoji: string
  name: string
}

interface CollectionShowcaseProps {
  items: CollectionItem[]
}

const COLLECTION_CARD_BG = '/contact-section-bg.webp'
const COLLECTION_CARD_BG_FALLBACK = '/contact-section-bg.png'

const chipThemes = [
  { border: 'border-amber-500/25', hover: 'hover:border-amber-400/45 hover:shadow-amber-500/15' },
  { border: 'border-rose-500/25', hover: 'hover:border-rose-400/45 hover:shadow-rose-500/15' },
  { border: 'border-violet-500/25', hover: 'hover:border-violet-400/45 hover:shadow-violet-500/15' },
  { border: 'border-sky-500/25', hover: 'hover:border-sky-400/45 hover:shadow-sky-500/15' },
  { border: 'border-emerald-500/25', hover: 'hover:border-emerald-400/45 hover:shadow-emerald-500/15' },
  { border: 'border-lime-500/25', hover: 'hover:border-lime-400/45 hover:shadow-lime-500/15' },
  { border: 'border-fuchsia-500/25', hover: 'hover:border-fuchsia-400/45 hover:shadow-fuchsia-500/15' },
  { border: 'border-orange-500/25', hover: 'hover:border-orange-400/45 hover:shadow-orange-500/15' },
  { border: 'border-indigo-500/25', hover: 'hover:border-indigo-400/45 hover:shadow-indigo-500/15' },
  { border: 'border-teal-500/25', hover: 'hover:border-teal-400/45 hover:shadow-teal-500/15' },
  { border: 'border-festive-500/25', hover: 'hover:border-festive-400/45 hover:shadow-festive-500/15' },
  { border: 'border-purple-500/25', hover: 'hover:border-purple-400/45 hover:shadow-purple-500/15' },
]

const chipObjectPositions = [
  'object-[center_25%]',
  'object-[30%_center]',
  'object-[70%_center]',
  'object-[center_40%]',
  'object-[20%_30%]',
  'object-[80%_35%]',
  'object-[center_55%]',
  'object-[40%_center]',
  'object-[60%_25%]',
  'object-[center_35%]',
  'object-[25%_60%]',
  'object-[75%_50%]',
]

function CollectionChip({
  item,
  index,
  visible,
  reducedMotion,
}: {
  item: CollectionItem
  index: number
  visible: boolean
  reducedMotion: boolean
}) {
  const theme = chipThemes[index % chipThemes.length]
  const delay = reducedMotion ? 0 : index * 35

  return (
    <div
      className={cn(
        !reducedMotion && 'transition-[opacity,transform] duration-400 ease-out',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <span
        className={cn(
          'group relative flex min-h-[3.25rem] overflow-hidden rounded-xl border shadow-[0_6px_24px_rgba(15,13,11,0.2)] transition-all duration-250 hover:-translate-y-0.5 sm:min-h-[3.5rem]',
          theme.border,
          theme.hover,
        )}
      >
        <span className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
          <picture className="block h-full w-full">
            <source srcSet={COLLECTION_CARD_BG} type="image/webp" />
            <img
              src={COLLECTION_CARD_BG_FALLBACK}
              alt=""
              loading="lazy"
              decoding="async"
              className={cn(
                'h-full w-full scale-110 object-cover blur-[3px] transition-transform duration-500 group-hover:scale-[1.15]',
                chipObjectPositions[index % chipObjectPositions.length],
              )}
            />
          </picture>
        </span>
        <span
          className="absolute inset-0 z-[1] bg-gradient-to-br from-black/70 via-black/55 to-black/75"
          aria-hidden="true"
        />
        <span className="relative z-[2] flex items-center px-3 py-2.5 text-[11px] font-semibold leading-tight text-cream-50 drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)] sm:text-xs">
          <span className="line-clamp-2">{item.name}</span>
        </span>
      </span>
    </div>
  )
}

export function CollectionShowcase({ items }: CollectionShowcaseProps) {
  const gridRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setReducedMotion(prefersReduced)
    if (prefersReduced) setVisible(true)
  }, [])

  useEffect(() => {
    if (reducedMotion) return
    const grid = gridRef.current
    if (!grid) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(grid)
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -5% 0px' },
    )
    observer.observe(grid)
    return () => observer.disconnect()
  }, [reducedMotion])

  return (
    <section className="relative overflow-hidden border-y border-navy-900/8 bg-gradient-to-br from-amber-50 via-rose-50/40 to-violet-50/50 py-8 sm:py-10">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(circle at 10% 20%, rgba(251,191,36,0.25), transparent 40%), radial-gradient(circle at 90% 80%, rgba(236,72,153,0.2), transparent 35%), radial-gradient(circle at 50% 50%, rgba(139,92,246,0.12), transparent 45%)',
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimateIn animation="fade-up">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-0.5 w-8 rounded-full bg-gradient-to-r from-festive-500 to-gold-400" />
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-festive-600">
                Our Collection
              </p>
            </div>
            <h2 className="mt-2 font-display text-2xl font-bold text-navy-900 sm:text-3xl">
              Something for Every <TitleHighlight variant="light">Celebration</TitleHighlight>
            </h2>
          </div>
        </AnimateIn>

        <div ref={gridRef} className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-2.5 lg:grid-cols-4 xl:grid-cols-6">
          {items.map((item, i) => (
            <CollectionChip
              key={item.name}
              item={item}
              index={i}
              visible={visible}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
