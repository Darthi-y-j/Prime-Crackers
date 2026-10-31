import { useEffect, useState } from 'react'
import { formatReferralCodesForStorage, parseReferralCodeList } from '@/lib/referralCode'
import { DEFAULT_ORDER_PLACEMENT_PAUSE_MESSAGE } from '@/lib/orderPlacement'
import { updateWebsiteSettings } from '@/services/settings'
import { useToast } from '@/contexts/ToastContext'
import { useSettings } from '@/contexts/SettingsContext'

export function SettingsForm() {
  const { settings, refresh } = useSettings()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    business_name: settings.business_name,
    tagline: settings.tagline || '',
    phone: settings.phone || '',
    whatsapp_number: settings.whatsapp_number || '',
    email: settings.email || '',
    address: settings.address || '',
    about_text: settings.about_text || '',
    facebook: settings.social_links.facebook || '',
    instagram: settings.social_links.instagram || '',
    youtube: settings.social_links.youtube || '',
    weekdays: settings.business_hours.weekdays || '',
    saturday: settings.business_hours.saturday || '',
    sunday: settings.business_hours.sunday || '',
    referral_codes: (settings.social_links.referral_codes ?? []).join('\n'),
    order_placement_paused: settings.social_links.order_placement_paused === true,
    order_placement_pause_message:
      settings.social_links.order_placement_pause_message ??
      DEFAULT_ORDER_PLACEMENT_PAUSE_MESSAGE,
  })

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      order_placement_paused: settings.social_links.order_placement_paused === true,
      order_placement_pause_message:
        settings.social_links.order_placement_pause_message ??
        DEFAULT_ORDER_PLACEMENT_PAUSE_MESSAGE,
    }))
  }, [settings.social_links.order_placement_paused, settings.social_links.order_placement_pause_message])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await updateWebsiteSettings({
      business_name: form.business_name,
      tagline: form.tagline || null,
      phone: form.phone || null,
      whatsapp_number: form.whatsapp_number || null,
      email: form.email || null,
      address: form.address || null,
      about_text: form.about_text || null,
      social_links: {
        ...settings.social_links,
        facebook: form.facebook || undefined,
        instagram: form.instagram || undefined,
        youtube: form.youtube || undefined,
        referral_codes: formatReferralCodesForStorage(parseReferralCodeList(form.referral_codes)),
        order_placement_paused: form.order_placement_paused,
        order_placement_pause_message: form.order_placement_paused
          ? form.order_placement_pause_message.trim() || DEFAULT_ORDER_PLACEMENT_PAUSE_MESSAGE
          : undefined,
      },
      business_hours: {
        weekdays: form.weekdays || undefined,
        saturday: form.saturday || undefined,
        sunday: form.sunday || undefined,
      },
    })

    if (error) {
      showToast(error, 'error')
    } else {
      showToast('Settings saved successfully', 'success')
      await refresh()
    }

    setLoading(false)
  }

  const inputClass =
    'admin-input w-full placeholder:text-slate-400'

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
      <section className="space-y-4 rounded-xl border-2 border-amber-200 bg-amber-50/60 p-5">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Order placement</h3>
          <p className="mt-1 text-sm text-slate-600">
            Turn off cart and WhatsApp checkout when you are at capacity. Customers can still browse
            the catalogue.
          </p>
        </div>

        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={form.order_placement_paused}
            onChange={(e) =>
              setForm({ ...form, order_placement_paused: e.target.checked })
            }
            className="mt-1 h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
          />
          <span>
            <span className="block text-sm font-semibold text-slate-900">Order placement off</span>
            <span className="block text-xs text-slate-600">
              Blocks new cart enquiries and product WhatsApp orders on the storefront.
            </span>
          </span>
        </label>

        {form.order_placement_paused && (
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Message shown to customers
            </label>
            <textarea
              value={form.order_placement_pause_message}
              onChange={(e) =>
                setForm({ ...form, order_placement_pause_message: e.target.value })
              }
              rows={3}
              className={inputClass}
            />
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Business Information</h3>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Business Name</label>
          <input
            required
            value={form.business_name}
            onChange={(e) => setForm({ ...form, business_name: e.target.value })}
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Tagline</label>
          <input
            value={form.tagline}
            onChange={(e) => setForm({ ...form, tagline: e.target.value })}
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">About Text</label>
          <textarea
            value={form.about_text}
            onChange={(e) => setForm({ ...form, about_text: e.target.value })}
            rows={5}
            className={inputClass}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Contact Details</h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Phone</label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className={inputClass}
              placeholder="+91 9876543210"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              WhatsApp Number *
            </label>
            <input
              required
              value={form.whatsapp_number}
              onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })}
              className={inputClass}
              placeholder="919876543210 (country code + number)"
            />
            <p className="mt-1 text-xs text-slate-500">
              Used for all customer enquiry WhatsApp links
            </p>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Address</label>
          <textarea
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            rows={2}
            className={inputClass}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Referral Codes</h3>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Active referral codes
          </label>
          <textarea
            value={form.referral_codes}
            onChange={(e) => setForm({ ...form, referral_codes: e.target.value })}
            rows={4}
            className={inputClass}
            placeholder="PRIME50&#10;DIWALI2026&#10;One code per line"
          />
          <p className="mt-1 text-xs text-slate-500">
            Customers can enter these on the cart enquiry form. Leave empty to accept any code.
          </p>
          {form.referral_codes.trim() && (
            <p className="mt-2 text-xs font-medium text-slate-600">
              {formatReferralCodesForStorage(parseReferralCodeList(form.referral_codes)).length}{' '}
              code(s) configured
            </p>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Social Media</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {(['facebook', 'instagram', 'youtube'] as const).map((platform) => (
            <div key={platform}>
              <label className="mb-1 block text-sm font-medium capitalize text-slate-700">
                {platform}
              </label>
              <input
                value={form[platform]}
                onChange={(e) => setForm({ ...form, [platform]: e.target.value })}
                className={inputClass}
                placeholder={`https://${platform}.com/...`}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Business Hours</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Weekdays</label>
            <input
              value={form.weekdays}
              onChange={(e) => setForm({ ...form, weekdays: e.target.value })}
              className={inputClass}
              placeholder="9:00 AM - 8:00 PM"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Saturday</label>
            <input
              value={form.saturday}
              onChange={(e) => setForm({ ...form, saturday: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Sunday</label>
            <input
              value={form.sunday}
              onChange={(e) => setForm({ ...form, sunday: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>
      </section>

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-festive-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-festive-400 disabled:opacity-60"
      >
        {loading ? 'Saving...' : 'Save Settings'}
      </button>
    </form>
  )
}
