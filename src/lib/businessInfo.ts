import type { BusinessPolicies, WebsiteSettings } from '@/types/database'
import { cleanPhone } from './utils'

export const BUSINESS_ADDRESS = `Prime Crackers,
Chillayanayakanpatti Road, Alamarathupatti,
Sivakasi, Tamil Nadu, India`

export const WHATSAPP_NUMBERS = ['916369773883', '918903908929'] as const

export const BUSINESS_POLICIES: BusinessPolicies = {
  delivery_areas: 'All over India',
  payment_methods: 'Pre-payment',
  whatsapp_response: '24/7',
  years_in_business: '10+ years',
  happy_customers: '10000+',
}

export const BUSINESS_HOURS_24_7 = {
  weekdays: '24/7 — Always Open',
  saturday: '24/7 — Always Open',
  sunday: '24/7 — Always Open',
}

export function formatDisplayPhone(phone: string): string {
  const digits = cleanPhone(phone)
  if (digits.length === 12 && digits.startsWith('91')) {
    return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`
  }
  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`
  }
  return phone
}

export function getWhatsAppNumbers(settings: WebsiteSettings): string[] {
  const fromSettings = settings.social_links.whatsapp_numbers?.filter(Boolean) ?? []
  if (fromSettings.length > 0) return fromSettings

  if (settings.whatsapp_number) {
    const primary = cleanPhone(settings.whatsapp_number)
    const rest = WHATSAPP_NUMBERS.filter((n) => cleanPhone(n) !== primary)
    return [settings.whatsapp_number, ...rest]
  }

  return [...WHATSAPP_NUMBERS]
}

export function getBusinessPolicies(settings: WebsiteSettings): BusinessPolicies {
  return {
    ...BUSINESS_POLICIES,
    ...settings.social_links.policies,
  }
}
