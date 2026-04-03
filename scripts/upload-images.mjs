#!/usr/bin/env node
/**
 * upload-images.mjs
 * Processes raw images with sharp and uploads them to S3/OCI.
 * Usage: node scripts/upload-images.mjs <post-slug>
 *
 * Prints ready-to-paste YAML for the MDX frontmatter.
 */

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { readdir, readFile } from 'fs/promises'
import { existsSync } from 'fs'
import { join, extname, basename } from 'path'
import sharp from 'sharp'

const SUPPORTED = ['.jpg', '.jpeg', '.png', '.tiff', '.webp', '.avif']
const MAX_WIDTH = 1920
const THUMB_WIDTH = 400
const WEBP_QUALITY = 82

const slug = process.argv[2]
if (!slug) {
  console.error('Uso: node scripts/upload-images.mjs <slug-do-post>')
  process.exit(1)
}
if (!/^[a-z0-9-]+$/i.test(slug)) {
  console.error('Error: slug must contain only letters, numbers, and hyphens')
  process.exit(1)
}

const bucket = process.env.S3_BUCKET_NAME
const region = process.env.AWS_REGION || 'us-east-1'
const cdnUrl = process.env.CDN_URL || `https://${bucket}.s3.${region}.amazonaws.com`

if (!bucket) {
  console.error('Set S3_BUCKET_NAME in .env.local')
  process.exit(1)
}

const s3 = new S3Client({ region })
const srcDir = join('content/posts', slug, 'images-src')

if (!existsSync(srcDir)) {
  console.error(`Directory not found: ${srcDir}`)
  process.exit(1)
}

const files = (await readdir(srcDir)).filter((f) => SUPPORTED.includes(extname(f).toLowerCase()))

if (!files.length) {
  console.log('No supported images found in', srcDir)
  process.exit(0)
}

async function upload(key, buffer, contentType = 'image/webp') {
  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      CacheControl: 'max-age=31536000,immutable',
    })
  )
  return `${cdnUrl}/${key}`
}

const results = []

for (const file of files) {
  const name = basename(file, extname(file))
  const srcPath = join(srcDir, file)
  const raw = await readFile(srcPath)

  process.stdout.write(`Processing ${file}... `)

  const meta = await sharp(raw).metadata()

  // Full-size WebP
  const fullBuffer = await sharp(raw)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer()
  const fullMeta = await sharp(fullBuffer).metadata()
  const fullKey = `posts/${slug}/${name}.webp`
  const fullUrl = await upload(fullKey, fullBuffer)

  // Thumbnail
  const thumbBuffer = await sharp(raw)
    .resize({ width: THUMB_WIDTH })
    .webp({ quality: 75 })
    .toBuffer()
  const thumbKey = `posts/${slug}/${name}-thumb.webp`
  await upload(thumbKey, thumbBuffer)

  console.log('✓')

  results.push({
    original: file,
    src: fullUrl,
    width: fullMeta.width ?? meta.width ?? MAX_WIDTH,
    height: fullMeta.height ?? meta.height ?? 1080,
    thumb: `${cdnUrl}/${thumbKey}`,
  })
}

// Print frontmatter YAML
console.log('\n─── Paste into MDX frontmatter ───\n')

console.log('# Cover image (first in the list):')
const first = results[0]
console.log(`coverImage:
  src: "${first.src}"
  alt: ""
  width: ${first.width}
  height: ${first.height}
`)

console.log('# Gallery:')
console.log('gallery:')
for (const r of results) {
  console.log(`  - src: "${r.src}"
    alt: ""
    width: ${r.width}
    height: ${r.height}
    caption: ""`)
}

console.log('\n─────────────────────────────────\n')
console.log(`✅ ${results.length} image(s) uploaded to s3://${bucket}/posts/${slug}/`)
