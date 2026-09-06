import { useSettings } from '@/contexts/SettingsContext'
import { INSTAGRAM_FEED_IMAGES, getInstagramHandle } from '@/lib/instagramFeed'

export function InstagramFeedSection() {
  const { settings } = useSettings()
  const instagramUrl = settings.social_links.instagram
  const handle = getInstagramHandle(instagramUrl)

  return (
    <section className="bg-white py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-navy-900 sm:text-4xl">Instagram</h2>
          {instagramUrl ? (
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm text-navy-600 transition hover:text-gold-600 sm:text-base"
            >
              Follow us on Instagram {handle}
            </a>
          ) : (
            <p className="mt-2 text-sm text-navy-600 sm:text-base">Follow us on Instagram {handle}</p>
          )}
        </div>

        <div className="mt-8 flex gap-3 overflow-x-auto pb-2 sm:mt-10 sm:grid sm:grid-cols-5 sm:gap-4 sm:overflow-visible sm:pb-0">
          {INSTAGRAM_FEED_IMAGES.map((image) => {
            const content = (
              <div className="relative aspect-square w-[42vw] shrink-0 overflow-hidden rounded-xl sm:w-auto">
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            )

            if (!instagramUrl) return <div key={image.src}>{content}</div>

            return (
              <a
                key={image.src}
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View ${image.alt} on Instagram`}
                className="block"
              >
                {content}
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
