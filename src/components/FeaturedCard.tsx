import Link from 'next/link'
import Image from 'next/image'
import type { Post } from '@/lib/posts'
import { formatDate } from '@/lib/utils'
import { CONTINENT_ACCENT } from '@/lib/constants'

export default function FeaturedCard({ post }: { post: Post }) {
  const { slug, frontmatter: f } = post
  const tagColor = CONTINENT_ACCENT[f.continent] ?? 'bg-gray-100 text-gray-600'

  return (
    <Link
      href={`/posts/${slug}/`}
      className="group relative flex flex-col md:flex-row rounded-3xl overflow-hidden bg-white
                 shadow-[6px_6px_0px_0px_rgba(26,26,46,0.08)] hover:shadow-[8px_8px_0px_0px_rgba(255,107,53,0.25)]
                 border border-gray-100 transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image — 60% on desktop */}
      <div className="md:w-[60%] aspect-[16/9] md:aspect-auto overflow-hidden bg-gray-100 shrink-0">
        <Image
          src={f.coverImage.src}
          alt={f.coverImage.alt}
          width={f.coverImage.width}
          height={f.coverImage.height}
          priority
          sizes="(max-width: 768px) 100vw, 60vw"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between p-7 md:p-10 gap-4">
        {/* Top */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${tagColor}`}>
              {f.continent}
            </span>
            <span className="text-xs text-gray-400">
              📍 {f.city}, {f.country}
            </span>
          </div>

          <h2 className="font-heading font-bold text-2xl md:text-3xl text-nomade-dark leading-snug group-hover:text-nomade-orange transition-colors">
            {f.title}
          </h2>

          <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
            {f.description}
          </p>
        </div>

        {/* Bottom */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex gap-3 text-xs text-gray-400">
            <span>⏱ {f.duration}</span>
            <span>·</span>
            <span>🗓 {f.season}</span>
          </div>
          <div className="flex items-center gap-1 text-nomade-orange text-sm font-medium">
            <time dateTime={f.date.toISOString()}>{formatDate(f.date)}</time>
          </div>
        </div>

        {/* CTA */}
        <span className="inline-flex items-center gap-2 text-nomade-orange font-semibold text-sm group-hover:gap-3 transition-all">
          Ler artigo <span>→</span>
        </span>
      </div>
    </Link>
  )
}
