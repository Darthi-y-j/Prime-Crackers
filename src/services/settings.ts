import { supabase, getSupabaseErrorMessage, isSupabaseConfigured } from '@/lib/supabase'
import { BUSINESS_ADDRESS,
  BUSINESS_HOURS_24_7,
  BUSINESS_POLICIES,
  WHATSAPP_NUMBERS,
} from '@/lib/businessInfo'
import { formatReferralCodesForStorage } from '@/lib/referralCode'
import { SITE_LOGO_PATH } from '@/lib/siteConfig'
import type { WebsiteSettings } from '@/types/database'

export const SOCIAL_LINKS = {
  youtube: 'https://www.youtube.com/@primecrackers',
  facebook: '',
  instagram: 'https://www.instagram.com/primecrackers',
} as const

export const DEFAULT_SETTINGS: WebsiteSettings = {
  id: 'default',
  business_name: 'Prime Crackers',
  tagline: 'We Bring Festivals',
  logo_url: SITE_LOGO_PATH,
  phone: '+91 63697 73883',
  whatsapp_number: WHATSAPP_NUMBERS[0],
  email: 'primecrackerssivakasi@gmail.com',
  address: BUSINESS_ADDRESS,
  about_text:
    'Prime Crackers brings festivals to life with quality crackers from Sivakasi. We offer wholesale & retail fireworks at up to 50% off — fancy items, rockets, sparklers and more, with all-India delivery from Alamarathupatti.',
  social_links: {
    ...SOCIAL_LINKS,
    whatsapp_numbers: [...WHATSAPP_NUMBERS],
    policies: BUSINESS_POLICIES,
  },
  business_hours: BUSINESS_HOURS_24_7,
  updated_at: new Date().toISOString(),
}

function mergeSettings(data: Record<string, unknown> | null): WebsiteSettings {
  if (!data) return DEFAULT_SETTINGS

  const socialLinks = (data.social_links as WebsiteSettings['social_links']) || {}
  const legacyPhones = ['+91 9876543210', '919876543210']
  const legacyWhatsapp = ['919876543210', '9876543210', '919344335242', '9344335242', '918825411254']
  const legacyAddresses = [
    'Sivakasi, Tamil Nadu, India',
    'Prime Crackers, Pallapatti, Sivakasi, Virudhunagar District, Tamil Nadu 626123, India',
  ]

  const legacyEmails = ['info@primecrackers.in', 'primecrackers@gmail.com']

  const phone =
    !data.phone || legacyPhones.includes(String(data.phone))
      ? DEFAULT_SETTINGS.phone
      : (data.phone as string)

  const whatsapp_number =
    !data.whatsapp_number || legacyWhatsapp.includes(String(data.whatsapp_number))
      ? DEFAULT_SETTINGS.whatsapp_number
      : (data.whatsapp_number as string)

  const address =
    !data.address ||
    legacyAddresses.includes(String(data.address).trim()) ||
    String(data.address).includes('Pallapatti')
      ? DEFAULT_SETTINGS.address
      : (data.address as string)

  const email =
    !data.email || legacyEmails.includes(String(data.email))
      ? DEFAULT_SETTINGS.email
      : (data.email as string)

  const existingHours = (data.business_hours as WebsiteSettings['business_hours']) || {}
  const isLegacyHours = existingHours.weekdays?.includes('9:00 AM')
  const business_hours = isLegacyHours
    ? DEFAULT_SETTINGS.business_hours
    : { ...DEFAULT_SETTINGS.business_hours, ...existingHours }

  const legacyBusinessNames = [
    'Aura Crackers',
    'AURA CRACKERS',
    'aura crackers',
    'Aura crackers',
  ]

  const business_name =
    !data.business_name ||
    legacyBusinessNames.some(
      (name) => String(data.business_name).trim().toLowerCase() === name.toLowerCase(),
    )
      ? DEFAULT_SETTINGS.business_name
      : (data.business_name as string)

  const tagline =
    !data.tagline || String(data.tagline).trim().toLowerCase() === 'we bring festivals'
      ? DEFAULT_SETTINGS.tagline
      : (data.tagline as string)

  return {
    ...DEFAULT_SETTINGS,
    ...(data as unknown as WebsiteSettings),
    business_name,
    tagline,
    logo_url: SITE_LOGO_PATH,
    phone,
    whatsapp_number,
    address,
    email,
    social_links: {
      ...DEFAULT_SETTINGS.social_links,
      ...socialLinks,
      facebook: socialLinks.facebook?.trim() || DEFAULT_SETTINGS.social_links.facebook,
      instagram: socialLinks.instagram?.trim() || DEFAULT_SETTINGS.social_links.instagram,
      youtube: socialLinks.youtube?.trim() || DEFAULT_SETTINGS.social_links.youtube,
      twitter: socialLinks.twitter?.trim() || undefined,
      whatsapp_numbers:
        socialLinks.whatsapp_numbers?.length &&
        socialLinks.whatsapp_numbers.length >= WHATSAPP_NUMBERS.length
          ? socialLinks.whatsapp_numbers
          : [...WHATSAPP_NUMBERS],
      referral_codes: formatReferralCodesForStorage(
        socialLinks.referral_codes?.length
          ? socialLinks.referral_codes
          : DEFAULT_SETTINGS.social_links.referral_codes ?? [],
      ),
      policies: {
        ...DEFAULT_SETTINGS.social_links.policies,
        ...socialLinks.policies,
      },
    },
    business_hours,
  }
}

export async function getWebsiteSettings(): Promise<WebsiteSettings> {
  if (!isSupabaseConfigured) {
    return DEFAULT_SETTINGS
  }

  const { data, error } = await supabase
    .from('website_settings')
    .select('*')
    .limit(1)
    .single()

  if (error || !data) {
    return DEFAULT_SETTINGS
  }

  return mergeSettings(data)
}

export async function updateWebsiteSettings(
  settings: Partial<Omit<WebsiteSettings, 'id' | 'updated_at'>>
): Promise<{ data: WebsiteSettings | null; error: string | null }> {
  const existing = await getWebsiteSettings()

  const { data, error } = await supabase
    .from('website_settings')
    .update({ ...settings, updated_at: new Date().toISOString() })
    .eq('id', existing.id === 'default' ? undefined : existing.id)
    .select()
    .single()

  if (error) {
    if (existing.id === 'default') {
      const { data: inserted, error: insertError } = await supabase
        .from('website_settings')
        .insert(settings)
        .select()
        .single()

      if (insertError) return { data: null, error: getSupabaseErrorMessage(insertError) }
      return { data: mergeSettings(inserted), error: null }
    }
    return { data: null, error: getSupabaseErrorMessage(error) }
  }

  return { data: mergeSettings(data), error: null }
}
