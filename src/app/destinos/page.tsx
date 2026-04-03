import type { Metadata } from 'next'
import { getAllPosts, getUniqueContinents } from '@/lib/posts'
import FilterBar from '@/components/FilterBar'
import HeroSection from '@/components/HeroSection'
import type { Post } from '@/lib/posts'

export const metadata: Metadata = {
  title: 'Destinos',
  description: 'Todos os cantos do mundo, sem frescura.',
}

export default function DestinosPage() {
  const posts: Post[] = getAllPosts()

  const continents = getUniqueContinents(posts)
  const budgets = Array.from(new Set(posts.map((p) => p.frontmatter.budget))) as ('$' | '$$' | '$$$' | '$$$$')[]
  const seasons = Array.from(new Set(posts.map((p) => p.frontmatter.season)))

  return (
    <>
      {/* Hero */}
      <HeroSection>
        <div className="px-4 max-w-5xl mx-auto text-center">
          <span className="inline-block text-nomade-orange font-body text-sm font-medium tracking-widest uppercase mb-4">
            explore o mapa
          </span>
          <h1 className="font-heading font-bold text-4xl md:text-6xl text-white leading-tight mb-4">
            Destinos
          </h1>
          <p className="text-white/60 text-lg max-w-xl mx-auto">
            Todos os cantos do mundo, sem frescura.
          </p>
        </div>
      </HeroSection>

      {/* Filters + Grid */}
      <div className="max-w-5xl mx-auto px-4 py-14">
        <FilterBar
          posts={posts.map(({ slug, frontmatter }) => ({ slug, frontmatter }))}
          continents={continents}
          budgets={budgets}
          seasons={seasons}
        />
      </div>
    </>
  )
}
