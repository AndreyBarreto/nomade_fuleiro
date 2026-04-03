# Nomade Fuleiro

Personal travel blog in Portuguese, built with Next.js 14 App Router, TypeScript, Tailwind CSS, and MDX. Generated as a fully static site and served via CDN.

## Stack

- **Next.js 14** — App Router, static export (`./out`)
- **TypeScript** — full typing, including frontmatter
- **Tailwind CSS** — custom design tokens
- **MDX** — rich content with embedded React components
- **Zod** — frontmatter validation at build time
- **AWS S3** — storage for images processed with `sharp`

## Commands

```bash
npm run dev                    # dev server (localhost:3000)
npm run build                  # next build + next-sitemap → ./out
npm run lint                   # ESLint
npm run upload-images <slug>   # process and upload post images to S3
npm run test                   # unit tests (Vitest)
npm run test:watch             # Vitest in watch mode
npm run test:coverage          # test coverage
npm run test:e2e               # E2E tests (Playwright)
```

## Environment setup

```bash
cp .env.example .env.local
```

| Variable | Required for |
|---|---|
| `AWS_ACCESS_KEY_ID` | image upload |
| `AWS_SECRET_ACCESS_KEY` | image upload |
| `AWS_REGION` | image upload |
| `S3_BUCKET_NAME` | image upload |

## Terraform

The infrastructure in `terraform/` provisions the static hosting stack for the site:

- private `S3` bucket for the static files
- `CloudFront` distribution with URL rewriting for Next.js static export
- `IAM` user/access key for CI deploys

### Remote state

Best practice in this repo is to keep Terraform state in a dedicated remote backend:

- `S3` bucket for `terraform.tfstate`
- `DynamoDB` table for state locking
- backend config stored locally in `terraform/backend.hcl` and not committed

The backend resources are bootstrapped separately from the main stack to avoid the "create my own backend with my own backend" problem.

### Bootstrap the backend

```bash
cd terraform/bootstrap
cp terraform.tfvars.example terraform.tfvars
terraform init
terraform plan
terraform apply
```

After that, create `terraform/backend.hcl` from the example:

```bash
cd ../
cp backend.hcl.example backend.hcl
```

### Apply the main infrastructure

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
terraform init -backend-config=backend.hcl
terraform plan
terraform apply
```

If you already initialized locally before enabling the remote backend, migrate the state with:

```bash
terraform init -migrate-state -backend-config=backend.hcl
```

## Content structure

```
content/
└── posts/
    └── <slug>/
        ├── index.mdx        # post with frontmatter + MDX content
        └── images-src/      # original images (not versioned)
```

### Required frontmatter

```yaml
title: "Post title"
description: "Short description"
date: "2024-01-15"
country: "Portugal"
city: "Lisbon"
continent: "Europa"   # América do Sul | América do Norte | Europa | Ásia | África | Oceania
duration: "7 dias"
budget: "$$"          # $ | $$ | $$$ | $$$$
season: "Primavera"
tags: ["gastronomy", "history"]
coverImage:
  src: "https://cdn.nomadefuleiro.com/..."
  alt: "Image description"
  width: 1200
  height: 800
```

### Optional frontmatter

```yaml
draft: true           # excludes the post from all listings
gallery:
  - src: "..."
    alt: "..."
    width: 1200
    height: 800
    caption: "Optional caption"
tips:
  - "Tip 1"
  - "Tip 2"
practicalInfo:
  currency: "Euro"
  language: "Portuguese"
  visa: "Not required for Brazilians"
  bestTime: "March to October"
  transport: "Metro + tram"
  internet: "Local SIM ~€10"
  emergencyNumber: "112"
```

## MDX Components

Available inside any `.mdx` file:

```mdx
<TipBox type="tip">Useful tip for the traveler</TipBox>
<TipBox type="warning">Pay attention to this point</TipBox>
<TipBox type="info">Additional information</TipBox>

<PhotoGallery images={frontmatter.gallery} />

<PracticalInfo info={frontmatter.practicalInfo} />
```

## Adding a new post

1. Create `content/posts/<slug>/index.mdx` with valid frontmatter
2. Place original images in `content/posts/<slug>/images-src/`
3. Run `npm run upload-images <slug>` — the script resizes to WebP, uploads to S3, and prints the YAML ready to paste into the frontmatter
4. Verify with `npm run build` — Zod throws a build-time error if the frontmatter is invalid

## Routes

| Route | Description |
|---|---|
| `/` | Homepage with all posts (newest featured) |
| `/posts/[slug]/` | Full post with gallery, tips, and practical info |

## Design tokens

| Token | Color |
|---|---|
| `nomade-orange` | `#FF6B35` |
| `nomade-mint` | `#4ECDC4` |
| `nomade-yellow` | `#FFE66D` |
| `nomade-coral` | `#FF8E72` |
| `nomade-dark` | `#1A1A2E` |
| `nomade-gray` | `#F7F7F7` |

Fonts: `font-heading` (Poppins 600/700) · `font-body` (Inter 400/500)

## Requirements

### Functional Requirements

| ID | Description | Priority |
|-----|-------------|----------|
| FR01 | List all published (non-draft) posts sorted by date, newest first | High |
| FR02 | Display the most recent post as featured on the homepage | High |
| FR03 | Each post card shows: title, description, cover image, location, duration, budget, and season | High |
| FR04 | Render MDX content with custom components (`TipBox`, `PhotoGallery`, `PracticalInfo`) | High |
| FR05 | Filter destinations by continent, budget range, and season (client-side) | High |
| FR06 | Group posts sharing tags into series with previous/next navigation | Medium |
| FR07 | Display a photo gallery with lightbox (click to zoom) inside posts | Medium |
| FR08 | Show global stats: total countries, continents, and published articles | Medium |
| FR09 | Posts with `draft: true` must be excluded from all listings | High |
| FR10 | Validate each post's frontmatter at build time — invalid or missing fields must fail the build | High |
| FR11 | Automatically generate an XML sitemap on every build | Medium |
| FR12 | Include SEO metadata (OpenGraph, Twitter Card, JSON-LD) on every page | Medium |
| FR13 | Process and upload images to S3 via CLI script | High |
| FR14 | Display a custom 404 page for non-existent routes | Low |
| FR15 | Mobile navigation accessible via hamburger menu | High |

### Non-Functional Requirements

| ID | Category | Description | Acceptance Criteria |
|-----|----------|-------------|---------------------|
| NFR01 | Performance | The site must be delivered as static HTML (zero SSR) | `output: 'export'` in next.config.mjs; no API routes |
| NFR02 | Performance | Images served as optimized WebP via CDN | Uploaded to S3; resized to max 1920px with sharp |
| NFR03 | Performance | Destination filtering on the client with no server requests | FilterBar uses React state, no fetch calls |
| NFR04 | Reliability | Schema errors detected at build time, never in production | Zod validates in `getAllPosts()` and fails the build |
| NFR05 | Maintainability | Content managed exclusively via MDX files | `content/posts/<slug>/index.mdx` structure; no database |
| NFR06 | Usability | Responsive layout: 1 column mobile, 2 tablet, 3 desktop | Tailwind breakpoints `sm`/`md`/`lg` |
| NFR07 | Accessibility | Links and buttons with visible focus and semantic labels | `aria-*` attributes and Playwright verification |
| NFR08 | SEO | Each page has a unique title, description, and canonical URL | Next.js Metadata API per page |
| NFR09 | Security | AWS credentials never exposed in the client bundle | Used exclusively in server-side Node.js scripts |
| NFR10 | Portability | The `./out` artifact can be hosted on any static CDN | Static export with no runtime dependencies |
| NFR11 | Testability | Critical components have unit tests (Vitest) and main flows have E2E tests (Playwright) | Coverage of PostCard, FilterBar, Header, post detail, 404 |
| NFR12 | Internationalization | All content and date formatting in pt-BR | `formatDate()` with `locale: 'pt-BR'`; copy in Portuguese |
