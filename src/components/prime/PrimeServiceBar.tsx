import { Shield, Package, Truck, Headphones } from 'lucide-react'
import { SERVICE_HIGHLIGHTS } from '@/lib/primeBrand'

const ICONS = [Shield, Package, Truck, Headphones]
const ICON_BG = ['bg-[#004D55]/10', 'bg-[#FFC107]/20', 'bg-[#29B6F6]/15', 'bg-[#FFC107]/20']
const ICON_COLOR = ['text-[#004D55]', 'text-[#E65100]', 'text-[#0288D1]', 'text-[#FF8C00]']

export function PrimeServiceBar() {
  return (
    <section className="border-b border-slate-100 bg-white py-3 sm:py-5">
      <div className="mx-auto grid max-w-7xl grid-cols-4 gap-1.5 px-2 sm:gap-6 sm:px-6">
        {SERVICE_HIGHLIGHTS.map((item, i) => {
          const Icon = ICONS[i]
          return (
            <div
              key={item.title}
              className="flex min-w-0 flex-col items-center text-center sm:flex-row sm:items-start sm:text-left"
            >
              <div
                className={`mb-1.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full sm:mb-0 sm:mr-3 sm:h-14 sm:w-14 ${ICON_BG[i]}`}
              >
                <Icon className={`h-4 w-4 sm:h-6 sm:w-6 ${ICON_COLOR[i]}`} />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-bold leading-tight text-[#1e3a5f] sm:text-sm sm:leading-normal">
                  {item.title}
                </p>
                <p className="mt-0.5 hidden text-xs leading-relaxed text-slate-500 sm:block">
                  {item.desc}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
