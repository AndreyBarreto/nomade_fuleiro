import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getPostBySlug, getPostSlugs, getSeriesNavigation, getAllPosts } from '@/lib/posts'
import { formatDate } from '@/lib/utils'
import { SITE_URL } from '@/lib/constants'
import JsonLd from '@/components/seo/JsonLd'
import { mdxComponents } from '@/components/mdx'
import PhotoGallery from '@/components/mdx/PhotoGallery'
import PracticalInfo from '@/components/mdx/PracticalInfo'
import Link from 'next/link'
import SeriesNav from '@/components/SeriesNav'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params
    const post = getPostBySlug(slug)
    if (!post) return {}
    const { frontmatter: f } = post

    return {
      title: f.title,
      description: f.description,
      openGraph: {
        title: f.title,
        description: f.description,
        type: 'article',
        publishedTime: f.date.toISOString(),
        authors: ['Nômade Fuleiro'],
        url: `${SITE_URL}/posts/${slug}/`,
        images: [
          {
            url: f.coverImage.src,
            width: f.coverImage.width,
            height: f.coverImage.height,
            alt: f.coverImage.alt,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: f.title,
        description: f.description,
        images: [f.coverImage.src],
      },
      alternates: {
        canonical: `${SITE_URL}/posts/${slug}/`,
      },
    }
  } catch (error) {
    console.error('[generateMetadata] Failed to load post metadata:', error)
    return {}
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params

  let post
  try {
    post = getPostBySlug(slug)
  } catch (error) {
    console.error('[PostPage] Failed to load post:', slug, error)
    notFound()
  }
  if (!post) notFound()

  const { frontmatter: f, content } = post
  const seriesNav = getSeriesNavigation(post, getAllPosts())

  return (
    <>
      <JsonLd post={post} />

      <article className="max-w-3xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-sm text-gray-400 mb-8">
          <ol className="flex items-center">
            <li>
              <Link href="/" className="hover:text-nomade-orange transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="mx-2">/</li>
            <li aria-current="page">{f.city}</li>
          </ol>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <div className="flex flex-wrap gap-2 mb-4 text-xs text-gray-500">
            <span>📍 {f.city}, {f.country}</span>
            <span>·</span>
            <time dateTime={f.date.toISOString()}>{formatDate(f.date)}</time>
            <span>·</span>
            <span>⏱ {f.duration}</span>
          </div>

          <h1 className="font-heading font-bold text-3xl md:text-4xl text-nomade-dark leading-tight mb-4">
            {f.title}
          </h1>
          <p className="text-lg text-gray-500">{f.description}</p>

          {/* Cover image */}
          <div className="mt-8 rounded-2xl overflow-hidden aspect-[16/9] bg-gray-100">
            <Image
              src={f.coverImage.src}
              alt={f.coverImage.alt}
              width={f.coverImage.width}
              height={f.coverImage.height}
              priority
              sizes="(max-width: 768px) 100vw, 80vw"
              className="w-full h-full object-cover"
            />
          </div>
        </header>

        {/* MDX content */}
        <div className="prose prose-gray max-w-none">
          <MDXRemote source={content} components={mdxComponents} />
        </div>

        {/* Gallery from frontmatter */}
        {f.gallery && f.gallery.length > 0 && (
          <section className="mt-10">
            <h2 className="font-heading font-semibold text-xl text-nomade-dark mb-4">
              📸 Galeria
            </h2>
            <PhotoGallery images={f.gallery} />
          </section>
        )}

        {/* Tips from frontmatter */}
        {f.tips && f.tips.length > 0 && (
          <section className="mt-10">
            <h2 className="font-heading font-semibold text-xl text-nomade-dark mb-4">
              💡 Dicas rápidas
            </h2>
            <ul className="space-y-2">
              {f.tips.map((tip, i) => (
                <li key={i} className="flex gap-3 text-sm text-gray-600">
                  <span className="text-nomade-mint font-bold shrink-0">→</span>
                  {tip}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Practical info from frontmatter */}
        {f.practicalInfo && <PracticalInfo info={f.practicalInfo} />}

        {/* Tags */}
        {f.tags.length > 0 && (
          <div className="mt-10 pt-6 border-t border-gray-100 flex flex-wrap gap-2">
            {f.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-500"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Series navigation */}
        {seriesNav && <SeriesNav series={seriesNav} />}

        {/* Back link */}
        <div className="mt-10">
          <Link
            href="/"
            className="text-nomade-orange font-medium hover:underline text-sm"
          >
            ← Ver todos os destinos
          </Link>
        </div>
      </article>
    </>
  )
}
