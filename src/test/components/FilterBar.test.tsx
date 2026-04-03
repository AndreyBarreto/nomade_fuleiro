import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FilterBar from '@/components/FilterBar'
import { makePost } from '@/test/fixtures/posts'
import type { Post } from '@/lib/posts'

type Budget = '$' | '$$' | '$$$' | '$$$$'

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const europePost = makePost({
  slug: 'amsterdam',
  frontmatter: {
    ...makePost().frontmatter,
    title: 'Amsterdã',
    continent: 'Europa',
    budget: '$$$',
    season: 'Outono',
  },
})

const southAmericaPost = makePost({
  slug: 'rio',
  frontmatter: {
    ...makePost().frontmatter,
    title: 'Rio de Janeiro',
    continent: 'América do Sul',
    budget: '$$',
    season: 'Verão',
  },
})

const asiaPost = makePost({
  slug: 'tokyo',
  frontmatter: {
    ...makePost().frontmatter,
    title: 'Tóquio',
    continent: 'Ásia',
    budget: '$$$',
    season: 'Primavera',
  },
})

const allPosts: Post[] = [europePost, southAmericaPost, asiaPost]
const continents = ['Europa', 'América do Sul', 'Ásia']
const budgets: Budget[] = ['$$', '$$$']
const seasons = ['Outono', 'Verão', 'Primavera']

function renderFilterBar(posts: Post[] = allPosts) {
  return render(
    <FilterBar
      posts={posts}
      continents={continents}
      budgets={budgets}
      seasons={seasons}
    />,
  )
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('FilterBar', () => {
  describe('initial render', () => {
    it('renders all posts when no filters are active', () => {
      renderFilterBar()
      expect(screen.getByText('Amsterdã')).toBeInTheDocument()
      expect(screen.getByText('Rio de Janeiro')).toBeInTheDocument()
      expect(screen.getByText('Tóquio')).toBeInTheDocument()
    })

    it('shows correct result count for all posts', () => {
      renderFilterBar()
      expect(screen.getByText('3 destinos encontrados')).toBeInTheDocument()
    })

    it('shows singular "destino encontrado" when exactly one post matches', () => {
      renderFilterBar([europePost])
      expect(screen.getByText('1 destino encontrado')).toBeInTheDocument()
    })

    it('renders filter pills for each provided continent', () => {
      renderFilterBar()
      expect(screen.getByRole('button', { name: 'Europa' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'América do Sul' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Ásia' })).toBeInTheDocument()
    })

    it('renders filter pills for each provided budget', () => {
      renderFilterBar()
      expect(screen.getByRole('button', { name: '$$' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '$$$' })).toBeInTheDocument()
    })

    it('renders filter pills for each provided season', () => {
      renderFilterBar()
      expect(screen.getByRole('button', { name: 'Outono' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Verão' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Primavera' })).toBeInTheDocument()
    })
  })

  describe('continent filter', () => {
    it('filters posts to the selected continent', async () => {
      renderFilterBar()
      await userEvent.click(screen.getByRole('button', { name: 'Europa' }))
      expect(screen.getByText('Amsterdã')).toBeInTheDocument()
      expect(screen.queryByText('Rio de Janeiro')).not.toBeInTheDocument()
      expect(screen.queryByText('Tóquio')).not.toBeInTheDocument()
    })

    it('updates result count after continent filter is applied', async () => {
      renderFilterBar()
      await userEvent.click(screen.getByRole('button', { name: 'Europa' }))
      expect(screen.getByText('1 destino encontrado')).toBeInTheDocument()
    })

    it('deselects continent filter when the active pill is clicked again', async () => {
      renderFilterBar()
      await userEvent.click(screen.getByRole('button', { name: 'Europa' }))
      await userEvent.click(screen.getByRole('button', { name: 'Europa' }))
      expect(screen.getByText('3 destinos encontrados')).toBeInTheDocument()
      expect(screen.getByText('Rio de Janeiro')).toBeInTheDocument()
    })

    it('resets continent filter when "Todos" button is clicked', async () => {
      renderFilterBar()
      await userEvent.click(screen.getByRole('button', { name: 'Europa' }))
      const continentGroup = screen.getByText('Continente').closest('div')!
      await userEvent.click(within(continentGroup).getByRole('button', { name: 'Todos' }))
      expect(screen.getByText('3 destinos encontrados')).toBeInTheDocument()
    })

    it('active continent pill has the orange active style', async () => {
      renderFilterBar()
      const europeBtn = screen.getByRole('button', { name: 'Europa' })
      await userEvent.click(europeBtn)
      expect(europeBtn.className).toMatch(/bg-nomade-orange/)
    })
  })

  describe('budget filter', () => {
    it('filters posts to the selected budget', async () => {
      renderFilterBar()
      await userEvent.click(screen.getByRole('button', { name: '$$' }))
      expect(screen.getByText('Rio de Janeiro')).toBeInTheDocument()
      expect(screen.queryByText('Amsterdã')).not.toBeInTheDocument()
      expect(screen.queryByText('Tóquio')).not.toBeInTheDocument()
    })

    it('deselects budget filter when the active pill is clicked again', async () => {
      renderFilterBar()
      await userEvent.click(screen.getByRole('button', { name: '$$' }))
      await userEvent.click(screen.getByRole('button', { name: '$$' }))
      expect(screen.getByText('3 destinos encontrados')).toBeInTheDocument()
    })
  })

  describe('season filter', () => {
    it('filters posts to the selected season', async () => {
      renderFilterBar()
      await userEvent.click(screen.getByRole('button', { name: 'Verão' }))
      expect(screen.getByText('Rio de Janeiro')).toBeInTheDocument()
      expect(screen.queryByText('Amsterdã')).not.toBeInTheDocument()
      expect(screen.queryByText('Tóquio')).not.toBeInTheDocument()
    })

    it('deselects season filter when the active pill is clicked again', async () => {
      renderFilterBar()
      await userEvent.click(screen.getByRole('button', { name: 'Verão' }))
      await userEvent.click(screen.getByRole('button', { name: 'Verão' }))
      expect(screen.getByText('3 destinos encontrados')).toBeInTheDocument()
    })
  })

  describe('combined filters (AND logic)', () => {
    it('applies continent AND budget filters together', async () => {
      renderFilterBar()
      await userEvent.click(screen.getByRole('button', { name: 'Europa' }))
      await userEvent.click(screen.getByRole('button', { name: '$$$' }))
      // europePost matches both Europa + $$$
      expect(screen.getByText('Amsterdã')).toBeInTheDocument()
      // asiaPost has $$$ but not Europa
      expect(screen.queryByText('Tóquio')).not.toBeInTheDocument()
      expect(screen.queryByText('Rio de Janeiro')).not.toBeInTheDocument()
    })

    it('shows zero results when combined filters match no posts', async () => {
      renderFilterBar()
      // América do Sul has budget $$ but we filter for $$$ — no match
      await userEvent.click(screen.getByRole('button', { name: 'América do Sul' }))
      await userEvent.click(screen.getByRole('button', { name: '$$$' }))
      expect(
        screen.getByText('Nenhum destino encontrado com esses filtros. 😅'),
      ).toBeInTheDocument()
    })

    it('applies continent AND season filters together', async () => {
      renderFilterBar()
      await userEvent.click(screen.getByRole('button', { name: 'Ásia' }))
      await userEvent.click(screen.getByRole('button', { name: 'Primavera' }))
      expect(screen.getByText('Tóquio')).toBeInTheDocument()
      expect(screen.queryByText('Amsterdã')).not.toBeInTheDocument()
      expect(screen.queryByText('Rio de Janeiro')).not.toBeInTheDocument()
    })
  })

  describe('empty state', () => {
    it('shows empty state message when no posts match the active filters', async () => {
      renderFilterBar()
      await userEvent.click(screen.getByRole('button', { name: 'Europa' }))
      await userEvent.click(screen.getByRole('button', { name: 'Verão' }))
      expect(
        screen.getByText('Nenhum destino encontrado com esses filtros. 😅'),
      ).toBeInTheDocument()
    })

    it('shows zero result count when no posts match', async () => {
      renderFilterBar()
      await userEvent.click(screen.getByRole('button', { name: 'Europa' }))
      await userEvent.click(screen.getByRole('button', { name: 'Verão' }))
      expect(screen.getByText('0 destinos encontrados')).toBeInTheDocument()
    })
  })
})
