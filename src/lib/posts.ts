import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { z } from 'zod'

const POSTS_DIR = path.join(process.cwd(), 'content/posts')

// ── Schemas ────────────────────────────────────────────────────────────────

export const ImageSchema = z.object({
  src: z.string().url(),
  alt: z.string(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  caption: z.string().optional(),
})

const PracticalInfoSchema = z.object({
  currency: z.string().optional(),
  language: z.string().optional(),
  visa: z.string().optional(),
  bestTime: z.string().optional(),
  transport: z.string().optional(),
  internet: z.string().optional(),
  emergencyNumber: z.string().optional(),
})

export const FrontmatterSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  coverImage: ImageSchema,
  country: z.string(),
  city: z.string(),
  continent: z.enum(['América do Sul', 'América do Norte', 'Europa', 'Ásia', 'África', 'Oceania']),
  duration: z.string(),
  budget: z.enum(['$', '$$', '$$$', '$$$$']),
  season: z.string(),
  tags: z.array(z.string()).default([]),
  gallery: z.array(ImageSchema).optional().default([]),
  tips: z.array(z.string()).optional().default([]),
  practicalInfo: PracticalInfoSchema.optional(),
  draft: z.boolean().default(false),
})

export type Frontmatter = z.infer<typeof FrontmatterSchema>
export type PostImage = z.infer<typeof ImageSchema>
export type PracticalInfoData = z.infer<typeof PracticalInfoSchema>

export interface Post {
  slug: string
  frontmatter: Frontmatter
  content: string
}

// ── Helpers ────────────────────────────────────────────────────────────────

export function getPostSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return []
  return fs.readdirSync(POSTS_DIR).filter((name) => {
    const postPath = path.join(POSTS_DIR, name, 'index.mdx')
    return fs.existsSync(postPath)
  })
}

export function getPostBySlug(slug: string): Post | null {
  if (!/^[a-z0-9-]+$/i.test(slug)) {
    return null;
  }
  const filePath = path.join(POSTS_DIR, slug, 'index.mdx')
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)

  const frontmatter = FrontmatterSchema.parse(data)
  return { slug, frontmatter, content }
}

let cachedPosts: Post[] | null = null

export function getAllPosts(): Post[] {
  if (cachedPosts) return cachedPosts
  cachedPosts = getPostSlugs()
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is Post => post !== null && !post.frontmatter.draft)
    .sort((a, b) => b.frontmatter.date.getTime() - a.frontmatter.date.getTime())
  return cachedPosts
}

export function getPostsByContinent(continent: string): Post[] {
  return getAllPosts().filter((p) => p.frontmatter.continent === continent)
}

export function getPostsByCountry(country: string): Post[] {
  return getAllPosts().filter((p) => p.frontmatter.country === country)
}

export function getAllTags(): string[] {
  const all = getAllPosts().flatMap((p) => p.frontmatter.tags)
  return Array.from(new Set(all)).sort()
}

export function getUniqueCountries(posts: Post[]): string[] {
  return Array.from(new Set(posts.map((p) => p.frontmatter.country)))
}

export function getUniqueContinents(posts: Post[]): string[] {
  return Array.from(new Set(posts.map((p) => p.frontmatter.continent)))
}


export interface SeriesNavigation {
  seriesTag: string
  prev: Post | null
  next: Post | null
  seriesLength: number
  currentIndex: number
}

export function getSeriesNavigation(currentPost: Post, allPosts: Post[]): SeriesNavigation | null {
  const currentTags = currentPost.frontmatter.tags
  if (currentTags.length === 0) return null

  // Count how many posts share each tag with the current post
  const tagCounts: Record<string, number> = {}
  for (const tag of currentTags) {
    const count = allPosts.filter((p) => p.frontmatter.tags.includes(tag)).length
    tagCounts[tag] = count
  }

  // Pick the tag with the most matches (ties: first wins)
  const seriesTag = currentTags.reduce((best, tag) =>
    tagCounts[tag] > tagCounts[best] ? tag : best
  )

  // If no tag appears in more than 1 post, there is no series
  if (tagCounts[seriesTag] <= 1) return null

  // Filter and sort by date ASC
  const seriesPosts = allPosts
    .filter((p) => p.frontmatter.tags.includes(seriesTag))
    .sort((a, b) => a.frontmatter.date.getTime() - b.frontmatter.date.getTime())

  const currentIndex = seriesPosts.findIndex((p) => p.slug === currentPost.slug)
  if (currentIndex === -1) return null

  return {
    seriesTag,
    prev: currentIndex > 0 ? seriesPosts[currentIndex - 1] : null,
    next: currentIndex < seriesPosts.length - 1 ? seriesPosts[currentIndex + 1] : null,
    seriesLength: seriesPosts.length,
    currentIndex,
  }
}
