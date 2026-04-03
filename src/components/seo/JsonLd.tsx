import type { Post } from '@/lib/posts'
import { SITE_URL } from '@/lib/constants'

export default function JsonLd({ post }: { post: Post }) {
  const { slug, frontmatter: f } = post

  const data = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: f.title,
    description: f.description,
    datePublished: f.date.toISOString(),
    image: f.coverImage.src,
    url: `${SITE_URL}/posts/${slug}/`,
    author: {
      '@type': 'Person',
      name: 'Nômade Fuleiro',
      url: SITE_URL,
    },
    contentLocation: {
      '@type': 'Place',
      name: f.city,
      address: {
        '@type': 'PostalAddress',
        addressCountry: f.country,
      },
    },
    keywords: f.tags.join(', '),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}
