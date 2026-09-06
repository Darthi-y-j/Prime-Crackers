import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Percent, CheckCircle, Truck } from 'lucide-react'
import { useSettings } from '@/contexts/SettingsContext'
import { useHeroSlideTheme } from '@/contexts/HeroSlideContext'
import { TitleHighlight } from './TitleHighlight'
import { AnimateIn } from './AnimateIn'
import { FeaturedProductsShowcase } from './FeaturedProductsShowcase'
import type { Product } from '@/types/database'

interface HeroProps {
  heroSelectionProducts?: Product[]
}

export function Hero({ heroSelectionProducts = [] }: HeroProps) {
  const { settings } = useSettings()
  const { setTheme } = useHeroSlideTheme()

  useEffect(() => {
    setTheme('light')
  }, [setTheme])

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-cream-50 via-white to-cream-100">
      {/* Decorative background shapes */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-festive-500/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-gold-500/15 blur-3xl" />
        <div className="absolute right-1/4 top-1/3 h-48 w-48 rounded-full bg-festive-400/8 blur-2xl" />
      </div>

      <div className="relative z-10 mx-auto flex w-full min-w-0 max-w-7xl flex-col px-4 pb-10 pt-[4.25rem] sm:px-6 sm:pb-14 sm:pt-24 lg:px-8 lg:pt-28">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="w-full max-w-xl">
            <AnimateIn animation="fade-down" delay={100}>
              <div className="inline-flex items-center gap-2 rounded-full border border-festive-500/30 bg-festive-500/10 px-4 py-1.5">
                <Percent className="h-4 w-4 text-festive-500" />
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-festive-500">
                  Up to 90% OFF — Wholesale &amp; Retail
                </span>
              </div>
            </AnimateIn>

            <AnimateIn animation="fade-up" delay={200}>
              <h1 className="mt-5 font-display text-[2.25rem] font-extrabold leading-[1.15] text-navy-950 sm:text-[3rem] lg:text-[3.5rem]">
                Best Diwali <TitleHighlight>Crackers</TitleHighlight> from Sivakasi
              </h1>
            </AnimateIn>

            <AnimateIn animation="fade-up" delay={350}>
              <p className="mt-5 max-w-md text-base leading-relaxed text-navy-800/80 sm:text-lg">
                {settings.tagline ||
                  'Prime Crackers — your trusted wholesale fireworks store in Alamarathupatti, Sivakasi. Fancy items, rockets, sparklers & more with all-India delivery.'}
              </p>
            </AnimateIn>

            <AnimateIn animation="fade-up" delay={480}>
              <div className="mt-6 flex flex-wrap gap-3">
                {[
                  { icon: CheckCircle, text: '100% Quality Products' },
                  { icon: Truck, text: 'All-India Delivery' },
                ].map(({ icon: Icon, text }) => (
                  <span
                    key={text}
                    className="inline-flex items-center gap-2 rounded-full border border-navy-800/15 bg-white px-4 py-2 text-xs font-semibold text-navy-900 shadow-sm"
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0 text-festive-500" />
                    {text}
                  </span>
                ))}
              </div>
            </AnimateIn>

            <AnimateIn animation="fade-up" delay={600}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  to="/products"
                  className="btn-hover-lift inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-gold-500 to-gold-400 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-gold-500/30 sm:w-auto"
                >
                  Shop Crackers
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/cart"
                  className="btn-hover-lift inline-flex w-full items-center justify-center gap-2 rounded-lg border-2 border-festive-500 bg-white px-8 py-3.5 text-sm font-bold text-festive-500 transition-colors hover:bg-festive-500/5 sm:w-auto"
                >
                  Get Quote on WhatsApp
                </Link>
              </div>
            </AnimateIn>
          </div>

          {/* Hero visual — logo + festive card */}
          <AnimateIn animation="scale-in" delay={300} className="relative hidden lg:block">
            <div className="relative mx-auto flex max-w-md flex-col items-center">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-festive-500/20 to-gold-500/20 blur-2xl" />
              <div className="relative rounded-3xl border border-white/60 bg-white/80 p-10 shadow-2xl shadow-festive-500/10 backdrop-blur-sm">
                <img
                  src="/prime-logo.svg"
                  alt="Prime Crackers"
                  className="mx-auto h-40 w-auto object-contain"
                  fetchPriority="high"
                />
                <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                  {[
                    { value: '90%', label: 'Max Discount' },
                    { value: '10+', label: 'Years' },
                    { value: 'PAN', label: 'India Delivery' },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-xl bg-cream-50 px-2 py-3">
                      <div className="font-display text-lg font-extrabold text-festive-500">{stat.value}</div>
                      <div className="text-[10px] font-semibold uppercase tracking-wide text-navy-800/60">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AnimateIn>
        </div>

        {heroSelectionProducts.length > 0 && (
          <AnimateIn animation="fade-up" delay={720} className="relative mt-10 w-full">
            <FeaturedProductsShowcase products={heroSelectionProducts} variant="hero" />
          </AnimateIn>
        )}
      </div>

      {/* Bottom wave — blue tint */}
      <div className="relative h-12 w-full overflow-hidden" aria-hidden="true">
        <svg viewBox="0 0 1440 48" fill="none" className="absolute bottom-0 w-full" preserveAspectRatio="none">
          <path d="M0 48V24C240 0 480 0 720 24C960 48 1200 48 1440 24V48H0Z" fill="#f5f8fc" />
        </svg>
      </div>
    </section>
  )
}
