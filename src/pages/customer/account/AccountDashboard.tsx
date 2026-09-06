import { Link } from 'react-router-dom'
import {
  User,
  MapPin,
  MessageSquare,
  Heart,
  Shield,
  HelpCircle,
  Phone,
  LogOut,
  Mail,
  ShoppingCart,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { SEO } from '@/components/shared/SEO'
import { LoadingState } from '@/components/customer/LoadingState'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import {
  AccountPageHeader,
  MenuLink,
  MenuSection,
  ProfileAvatar,
  QuickActionCard,
  StatCard,
} from '@/components/customer/account/AccountUI'
import { useAccountProfile } from '@/contexts/AccountProfileContext'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { useWishlist } from '@/contexts/WishlistContext'
import { formatDisplayPhone } from '@/lib/businessInfo'
import { useState } from 'react'

export function AccountDashboard() {
  const { displayName, email, phone, memberSince, enquiryStats, loading } = useAccountProfile()
  const { signOut } = useAuth()
  const { itemCount } = useCart()
  const { itemCount: wishlistCount } = useWishlist()
  const [logoutOpen, setLogoutOpen] = useState(false)

  if (loading) {
    return (
      <div className="py-16">
        <LoadingState message="Loading your profile..." />
      </div>
    )
  }

  return (
    <>
      <SEO title="My Profile" description="Manage your Prime Crackers account and enquiries." noIndex />

      <AccountPageHeader showEdit>
        <div className="mt-6 flex flex-col items-center text-center sm:flex-row sm:items-center sm:gap-6 sm:text-left">
          <ProfileAvatar name={displayName} />
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-2xl font-extrabold uppercase tracking-wide text-white sm:text-3xl">
              {displayName}
            </h1>
            <div className="mt-3 flex flex-col gap-1.5 sm:gap-2">
              {email && (
                <p className="flex items-center justify-center gap-2 text-sm text-white/85 sm:justify-start">
                  <Mail className="h-4 w-4 shrink-0 text-[#FFC107]" />
                  <span className="truncate">{email}</span>
                </p>
              )}
              {phone && (
                <p className="flex items-center justify-center gap-2 text-sm text-white/85 sm:justify-start">
                  <Phone className="h-4 w-4 shrink-0 text-[#FFC107]" />
                  {formatDisplayPhone(phone)}
                </p>
              )}
            </div>
            {memberSince && (
              <p className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[#FFC107]/35 bg-[#FFC107]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#FFC107]">
                <Sparkles className="h-3 w-3" />
                Member since {memberSince}
              </p>
            )}
          </div>
        </div>
      </AccountPageHeader>

      <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard value={enquiryStats.total} label="Enquiries" accent="#004D55" />
          <StatCard value={enquiryStats.new} label="New" accent="#E65100" />
          <StatCard value={enquiryStats.completed} label="Completed" accent="#006670" />
          <StatCard value={wishlistCount} label="Wishlist" accent="#FFC107" />
        </div>

        {itemCount > 0 && (
          <div className="relative overflow-hidden rounded-2xl border border-[#FFC107]/35 bg-gradient-to-r from-[#004D55] to-[#006670] p-5 text-white shadow-lg">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#FFC107]">Your cart</p>
                <p className="mt-1 font-display text-xl font-extrabold">
                  {itemCount} item{itemCount !== 1 ? 's' : ''} ready to enquire
                </p>
                <p className="mt-1 text-sm text-white/75">Send your list on WhatsApp in one tap.</p>
              </div>
              <ShoppingCart className="h-10 w-10 shrink-0 text-[#FFC107]/80" />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                to="/"
                className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/20"
              >
                Continue shopping
              </Link>
              <Link
                to="/cart"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#FFC107] px-4 py-2 text-xs font-bold text-[#004D55] transition hover:bg-[#FFD54F]"
              >
                WhatsApp enquiry
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        )}

        <div>
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#004D55]/55">
            Quick access
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <QuickActionCard
              to="/account/personal"
              label="Personal info"
              description="Name, email & phone"
              accent="#004D55"
              icon={<User className="h-5 w-5 text-[#004D55]" />}
            />
            <QuickActionCard
              to="/account/addresses"
              label="My addresses"
              description="Delivery locations"
              accent="#006670"
              icon={<MapPin className="h-5 w-5 text-[#006670]" />}
            />
            <QuickActionCard
              to="/account/enquiries"
              label="My enquiries"
              description="Track your orders"
              accent="#E65100"
              icon={<MessageSquare className="h-5 w-5 text-[#E65100]" />}
            />
            <QuickActionCard
              to="/account/wishlist"
              label="Wishlist"
              description="Saved favourites"
              accent="#FFC107"
              icon={<Heart className="h-5 w-5 text-[#E65100]" />}
            />
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <MenuSection title="Settings">
            <MenuLink
              to="/account/security"
              icon={<Shield className="h-5 w-5 text-[#006670]" />}
              label="Password & security"
              description="Change your password"
              accent="#006670"
            />
          </MenuSection>

          <MenuSection title="Support">
            <MenuLink
              to="/account/help"
              icon={<HelpCircle className="h-5 w-5 text-[#004D55]" />}
              label="Help & support"
              description="FAQ, delivery, terms & more"
            />
            <MenuLink
              to="/contact"
              icon={<Phone className="h-5 w-5 text-[#E65100]" />}
              label="Contact us"
              accent="#E65100"
            />
          </MenuSection>
        </div>

        <button
          type="button"
          onClick={() => setLogoutOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#004D55]/15 bg-white py-3.5 text-sm font-bold text-[#004D55] shadow-sm transition hover:border-[#004D55]/30 hover:bg-[#FFF8E1]/50"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>

      <ConfirmDialog
        open={logoutOpen}
        title="Sign out?"
        message="You will need to sign in again to access your profile and enquiries."
        confirmLabel="Logout"
        onConfirm={() => {
          setLogoutOpen(false)
          void signOut()
        }}
        onCancel={() => setLogoutOpen(false)}
      />
    </>
  )
}
