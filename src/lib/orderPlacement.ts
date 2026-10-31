import type { WebsiteSettings } from '@/types/database'

export const DEFAULT_ORDER_PLACEMENT_PAUSE_MESSAGE =
  'We are temporarily not accepting new orders due to high demand. Please check back soon or contact us on WhatsApp for urgent queries.'

export function isOrderPlacementPaused(settings: WebsiteSettings): boolean {
  return settings.social_links.order_placement_paused === true
}

export function getOrderPlacementPauseMessage(settings: WebsiteSettings): string {
  const custom = settings.social_links.order_placement_pause_message?.trim()
  return custom || DEFAULT_ORDER_PLACEMENT_PAUSE_MESSAGE
}
