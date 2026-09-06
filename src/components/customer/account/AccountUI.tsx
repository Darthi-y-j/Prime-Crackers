import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Pencil } from 'lucide-react'
import { cn } from '@/lib/utils'

const STOREFRONT_BG = '/prime-storefront-bg.png'

export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('')
}

interface AccountPageHeaderProps {
  title?: string
  subtitle?: string
  backTo?: string
  showEdit?: boolean
  editTo?: string
  children?: React.ReactNode
}

export function AccountPageHeader({
  title = 'My Profile',
  subtitle,
  backTo,
  showEdit,
  editTo = '/account/personal',
  children,
}: AccountPageHeaderProps) {
  return (
    <section className="relative overflow-hidden border-b-2 border-[#004D55]">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{ backgroundImage: `url('${STOREFRONT_BG}')` }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#004D55]/95 via-[#003840]/92 to-[#004D55]/88"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="flex items-center justify-between gap-4">
          {backTo ? (
            <Link
              to={backTo}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/80 transition hover:text-[#FFC107]"
            >
              <ChevronLeft className="h-4 w-4" />
              My Profile
            </Link>
          ) : (
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FFC107]">{title}</p>
          )}

          {showEdit && (
            <Link
              to={editTo}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#FFC107]/40 bg-[#FFC107]/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-[#FFC107] transition hover:bg-[#FFC107]/20"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit Profile
            </Link>
          )}
        </div>

        {subtitle && (
          <h1 className="mt-4 font-display text-2xl font-extrabold uppercase tracking-wide text-white sm:text-3xl">
            {subtitle}
          </h1>
        )}

        {children}
      </div>
    </section>
  )
}

interface ProfileAvatarProps {
  name: string
  size?: 'md' | 'lg'
  className?: string
}

export function ProfileAvatar({ name, size = 'lg', className }: ProfileAvatarProps) {
  return (
    <span
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full bg-[#FFC107] font-display font-extrabold text-[#004D55] shadow-[0_4px_20px_rgba(255,193,7,0.35)] ring-4 ring-white/30',
        size === 'lg' ? 'h-20 w-20 text-2xl sm:h-24 sm:w-24 sm:text-3xl' : 'h-12 w-12 text-sm',
        className,
      )}
    >
      {getInitials(name)}
    </span>
  )
}

interface StatCardProps {
  value: number | string
  label: string
  accent?: string
  className?: string
}

export function StatCard({ value, label, accent = '#004D55', className }: StatCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-[#004D55]/10 bg-white px-3 py-4 text-center shadow-sm transition hover:border-[#FFC107]/40 hover:shadow-md',
        className,
      )}
    >
      <p className="font-display text-2xl font-extrabold sm:text-3xl" style={{ color: accent }}>
        {value}
      </p>
      <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-[#004D55]/55">{label}</p>
    </div>
  )
}

interface QuickActionCardProps {
  to: string
  icon: React.ReactNode
  label: string
  description?: string
  accent?: string
}

export function QuickActionCard({
  to,
  icon,
  label,
  description,
  accent = '#004D55',
}: QuickActionCardProps) {
  return (
    <Link
      to={to}
      className="group flex flex-col gap-3 rounded-2xl border border-[#004D55]/10 bg-white p-4 shadow-sm transition hover:border-[#FFC107]/50 hover:shadow-md"
    >
      <span
        className="flex h-11 w-11 items-center justify-center rounded-xl transition group-hover:scale-105"
        style={{ backgroundColor: `${accent}12` }}
      >
        {icon}
      </span>
      <span>
        <span className="block text-sm font-bold text-[#004D55]">{label}</span>
        {description && (
          <span className="mt-0.5 block text-xs text-[#004D55]/55">{description}</span>
        )}
      </span>
    </Link>
  )
}

interface MenuLinkProps {
  to: string
  icon: React.ReactNode
  label: string
  description?: string
  accent?: string
}

export function MenuLink({ to, icon, label, description, accent = '#004D55' }: MenuLinkProps) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-[#FFF8E1]/60"
    >
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${accent}10` }}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-[#004D55]">{label}</span>
        {description && (
          <span className="mt-0.5 block text-xs text-[#004D55]/55">{description}</span>
        )}
      </span>
      <ChevronRight
        className="h-4 w-4 shrink-0 text-[#004D55]/25 transition group-hover:translate-x-0.5 group-hover:text-[#FFC107]"
      />
    </Link>
  )
}

interface MenuSectionProps {
  title: string
  children: React.ReactNode
}

export function MenuSection({ title, children }: MenuSectionProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#004D55]/10 bg-white shadow-sm">
      <p className="border-b border-[#FFC107]/25 bg-[#FFF8E1]/40 px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#004D55]/70">
        {title}
      </p>
      <div className="divide-y divide-[#004D55]/[0.06] px-1 py-1">{children}</div>
    </div>
  )
}

interface ToggleRowProps {
  label: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export function ToggleRow({ label, description, checked, onChange }: ToggleRowProps) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 py-3">
      <span className="min-w-0">
        <span className="block text-sm font-medium text-[#004D55]">{label}</span>
        {description && (
          <span className="mt-0.5 block text-xs text-[#004D55]/55">{description}</span>
        )}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'inline-flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors',
          checked ? 'justify-end bg-[#004D55]' : 'justify-start bg-[#004D55]/15',
        )}
      >
        <span className="h-5 w-5 shrink-0 rounded-full bg-white shadow-sm" />
      </button>
    </label>
  )
}

export const accountInputClass =
  'w-full rounded-xl border border-[#004D55]/15 bg-white px-3.5 py-2.5 text-sm text-[#004D55] placeholder:text-[#004D55]/40 transition focus:border-[#FFC107] focus:outline-none focus:ring-2 focus:ring-[#FFC107]/25'

export const accountLabelClass = 'mb-1.5 block text-xs font-semibold text-[#004D55]/70'
