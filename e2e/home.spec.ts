import { test, expect } from '@playwright/test'

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
    await page.goto('/')
    await expect(page.getByText('países')).toBeVisible()
    await expect(page.getByText('continentes')).toBeVisible()
    await expect(page.getByText('artigos')).toBeVisible()
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

  test('header navigation links are visible', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('link', { name: 'Nomade Fuleiro' })).toBeVisible()
  })
})
