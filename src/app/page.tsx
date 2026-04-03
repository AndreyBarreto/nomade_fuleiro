import type { Metadata } from 'next'
import { getAllPosts, getUniqueCountries, getUniqueContinents } from '@/lib/posts'
import PostCard from '@/components/PostCard'
import FeaturedCard from '@/components/FeaturedCard'
import HeroSection from '@/components/HeroSection'
import StatsBar from '@/components/StatsBar'
import { SITE_DESCRIPTION } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Home',
  description: SITE_DESCRIPTION,
}

export default function HomePage() {
  const posts = getAllPosts()
  const [featured, ...rest] = posts
  const timelinePosts = posts.filter((post) => post.frontmatter.showInTimeline)

  const continents = getUniqueContinents(timelinePosts)
  const countries = getUniqueCountries(timelinePosts)

  return (
    <>
      {/* Hero */}
      <HeroSection>
        <div className="px-4 max-w-5xl mx-auto text-center">
          <span className="inline-block text-nomade-orange font-body text-sm font-medium tracking-widest uppercase mb-4">
            blog de viagens
          </span>
          <h1 className="font-heading font-bold text-4xl md:text-6xl text-white leading-tight mb-6">
            Mundo afora,{' '}
            <span className="text-nomade-orange">sem frescura</span> 🌍
          </h1>
          <p className="text-white/60 text-lg max-w-xl mx-auto mb-12">{SITE_DESCRIPTION}</p>

          <StatsBar stats={[
            { value: countries.length, label: 'países', color: 'text-nomade-orange' },
            { value: continents.length, label: 'continentes', color: 'text-nomade-mint' },
            { value: posts.length, label: 'artigos', color: 'text-nomade-yellow' },
          ]} />
        </div>
      </HeroSection>

      <div className="max-w-5xl mx-auto px-4 py-14">
        {posts.length === 0 ? (
          <p className="text-center text-gray-400 py-16">Nenhum post publicado ainda.</p>
        ) : (
          <>
            {/* Featured post */}
            {featured && (
              <section className="mb-14">
                <div className="flex items-center gap-3 mb-6">
                  <span className="h-px flex-1 bg-gray-100" />
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">
                    mais recente
                  </span>
                  <span className="h-px flex-1 bg-gray-100" />
                </div>
                <FeaturedCard post={featured} />
              </section>
            )}

            {/* Rest of posts */}
            {rest.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <span className="h-px flex-1 bg-gray-100" />
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">
                    todos os destinos
                  </span>
                  <span className="h-px flex-1 bg-gray-100" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rest.map((post) => (
                    <PostCard key={post.slug} post={post} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </>
  )
}
