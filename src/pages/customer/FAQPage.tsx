import { Link } from 'react-router-dom'
import { HelpCircle, MessageCircle, ChevronDown, Sparkles, ArrowRight } from 'lucide-react'
import { SEO } from '@/components/shared/SEO'
import { AnimateIn } from '@/components/customer/AnimateIn'
import { useSettings } from '@/contexts/SettingsContext'
import { buildWhatsAppContactUrl } from '@/lib/whatsapp'
import { getWhatsAppNumbers } from '@/lib/businessInfo'

import { PageHeader } from '@/components/customer/PageHeader'

const faqs = [
  {
    q: 'How do I place an order?',
    a: 'Browse products, add them to your cart, then go to Cart and tap "Send Enquiry on WhatsApp". Our team confirms availability, pricing, and delivery. There is no online payment.',
  },
  {
    q: 'Is there online payment?',
    a: 'We accept pre-payment only. After you send an enquiry, our team shares payment details and confirms your order before dispatch.',
  },
  {
    q: 'Can I enquire about multiple products?',
    a: 'Yes. Add multiple products to your cart, then send one combined WhatsApp enquiry with all items listed.',
  },
  {
    q: 'Are prices on the website final?',
    a: 'Prices shown are indicative. Send an enquiry and our team will provide current rates and stock.',
  },
  {
    q: 'Do you deliver across India?',
    a: 'Yes. Share your location on WhatsApp — we confirm delivery availability and charges for your area.',
  },
  {
    q: 'Is it safe to buy fireworks online?',
    a: 'We are a catalogue and enquiry platform. Orders are handled offline via WhatsApp with proper safety guidance.',
  },
  {
    q: 'What is the minimum order quantity?',
    a: 'Minimums vary by product. Enquire on WhatsApp for the item you need and we will confirm.',
  },
  {
    q: 'How quickly will you respond?',
    a: 'We reply on WhatsApp 24/7. Most enquiries get a response within minutes, including festival season.',
  },
]

const topicChips = ['Ordering', 'Pricing', 'Delivery', 'Safety & Support']

function FAQItem({ faq, index }: { faq: (typeof faqs)[number]; index: number }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#004D55]/10 bg-white shadow-sm transition hover:border-[#FFC107]/40 hover:shadow-md">
      <details className="group">
        <summary className="flex cursor-pointer list-none items-start gap-3 px-4 py-4 marker:content-none sm:px-5 sm:py-5 [&::-webkit-details-marker]:hidden">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFC107] font-display text-xs font-extrabold text-[#004D55]">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="min-w-0 flex-1 font-display text-base font-bold leading-snug text-[#004D55] sm:text-lg">
            {faq.q}
          </span>
          <ChevronDown className="mt-1 h-5 w-5 shrink-0 text-[#004D55]/40 transition-transform duration-300 group-open:rotate-180 group-open:text-[#FFC107]" />
        </summary>
        <div className="border-t border-[#004D55]/8 bg-[#FFF8E1]/30 px-4 py-4 text-sm leading-relaxed text-[#004D55]/85 sm:px-5 sm:pl-[3.85rem]">
          {faq.a}
        </div>
      </details>
    </div>
  )
}

export function FAQPage() {
  const { settings } = useSettings()
  const primaryWhatsApp = getWhatsAppNumbers(settings)[0]

  return (
    <>
      <SEO
        title="FAQ"
        description="Frequently asked questions about browsing products and sending enquiries at Prime Crackers."
        url="/faq"
      />

      <div className="bg-gradient-to-b from-[#FFF8E1]/30 to-white">
        <PageHeader contentClassName="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
            <nav className="flex items-center gap-2 text-xs text-white/70">
              <Link to="/" className="transition hover:text-[#FFC107]">Home</Link>
              <span aria-hidden="true">/</span>
              <span className="font-semibold text-white">FAQ</span>
            </nav>

            <AnimateIn animation="fade-up">
              <div className="mt-6 max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#FFC107]/35 bg-[#FFC107]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#FFC107]">
                  <HelpCircle className="h-3.5 w-3.5" />
                  Help Centre
                </div>

                <h1 className="mt-4 font-display text-3xl font-extrabold uppercase tracking-wide text-white sm:text-4xl lg:text-5xl">
                  Frequently Asked <span className="text-[#FFC107]">Questions</span>
                </h1>

                <p className="mt-4 text-sm leading-relaxed text-white/85 sm:text-base">
                  Clear answers on ordering, pricing, delivery, and enquiries — shop with confidence.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {topicChips.map((topic) => (
                    <span
                      key={topic}
                      className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </AnimateIn>
        </PageHeader>

        <section className="py-10 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
              {faqs.map((faq, i) => (
                <AnimateIn key={faq.q} animation="fade-up" delay={40 + i * 30} className="h-full">
                  <FAQItem faq={faq} index={i} />
                </AnimateIn>
              ))}
            </div>

            <AnimateIn animation="fade-up" delay={300}>
              <div className="relative mt-10 overflow-hidden rounded-2xl border border-[#004D55]/15 bg-gradient-to-r from-[#004D55] to-[#006670] shadow-lg">
                <div className="flex flex-col items-center justify-between gap-6 px-6 py-8 sm:flex-row sm:px-8">
                  <div className="text-center sm:text-left">
                    <Sparkles className="mx-auto h-6 w-6 text-[#FFC107] sm:mx-0" />
                    <h2 className="mt-3 font-display text-xl font-extrabold uppercase text-white sm:text-2xl">
                      Still have questions?
                    </h2>
                    <p className="mt-2 max-w-xl text-sm text-white/80">
                      Message us on WhatsApp 24/7 for product details, pricing, or delivery info.
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center justify-center gap-3">
                    {primaryWhatsApp && (
                      <a
                        href={buildWhatsAppContactUrl(primaryWhatsApp, 'Hello! I have a question.')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-bold text-white shadow-lg transition hover:brightness-110"
                      >
                        <MessageCircle className="h-4 w-4" />
                        Chat on WhatsApp
                      </a>
                    )}
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-2 rounded-full bg-[#FFC107] px-5 py-2.5 text-sm font-bold text-[#004D55] transition hover:bg-[#FFD54F]"
                    >
                      Contact Us
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </AnimateIn>
          </div>
        </section>
      </div>
    </>
  )
}
