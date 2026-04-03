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

test.describe('Sobre page', () => {
  test('stats count only posts shown in the timeline except published posts total', async ({ page }) => {
    const posts = getAllPosts()
    const timelinePosts = getTimelinePosts()

    await page.goto('/sobre/')
    await expectStatValue(page, 'posts publicados', posts.length)
    await expectStatValue(page, 'países visitados', getUniqueCountries(timelinePosts).length)
    await expectStatValue(page, 'continentes', getUniqueContinents(timelinePosts).length)
  })

  test('does not render links for posts hidden from the timeline', async ({ page }) => {
    const hiddenPost = getAllPosts().find((post) => post.slug === HIDDEN_TIMELINE_SLUG)

    expect(hiddenPost).toBeDefined()

    await page.goto('/sobre/')
    await expect(page.locator(`a[href="/posts/${HIDDEN_TIMELINE_SLUG}/"]`)).toHaveCount(0)
  })
})
