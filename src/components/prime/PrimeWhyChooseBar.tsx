import { Link } from 'react-router-dom'
import { Shield, Tag, Gift, Users, ArrowRight } from 'lucide-react'
import { OptimizedBackground } from '@/components/customer/OptimizedBackground'
import { WHY_CHOOSE } from '@/lib/primeBrand'

const WHY_CHOOSE_BG = '/why-choose-bg.png'

const WHY_ICONS = [Shield, Tag, Gift, Users]

function WhyChooseItem({
  item,
  icon: Icon,
}: {
  item: (typeof WHY_CHOOSE)[number]
  icon: (typeof WHY_ICONS)[number]
}) {
  return (
    <div className="flex min-w-0 items-center gap-2 rounded-lg border border-white/15 bg-[#004D55]/45 px-2 py-2 backdrop-blur-md sm:gap-3 sm:rounded-xl sm:px-3 sm:py-3 lg:px-4">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/15 sm:h-9 sm:w-9 lg:h-10 lg:w-10">
        <Icon className="h-3.5 w-3.5 text-[#FFC107] sm:h-4 sm:w-4 lg:h-[18px] lg:w-[18px]" />
      </div>
      <p className="min-w-0 text-[10px] font-semibold leading-tight text-white sm:text-xs lg:text-sm">
        {item.title}
      </p>
    </div>
  )
}

export function PrimeWhyChooseBar() {
  return (
    <section className="relative overflow-x-hidden py-4 sm:py-6">
      <OptimizedBackground src={WHY_CHOOSE_BG} />
      <div
        className="absolute inset-0 bg-gradient-to-r from-[#004D55]/55 via-[#004D55]/40 to-[#004D55]/30"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-3 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <h2 className="text-center font-display text-sm font-extrabold uppercase tracking-wide sm:text-left sm:text-base lg:text-lg">
            <span className="text-[#FFC107]">Why Choose </span>
            <span className="text-white">Prime Crackers?</span>
          </h2>

          <Link
            to="/contact"
            className="hidden shrink-0 items-center gap-3 rounded-2xl bg-[#FFC107] px-5 py-3 text-[#004D55] shadow-lg transition hover:bg-[#FFD54F] sm:flex lg:px-6 lg:py-4"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#004D55]/10 lg:h-10 lg:w-10">
              <Gift className="h-[18px] w-[18px] lg:h-5 lg:w-5" />
            </div>
            <div className="min-w-0 text-left">
              <p className="text-sm font-extrabold uppercase leading-tight tracking-wide">
                Bulk Orders Available
              </p>
              <p className="text-xs font-semibold">For Events &amp; Functions</p>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0" />
          </Link>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-4 sm:gap-3 lg:grid-cols-4 lg:gap-4">
          {WHY_CHOOSE.map((item, i) => (
            <WhyChooseItem key={item.title} item={item} icon={WHY_ICONS[i]} />
          ))}
        </div>

        <Link
          to="/contact"
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-[#FFC107] px-3 py-2.5 text-[#004D55] shadow-lg transition hover:bg-[#FFD54F] sm:hidden"
        >
          <Gift className="h-4 w-4 shrink-0" />
          <span className="text-[11px] font-extrabold uppercase tracking-wide">Bulk Orders Available</span>
        </Link>
      </div>
    </section>
  )
}
