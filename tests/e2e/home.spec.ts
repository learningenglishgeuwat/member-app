import { test, expect } from '@playwright/test'

test('page title is set', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/GEUWAT Member/i)
})
