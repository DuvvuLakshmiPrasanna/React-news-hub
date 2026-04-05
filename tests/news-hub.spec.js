import { expect, test } from '@playwright/test'

async function waitForStories(page) {
  await page.waitForSelector('[data-testid="article-list"]')
  await page.waitForSelector('[data-testid="article-item"]')
}

async function mockHackerNews(page) {
  await page.route('**/topstories.json', async (route) => {
    const ids = Array.from({ length: 500 }, (_, index) => index + 1)
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify(ids),
    })
  })

  await page.route('**/item/*.json', async (route) => {
    const url = new URL(route.request().url())
    const id = Number(url.pathname.split('/').pop().replace('.json', ''))

    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        id,
        title: `Story ${id}`,
        by: `author-${id}`,
        score: 500 - id,
        time: 1710000000 + id,
        type: 'story',
        url: `https://example.com/story-${id}`,
      }),
    })
  })
}

test('main page loads and exposes optimized hero image', async ({ page }) => {
  const response = await page.goto('/')

  expect(response?.status()).toBe(200)

  const heroImage = page.getByTestId('hero-image')
  await expect(heroImage).toHaveAttribute('width', '1200')
  await expect(heroImage).toHaveAttribute('height', '540')
  await expect(heroImage).toHaveAttribute('srcset')
  await expect(heroImage).toHaveAttribute('sizes')
})

test('article list is virtualized and interactive', async ({ page }) => {
  await mockHackerNews(page)
  await page.goto('/')
  await waitForStories(page)

  const list = page.getByTestId('article-list')
  const items = list.getByTestId('article-item')
  const count = await items.count()

  expect(count).toBeLessThan(50)

  await page.getByRole('button', { name: /sort by score/i }).click()
  await page.getByPlaceholder('Filter by title').fill('the')
  await expect(list).toBeVisible()
})
