import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts, getUniqueCountries, getUniqueContinents } from '@/lib/posts'
import { BUDGET_LABEL, COUNTRY_FLAGS } from '@/lib/constants'
import HeroSection from '@/components/HeroSection'
import StatsBar from '@/components/StatsBar'

export const metadata: Metadata = {
  title: 'Sobre',
  description: 'Quem é o Nômade Fuleiro e a história de cada viagem.',
}

function formatMonthYear(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export default function SobrePage() {
  const posts = getAllPosts()

  const countries = getUniqueCountries(posts)
  const continents = getUniqueContinents(posts)

  // Timeline: oldest first
  const timeline = [...posts].sort(
    (a, b) => a.frontmatter.date.getTime() - b.frontmatter.date.getTime()
  )

  return (
    <>
      {/* ── Hero ── */}
      <HeroSection>
        <div className="px-4 max-w-5xl mx-auto text-center">
          <div className="text-6xl mb-6 select-none">✈️ 🎒</div>

          <span className="inline-block text-nomade-orange font-body text-sm font-medium tracking-widest uppercase mb-4">
            quem sou eu
          </span>

          <h1 className="font-heading font-bold text-4xl md:text-5xl text-white leading-tight mb-6">
            Oi, eu sou o{' '}
            <span className="text-nomade-orange">Nômade Fuleiro</span>
          </h1>

          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-4 font-body leading-relaxed">
            Viajante assumidamente pão-duro, fã incondicional de hostel com café da manhã incluso,
            devorador de street food e descobridor de atalhos que o Booking.com nunca vai te mostrar.
          </p>
          <p className="text-white/50 text-base max-w-xl mx-auto mb-12 font-body leading-relaxed">
            Acredito que o mundo cabe no bolso — desde que você saiba dobrar a roupa certa e nunca
            dispense uma promoção de passagem. Neste blog compartilho roteiros honestos, sem
            patrocínio, sem filtro e sem frescura.
          </p>

          <StatsBar stats={[
            { value: posts.length, label: 'posts publicados', color: 'text-nomade-orange' },
            { value: countries.length, label: 'países visitados', color: 'text-nomade-mint' },
            { value: continents.length, label: 'continentes', color: 'text-nomade-yellow' },
            { value: '∞', label: 'kebabs consumidos', color: 'text-nomade-coral' },
          ]} />
        </div>
      </HeroSection>

      {/* ── Timeline ── */}
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="flex items-center gap-3 mb-12">
          <span className="h-px flex-1 bg-gray-100" />
          <span className="text-xs font-medium text-gray-400 uppercase tracking-widest font-body">
            minha jornada
          </span>
          <span className="h-px flex-1 bg-gray-100" />
        </div>

        {timeline.length === 0 ? (
          <p className="text-center text-gray-400 py-16 font-body">
            Nenhuma aventura registrada ainda. Em breve!
          </p>
        ) : (
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-nomade-orange/30" />

            <div className="space-y-10">
              {timeline.map((post) => {
                const flag = COUNTRY_FLAGS[post.frontmatter.country] ?? '🌍'
                const monthYear = formatMonthYear(post.frontmatter.date)
                const budgetLabel = BUDGET_LABEL[post.frontmatter.budget] ?? post.frontmatter.budget

                return (
                  <div key={post.slug} className="relative pl-12">
                    {/* Orange dot */}
                    <div className="absolute left-2.5 top-3 w-3 h-3 rounded-full bg-nomade-orange border-2 border-white shadow-sm -translate-x-1/2" />

                    {/* Card */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      {/* Date */}
                      <p className="text-nomade-orange font-body text-xs font-semibold uppercase tracking-widest mb-2">
                        {monthYear}
                      </p>

                      {/* Destination */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h3 className="font-heading font-bold text-lg text-nomade-dark leading-snug">
                          {flag} {post.frontmatter.city},{' '}
                          <span className="text-gray-500 font-medium">{post.frontmatter.country}</span>
                        </h3>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="inline-block bg-nomade-orange/10 text-nomade-orange text-xs font-bold px-2 py-0.5 rounded-full">
                            {post.frontmatter.budget}
                          </span>
                          <span className="inline-block bg-nomade-mint/10 text-nomade-mint text-xs font-medium px-2 py-0.5 rounded-full">
                            {post.frontmatter.season}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 font-body text-sm leading-relaxed mb-4">
                        {post.frontmatter.description}
                      </p>

                      {/* Footer row */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-gray-400 font-body">
                          <span>🕐 {post.frontmatter.duration}</span>
                          <span>·</span>
                          <span>{budgetLabel}</span>
                        </div>
                        <Link
                          href={`/posts/${post.slug}/`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-nomade-orange hover:text-nomade-coral transition-colors font-body"
                        >
                          Ler mais →
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
