import { expect, test } from '@playwright/test';

type RouteCheck = {
  path: string;
  name: string;
  clickSelectors?: string[];
};

const ROUTES: RouteCheck[] = [
  { path: '/', name: 'Root Redirect' },
  {
    path: '/login',
    name: 'Login',
    clickSelectors: [
      'a[href="/forgot-password"]',
      'button[type="submit"]',
    ],
  },
  {
    path: '/forgot-password',
    name: 'Forgot Password',
    clickSelectors: ['button[type="submit"]', 'a[href="/login"]'],
  },
  { path: '/dashboard', name: 'Dashboard' },
  { path: '/skill', name: 'Skill Hub' },
  { path: '/skill/pronunciation', name: 'Pronunciation Menu' },
  { path: '/skill/vocabulary', name: 'Vocabulary Menu' },
  { path: '/skill/speaking', name: 'Speaking Menu' },
  { path: '/skill/grammar', name: 'Grammar Menu' },
];

for (const route of ROUTES) {
  test(`smoke: ${route.name} (${route.path})`, async ({ page }) => {
    const pageErrors: string[] = [];
    const severeConsoleErrors: string[] = [];
    const serverErrors: string[] = [];

    page.on('pageerror', (error) => {
      pageErrors.push(error.message);
    });

    page.on('console', (msg) => {
      if (msg.type() !== 'error') return;
      const text = msg.text();
      // Filter extension noise and common non-app noise.
      if (/favicon\.ico/i.test(text)) return;
      if (/extension|chrome-extension/i.test(text)) return;
      severeConsoleErrors.push(text);
    });

    page.on('response', (response) => {
      if (response.status() >= 500) {
        serverErrors.push(`${response.status()} ${response.url()}`);
      }
    });

    await page.goto(route.path, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle').catch(() => null);
    await page.waitForTimeout(600);

    await expect(page.locator('body')).toBeVisible();
    const hasMainLikeNode = await page.locator('main, h1, [role="main"]').first().isVisible().catch(() => false);
    const bodyTextLength = (await page.locator('body').innerText()).trim().length;
    expect(hasMainLikeNode || bodyTextLength > 20).toBeTruthy();

    if (route.clickSelectors?.length) {
      for (const selector of route.clickSelectors) {
        const target = page.locator(selector).first();
        const visible = await target.isVisible().catch(() => false);
        if (!visible) continue;
        const enabled = await target.isEnabled().catch(() => false);
        if (!enabled) continue;
        await target.click({ timeout: 5_000 });
        await page.waitForLoadState('domcontentloaded').catch(() => null);
        await page.waitForTimeout(250);
        break;
      }
    }

    expect(pageErrors, `Unhandled page errors on ${route.path}`).toEqual([]);
    expect(serverErrors, `HTTP 5xx responses on ${route.path}`).toEqual([]);
    expect(severeConsoleErrors, `Console errors on ${route.path}`).toEqual([]);
  });
}
