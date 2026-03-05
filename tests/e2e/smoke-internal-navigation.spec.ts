import { expect, test, type Page } from '@playwright/test';

const E2E_EMAIL = process.env.E2E_EMAIL ?? '';
const E2E_PASSWORD = process.env.E2E_PASSWORD ?? '';

async function collectClientErrors(page: Page) {
  const pageErrors: string[] = [];
  const severeConsoleErrors: string[] = [];
  const serverErrors: string[] = [];

  page.on('pageerror', (error) => {
    pageErrors.push(error.message);
  });

  page.on('console', (msg) => {
    if (msg.type() !== 'error') return;
    const text = msg.text();
    if (/favicon\.ico/i.test(text)) return;
    if (/extension|chrome-extension/i.test(text)) return;
    if (/Error fetching user data on auth change: Error: User data is empty/i.test(text)) return;
    severeConsoleErrors.push(text);
  });

  page.on('response', (response) => {
    if (response.status() >= 500) {
      serverErrors.push(`${response.status()} ${response.url()}`);
    }
  });

  return {
    assertNoCriticalErrors: (context: string) => {
      expect(pageErrors, `Unhandled page errors on ${context}`).toEqual([]);
      expect(serverErrors, `HTTP 5xx responses on ${context}`).toEqual([]);
      expect(severeConsoleErrors, `Console errors on ${context}`).toEqual([]);
    },
  };
}

async function ensureAuthenticated(page: Page) {
  test.skip(
    !E2E_EMAIL || !E2E_PASSWORD,
    'E2E_EMAIL and E2E_PASSWORD are required for authenticated navigation smoke.',
  );

  await page.goto('/login', { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle').catch(() => null);

  if (page.url().includes('/dashboard')) return;

  const form = page.locator('form').first();
  await expect(form).toBeVisible();
  const gearIcons = form.locator('svg.lucide-settings');
  await expect(gearIcons.first()).toBeVisible();

  const gearCount = await gearIcons.count();
  expect(gearCount).toBeGreaterThanOrEqual(2);
  await gearIcons.nth(0).click({ force: true });
  await gearIcons.nth(1).click({ force: true });

  await page.getByPlaceholder('Email Address').fill(E2E_EMAIL);
  await page.getByPlaceholder('Password').fill(E2E_PASSWORD);
  await page.locator('button[type="submit"]').click();

  await page.waitForURL('**/dashboard', { timeout: 30_000 });
}

test('authenticated internal navigation smoke', async ({ page }) => {
  const { assertNoCriticalErrors } = await collectClientErrors(page);
  await ensureAuthenticated(page);

  await test.step('skill hub -> pronunciation', async () => {
    await page.goto('/skill', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle').catch(() => null);
    await expect(page.locator('[data-tour="skill-node-pronunciation"]')).toBeVisible();
    await page.locator('[data-tour="skill-node-pronunciation"]').click();
    await page.locator('[data-tour="skill-execute-button"]').click();
    await page.waitForURL('**/skill/pronunciation', { timeout: 20_000 });
    await expect(page.locator('[data-tour="pronunciation-title"]')).toBeVisible();
    assertNoCriticalErrors('/skill -> pronunciation');
  });

  await test.step('pronunciation menu open selected topic', async () => {
    const executeBtn = page.locator('[data-tour="pronunciation-execute-button"]');
    await expect(executeBtn).toBeVisible();
    await executeBtn.click();
    await page.waitForURL(/\/skill\/pronunciation\/.+/, { timeout: 20_000 });
    await expect(page.locator('main, h1').first()).toBeVisible();
    assertNoCriticalErrors('/skill/pronunciation -> detail');
  });

  await test.step('vocabulary menu open topic detail', async () => {
    await page.goto('/skill/vocabulary', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle').catch(() => null);
    await expect(page.locator('[data-tour="vocab-topic-grid"]')).toBeVisible();
    const firstDetailLink = page.locator('[data-tour="vocab-topic-grid"] a:has-text("Lihat Detail")').first();
    await expect(firstDetailLink).toBeVisible();
    await firstDetailLink.click();
    await page.waitForURL(/\/skill\/vocabulary\/topic\/pages\/.+/, { timeout: 20_000 });
    await expect(page.locator('main, h1').first()).toBeVisible();
    assertNoCriticalErrors('/skill/vocabulary -> topic detail');
  });

  await test.step('grammar menu open grammar resource', async () => {
    await page.goto('/skill/grammar', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle').catch(() => null);
    const grammarResourceLink = page.locator('[data-tour="grammar-resource-button"]');
    await expect(grammarResourceLink).toBeVisible();
    await grammarResourceLink.click();
    await page.waitForURL('**/skill/grammar/grammar-resource', { timeout: 20_000 });
    await expect(page.locator('main, h1').first()).toBeVisible();
    assertNoCriticalErrors('/skill/grammar -> grammar resource');
  });

  await test.step('speaking menu open first authored goal', async () => {
    await page.goto('/skill/speaking', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle').catch(() => null);
    const goalGrid = page.locator('[data-tour="speaking-goal-grid"]');
    await expect(goalGrid).toBeVisible();
    const firstClickableGoal = goalGrid.locator('article[role="button"]').first();
    await expect(firstClickableGoal).toBeVisible();
    await firstClickableGoal.click();
    await page.waitForURL(/\/skill\/speaking\/cefr-a1\/cefr-a1-\d-g\d{2}/, { timeout: 20_000 });
    await expect(page.locator('main, h1').first()).toBeVisible();
    assertNoCriticalErrors('/skill/speaking -> goal detail');
  });
});
