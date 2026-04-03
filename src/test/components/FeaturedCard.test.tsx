import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import FeaturedCard from '@/components/FeaturedCard'
import { makePost } from '../fixtures/posts'

describe('FeaturedCard', () => {
  const post = makePost()

  it('renders the post title as h2', () => {
    render(<FeaturedCard post={post} />)
    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading).toHaveTextContent('Test Post Title')
  })

  it('renders the description', () => {
    render(<FeaturedCard post={post} />)
    expect(screen.getByText('A test post description')).toBeInTheDocument()
  })

  it('renders "Read article" CTA', () => {
    render(<FeaturedCard post={post} />)
    expect(screen.getByText(/Ler artigo/)).toBeInTheDocument()
  })

  it('renders the continent badge', () => {
    render(<FeaturedCard post={post} />)
    expect(screen.getByText('Europa')).toBeInTheDocument()
  })

  it('link href points to /posts/{slug}/', () => {
    render(<FeaturedCard post={post} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/posts/test-post/')
  })

  it('renders city and country', () => {
    render(<FeaturedCard post={post} />)
    expect(screen.getByText(/Amsterdã, Holanda/)).toBeInTheDocument()
  })

  it('renders formatted date', () => {
    render(<FeaturedCard post={post} />)
    expect(screen.getByText(/junho.*2024|2024.*junho/i)).toBeInTheDocument()
  })

  it('renders the cover image', () => {
    render(<FeaturedCard post={post} />)
    const img = screen.getByAltText('Cover image alt text')
    expect(img).toBeInTheDocument()
  })
})
