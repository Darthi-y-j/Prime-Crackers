import { useEffect, useRef, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TitleHighlight } from './TitleHighlight'

export interface VisionPillar {
  icon: LucideIcon
  word: string
  text: string
}

interface VisionPillarsProps {
  items: VisionPillar[]
  label?: string
  title?: string
  description?: string
}

const accentStyles = [
  'from-sky-400/80 to-cyan-300/60',
  'from-gold-400 to-festive-400',
  'from-festive-500/90 to-orange-400/70',
]

const iconStyles = [
  'bg-sky-500/15 text-sky-300 ring-sky-400/25 group-hover:bg-sky-500/25',
  'bg-gold-500/15 text-gold-300 ring-gold-400/30 group-hover:bg-gold-500/25',
  'bg-festive-500/15 text-festive-300 ring-festive-400/25 group-hover:bg-festive-500/25',
]

const VISION_BG = '/about-vision-bg.png'

export function VisionPillars({
  items,
  label = 'Looking Ahead',
  title = 'Our Vision',
  description = 'Building Prime Crackers into a trusted destination for festive celebrations.',
}: VisionPillarsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  const titleWords = title.split(' ')
  const titleLead = titleWords.slice(0, -1).join(' ')
  const titleHighlight = titleWords.at(-1) ?? title

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setReducedMotion(prefersReduced)
    if (prefersReduced) setVisible(true)
  }, [])

  useEffect(() => {
    if (reducedMotion) return

    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(container)
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -5% 0px' },
    )
    observer.observe(container)

    return () => observer.disconnect()
  }, [reducedMotion])

  return (
    <div ref={containerRef}>
      <div
        className={cn(
          'group relative min-h-[300px] overflow-hidden rounded-2xl border border-gold-400/25 shadow-[0_20px_60px_rgba(15,13,11,0.28)] sm:min-h-[340px]',
          !reducedMotion && 'transition-[opacity,transform] duration-700 ease-out',
          visible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0',
        )}
      >
        <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
          <img
            src={VISION_BG}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full scale-110 object-cover object-[center_38%] blur-[4px] transition-transform duration-700 group-hover:scale-[1.14]"
          />
        </div>
        <div
          className="absolute inset-0 z-[1] bg-gradient-to-b from-black/35 via-black/45 to-black/75"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_60%_45%_at_50%_35%,rgba(234,88,12,0.18),transparent_65%)]"
          aria-hidden="true"
        />

        <div
          className="relative z-[2] h-1 bg-gradient-to-r from-transparent via-gold-400/80 to-transparent shimmer-gold"
          aria-hidden="true"
        />

        <header className="relative z-[2] border-b border-white/[0.12] px-5 py-6 text-center sm:px-8 sm:py-7">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-gold-400 sm:text-xs">
            {label}
          </p>
          <h2 className="mt-3 font-display text-[1.75rem] font-bold leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] sm:text-4xl">
            {titleLead ? (
              <>
                <span className="text-cream-50">{titleLead} </span>
                <TitleHighlight variant="dark">{titleHighlight}</TitleHighlight>
              </>
            ) : (
              <TitleHighlight variant="dark">{titleHighlight}</TitleHighlight>
            )}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-cream-100/85 drop-shadow-[0_1px_8px_rgba(0,0,0,0.7)]">
            {description}
          </p>
        </header>

        <div className="relative z-[2] grid divide-y divide-white/[0.12] lg:grid-cols-3 lg:divide-x lg:divide-y-0">
          {items.map((pillar, index) => {
            const Icon = pillar.icon

            return (
              <article
                key={pillar.word}
                className="group relative p-5 transition-colors duration-300 hover:bg-black/25 sm:p-6"
              >
                <div
                  className={cn(
                    'relative flex flex-col',
                    !reducedMotion && 'transition-[opacity,transform] duration-600 ease-out',
                    visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
                  )}
                  style={{ transitionDelay: `${100 + index * 130}ms` }}
                >
                  <div
                    className={cn(
                      'mb-3 flex h-10 w-10 items-center justify-center rounded-xl ring-1 transition-transform duration-300 group-hover:scale-110',
                      iconStyles[index % iconStyles.length],
                    )}
                  >
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  </div>

                  <h3 className="font-display text-lg font-bold sm:text-xl">
                    <TitleHighlight variant="dark">{pillar.word}</TitleHighlight>
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-cream-100/70">{pillar.text}</p>

                  <div
                    className={cn(
                      'mt-3 h-0.5 origin-left rounded-full bg-gradient-to-r transition-[width,opacity] duration-700 ease-out',
                      accentStyles[index % accentStyles.length],
                      visible ? 'w-10 opacity-100' : 'w-0 opacity-0',
                    )}
                    style={{ transitionDelay: `${240 + index * 130}ms` }}
                    aria-hidden="true"
                  />
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </div>
  )
}
