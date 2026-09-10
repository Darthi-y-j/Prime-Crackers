import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { HeroMemberOfferCard } from '@/components/prime/HeroMemberOfferCard'
import { WaveDividerWhite } from '@/components/customer/WaveDivider'
import { AnimateIn } from '@/components/customer/AnimateIn'
import { OptimizedBackground } from '@/components/customer/OptimizedBackground'
import { PRIME_BRAND } from '@/lib/primeBrand'
import { usePrimeShop } from '@/contexts/PrimeShopContext'

function shouldPlayHeroVideo(): boolean {
  if (typeof window === 'undefined') return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  if (window.matchMedia('(max-width: 768px)').matches) return false
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection
  if (connection?.saveData) return false
  if (connection?.effectiveType && ['slow-2g', '2g', '3g'].includes(connection.effectiveType)) return false
  return true
}

export function PrimeHero() {
  const { scrollToShop } = usePrimeShop()
  const videoRef = useRef<HTMLVideoElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const [playVideo] = useState(() => shouldPlayHeroVideo())

  useEffect(() => {
    const video = videoRef.current
    const section = sectionRef.current
    if (!video || !playVideo || !section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => undefined)
        } else {
          video.pause()
        }
      },
      { threshold: 0.1 },
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [playVideo])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[440px] overflow-hidden sm:min-h-[500px] lg:min-h-[580px]"
    >
      <OptimizedBackground src={PRIME_BRAND.heroPoster} priority className="z-0" />
      {playVideo ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={PRIME_BRAND.heroPoster}
          className="absolute inset-0 z-[1] h-full w-full object-cover"
          aria-hidden="true"
        >
          <source src={PRIME_BRAND.heroVideo} type="video/mp4" />
        </video>
      ) : null}

      <div
        className="absolute inset-0 z-[2] bg-gradient-to-r from-[#003840]/72 via-[#004D55]/25 to-transparent"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 z-[2] bg-gradient-to-t from-[#001a1c]/50 via-transparent to-transparent"
        aria-hidden="true"
      />

      <div className="relative z-[3] mx-auto flex max-w-7xl flex-col justify-start px-4 pb-12 pt-7 sm:px-6 sm:pb-14 sm:pt-8 lg:pb-16 lg:pt-10">
        <div className="max-w-xl lg:max-w-2xl">
          <AnimateIn animation="fade-down" delay={80}>
            <p className="inline-flex items-center gap-2 rounded-full border border-[#FFC107]/35 bg-[#FFC107]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#FFC107] sm:text-xs">
              Celebrate every moment
            </p>
          </AnimateIn>

          <h1 className="mt-3 font-display font-extrabold uppercase text-[#FFC107] drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] sm:mt-4">
            <span className="mb-1 block text-sm font-bold tracking-[0.16em] text-white/90 sm:mb-1.5 sm:text-xl md:text-2xl lg:text-[1.85rem]">
              {PRIME_BRAND.displayName}
            </span>
            <span className="block text-[1.65rem] leading-[1.1] sm:whitespace-nowrap sm:text-[2.25rem] sm:leading-[1.08] md:text-4xl lg:text-5xl">
              Diwali Crackers from{' '}
              <span className="block sm:inline">Sivakasi</span>
            </span>
          </h1>

          <AnimateIn animation="fade-up" delay={200}>
            <p className="font-script mt-1.5 text-lg text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)] sm:mt-2.5 sm:text-2xl md:text-3xl lg:text-4xl">
              {PRIME_BRAND.tagline}
            </p>
          </AnimateIn>

          <AnimateIn animation="fade-up" delay={260}>
            <p className="mt-3 max-w-md text-[13px] leading-relaxed text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.55)] sm:mt-4 sm:text-sm md:text-base">
              Wholesale &amp; retail crackers from Sivakasi. Up to{' '}
              <span className="font-bold text-[#FFC107]">50% OFF</span> —{' '}
              <Link to="/#shop" className="font-semibold text-white underline decoration-[#FFC107]/50 underline-offset-2 hover:text-[#FFC107]">
                browse our catalogue
              </Link>
              , read our{' '}
              <Link to="/about" className="font-semibold text-white underline decoration-[#FFC107]/50 underline-offset-2 hover:text-[#FFC107]">
                About
              </Link>{' '}
              page, and order on WhatsApp.
            </p>
          </AnimateIn>

          <AnimateIn animation="fade-up" delay={320}>
            <div className="mt-6 flex flex-col gap-3 sm:mt-7">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  to="/#shop"
                  onClick={scrollToShop}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FFC107] px-7 py-3.5 text-sm font-extrabold uppercase tracking-wide text-[#004D55] shadow-[0_8px_24px_rgba(255,193,7,0.35)] transition hover:bg-[#FFD54F] sm:px-8"
                >
                  Shop Now
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 bg-white/5 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition hover:border-white/60 hover:bg-white/10"
                >
                  Contact Us
                </Link>
              </div>

              <HeroMemberOfferCard />
            </div>
          </AnimateIn>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10">
        <WaveDividerWhite />
      </div>
    </section>
  )
}
