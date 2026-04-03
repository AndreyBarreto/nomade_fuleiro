import { vi, describe, it, expect, beforeEach } from 'vitest'

vi.mock('fs', () => ({
  default: {
    existsSync: vi.fn(),
    readdirSync: vi.fn(),
    readFileSync: vi.fn(),
  },
}))

import fs from 'fs'
import {
  FrontmatterSchema,
  formatDate,
  getAllPosts,
  getPostBySlug,
  getPostSlugs,
  getAllTags,
  getPostsByContinent,
  getPostsByCountry,
  getSeriesNavigation,
} from '@/lib/posts'

const mockFs = vi.mocked(fs)

// Minimal valid MDX frontmatter + content
const VALID_MDX = `---
title: "Test Post"
description: "A test post description"
date: "2024-06-15"
coverImage:
  src: "https://example.com/cover.jpg"
  alt: "Cover image"
  width: 1200
  height: 675
country: "Holanda"
city: "Amsterdã"
continent: "Europa"
duration: "3 dias"
budget: "$$$"
season: "Outono"
tags: ["europa", "museus"]
---
Post content here.
`

const DRAFT_MDX = `---
title: "Draft Post"
description: "Not published yet"
date: "2024-01-01"
coverImage:
  src: "https://example.com/draft.jpg"
  alt: "Draft cover"
  width: 800
  height: 600
country: "Brasil"
city: "São Paulo"
continent: "América do Sul"
duration: "2 dias"
budget: "$$"
season: "Verão"
tags: ["brasil"]
draft: true
---
Draft content.
`

const OLDER_MDX = VALID_MDX.replace('"2024-06-15"', '"2023-03-10"').replace(
  'tags: ["europa", "museus"]',
  'tags: ["arte"]'
)

beforeEach(() => {
  vi.resetAllMocks()
  // Default: one valid post
  mockFs.existsSync.mockReturnValue(true)
  mockFs.readdirSync.mockReturnValue(['post-a'] as unknown as ReturnType<typeof fs.readdirSync>)
  mockFs.readFileSync.mockReturnValue(VALID_MDX)
})

// ── FrontmatterSchema ────────────────────────────────────────────────────────

describe('FrontmatterSchema', () => {
  const valid = {
    title: 'Test',
    description: 'Desc',
    date: '2024-06-15',
    coverImage: { src: 'https://example.com/img.jpg', alt: 'Alt', width: 1200, height: 675 },
    country: 'Holanda',
    city: 'Amsterdã',
    continent: 'Europa',
    duration: '3 dias',
    budget: '$$$',
    season: 'Outono',
    tags: ['europa'],
  }

  it('parses a valid frontmatter object', () => {
    const result = FrontmatterSchema.safeParse(valid)
    expect(result.success).toBe(true)
  })

  it('coerces date string to Date object', () => {
    const result = FrontmatterSchema.safeParse(valid)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.date).toBeInstanceOf(Date)
    }
  })

  it('defaults draft to false when omitted', () => {
    const result = FrontmatterSchema.safeParse(valid)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.draft).toBe(false)
    }
  })

  it('defaults gallery and tips to empty arrays when omitted', () => {
    const result = FrontmatterSchema.safeParse(valid)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.gallery).toEqual([])
      expect(result.data.tips).toEqual([])
    }
  })

  it('fails when title is missing', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { title: _t, ...rest } = valid
    const result = FrontmatterSchema.safeParse(rest)
    expect(result.success).toBe(false)
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path[0])
      expect(paths).toContain('title')
    }
  })

  it('fails when coverImage.src is missing', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { src: _s, ...coverWithoutSrc } = valid.coverImage
    const result = FrontmatterSchema.safeParse({ ...valid, coverImage: coverWithoutSrc })
    expect(result.success).toBe(false)
  })

  it('fails when continent is not in the allowed enum', () => {
    const result = FrontmatterSchema.safeParse({ ...valid, continent: 'Antártida' })
    expect(result.success).toBe(false)
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path[0])
      expect(paths).toContain('continent')
    }
  })

  it('fails when budget is not in the allowed enum', () => {
    const result = FrontmatterSchema.safeParse({ ...valid, budget: '$$$$$' })
    expect(result.success).toBe(false)
  })
})

// ── formatDate ───────────────────────────────────────────────────────────────

describe('formatDate', () => {
  it('formats january dates in pt-BR', () => {
    expect(formatDate(new Date('2024-01-15T12:00:00Z'))).toMatch(/15.*janeiro.*2024/i)
  })

  it('formats december dates in pt-BR', () => {
    expect(formatDate(new Date('2024-12-01T12:00:00Z'))).toMatch(/1.*dezembro.*2024/i)
  })

  it('formats november dates in pt-BR', () => {
    expect(formatDate(new Date('2024-11-15T12:00:00Z'))).toMatch(/15.*novembro.*2024/i)
  })
})

// ── getPostSlugs ─────────────────────────────────────────────────────────────

describe('getPostSlugs', () => {
  it('returns slugs for existing posts', () => {
    mockFs.readdirSync.mockReturnValue(['post-a', 'post-b'] as unknown as ReturnType<typeof fs.readdirSync>)
    expect(getPostSlugs()).toEqual(['post-a', 'post-b'])
  })

  it('returns empty array when POSTS_DIR does not exist', () => {
    mockFs.existsSync.mockReturnValue(false)
    expect(getPostSlugs()).toEqual([])
  })

  it('excludes directories without index.mdx', () => {
    mockFs.readdirSync.mockReturnValue(['post-a', 'no-index'] as unknown as ReturnType<typeof fs.readdirSync>)
    mockFs.existsSync.mockImplementation((p: unknown) => {
      return !String(p).includes('no-index')
    })
    expect(getPostSlugs()).toEqual(['post-a'])
  })
})

// ── getPostBySlug ────────────────────────────────────────────────────────────

describe('getPostBySlug', () => {
  it('returns a post with the correct shape', () => {
    const post = getPostBySlug('test-post')
    expect(post.slug).toBe('test-post')
    expect(post.frontmatter.title).toBe('Test Post')
    expect(post.frontmatter.continent).toBe('Europa')
    expect(post.content).toContain('Post content here.')
  })

  it('throws when the file does not exist', () => {
    mockFs.readFileSync.mockImplementation(() => {
      throw new Error('ENOENT: no such file or directory')
    })
    expect(() => getPostBySlug('missing')).toThrow()
  })
})

// ── getAllPosts ───────────────────────────────────────────────────────────────

describe('getAllPosts', () => {
  it('filters out draft posts', () => {
    mockFs.readdirSync.mockReturnValue(['post-a', 'post-draft'] as unknown as ReturnType<typeof fs.readdirSync>)
    mockFs.readFileSync.mockImplementation((filePath: unknown) => {
      return String(filePath).includes('post-draft') ? DRAFT_MDX : VALID_MDX
    })
    const posts = getAllPosts()
    expect(posts).toHaveLength(1)
    expect(posts[0].slug).toBe('post-a')
  })

  it('sorts posts by date newest first', () => {
    mockFs.readdirSync.mockReturnValue(['post-old', 'post-new'] as unknown as ReturnType<typeof fs.readdirSync>)
    mockFs.readFileSync.mockImplementation((filePath: unknown) => {
      return String(filePath).includes('post-old') ? OLDER_MDX : VALID_MDX
    })
    const posts = getAllPosts()
    expect(posts[0].frontmatter.date.getFullYear()).toBe(2024)
    expect(posts[1].frontmatter.date.getFullYear()).toBe(2023)
  })

  it('returns empty array when no posts exist', () => {
    mockFs.existsSync.mockReturnValue(false)
    expect(getAllPosts()).toEqual([])
  })
})

// ── getAllTags ────────────────────────────────────────────────────────────────

describe('getAllTags', () => {
  it('returns deduplicated sorted tags from all posts', () => {
    mockFs.readdirSync.mockReturnValue(['post-a', 'post-b'] as unknown as ReturnType<typeof fs.readdirSync>)
    mockFs.readFileSync.mockImplementation((filePath: unknown) => {
      return String(filePath).includes('post-b') ? OLDER_MDX : VALID_MDX
    })
    // post-a has ['europa','museus'], post-b (OLDER_MDX) has ['arte']
    const tags = getAllTags()
    expect(tags).toEqual(['arte', 'europa', 'museus'])
  })

  it('returns empty array when no posts exist', () => {
    mockFs.existsSync.mockReturnValue(false)
    expect(getAllTags()).toEqual([])
  })

  it('deduplicates tags that appear in multiple posts', () => {
    mockFs.readdirSync.mockReturnValue(['post-a', 'post-b'] as unknown as ReturnType<typeof fs.readdirSync>)
    // Both posts have the same VALID_MDX with ['europa', 'museus']
    const tags = getAllTags()
    expect(tags).toEqual(['europa', 'museus'])
  })
})

// ── getPostsByContinent ───────────────────────────────────────────────────────

describe('getPostsByContinent', () => {
  it('returns only posts matching the continent', () => {
    mockFs.readdirSync.mockReturnValue(['post-eu', 'post-sa'] as unknown as ReturnType<typeof fs.readdirSync>)
    mockFs.readFileSync.mockImplementation((filePath: unknown) => {
      return String(filePath).includes('post-sa') ? DRAFT_MDX.replace('draft: true', 'draft: false') : VALID_MDX
    })
    const europePosts = getPostsByContinent('Europa')
    expect(europePosts).toHaveLength(1)
    expect(europePosts[0].frontmatter.continent).toBe('Europa')
  })
})

// ── getPostsByCountry ─────────────────────────────────────────────────────────

describe('getPostsByCountry', () => {
  it('returns only posts matching the country', () => {
    const posts = getPostsByCountry('Holanda')
    expect(posts).toHaveLength(1)
    expect(posts[0].frontmatter.country).toBe('Holanda')
  })

  it('returns empty array when no posts match the country', () => {
    expect(getPostsByCountry('Japão')).toEqual([])
  })
})

// ── getSeriesNavigation ───────────────────────────────────────────────────────

// MDX helpers for series tests
// Post A: oldest, tags: ['diario-2026', 'europa']
const SERIES_A_MDX = `---
title: "Series Post A"
description: "First in series"
date: "2026-01-01"
coverImage:
  src: "https://example.com/a.jpg"
  alt: "A"
  width: 1200
  height: 675
country: "Holanda"
city: "Amsterdã"
continent: "Europa"
duration: "3 dias"
budget: "$$$"
season: "Inverno"
tags: ["diario-2026", "europa"]
---
Content A.
`

// Post B: middle, tags: ['diario-2026', 'europa']
const SERIES_B_MDX = `---
title: "Series Post B"
description: "Second in series"
date: "2026-02-01"
coverImage:
  src: "https://example.com/b.jpg"
  alt: "B"
  width: 1200
  height: 675
country: "Portugal"
city: "Lisboa"
continent: "Europa"
duration: "4 dias"
budget: "$$$"
season: "Inverno"
tags: ["diario-2026", "europa"]
---
Content B.
`

// Post C: newest, tags: ['diario-2026', 'europa']
const SERIES_C_MDX = `---
title: "Series Post C"
description: "Third in series"
date: "2026-03-01"
coverImage:
  src: "https://example.com/c.jpg"
  alt: "C"
  width: 1200
  height: 675
country: "Holanda"
city: "Rotterdam"
continent: "Europa"
duration: "2 dias"
budget: "$$"
season: "Inverno"
tags: ["diario-2026", "europa"]
---
Content C.
`

// Post with no tags
const NO_TAGS_MDX = `---
title: "No Tags Post"
description: "Post with empty tags"
date: "2026-01-15"
coverImage:
  src: "https://example.com/notags.jpg"
  alt: "No Tags"
  width: 1200
  height: 675
country: "Holanda"
city: "Amsterdã"
continent: "Europa"
duration: "1 dia"
budget: "$"
season: "Inverno"
tags: []
---
No tags content.
`

// Post with a unique tag shared by no other post
const UNIQUE_TAG_MDX = VALID_MDX.replace(
  'tags: ["europa", "museus"]',
  'tags: ["one-of-a-kind"]'
)

// Draft post that shares the series tag
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SERIES_DRAFT_MDX = SERIES_B_MDX.replace('date: "2026-02-01"', 'date: "2026-02-01"').replace(
  'Content B.',
  'Content B.\n'
).replace('---\nContent B', 'draft: true\n---\nContent B')

describe('getSeriesNavigation', () => {
  it('returns null when post has no tags', () => {
    mockFs.readdirSync.mockReturnValue(['no-tags'] as unknown as ReturnType<typeof fs.readdirSync>)
    mockFs.readFileSync.mockReturnValue(NO_TAGS_MDX)
    const result = getSeriesNavigation('no-tags')
    expect(result).toBeNull()
  })

  it('returns null when no tag is shared by multiple posts', () => {
    mockFs.readdirSync.mockReturnValue(['solo-post'] as unknown as ReturnType<typeof fs.readdirSync>)
    mockFs.readFileSync.mockReturnValue(UNIQUE_TAG_MDX)
    const result = getSeriesNavigation('solo-post')
    expect(result).toBeNull()
  })

  it('throws when slug does not exist', () => {
    mockFs.readFileSync.mockImplementation(() => {
      throw new Error('ENOENT: no such file or directory')
    })
    expect(() => getSeriesNavigation('non-existent')).toThrow()
  })

  it('detects the most-shared tag as the series tag', () => {
    // post-a and post-c share 'europa' (all 3 posts) but also 'diario-2026' (2 of 3)
    // post-b only has 'europa' — so 'europa' appears in more posts than 'diario-2026'
    const ONLY_EUROPA_MDX = SERIES_B_MDX.replace(
      'tags: ["diario-2026", "europa"]',
      'tags: ["europa"]'
    )
    mockFs.readdirSync.mockReturnValue(
      ['post-a', 'post-b', 'post-c'] as unknown as ReturnType<typeof fs.readdirSync>
    )
    mockFs.readFileSync.mockImplementation((filePath: unknown) => {
      const p = String(filePath)
      if (p.includes('post-a')) return SERIES_A_MDX
      if (p.includes('post-b')) return ONLY_EUROPA_MDX
      return SERIES_C_MDX
    })
    // current post is post-a which has both tags; europa appears in 3 posts, diario-2026 in 2
    const result = getSeriesNavigation('post-a')
    expect(result).not.toBeNull()
    expect(result!.seriesTag).toBe('europa')
  })

  it('returns correct prev and next for a middle post in the series', () => {
    mockFs.readdirSync.mockReturnValue(
      ['post-a', 'post-b', 'post-c'] as unknown as ReturnType<typeof fs.readdirSync>
    )
    mockFs.readFileSync.mockImplementation((filePath: unknown) => {
      const p = String(filePath)
      if (p.includes('post-a')) return SERIES_A_MDX
      if (p.includes('post-b')) return SERIES_B_MDX
      return SERIES_C_MDX
    })
    const result = getSeriesNavigation('post-b')
    expect(result).not.toBeNull()
    expect(result!.prev).not.toBeNull()
    expect(result!.prev!.slug).toBe('post-a')
    expect(result!.next).not.toBeNull()
    expect(result!.next!.slug).toBe('post-c')
  })

  it('returns null prev for the first post in the series', () => {
    mockFs.readdirSync.mockReturnValue(
      ['post-a', 'post-b', 'post-c'] as unknown as ReturnType<typeof fs.readdirSync>
    )
    mockFs.readFileSync.mockImplementation((filePath: unknown) => {
      const p = String(filePath)
      if (p.includes('post-a')) return SERIES_A_MDX
      if (p.includes('post-b')) return SERIES_B_MDX
      return SERIES_C_MDX
    })
    const result = getSeriesNavigation('post-a')
    expect(result).not.toBeNull()
    expect(result!.prev).toBeNull()
    expect(result!.next).not.toBeNull()
  })

  it('returns null next for the last post in the series', () => {
    mockFs.readdirSync.mockReturnValue(
      ['post-a', 'post-b', 'post-c'] as unknown as ReturnType<typeof fs.readdirSync>
    )
    mockFs.readFileSync.mockImplementation((filePath: unknown) => {
      const p = String(filePath)
      if (p.includes('post-a')) return SERIES_A_MDX
      if (p.includes('post-b')) return SERIES_B_MDX
      return SERIES_C_MDX
    })
    const result = getSeriesNavigation('post-c')
    expect(result).not.toBeNull()
    expect(result!.next).toBeNull()
    expect(result!.prev).not.toBeNull()
  })

  it('returns correct seriesLength and currentIndex for a middle post', () => {
    mockFs.readdirSync.mockReturnValue(
      ['post-a', 'post-b', 'post-c'] as unknown as ReturnType<typeof fs.readdirSync>
    )
    mockFs.readFileSync.mockImplementation((filePath: unknown) => {
      const p = String(filePath)
      if (p.includes('post-a')) return SERIES_A_MDX
      if (p.includes('post-b')) return SERIES_B_MDX
      return SERIES_C_MDX
    })
    const result = getSeriesNavigation('post-b')
    expect(result).not.toBeNull()
    expect(result!.seriesLength).toBe(3)
    expect(result!.currentIndex).toBe(1)
  })

  it('excludes draft posts from the series count', () => {
    // post-a (published), post-b (draft), post-c (published) — all share 'diario-2026'
    // getAllPosts filters drafts, so series should only contain post-a and post-c
    const DRAFT_SERIES_MDX = SERIES_B_MDX.replace(
      'season: "Inverno"',
      'season: "Inverno"\ndraft: true'
    )
    mockFs.readdirSync.mockReturnValue(
      ['post-a', 'post-b', 'post-c'] as unknown as ReturnType<typeof fs.readdirSync>
    )
    mockFs.readFileSync.mockImplementation((filePath: unknown) => {
      const p = String(filePath)
      if (p.includes('post-a')) return SERIES_A_MDX
      if (p.includes('post-b')) return DRAFT_SERIES_MDX
      return SERIES_C_MDX
    })
    const result = getSeriesNavigation('post-a')
    expect(result).not.toBeNull()
    expect(result!.seriesLength).toBe(2)
    expect(result!.next!.slug).toBe('post-c')
  })
})
