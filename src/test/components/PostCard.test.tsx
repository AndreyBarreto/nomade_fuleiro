import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import PostCard from '@/components/PostCard'
import { makePost } from '../fixtures/posts'

describe('PostCard', () => {
  const post = makePost()

  it('renders the post title', () => {
    render(<PostCard post={post} />)
    expect(screen.getByText('Test Post Title')).toBeInTheDocument()
  })

  it('renders city and country', () => {
    render(<PostCard post={post} />)
    expect(screen.getByText(/Amsterdã, Holanda/)).toBeInTheDocument()
  })

  it('renders the cover image with correct alt text', () => {
    render(<PostCard post={post} />)
    const img = screen.getByAltText('Cover image alt text')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', 'https://example.com/cover.jpg')
  })

  it('renders the continent badge', () => {
    render(<PostCard post={post} />)
    expect(screen.getByText('Europa')).toBeInTheDocument()
  })

  it('renders duration', () => {
    render(<PostCard post={post} />)
    expect(screen.getByText(/3 dias/)).toBeInTheDocument()
  })

  it('renders the budget label ($$$ → Expensive)', () => {
    render(<PostCard post={post} />)
    expect(screen.getByText('Caro')).toBeInTheDocument()
  })

  it('renders the description', () => {
    render(<PostCard post={post} />)
    expect(screen.getByText('A test post description')).toBeInTheDocument()
  })

  it('link href points to /posts/{slug}/', () => {
    render(<PostCard post={post} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/posts/test-post/')
  })

  it('renders formatted date', () => {
    render(<PostCard post={post} />)
    // 2024-06-15 → June 2024 in pt-BR locale
    expect(screen.getByText(/junho.*2024|2024.*junho/i)).toBeInTheDocument()
  })
})
