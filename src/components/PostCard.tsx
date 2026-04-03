import Link from 'next/link'
import Image from 'next/image'
import type { Frontmatter } from '@/lib/posts'
import { formatDate } from '@/lib/utils'
import { CONTINENT_ACCENT, BUDGET_LABEL } from '@/lib/constants'

type PostCardPost = { slug: string; frontmatter: Frontmatter }

export default function PostCard({ post }: { post: PostCardPost }) {
  const { slug, frontmatter: f } = post
  const accentClass = CONTINENT_ACCENT[f.continent] ?? 'bg-gray-100 text-gray-600'

  return (
    <Link
      href={`/posts/${slug}/`}
      className="group flex flex-col rounded-2xl overflow-hidden bg-white
                 border border-gray-100
                 shadow-[4px_4px_0px_0px_rgba(26,26,46,0.06)]
                 hover:shadow-[6px_6px_0px_0px_rgba(255,107,53,0.2)]
                 hover:-translate-y-1 transition-all duration-300"
    >
      {/* Cover image */}
      <div className="aspect-[4/3] overflow-hidden bg-gray-100 relative">
        <Image
          src={f.coverImage.src}
          alt={f.coverImage.alt}
          width={f.coverImage.width}
          height={f.coverImage.height}
          loading="lazy"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Continent badge over image */}
        <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm ${accentClass}`}>
          {f.continent}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Location + date */}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>📍 {f.city}, {f.country}</span>
          <time dateTime={f.date.toISOString()}>{formatDate(f.date)}</time>
        </div>

        {/* Title */}
        <h2 className="font-heading font-bold text-base text-nomade-dark leading-snug group-hover:text-nomade-orange transition-colors line-clamp-2">
          {f.title}
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-500 line-clamp-2 flex-1">{f.description}</p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
          <div className="flex gap-2 text-xs text-gray-400">
            <span>⏱ {f.duration}</span>
            <span>·</span>
            <span>{BUDGET_LABEL[f.budget] ?? f.budget}</span>
          </div>
          <span className="text-nomade-orange text-xs font-semibold group-hover:translate-x-1 transition-transform">
            →
          </span>
        </div>
      </div>
    </Link>
  )
}
