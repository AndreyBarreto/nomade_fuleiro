import { test, expect } from '@playwright/test'

const SLUG = 'primeiro-post'
const POST_URL = `/posts/${SLUG}/`

test.describe('Post detail page', () => {
  test('renders the article at the expected URL', async ({ page }) => {
    const response = await page.goto(POST_URL)
    expect(response?.status()).toBe(200)
  })

  test('breadcrumb is visible', async ({ page }) => {
    await page.goto(POST_URL)
    // Breadcrumb "Home" link is inside the article element, not the header
    await expect(page.locator('article nav').getByRole('link', { name: 'Home' })).toBeVisible()
  })

  test('clicking breadcrumb Home navigates back to homepage', async ({ page }) => {
    await page.goto(POST_URL)
    await page.locator('article nav').getByRole('link', { name: 'Home' }).click()
    await expect(page).toHaveURL('/')
  })

  test('cover image is present with non-empty alt text', async ({ page }) => {
    await page.goto(POST_URL)
    // Cover image is the first image in the article
    const coverImg = page.locator('main img').first()
    await expect(coverImg).toBeVisible()
    const alt = await coverImg.getAttribute('alt')
    expect(alt).toBeTruthy()
    expect(alt!.length).toBeGreaterThan(0)
  })

  test('post title is rendered as a heading', async ({ page }) => {
    await page.goto(POST_URL)
    // The post has "Amsterdã" in its title
    await expect(page.getByRole('heading', { name: /Amsterdã/i })).toBeVisible()
  })

  test('tags section is rendered', async ({ page }) => {
    await page.goto(POST_URL)
    // Tags are rendered with # prefix
    await expect(page.getByText('#europa')).toBeVisible()
  })

  test('"Ver todos os destinos" link navigates back to homepage', async ({ page }) => {
    await page.goto(POST_URL)
    const backLink = page.getByRole('link', { name: /Ver todos os destinos/i })
    await expect(backLink).toBeVisible()
    await backLink.click()
    await expect(page).toHaveURL('/')
  })

  test('gallery section is visible (this post has a gallery)', async ({ page }) => {
    await page.goto(POST_URL)
    // The primeiro-post has a gallery defined in frontmatter
    await expect(page.getByText(/Galeria/i)).toBeVisible()
  })

  test('practical info section is visible (this post has practicalInfo)', async ({ page }) => {
    await page.goto(POST_URL)
    await expect(page.getByText(/Informações práticas/i)).toBeVisible()
  })

  test('tips section is visible (this post has tips)', async ({ page }) => {
    await page.goto(POST_URL)
    await expect(page.getByText(/Dicas/i)).toBeVisible()
  })
})
