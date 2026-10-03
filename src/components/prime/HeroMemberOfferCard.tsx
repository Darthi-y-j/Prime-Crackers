import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Unlock } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export function HeroMemberOfferCard() {
  const { isCustomer, user } = useAuth()
  const isLoggedIn = Boolean(user && isCustomer)

  if (isLoggedIn) {
    const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'there'
    return (
      <Link
        to="/account"
        className="group inline-flex w-full max-w-md items-center justify-between gap-2 rounded-full border border-[#FFC107]/45 bg-[#004D55]/50 px-2.5 py-1.5 backdrop-blur-md transition hover:border-[#FFC107]/70 hover:bg-[#004D55]/65 sm:max-w-xl sm:min-w-[320px] sm:gap-3 sm:px-4 sm:py-2.5 sm:w-auto"
      >
        <span className="flex min-w-0 items-center gap-2">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FFC107] sm:h-8 sm:w-8">
            <Unlock className="h-3.5 w-3.5 text-[#004D55] sm:h-4 sm:w-4" aria-hidden="true" />
          </span>
          <span className="truncate text-[11px] font-semibold leading-tight text-white sm:text-sm">
            <span className="sm:hidden">Hi {firstName} — offers ready</span>
            <span className="hidden sm:inline">Hi {firstName} — your member offers are ready</span>
          </span>
        </span>
        <ArrowRight
          className="h-3.5 w-3.5 shrink-0 text-[#FFC107] transition group-hover:translate-x-0.5 sm:h-4 sm:w-4"
          aria-hidden="true"
        />
      </Link>
    )
  }

  return (
    <div className="w-full max-w-md sm:max-w-xl">
      <div className="flex items-center gap-2 rounded-full border border-[#FFC107]/40 bg-[#004D55]/55 px-1.5 py-1 backdrop-blur-md sm:gap-3 sm:px-2.5 sm:py-2">
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FFC107] sm:h-10 sm:w-10"
          aria-hidden="true"
        >
          <Sparkles className="h-3.5 w-3.5 text-[#004D55] sm:h-[18px] sm:w-[18px]" />
        </span>

        <p className="min-w-0 flex-1 py-0.5 text-[10px] leading-snug text-white sm:text-xs">
          <span className="font-extrabold uppercase tracking-wide text-[#FFC107]">Login free</span>
          <span className="text-white/90"> — offers &amp; orders</span>
        </p>

        <Link
          to="/login"
          state={{ from: '/' }}
          className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-[#FFC107] px-2.5 py-1.5 text-[9px] font-extrabold uppercase tracking-wide text-[#004D55] transition hover:bg-[#FFD54F] sm:gap-1 sm:px-4 sm:py-2.5 sm:text-[11px]"
        >
          Login
          <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" aria-hidden="true" />
        </Link>
      </div>

      <p className="mt-1.5 text-[9px] text-white/55 sm:mt-2 sm:text-[11px]">
        No account yet?{' '}
        <Link
          to="/register"
          state={{ from: '/' }}
          className="font-semibold text-[#FFC107] underline decoration-[#FFC107]/40 underline-offset-2 hover:text-[#FFD54F]"
        >
          Sign up in 30 seconds
        </Link>
      </p>
    </div>
  )
}
