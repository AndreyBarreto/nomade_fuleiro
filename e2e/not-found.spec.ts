import { test, expect } from '@playwright/test'

// Use a static unknown route — dynamic [slug] routes outside generateStaticParams()
// throw a server error in dev mode with output: 'export'.
const NOT_FOUND_URL = '/pagina-que-nao-existe'

test.describe('404 page', () => {
  test('shows 404 page for an unknown static route', async ({ page }) => {
    await page.goto(NOT_FOUND_URL)
    await expect(page.getByRole('heading', { name: 'Página não encontrada' })).toBeVisible()
  })

  test('shows the lost traveller message', async ({ page }) => {
    await page.goto(NOT_FOUND_URL)
    await expect(page.getByText(/se perdeu no mapa/i)).toBeVisible()
  })

  test('"Voltar para o início" link navigates to homepage', async ({ page }) => {
    await page.goto(NOT_FOUND_URL)
    await page.getByRole('link', { name: 'Voltar para o início' }).click()
    await expect(page).toHaveURL('/')
  })
})
