import { formatPrice } from '@/lib/utils'

/** Minimum cart value (INR) before a WhatsApp enquiry can be sent. */
export const MIN_ORDER_AMOUNT_INR = 3000

export const MIN_ORDER_AMOUNT_LABEL = formatPrice(MIN_ORDER_AMOUNT_INR)

/** Shown in cart UI when the order is below the minimum. */
export const MIN_ORDER_TRANSPORT_REASON =
  'We can only process orders of ' +
  MIN_ORDER_AMOUNT_LABEL +
  ' or more. When the package is too small or light, our transport partners usually do not approve pickup — they need a minimum parcel size for all-India delivery. Please add more items to your cart. If you need help, contact us on WhatsApp.'

/** Shorter copy for mobile cart to reduce scroll. */
export const MIN_ORDER_TRANSPORT_REASON_SHORT =
  `Minimum ${MIN_ORDER_AMOUNT_LABEL} — small parcels are often not accepted for transport pickup. Add more items or message us on WhatsApp.`

export const MIN_ORDER_TOAST_MESSAGE =
  `Minimum order is ${MIN_ORDER_AMOUNT_LABEL}. Small packages are often not accepted for transport — please add more items.`

export function meetsMinimumOrderAmount(subtotalInr: number): boolean {
  return subtotalInr >= MIN_ORDER_AMOUNT_INR
}

export function amountNeededForMinimum(subtotalInr: number): number {
  return Math.max(0, MIN_ORDER_AMOUNT_INR - subtotalInr)
}
