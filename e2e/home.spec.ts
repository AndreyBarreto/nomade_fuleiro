import { test, expect, type Page } from '@playwright/test'
import { getAllPosts, getUniqueCountries, getUniqueContinents } from '../src/lib/posts'

const HIDDEN_TIMELINE_SLUG = 'porque-escolhi-ser-nomade'

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function getTimelinePosts() {
  return getAllPosts().filter((post) => post.frontmatter.showInTimeline)
}

async function expectStatValue(page: Page, label: string, value: string | number) {
  const stat = page.locator('div.text-center').filter({
    has: page.getByText(new RegExp(`^${escapeRegExp(label)}$`, 'i')),
  }).first()

  await expect(stat).toBeVisible()
  await expect(stat).toContainText(String(value))
}

test.describe('Homepage', () => {
  test('loads successfully', async ({ page }) => {
    const response = await page.goto('/')
    expect(response?.status()).toBe(200)
  })

  test('hero section has the main heading', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: /Mundo afora/i })).toBeVisible()
  })

  test('hero section shows the "blog de viagens" label', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('blog de viagens')).toBeVisible()
  })

  test('stats section displays country, continent and article counts', async ({ page }) => {
    const posts = getAllPosts()
    const timelinePosts = getTimelinePosts()

    await page.goto('/')
    await expectStatValue(page, 'países', getUniqueCountries(timelinePosts).length)
    await expectStatValue(page, 'continentes', getUniqueContinents(timelinePosts).length)
    await expectStatValue(page, 'artigos', posts.length)
  })

  test('featured post section label "mais recente" is visible', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('mais recente')).toBeVisible()
  })

  test('at least one post card is rendered', async ({ page }) => {
    await page.goto('/')
    // Posts link to /posts/{slug}/
    const postLinks = page.locator('a[href^="/posts/"]')
    await expect(postLinks.first()).toBeVisible()
  })

  test('clicking a post card navigates to the post detail', async ({ page }) => {
    await page.goto('/')
    const firstPostLink = page.locator('a[href^="/posts/"]').first()
    const href = await firstPostLink.getAttribute('href')
    await firstPostLink.click()
    await expect(page).toHaveURL(href!)
  })

  test('posts hidden from timeline still appear as published articles on the homepage', async ({ page }) => {
    const hiddenPost = getAllPosts().find((post) => post.slug === HIDDEN_TIMELINE_SLUG)

    expect(hiddenPost).toBeDefined()

    await page.goto('/')
    await expect(page.getByRole('heading', { name: hiddenPost!.frontmatter.title })).toBeVisible()
    await expect(page.locator(`a[href="/posts/${HIDDEN_TIMELINE_SLUG}/"]`).first()).toBeVisible()
  })

  test('header navigation links are visible', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('link', { name: 'Nomade Fuleiro' })).toBeVisible()
  })
})
