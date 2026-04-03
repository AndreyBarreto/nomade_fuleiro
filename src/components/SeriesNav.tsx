import Link from 'next/link'
import type { SeriesNavigation } from '@/lib/posts'

interface Props {
  series: SeriesNavigation
}

export default function SeriesNav({ series }: Props) {
  const { seriesTag, prev, next, seriesLength, currentIndex } = series

  return (
    <nav className="mt-10 pt-8 border-t border-gray-100">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <span className="font-heading font-semibold text-nomade-dark text-sm uppercase tracking-wide">
          Série: {seriesTag}
        </span>
        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-nomade-orange text-white">
          Post {currentIndex + 1} de {seriesLength}
        </span>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Previous */}
        {prev ? (
          <Link
            href={`/posts/${prev.slug}/`}
            className="group flex flex-col gap-1 p-4 rounded-xl border border-gray-200 bg-nomade-gray hover:border-nomade-orange hover:shadow-sm transition-all"
          >
            <span className="text-xs font-medium text-nomade-orange">← Anterior</span>
            <span className="font-heading font-semibold text-nomade-dark text-sm leading-snug group-hover:text-nomade-orange transition-colors line-clamp-2">
              {prev.frontmatter.title}
            </span>
            <span className="text-xs text-gray-400 mt-0.5">
              {prev.frontmatter.city}, {prev.frontmatter.country}
            </span>
          </Link>
        ) : (
          <div className="flex flex-col gap-1 p-4 rounded-xl border border-gray-100 bg-gray-50 opacity-50 cursor-default">
            <span className="text-xs font-medium text-gray-400">← Anterior</span>
            <span className="font-heading font-semibold text-gray-300 text-sm">
              Primeiro post da série
            </span>
          </div>
        )}

        {/* Next */}
        {next ? (
          <Link
            href={`/posts/${next.slug}/`}
            className="group flex flex-col gap-1 p-4 rounded-xl border border-gray-200 bg-nomade-gray hover:border-nomade-orange hover:shadow-sm transition-all text-right"
          >
            <span className="text-xs font-medium text-nomade-orange">Próximo →</span>
            <span className="font-heading font-semibold text-nomade-dark text-sm leading-snug group-hover:text-nomade-orange transition-colors line-clamp-2">
              {next.frontmatter.title}
            </span>
            <span className="text-xs text-gray-400 mt-0.5">
              {next.frontmatter.city}, {next.frontmatter.country}
            </span>
          </Link>
        ) : (
          <div className="flex flex-col gap-1 p-4 rounded-xl border border-gray-100 bg-gray-50 opacity-50 cursor-default text-right">
            <span className="text-xs font-medium text-gray-400">Próximo →</span>
            <span className="font-heading font-semibold text-gray-300 text-sm">
              Último post da série
            </span>
          </div>
        )}
      </div>
    </nav>
  )
}
