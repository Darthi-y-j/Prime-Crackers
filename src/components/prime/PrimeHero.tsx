import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { HeroMemberOfferCard } from '@/components/prime/HeroMemberOfferCard'
import { WaveDividerWhite } from '@/components/customer/WaveDivider'
import { AnimateIn } from '@/components/customer/AnimateIn'
import { OptimizedBackground } from '@/components/customer/OptimizedBackground'
import { PRIME_BRAND } from '@/lib/primeBrand'
import { usePrimeShop } from '@/contexts/PrimeShopContext'

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function isVideoVisible(video: HTMLVideoElement): boolean {
  return video.getClientRects().length > 0
}

export function PrimeHero() {
  const { scrollToShop } = usePrimeShop()
  const mobileVideoRef = useRef<HTMLVideoElement>(null)
  const desktopVideoRef = useRef<HTMLVideoElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const [playVideo] = useState(() => !prefersReducedMotion())

  useEffect(() => {
    const section = sectionRef.current
    if (!playVideo) return

    const videos = () =>
      [mobileVideoRef.current, desktopVideoRef.current].filter(
        (v): v is HTMLVideoElement => v != null,
      )

    const syncPlayback = () => {
      for (const video of videos()) {
        if (!isVideoVisible(video)) {
          video.pause()
          continue
        }
        if (video.paused) {
          void video.play().catch(() => undefined)
        }
      }
    }

    const onMediaChange = () => syncPlayback()
    const mq = window.matchMedia('(max-width: 767px)')
    mq.addEventListener('change', onMediaChange)

    for (const video of videos()) {
      video.addEventListener('loadeddata', syncPlayback)
      video.addEventListener('canplay', syncPlayback)
    }
    syncPlayback()

    let observer: IntersectionObserver | undefined
    if (section) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            syncPlayback()
          } else {
            for (const video of videos()) video.pause()
          }
        },
        { threshold: 0.1 },
      )
      observer.observe(section)
    }

    return () => {
      mq.removeEventListener('change', onMediaChange)
      for (const video of videos()) {
        video.removeEventListener('loadeddata', syncPlayback)
        video.removeEventListener('canplay', syncPlayback)
      }
      observer?.disconnect()
    }
  }, [playVideo])

  return (
    <section
      ref={sectionRef}
      className="relative flex flex-col overflow-hidden max-md:min-h-[min(100svh,920px)] sm:min-h-[62svh] sm:min-h-[440px] lg:min-h-[min(70svh,600px)]"
    >
      <OptimizedBackground
        src={PRIME_BRAND.heroPosterMobile}
        priority
        className="z-0 md:hidden"
        style={{ backgroundPosition: 'center top' }}
      />
      <OptimizedBackground src={PRIME_BRAND.heroPoster} priority className="z-0 hidden md:block" />
      {playVideo ? (
        <>
          <video
            ref={mobileVideoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            poster={PRIME_BRAND.heroPosterMobile}
            className="absolute inset-0 z-[1] h-full w-full object-cover object-right md:hidden"
            aria-hidden="true"
          >
            <source src={PRIME_BRAND.heroVideoMobile} type="video/mp4" />
          </video>
          <video
            ref={desktopVideoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            poster={PRIME_BRAND.heroPoster}
            className="absolute inset-0 z-[1] hidden h-full w-full object-cover object-[72%_center] object-right md:block"
            aria-hidden="true"
          >
            <source src={PRIME_BRAND.heroVideo} type="video/mp4" />
          </video>
        </>
      ) : null}

      <div className="relative z-[3] mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-3 pb-28 pt-[5.5rem] max-md:min-h-0 sm:flex-none sm:justify-start sm:px-6 sm:pb-12 sm:pt-[6rem] lg:pb-16 lg:pt-[6.5rem]">
        <div className="hero-copy-panel hero-copy-panel--mobile w-full max-w-none sm:max-w-xl sm:pl-10 md:pl-16 lg:max-w-2xl lg:pl-20">
          <AnimateIn animation="fade-down" delay={80}>
            <p
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/40 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white sm:text-xs"
            >
              Celebrate every moment
            </p>
          </AnimateIn>

          <h1 className="mt-5 max-md:mt-6 sm:mt-5">
            <span
              className="hero-gradient-text hero-gradient-brand block font-sans text-xs font-bold uppercase tracking-[0.2em] sm:text-sm sm:tracking-[0.22em]"
            >
              {PRIME_BRAND.displayName}
            </span>
            <span
              className="mt-2.5 block font-display text-[1.6rem] font-bold leading-[1.18] tracking-tight max-md:mt-3 sm:mt-2 sm:text-[2.35rem] sm:leading-[1.12] md:text-[2.65rem] lg:text-[3.15rem]"
            >
              <span className="hero-gradient-text hero-gradient-headline">Diwali crackers from </span>
              <span className="hero-gradient-text hero-gradient-sivakasi">Sivakasi</span>
            </span>
          </h1>

          <AnimateIn animation="fade-up" delay={200}>
            <p
              className="hero-gradient-text hero-gradient-tagline mt-4 max-w-lg font-display text-lg font-medium italic leading-snug max-md:mt-5 sm:mt-4 sm:text-2xl md:text-[1.75rem] md:leading-tight"
            >
              {PRIME_BRAND.tagline}
            </p>
          </AnimateIn>

          <AnimateIn animation="fade-up" delay={260}>
            <p className="hero-text-plain mt-5 max-w-md font-sans text-[12.5px] leading-[1.65] text-white/95 max-md:mt-6 sm:mt-5 sm:text-[15px] sm:leading-relaxed md:text-base">
              Wholesale &amp; retail crackers from Sivakasi. Up to{' '}
              <span className="hero-gradient-text hero-gradient-accent font-bold">50% OFF</span> —{' '}
              <Link
                to="/#shop"
                className="hero-gradient-text hero-gradient-accent font-semibold underline decoration-white/30 underline-offset-[3px] transition hover:opacity-90"
              >
                browse our catalogue
              </Link>
              , read our{' '}
              <Link
                to="/about"
                className="hero-gradient-text hero-gradient-accent font-semibold underline decoration-white/30 underline-offset-[3px] transition hover:opacity-90"
              >
                About
              </Link>{' '}
              page, and order on WhatsApp.
            </p>
          </AnimateIn>

          <AnimateIn animation="fade-up" delay={320}>
            <div className="mt-6 flex flex-col gap-3 max-md:mt-8 sm:mt-7 sm:gap-3">
              <div className="flex max-w-md flex-row flex-wrap items-stretch gap-2 sm:max-w-none sm:items-center sm:gap-3">
                <Link
                  to="/#shop"
                  onClick={scrollToShop}
                  className="inline-flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-[#FFEB3B] via-[#FFC107] to-[#FF9800] px-3 py-2 text-[11px] font-extrabold uppercase tracking-wide text-[#1a2e2a] shadow-[0_6px_16px_rgba(255,152,0,0.4)] transition hover:from-[#FFF59D] hover:via-[#FFD54F] hover:to-[#FB8C00] sm:min-h-0 sm:flex-none sm:gap-2 sm:px-8 sm:py-3.5 sm:text-sm sm:shadow-[0_10px_28px_rgba(255,152,0,0.45)]"
                >
                  Shop Now
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 sm:h-5 sm:w-5" aria-hidden />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-full border border-[#FFC107]/80 bg-transparent px-3 py-2 text-[11px] font-bold text-[#FFF8E1] transition hover:border-[#FFD54F] hover:bg-[#FFC107]/15 sm:min-h-0 sm:flex-none sm:border-2 sm:px-7 sm:py-3.5 sm:text-sm"
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
