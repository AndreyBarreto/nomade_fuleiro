# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Nomade Fuleiro** — a personal travel blog (pt-BR) built with Next.js 14 App Router, TypeScript, Tailwind CSS, and MDX. Deploys as a fully static export.

## Commands

```bash
npm run dev          # dev server (localhost:3000)
npm run build        # next build + next-sitemap (static export to ./out)
npm run lint         # ESLint
npm run upload-images <slug>  # process & upload images for a post to S3
```

There is no test suite configured.

## Architecture

### Static export
`next.config.mjs` sets `output: 'export'` and `trailingSlash: true`. All pages must be statically renderable — no server-side data fetching. The `./out` directory is the deployable artifact.

### Content layer
Posts live at `content/posts/<slug>/index.mdx`. The frontmatter is parsed with `gray-matter` and validated at build time against the Zod schema in `src/lib/posts.ts` (`FrontmatterSchema`). Any schema violation throws at build time. Posts with `draft: true` are excluded from all listings.

Required frontmatter fields: `title`, `description`, `date`, `coverImage` (with `src`, `alt`, `width`, `height`), `country`, `city`, `continent` (enum), `duration`, `budget` ($–$$$$), `season`, `tags`.

Optional: `gallery` (array of images), `tips` (string array), `practicalInfo` (object), `draft`.

### Image workflow
Raw images go into `content/posts/<slug>/images-src/`. Run `npm run upload-images <slug>` to process them with `sharp` (resize → WebP) and upload to S3. The script prints ready-to-paste YAML for the MDX frontmatter. All images in production are served from the CDN, not bundled locally.

### Routing
- `/` — homepage: lists all non-draft posts sorted by date (newest first); first post is "featured"
- `/posts/[slug]/` — post detail: renders MDX via `next-mdx-remote/rsc`, shows gallery/tips/practicalInfo from frontmatter

### MDX components
Available inside MDX files (registered in `src/components/mdx/index.ts`):
- `<TipBox type="tip|warning|info">` — styled callout
- `<PhotoGallery images={[...]} />` — image grid
- `<PracticalInfo info={...} />` — destination info table

### Design tokens
Custom Tailwind colors: `nomade-orange` (#FF6B35), `nomade-mint` (#4ECDC4), `nomade-yellow` (#FFE66D), `nomade-coral` (#FF8E72), `nomade-dark` (#1A1A2E), `nomade-gray` (#F7F7F7).

Font families: `font-heading` (Poppins 600/700), `font-body` (Inter 400/500).

### Environment variables
Copy `.env.example` to `.env.local`. For local dev only `NEXT_PUBLIC_SITE_URL` matters. The upload script additionally requires `S3_BUCKET_NAME`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `AWS_REGION`.

## Adding a new post

1. Create `content/posts/<slug>/index.mdx` with valid frontmatter
2. Place raw images in `content/posts/<slug>/images-src/`
3. Run `npm run upload-images <slug>` and paste the output YAML into the frontmatter
4. Verify with `npm run build` (Zod will catch schema errors)
