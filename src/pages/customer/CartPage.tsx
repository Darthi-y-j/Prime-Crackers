import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Trash2,
  ShoppingBag,
  MessageCircle,
  Loader2,
  User,
  Phone,
  MapPin,
  Sparkles,
  ArrowRight,
  Package,
  Gift,
  ShieldCheck,
  Truck,
  BadgeCheck,
  Minus,
  Plus,
} from 'lucide-react'
import { SEO } from '@/components/shared/SEO'
import { AnimateIn } from '@/components/customer/AnimateIn'
import { ProductImage } from '@/components/customer/ProductImage'
import { useCart } from '@/contexts/CartContext'
import { useSettings } from '@/contexts/SettingsContext'
import { useToast } from '@/contexts/ToastContext'
import { useAuth } from '@/contexts/AuthContext'
import { SpinToWinWheel } from '@/components/customer/SpinToWinWheel'
import { createCartEnquiry } from '@/services/enquiries'
import { buildCartWhatsAppMessage, buildWhatsAppUrl } from '@/lib/whatsapp'
import type { SpinReward } from '@/lib/spinToWin'
import type { CartEnquiryFormData } from '@/types/database'
import { getCurrentDeliveryAddress, geolocationErrorMessage } from '@/lib/geolocation'
import {
  buildFullDeliveryAddress,
  emptyAddressFields,
  validateDeliveryAddress,
  type DeliveryAddressFields,
} from '@/lib/deliveryAddress'
import { formatPrice, validatePhone, cn } from '@/lib/utils'
import { formatDisplayPhone } from '@/lib/businessInfo'
import type { CartItem } from '@/types/database'

const inputClass =
  'w-full rounded-xl border border-[#004D55]/12 bg-white px-3.5 py-2.5 text-sm text-[#004D55] placeholder:text-slate-400 transition focus:border-[#FFC107] focus:outline-none focus:ring-2 focus:ring-[#FFC107]/25'

const trustPoints = [
  { icon: ShieldCheck, label: 'No online payment' },
  { icon: MessageCircle, label: 'WhatsApp enquiry' },
  { icon: Truck, label: 'Delivery across India' },
]

function CartQuantityControls({
  value,
  onChange,
}: {
  value: number
  onChange: (qty: number) => void
}) {
  return (
    <div className="flex h-9 items-stretch overflow-hidden rounded-lg bg-white shadow-[0_2px_10px_rgba(0,77,85,0.12)] ring-1 ring-[#004D55]/15 sm:h-10">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, value - 1))}
        disabled={value <= 1}
        className="flex w-9 items-center justify-center text-[#004D55] transition hover:bg-[#004D55]/5 disabled:opacity-35 sm:w-10"
        aria-label="Decrease quantity"
      >
        <Minus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      </button>
      <span className="flex min-w-[2rem] flex-1 items-center justify-center border-x border-[#004D55]/10 text-xs font-extrabold tabular-nums text-[#004D55] sm:min-w-[2.25rem] sm:text-sm">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="flex w-9 items-center justify-center bg-gradient-to-r from-[#004D55] to-[#006670] text-white transition hover:from-[#006670] hover:to-[#00838f] sm:w-10"
        aria-label="Increase quantity"
      >
        <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      </button>
    </div>
  )
}

function CartItemCard({
  item,
  index,
  onUpdateQuantity,
  onRemove,
  isLast,
}: {
  item: CartItem
  index: number
  onUpdateQuantity: (productId: string, qty: number) => void
  onRemove: (productId: string) => void
  isLast?: boolean
}) {
  const lineTotal = item.price != null ? item.price * item.quantity : null
  const isGiftBox = Boolean(item.isGiftBox)

  const title = isGiftBox ? (
    <p className="line-clamp-2 text-sm font-extrabold leading-snug text-[#004D55] sm:text-[15px]">
      {item.productName}
    </p>
  ) : (
    <Link
      to={`/products/${item.slug}`}
      className="line-clamp-2 text-sm font-extrabold leading-snug text-[#004D55] transition hover:text-[#006670] sm:text-[15px]"
    >
      {item.productName}
    </Link>
  )

  const image = (
    <div className="relative h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-xl bg-[#FFF8E1] ring-1 ring-[#004D55]/10 sm:h-20 sm:w-20">
      <ProductImage src={item.imageUrl} alt={item.productName} className="h-full w-full object-cover" />
      {isGiftBox && (
        <span className="absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#004D55] text-[#FFC107] ring-1 ring-white">
          <Gift className="h-2.5 w-2.5" />
        </span>
      )}
    </div>
  )

  return (
    <AnimateIn animation="fade-up" delay={40 + index * 30}>
      <article
        className={cn(
          'px-3 py-3.5 sm:px-4 sm:py-4',
          !isLast && 'border-b border-[#004D55]/8',
        )}
      >
        <div className="flex gap-3 sm:gap-4">
          {isGiftBox ? image : <Link to={`/products/${item.slug}`} className="shrink-0">{image}</Link>}

          <div className="flex min-w-0 flex-1 flex-col gap-2.5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1 space-y-1.5">
                {title}
                {item.pieces != null && item.pieces > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#004D55] px-2 py-0.5 text-[9px] font-extrabold text-[#FFC107] sm:text-[10px]">
                    <span className="h-1 w-1 rounded-full bg-[#FFC107]" aria-hidden="true" />
                    {item.pieces} pcs
                  </span>
                )}
              </div>

              {lineTotal != null && (
                <p className="shrink-0 text-right text-base font-extrabold tabular-nums leading-none text-[#E65100] sm:text-lg">
                  {formatPrice(lineTotal)}
                </p>
              )}
            </div>

            {isGiftBox && item.giftBoxItems && item.giftBoxItems.length > 0 && (
              <ul className="space-y-0.5 rounded-lg border border-[#FFC107]/30 bg-[#FFF8E1]/60 px-2.5 py-2 text-[11px] text-[#004D55]/80">
                {item.giftBoxItems.map((inner) => (
                  <li key={inner.productId} className="flex justify-between gap-2">
                    <span className="truncate">{inner.productName}</span>
                    <span className="shrink-0 font-semibold">×{inner.quantity}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 text-xs text-slate-600">
                {item.price != null ? (
                  <span className="font-medium tabular-nums">
                    {formatPrice(item.price)}
                    {item.quantity > 1 ? ` × ${item.quantity}` : ''}
                  </span>
                ) : (
                  <span>Qty {item.quantity}</span>
                )}
              </div>

              <div className="flex shrink-0 items-center gap-1.5">
                <CartQuantityControls
                  value={item.quantity}
                  onChange={(qty) => onUpdateQuantity(item.productId, qty)}
                />
                <button
                  type="button"
                  onClick={() => onRemove(item.productId)}
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-500 sm:h-10 sm:w-10"
                  aria-label={`Remove ${item.productName}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>
    </AnimateIn>
  )
}

function EnquiryForm({
  customerName,
  setCustomerName,
  customerPhone,
  setCustomerPhone,
  addressFields,
  updateAddress,
  customerMessage,
  setCustomerMessage,
  locating,
  loading,
  isLoggedIn,
  customerEmail,
  settings,
  onUseLocation,
  onSendEnquiry,
  className,
}: {
  customerName: string
  setCustomerName: (v: string) => void
  customerPhone: string
  setCustomerPhone: (v: string) => void
  addressFields: DeliveryAddressFields
  updateAddress: (patch: Partial<DeliveryAddressFields>) => void
  customerMessage: string
  setCustomerMessage: (v: string) => void
  locating: boolean
  loading: boolean
  isLoggedIn: boolean
  customerEmail?: string
  settings: ReturnType<typeof useSettings>['settings']
  onUseLocation: () => void
  onSendEnquiry: () => void
  className?: string
}) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border border-[#004D55]/10 bg-white shadow-[0_8px_32px_rgba(0,77,85,0.08)]',
        className,
      )}
    >
      <div className="relative border-b border-[#FFC107]/25 bg-[#004D55] px-5 py-4 sm:px-6">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_100%_at_100%_0%,rgba(255,193,7,0.15),transparent_55%)]"
          aria-hidden="true"
        />
        <div className="relative flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFC107]/15 ring-1 ring-[#FFC107]/30">
            <MessageCircle className="h-5 w-5 text-[#FFC107]" />
          </span>
          <div>
            <h2 className="font-display text-lg font-bold text-white">Send Enquiry</h2>
            <p className="text-xs text-white/70">One tap to WhatsApp — no online payment</p>
          </div>
        </div>
      </div>

                <div className="p-5 sm:p-6">
                  {settings.whatsapp_number && (
          <p className="inline-flex items-center gap-1.5 rounded-full border border-[#25D366]/25 bg-[#25D366]/10 px-3 py-1 text-xs font-semibold text-[#128C7E]">
                      <MessageCircle className="h-3.5 w-3.5" />
                      {formatDisplayPhone(settings.whatsapp_number)}
                    </p>
                  )}

        {isLoggedIn && (
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[#FFC107]/40 bg-[#FFF8E1] px-3 py-1 text-xs font-semibold text-[#004D55]">
            <BadgeCheck className="h-3.5 w-3.5 text-[#E65100]" />
            Logged in — your details will be included in the enquiry
            {customerEmail ? ` (${customerEmail})` : ''}
          </p>
        )}

                  <div className="mt-5 space-y-4">
                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-[#004D55]">
                        <User className="h-3.5 w-3.5 text-[#E65100]" />
                        Your Name *
                      </label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Enter your name"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-[#004D55]">
                        <Phone className="h-3.5 w-3.5 text-[#E65100]" />
                        Phone *
                      </label>
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className={inputClass}
                      />
                    </div>

          <div className="space-y-3 rounded-xl border border-[#004D55]/10 bg-gradient-to-br from-[#FFF8E1]/50 to-white p-3.5">
            <div className="flex items-center justify-between gap-2">
              <label className="flex items-center gap-1.5 text-sm font-semibold text-[#004D55]">
                <MapPin className="h-3.5 w-3.5 text-[#E65100]" />
                Delivery Address *
              </label>
              <button
                type="button"
                onClick={onUseLocation}
                disabled={locating}
                className="inline-flex items-center gap-1 rounded-full border border-[#FFC107]/50 bg-[#FFF8E1] px-2.5 py-1 text-[11px] font-semibold text-[#004D55] transition hover:bg-[#FFC107]/20 disabled:opacity-60"
              >
                {locating ? <Loader2 className="h-3 w-3 animate-spin" /> : <MapPin className="h-3 w-3" />}
                Use my location
              </button>
            </div>

            {addressFields.locationSnapshot ? (
              <div className="rounded-xl border border-[#FFC107]/30 bg-white px-3 py-2.5 text-xs leading-relaxed text-slate-700">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[#E65100]">
                  Detected area
                </p>
                <p className="whitespace-pre-wrap">{addressFields.locationSnapshot}</p>
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                Tap &quot;Use my location&quot; for area &amp; map, then fill door details below.
              </p>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-[#004D55]">Door / Flat No. *</label>
                <input
                  type="text"
                  value={addressFields.doorNo}
                  onChange={(e) => updateAddress({ doorNo: e.target.value })}
                  placeholder="e.g. 12B, Flat 3"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-[#004D55]">Street / Building *</label>
                <input
                  type="text"
                  value={addressFields.street}
                  onChange={(e) => updateAddress({ street: e.target.value })}
                  placeholder="Street name, apartment"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-[#004D55]">Landmark (optional)</label>
                <input
                  type="text"
                  value={addressFields.landmark}
                  onChange={(e) => updateAddress({ landmark: e.target.value })}
                  placeholder="Near temple, school…"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-[#004D55]">Pincode (optional)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={addressFields.pincode}
                  onChange={(e) => updateAddress({ pincode: e.target.value })}
                  placeholder="6-digit pincode"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-[#004D55]">Message (optional)</label>
                      <textarea
                        value={customerMessage}
                        onChange={(e) => setCustomerMessage(e.target.value)}
              placeholder="Event date, bulk quantity, special instructions…"
                        rows={3}
                        className={cn(inputClass, 'resize-none')}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
          onClick={onSendEnquiry}
                    disabled={loading}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#25D366]/30 transition hover:bg-[#20bd5a] hover:shadow-xl disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <MessageCircle className="h-5 w-5" />}
                    Send Enquiry on WhatsApp
                  </button>

                  <p className="mt-3 flex items-start justify-center gap-1.5 text-center text-[11px] leading-relaxed text-slate-500">
                    <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-[#FFC107]" />
          Enquiry only — our team confirms price &amp; stock on WhatsApp.
        </p>
      </div>
    </div>
  )
}

export function CartPage() {
  const { items, updateQuantity, removeItem, clearCart } = useCart()
  const { settings } = useSettings()
  const { showToast } = useToast()
  const { user, isCustomer } = useAuth()
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [addressFields, setAddressFields] = useState<DeliveryAddressFields>(emptyAddressFields)
  const [customerMessage, setCustomerMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [locating, setLocating] = useState(false)
  const [spinReward, setSpinReward] = useState<SpinReward | null>(null)
  const [spinDiscount, setSpinDiscount] = useState(0)
  const [prefilledFromAccount, setPrefilledFromAccount] = useState(false)

  const customerEmail = isCustomer && user?.email ? user.email : undefined

  useEffect(() => {
    if (!isCustomer || !user || prefilledFromAccount) return

    const fullName = (user.user_metadata?.full_name as string | undefined)?.trim()
    const phone = (user.user_metadata?.phone as string | undefined)?.trim()

    if (fullName && !customerName) setCustomerName(fullName)
    if (phone && !customerPhone) setCustomerPhone(phone)
    setPrefilledFromAccount(true)
  }, [isCustomer, user, prefilledFromAccount, customerName, customerPhone])

  const handleSpinRewardChange = useCallback((reward: SpinReward | null, discount: number) => {
    setSpinReward(reward)
    setSpinDiscount(discount)
  }, [])

  const resetSpinForNewEnquiry = useCallback(() => {
    setSpinReward(null)
    setSpinDiscount(0)
  }, [])

  useEffect(() => {
    if (items.length === 0) {
      resetSpinForNewEnquiry()
    }
  }, [items.length, resetSpinForNewEnquiry])

  const estimatedTotal = useMemo(
    () =>
      items.reduce((sum, item) => {
        if (item.price == null) return sum
        return sum + item.price * item.quantity
      }, 0),
    [items],
  )

  const hasPricedItems = items.some((item) => item.price != null)
  const estimatedAfterSpin = Math.max(0, estimatedTotal - spinDiscount)

  const updateAddress = (patch: Partial<DeliveryAddressFields>) => {
    setAddressFields((prev) => ({ ...prev, ...patch }))
  }

  const buildEnquiryFormData = (): CartEnquiryFormData | null => {
    if (items.length === 0) {
      showToast('Your cart is empty', 'error')
      return null
    }

    if (!customerName.trim()) {
      showToast('Please enter your name', 'error')
      return null
    }

    if (!validatePhone(customerPhone)) {
      showToast('Please enter a valid phone number', 'error')
      return null
    }

    const addressError = validateDeliveryAddress(addressFields)
    if (addressError) {
      showToast(addressError, 'error')
      return null
    }

    return {
      items,
      customerName: customerName.trim(),
      customerPhone,
      customerAddress: buildFullDeliveryAddress(addressFields),
      customerMessage,
      customerEmail,
      authUserId: isCustomer && user?.id ? user.id : undefined,
      spinReward: spinReward
        ? {
            label: spinReward.label,
            discountAmount: spinDiscount > 0 ? spinDiscount : undefined,
          }
        : undefined,
    }
  }

  const handleUseCurrentLocation = async () => {
    setLocating(true)
    try {
      const locationSnapshot = await getCurrentDeliveryAddress()
      updateAddress({ locationSnapshot })
      showToast('Area detected — add door no. and street below', 'success')
    } catch (error) {
      showToast(geolocationErrorMessage(error), 'error')
    } finally {
      setLocating(false)
    }
  }

  const handleSendEnquiry = async () => {
    const formData = buildEnquiryFormData()
    if (!formData) return

    if (!settings.whatsapp_number) {
      showToast('WhatsApp contact is not configured. Please call us instead.', 'error')
      return
    }

    setLoading(true)

    try {
      const { error } = await createCartEnquiry(formData)

      if (error) {
        showToast('Could not save enquiry. Opening WhatsApp anyway...', 'info')
      }

      const message = buildCartWhatsAppMessage(formData)
      const url = buildWhatsAppUrl(settings.whatsapp_number, message)
      window.open(url, '_blank', 'noopener,noreferrer')
      clearCart()
      resetSpinForNewEnquiry()
      setCustomerName('')
      setCustomerPhone('')
      setAddressFields(emptyAddressFields())
      setCustomerMessage('')
      setPrefilledFromAccount(false)
    } catch {
      showToast('Something went wrong. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const formProps = {
    customerName,
    setCustomerName,
    customerPhone,
    setCustomerPhone,
    addressFields,
    updateAddress,
    customerMessage,
    setCustomerMessage,
    locating,
    loading,
    isLoggedIn: Boolean(isCustomer && user),
    customerEmail,
    settings,
    onUseLocation: handleUseCurrentLocation,
    onSendEnquiry: handleSendEnquiry,
  }

  if (items.length === 0) {
    return (
      <>
        <SEO title="Cart" description="Review your selected products and send enquiry on WhatsApp" noIndex />

        <div className="bg-gradient-to-b from-[#FFF8E1]/40 to-white">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
            <nav className="flex items-center gap-2 text-xs text-slate-500">
              <Link to="/" className="transition hover:text-[#004D55]">
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <span className="font-medium text-[#004D55]">Cart</span>
            </nav>

            <AnimateIn animation="fade-up">
              <div className="mt-4 max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#FFC107]/50 bg-[#FFF8E1] px-3.5 py-1.5">
                  <ShoppingBag className="h-3.5 w-3.5 text-[#E65100]" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#004D55]">
                    Your Cart
                  </span>
                </div>
                <h1 className="mt-4 font-display text-3xl font-bold text-[#004D55] sm:text-4xl">
                  Cart & Enquiry
                </h1>
              </div>
            </AnimateIn>

            <AnimateIn animation="fade-up" delay={60}>
              <div className="relative mt-8 overflow-hidden rounded-2xl border border-[#004D55]/10 bg-white px-6 py-14 text-center shadow-[0_8px_32px_rgba(0,77,85,0.08)] sm:px-12 sm:py-16">
                <div
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(255,193,7,0.1),transparent_65%)]"
                  aria-hidden="true"
                />
                <div className="relative">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-[#FFC107]/40 bg-gradient-to-br from-[#FFF8E1] to-white shadow-inner">
                    <ShoppingBag className="h-10 w-10 text-[#E65100]" />
                  </div>
                  <h2 className="mt-6 font-display text-2xl font-bold text-[#004D55]">Your cart is empty</h2>
                  <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-600">
                    Browse our catalogue and add products — send everything in one WhatsApp enquiry when
                    you&apos;re ready.
                  </p>
                  <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    <Link
                      to="/#shop"
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#004D55] to-[#006670] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#004D55]/20 transition hover:shadow-xl"
                    >
                      <Package className="h-4 w-4" />
                      Browse Products
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      to="/gift-box"
                      className="inline-flex items-center gap-2 rounded-xl border border-[#004D55]/15 bg-white px-6 py-3 text-sm font-bold text-[#004D55] transition hover:border-[#FFC107]"
                    >
                      <Gift className="h-4 w-4 text-[#E65100]" />
                      Build a Gift Box
                    </Link>
                  </div>
                </div>
              </div>
            </AnimateIn>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <SEO title="Cart" description="Review your selected products and send enquiry on WhatsApp" noIndex />

      <div className="bg-gradient-to-b from-[#FFF8E1]/40 to-white pb-28 sm:pb-10">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-slate-500">
            <Link to="/" className="transition hover:text-[#004D55]">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span className="font-medium text-[#004D55]">Cart</span>
          </nav>

          <AnimateIn animation="fade-up">
            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#FFC107]/50 bg-[#FFF8E1] px-3.5 py-1.5">
                  <ShoppingBag className="h-3.5 w-3.5 text-[#E65100]" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#004D55]">
                    {items.length} item{items.length !== 1 ? 's' : ''} selected
                  </span>
                </div>
                <h1 className="mt-3 font-display text-3xl font-bold text-[#004D55] sm:text-4xl">
                  Cart & Enquiry
                </h1>
                <p className="mt-2 max-w-lg text-sm leading-relaxed text-slate-600">
                  Review your items and send everything in one WhatsApp message — no payment online.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {trustPoints.map(({ icon: Icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#004D55]/10 bg-white px-3 py-1.5 text-xs font-semibold text-[#004D55] shadow-sm"
                  >
                    <Icon className="h-3 w-3 text-[#E65100]" />
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </AnimateIn>

          <div className="mt-8 grid gap-8 lg:grid-cols-5">
            <div className="space-y-4 lg:col-span-3">
              <div className="flex items-center justify-between gap-3">
                <h2 className="inline-flex items-center gap-2 font-display text-lg font-bold text-[#004D55]">
                  <Package className="h-5 w-5 text-[#E65100]" />
                  Selected Products
                </h2>
                <Link
                  to="/#shop"
                  className="text-xs font-semibold text-[#E65100] hover:text-[#004D55] sm:text-sm"
                >
                  + Add more
                </Link>
              </div>

              <div className="overflow-hidden rounded-2xl border border-[#004D55]/10 bg-white shadow-[0_4px_24px_rgba(0,77,85,0.06)]">
                {items.map((item, index) => (
                  <CartItemCard
                    key={item.productId}
                    item={item}
                    index={index}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                    isLast={index === items.length - 1}
                  />
                ))}
              </div>

              <AnimateIn animation="fade-up" delay={120}>
                <SpinToWinWheel
                  estimatedTotal={estimatedTotal}
                  reward={spinReward}
                  onRewardChange={handleSpinRewardChange}
                />
              </AnimateIn>

              {hasPricedItems && (
                <AnimateIn animation="fade-up" delay={150}>
                  <div className="flex items-center justify-between rounded-2xl border border-[#FFC107]/40 bg-gradient-to-r from-[#FFF8E1] to-white px-4 py-3.5 sm:px-5 sm:py-4">
                    <div>
                      <span className="text-sm font-semibold text-[#004D55]">Estimated total</span>
                      <p className="text-[11px] text-slate-500">Confirmed on WhatsApp</p>
                      {spinReward && (
                        <p className="mt-1 text-[11px] font-semibold text-[#E65100]">
                          Spin gift: {spinReward.label}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-extrabold tabular-nums text-[#004D55] sm:text-2xl">
                        {formatPrice(estimatedTotal)}
                      </span>
                    </div>
                  </div>
                </AnimateIn>
              )}
            </div>

            <div className="hidden lg:col-span-2 lg:block">
              <div className="sticky top-24">
                <EnquiryForm {...formProps} />
              </div>
            </div>
          </div>

          <div className="mt-8 lg:hidden">
            <EnquiryForm {...formProps} />
          </div>
        </div>

        {hasPricedItems && (
          <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#004D55]/10 bg-white/95 px-4 py-3 shadow-[0_-8px_32px_rgba(0,77,85,0.12)] backdrop-blur-md sm:hidden">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Estimated</p>
                <p className="text-lg font-extrabold tabular-nums text-[#004D55]">{formatPrice(estimatedAfterSpin)}</p>
              </div>
              <button
                type="button"
                onClick={handleSendEnquiry}
                disabled={loading}
                className="inline-flex max-w-[220px] flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-bold text-white shadow-lg disabled:opacity-60"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageCircle className="h-4 w-4" />}
                WhatsApp
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
