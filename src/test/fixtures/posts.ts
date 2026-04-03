import type { Post } from '@/lib/posts'

export function makePost(overrides: Partial<Post> = {}): Post {
  const base: Post = {
    slug: 'test-post',
    content: '## Test content\n\nSome text here.',
    frontmatter: {
      title: 'Test Post Title',
      description: 'A test post description',
      date: new Date('2024-06-15T00:00:00.000Z'),
      coverImage: {
        src: 'https://example.com/cover.jpg',
        alt: 'Cover image alt text',
        width: 1200,
        height: 675,
      },
      country: 'Holanda',
      city: 'Amsterdã',
      continent: 'Europa',
      duration: '3 dias',
      budget: '$$$',
      season: 'Outono',
      tags: ['europa', 'museus'],
      gallery: [],
      tips: [],
      practicalInfo: undefined,
      draft: false,
    },
  }

  return {
    ...base,
    ...overrides,
    frontmatter: {
      ...base.frontmatter,
      ...(overrides.frontmatter ?? {}),
    },
  }
}

export const DRAFT_POST = makePost({
  slug: 'draft-post',
  frontmatter: {
    title: 'Draft Post',
    description: 'Not published yet',
    date: new Date('2024-01-01T00:00:00.000Z'),
    coverImage: {
      src: 'https://example.com/draft.jpg',
      alt: 'Draft',
      width: 800,
      height: 600,
    },
    country: 'Brasil',
    city: 'São Paulo',
    continent: 'América do Sul',
    duration: '2 dias',
    budget: '$$',
    season: 'Verão',
    tags: ['brasil'],
    gallery: [],
    tips: [],
    practicalInfo: undefined,
    draft: true,
  },
})

export const POST_WITH_GALLERY = makePost({
  slug: 'post-with-gallery',
  frontmatter: {
    ...makePost().frontmatter,
    title: 'Post With Gallery',
    gallery: [
      {
        src: 'https://example.com/gallery1.jpg',
        alt: 'Gallery image 1',
        width: 800,
        height: 600,
        caption: 'Caption one',
      },
      {
        src: 'https://example.com/gallery2.jpg',
        alt: 'Gallery image 2',
        width: 800,
        height: 600,
      },
    ],
  },
})
