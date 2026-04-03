import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import SeriesNav from '@/components/SeriesNav'
import { makePost } from '@/test/fixtures/posts'
import type { SeriesNavigation } from '@/lib/posts'

const prevPost = makePost({
  slug: 'amsterdam-dia-1',
  frontmatter: {
    ...makePost().frontmatter,
    title: 'Amsterdã — Dia 1',
    city: 'Amsterdã',
    country: 'Holanda',
  },
})

const nextPost = makePost({
  slug: 'amsterdam-dia-3',
  frontmatter: {
    ...makePost().frontmatter,
    title: 'Amsterdã — Dia 3',
    city: 'Amsterdã',
    country: 'Holanda',
  },
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const currentPost = makePost({
  slug: 'amsterdam-dia-2',
  frontmatter: {
    ...makePost().frontmatter,
    title: 'Amsterdã — Dia 2',
    city: 'Amsterdã',
    country: 'Holanda',
  },
})

function makeSeries(overrides: Partial<SeriesNavigation> = {}): SeriesNavigation {
  return {
    seriesTag: 'amsterdam-2024',
    prev: prevPost,
    next: nextPost,
    seriesLength: 3,
    currentIndex: 1,
    ...overrides,
  }
}

describe('SeriesNav', () => {
  it('renders the series tag name in the header', () => {
    render(<SeriesNav series={makeSeries({ seriesTag: 'viagem-amsterdam' })} />)
    expect(screen.getByText(/Série: viagem-amsterdam/i)).toBeInTheDocument()
  })

  it('renders "Post X de Y" badge with correct 1-based numbers', () => {
    render(<SeriesNav series={makeSeries({ currentIndex: 1, seriesLength: 5 })} />)
    // currentIndex is 0-based so display is currentIndex+1
    expect(screen.getByText('Post 2 de 5')).toBeInTheDocument()
  })

  it('renders "Post 1 de Y" when currentIndex is 0', () => {
    render(<SeriesNav series={makeSeries({ currentIndex: 0, seriesLength: 4 })} />)
    expect(screen.getByText('Post 1 de 4')).toBeInTheDocument()
  })

  it('renders previous post link with title and city when prev is non-null', () => {
    render(<SeriesNav series={makeSeries()} />)
    expect(screen.getByText('Amsterdã — Dia 1')).toBeInTheDocument()
    // city and country are rendered as separate text nodes inside one <span>;
    // use getAllByText to match the city portion that also appears in the next post span
    const citySpans = screen.getAllByText((_, el) =>
      el?.tagName === 'SPAN' && el.textContent === 'Amsterdã, Holanda',
    )
    expect(citySpans.length).toBeGreaterThanOrEqual(1)
  })

  it('renders next post link with title and city when next is non-null', () => {
    render(<SeriesNav series={makeSeries()} />)
    expect(screen.getByText('Amsterdã — Dia 3')).toBeInTheDocument()
  })

  it('previous link points to the correct post URL', () => {
    render(<SeriesNav series={makeSeries()} />)
    const links = screen.getAllByRole('link')
    const prevLink = links.find((l) => l.getAttribute('href') === '/posts/amsterdam-dia-1/')
    expect(prevLink).toBeTruthy()
  })

  it('next link points to the correct post URL', () => {
    render(<SeriesNav series={makeSeries()} />)
    const links = screen.getAllByRole('link')
    const nextLink = links.find((l) => l.getAttribute('href') === '/posts/amsterdam-dia-3/')
    expect(nextLink).toBeTruthy()
  })

  it('shows "Primeiro post da série" placeholder when prev is null (first post)', () => {
    render(<SeriesNav series={makeSeries({ prev: null, currentIndex: 0 })} />)
    expect(screen.getByText('Primeiro post da série')).toBeInTheDocument()
  })

  it('shows "Último post da série" placeholder when next is null (last post)', () => {
    render(<SeriesNav series={makeSeries({ next: null, currentIndex: 2 })} />)
    expect(screen.getByText('Último post da série')).toBeInTheDocument()
  })

  it('renders no links when first post in series (prev is null)', () => {
    render(<SeriesNav series={makeSeries({ prev: null, currentIndex: 0 })} />)
    const links = screen.getAllByRole('link')
    // Only the next link should be present
    expect(links).toHaveLength(1)
    expect(links[0].getAttribute('href')).toBe('/posts/amsterdam-dia-3/')
  })

  it('renders no links when last post in series (next is null)', () => {
    render(<SeriesNav series={makeSeries({ next: null, currentIndex: 2 })} />)
    const links = screen.getAllByRole('link')
    // Only the prev link should be present
    expect(links).toHaveLength(1)
    expect(links[0].getAttribute('href')).toBe('/posts/amsterdam-dia-1/')
  })

  it('renders both prev and next links when in the middle of a series', () => {
    render(<SeriesNav series={makeSeries()} />)
    const links = screen.getAllByRole('link')
    const hrefs = links.map((l) => l.getAttribute('href'))
    expect(hrefs).toContain('/posts/amsterdam-dia-1/')
    expect(hrefs).toContain('/posts/amsterdam-dia-3/')
  })

  it('renders "← Anterior" label for the previous slot', () => {
    render(<SeriesNav series={makeSeries()} />)
    expect(screen.getByText('← Anterior')).toBeInTheDocument()
  })

  it('renders "Próximo →" label for the next slot', () => {
    render(<SeriesNav series={makeSeries()} />)
    expect(screen.getByText('Próximo →')).toBeInTheDocument()
  })
})
