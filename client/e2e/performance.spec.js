import { test, expect } from '@playwright/test';

test.describe('Layer 2: Real Browser Performance & CLS Verification', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('Perceived performance: Submit button enters loading state within 100ms of click', async ({
    page,
  }) => {
    // Delay response by 1 second to observe loading state accurately
    await page.route('**/api/auth/login', async (route) => {
      await page.waitForTimeout(1000);
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ token: 'mock-jwt', user: { name: 'Admin' } }),
      });
    });

    await page.getByTestId('email-input').fill('admin@bank.com');
    await page.getByTestId('password-input').fill('Admin123');

    // High precision timing via browser performance.now()
    const clickAndMeasure = await page.evaluate(async () => {
      const submitBtn = document.querySelector('[data-testid="login-submit"]');
      const start = performance.now();
      submitBtn.click();

      // Poll until loading spinner or disabled state appears
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (submitBtn.getAttribute('aria-busy') === 'true' || submitBtn.disabled) {
            const duration = performance.now() - start;
            clearInterval(checkInterval);
            resolve(duration);
          }
        }, 5);
      });
    });

    expect(clickAndMeasure).toBeLessThan(100);
  });

  test('Layout stability: Cumulative Layout Shift (CLS) remains 0 when error messages appear', async ({
    page,
  }) => {
    // Set up a Layout Shift PerformanceObserver in browser context
    await page.evaluate(() => {
      window.__cumulativeLayoutShift = 0;
      const observer = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            window.__cumulativeLayoutShift += entry.value;
          }
        }
      });
      observer.observe({ type: 'layout-shift', buffered: true });
    });

    // 1. Trigger inline validation errors
    await page.getByTestId('login-submit').click();
    await expect(page.getByTestId('email-error')).toBeVisible();
    await expect(page.getByTestId('password-error')).toBeVisible();

    // 2. Mock 401 error to trigger server alert container
    await page.route('**/api/auth/login', async (route) => {
      await route.fulfill({
        status: 401,
        body: JSON.stringify({ message: 'Invalid credentials' }),
      });
    });

    await page.getByTestId('email-input').fill('admin@bank.com');
    await page.getByTestId('password-input').fill('WrongPassword');
    await page.getByTestId('login-submit').click();

    await expect(page.getByTestId('server-error')).toBeVisible();

    // 3. Measure accumulated CLS score
    const totalCLS = await page.evaluate(() => window.__cumulativeLayoutShift);

    // Google Web Vitals 'Good' threshold is < 0.1, SafeLedger target is 0.00
    expect(totalCLS).toBeLessThanOrEqual(0.01);
  });

  test('Layout tokens & Theme preference are cached without performance penalty', async ({ page }) => {
    // Check initial cached tokens in localStorage
    const tokens = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('safeledger_layout_tokens') || '{}');
    });

    expect(tokens).toHaveProperty('density', 'comfortable');
    expect(tokens).toHaveProperty('surface', 'glassmorphism');

    // Measure theme switch execution time
    const themeSwitchDuration = await page.evaluate(async () => {
      const themeBtn = document.querySelector('[data-testid="theme-toggle"]');
      const start = performance.now();
      themeBtn.click();
      const end = performance.now();
      return end - start;
    });

    // Theme switch must complete synchronously in under 50ms
    expect(themeSwitchDuration).toBeLessThan(50);
  });
});
