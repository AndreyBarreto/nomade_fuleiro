'use client'

import { useState } from 'react'
import type { Frontmatter } from '@/lib/posts'
import PostCard from '@/components/PostCard'

type Budget = '$' | '$$' | '$$$' | '$$$$'

type LightPost = { slug: string; frontmatter: Frontmatter }

interface FilterBarProps {
  posts: LightPost[]
  continents: string[]
  budgets: Budget[]
  seasons: string[]
}

export default function FilterBar({ posts, continents, budgets, seasons }: FilterBarProps) {
  const [continent, setContinent] = useState<string | null>(null)
  const [budget, setBudget] = useState<Budget | null>(null)
  const [season, setSeason] = useState<string | null>(null)

  const filtered = posts.filter((p) => {
    if (continent && p.frontmatter.continent !== continent) return false
    if (budget && p.frontmatter.budget !== budget) return false
    if (season && p.frontmatter.season !== season) return false
    return true
  })

  const pillBase =
    'px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 cursor-pointer'
  const pillActive = 'bg-nomade-orange border-nomade-orange text-white'
  const pillInactive =
    'bg-white border-gray-200 text-gray-600 hover:border-nomade-orange hover:text-nomade-orange'

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col gap-5 mb-8">
        {/* Continents */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
            Continente
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setContinent(null)}
              className={`${pillBase} ${continent === null ? pillActive : pillInactive}`}
            >
              Todos
            </button>
            {continents.map((c) => (
              <button
                key={c}
                onClick={() => setContinent(continent === c ? null : c)}
                className={`${pillBase} ${continent === c ? pillActive : pillInactive}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Orçamento */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
            Orçamento
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setBudget(null)}
              className={`${pillBase} ${budget === null ? pillActive : pillInactive}`}
            >
              Todos
            </button>
            {budgets.map((b) => (
              <button
                key={b}
                onClick={() => setBudget(budget === b ? null : b)}
                className={`${pillBase} ${budget === b ? pillActive : pillInactive}`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        {/* Seasons */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
            Temporada
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSeason(null)}
              className={`${pillBase} ${season === null ? pillActive : pillInactive}`}
            >
              Todas
            </button>
            {seasons.map((s) => (
              <button
                key={s}
                onClick={() => setSeason(season === s ? null : s)}
                className={`${pillBase} ${season === s ? pillActive : pillInactive}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center gap-3 mb-8">
        <span className="h-px flex-1 bg-gray-100" />
        <span className="text-xs font-medium text-gray-400 uppercase tracking-widest whitespace-nowrap">
          {filtered.length} {filtered.length === 1 ? 'destino encontrado' : 'destinos encontrados'}
        </span>
        <span className="h-px flex-1 bg-gray-100" />
      </div>

      {/* Grid or empty state */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-400 py-16 text-sm">
          Nenhum destino encontrado com esses filtros. 😅
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
