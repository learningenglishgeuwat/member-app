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
    'E2E_EMAIL and E2E_PASSWORD are required for authenticated deep navigation.',
  );

  await page.goto('/login', { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle').catch(() => null);

  if (page.url().includes('/dashboard')) return;

  const form = page.locator('form').first();
  await expect(form).toBeVisible();

  const gearIcons = form.locator('svg.lucide-settings');
  await expect(gearIcons.first()).toBeVisible();
  await gearIcons.nth(0).click({ force: true });
  await gearIcons.nth(1).click({ force: true });

  await page.getByPlaceholder('Email Address').fill(E2E_EMAIL);
  await page.getByPlaceholder('Password').fill(E2E_PASSWORD);

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    await page.locator('button[type="submit"]').click();

    try {
      await page.waitForURL('**/dashboard', { timeout: 15_000 });
      return;
    } catch {
      const retryBtn = page.getByRole('button', { name: /Try Again|Coba lagi/i });
      if (await retryBtn.first().isVisible().catch(() => false)) {
        await retryBtn.first().click();
      }

      if (attempt < 3) {
        await page.waitForTimeout(800);
        await page.getByPlaceholder('Email Address').fill(E2E_EMAIL);
        await page.getByPlaceholder('Password').fill(E2E_PASSWORD);
      }
    }
  }

  await page.waitForURL('**/dashboard', { timeout: 30_000 });
}

test('authenticated deep navigation (desktop chrome)', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'Deep desktop suite is scoped for Chromium.');

  const { assertNoCriticalErrors } = await collectClientErrors(page);
  await ensureAuthenticated(page);

  await test.step('pronunciation: phonetic portal -> symbol detail', async () => {
    await page.goto('/skill/pronunciation/phoneticSymbols', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle').catch(() => null);

    const vowelPortal = page.locator('[data-tour="phonetic-portal-vowel"]');
    await expect(vowelPortal).toBeVisible();
    await vowelPortal.click();

    const symbolUh = page.locator('[data-tour="phonetic-symbol-uh"]');
    await expect(symbolUh).toBeVisible();
    await symbolUh.click();

    await page.waitForURL(/\/skill\/pronunciation\/phoneticSymbols\/.+/, { timeout: 20_000 });
    await expect(page.locator('[data-tour="symbol-detail-play-all"]')).toBeVisible();

    const goToVideoBtn = page.locator('[data-tour="symbol-go-to-video"]');
    await expect(goToVideoBtn).toBeVisible();
    await goToVideoBtn.click();
    await page.waitForTimeout(250);

    const videoToggle = page.locator('[data-tour="symbol-video-section-toggle"]');
    await expect(videoToggle).toBeVisible();

    await page.locator('[data-tour="symbol-practice-section-toggle"]').click();
    await page.locator('[data-tour="symbol-prompt-section-toggle"]').click();
    await expect(page.locator('[data-tour="symbol-prompt-copy-button"]')).toBeVisible();

    assertNoCriticalErrors('pronunciation deep detail');
  });

  await test.step('pronunciation: alphabet + final sound pages', async () => {
    await page.goto('/skill/pronunciation/alphabet', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle').catch(() => null);
    await expect(page.locator('[data-tour="alphabet-letter-a"]')).toBeVisible();
    await expect(page.locator('[data-tour="alphabet-letter-b"]')).toBeVisible();
    const playAllBtn = page.locator('[data-tour="alphabet-play-all"]');
    await expect(playAllBtn).toBeVisible();
    await playAllBtn.click();

    await page.goto('/skill/pronunciation/final-sound-new/s/es', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: 'S/ES Final Sound' })).toBeVisible();
    await expect(page.getByText('Final Sound Rules for -s/-es (Table)', { exact: false })).toBeVisible();

    await page.goto('/skill/pronunciation/final-sound-new/d/ed', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: 'D/ED Final Sound' })).toBeVisible();
    await expect(page.getByText('Final Sound Rules for -ed (Table)', { exact: false })).toBeVisible();

    assertNoCriticalErrors('pronunciation alphabet + final sound');
  });

  await test.step('vocabulary: topic detail -> flashcard', async () => {
    await page.goto('/skill/vocabulary', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle').catch(() => null);
    await expect(page.locator('[data-tour="vocab-topic-grid"]')).toBeVisible();

    const firstDetail = page.locator('[data-tour="vocab-topic-grid"] a:has-text("Lihat Detail")').first();
    await expect(firstDetail).toBeVisible();
    await firstDetail.click();

    await page.waitForURL(/\/skill\/vocabulary\/topic\/pages\/.+/, { timeout: 20_000 });
    await expect(page.locator('main, h1').first()).toBeVisible();

    await page.goto('/skill/vocabulary/flashcard/social-media', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle').catch(() => null);
    await expect(page.locator('.vf-page')).toBeVisible();
    await expect(page.locator('.vf-shell')).toBeVisible();

    assertNoCriticalErrors('vocabulary topic + flashcard');
  });

  await test.step('grammar: resource -> child topic page', async () => {
    await page.goto('/skill/grammar/grammar-resource', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle').catch(() => null);
    await expect(page.getByRole('heading', { name: 'Grammar Resource' })).toBeVisible();

    const firstFolder = page.locator('.tree-folder-card').first();
    await expect(firstFolder).toBeVisible();
    await firstFolder.click();

    const firstTopicLink = page.locator('.tree-topic-link').first();
    await expect(firstTopicLink).toBeVisible();
    await firstTopicLink.click();
    await page.waitForURL(/\/skill\/grammar\/grammar-resource\/resource\/.+/, { timeout: 20_000 });
    await expect(page.locator('main, h1').first()).toBeVisible();

    assertNoCriticalErrors('grammar resource child page');
  });

  await test.step('speaking: roadmap -> goal detail', async () => {
    await page.goto('/skill/speaking?phase=cefr-a1-1', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle').catch(() => null);
    await expect(page.locator('[data-tour="speaking-goal-grid"]')).toBeVisible();

    const firstGoal = page.locator('[data-tour="speaking-goal-grid"] article[role="button"]').first();
    await expect(firstGoal).toBeVisible();
    await firstGoal.click();

    await page.waitForURL(/\/skill\/speaking\/cefr-a1\/cefr-a1-\d-g\d{2}/, { timeout: 20_000 });
    await expect(page.locator('main, h1').first()).toBeVisible();

    assertNoCriticalErrors('speaking goal detail');
  });
});
