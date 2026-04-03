import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import HomePage from '@/app/page'
import { makePost } from '../fixtures/posts'

const { mockGetAllPosts } = vi.hoisted(() => ({
  mockGetAllPosts: vi.fn(),
}))

vi.mock('@/lib/posts', async () => {
  const actual = await vi.importActual<typeof import('@/lib/posts')>('@/lib/posts')
  return {
    ...actual,
    getAllPosts: mockGetAllPosts,
  }
})

function expectStatValue(label: string, expectedValue: string) {
  const statLabel = screen.getByText(label)
  const statValue = statLabel.previousElementSibling
  expect(statValue).toHaveTextContent(expectedValue)
}

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('ignores posts hidden from the timeline when counting countries and continents', () => {
    mockGetAllPosts.mockReturnValue([
      makePost({
        slug: 'amsterdam',
        frontmatter: {
          country: 'Holanda',
          city: 'Amsterdã',
          continent: 'Europa',
          showInTimeline: true,
        },
      }),
      makePost({
        slug: 'manifesto',
        frontmatter: {
          country: 'Brasil',
          city: 'Florianópolis',
          continent: 'América do Sul',
          showInTimeline: false,
        },
      }),
      makePost({
        slug: 'lisboa',
        frontmatter: {
          country: 'Portugal',
          city: 'Lisboa',
          continent: 'Europa',
          showInTimeline: true,
        },
      }),
    ])

    render(<HomePage />)

    expectStatValue('países', '2')
    expectStatValue('continentes', '1')
    expectStatValue('artigos', '3')
  })
})
