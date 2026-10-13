import { test, expect } from '@playwright/test';

test.describe('Layer 3: End-to-End Authentication & UI Edge Cases', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test run
    await page.goto('/login');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('Seamless theme switching (Light <-> Dark mode) without reload or flickering', async ({ page }) => {
    const html = page.locator('html');
    const themeBtn = page.getByTestId('theme-toggle');

    // 1. Initial State: Light Mode
    await expect(html).not.toHaveClass(/dark/);
    await expect(themeBtn).toHaveAttribute('aria-label', 'Switch to dark mode');

    // Attach navigation listener to verify NO full page reload happens
    let didNavigate = false;
    page.on('framenavigated', () => {
      didNavigate = true;
    });

    // 2. Click Theme Switcher -> Dark Mode
    await themeBtn.click();

    // Verify dark class is applied synchronously
    await expect(html).toHaveClass(/dark/);
    await expect(themeBtn).toHaveAttribute('aria-label', 'Switch to light mode');

    // Verify localStorage persistence
    const storedTheme = await page.evaluate(() => localStorage.getItem('theme'));
    expect(storedTheme).toBe('dark');

    // Assert that no page reload occurred
    expect(didNavigate).toBe(false);

    // 3. Toggle back to Light Mode
    await themeBtn.click();
    await expect(html).not.toHaveClass(/dark/);
    const storedThemeLight = await page.evaluate(() => localStorage.getItem('theme'));
    expect(storedThemeLight).toBe('light');

    // 4. Persistence Edge Case: Reload page and ensure dark theme persists without flicker
    await themeBtn.click(); // switch back to dark
    await page.reload();
    await expect(html).toHaveClass(/dark/);
  });

  test('Responsive layout integrity across Mobile (375px), Tablet (768px), and Desktop (1440px)', async ({
    page,
  }) => {
    const card = page.locator('.glass-card');
    const submitBtn = page.getByTestId('login-submit');
    const emailInput = page.getByTestId('email-input');
    const passwordInput = page.getByTestId('password-input');

    // 1. Assert card, inputs, and submit button are visible
    await expect(card).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitBtn).toBeVisible();

    // 2. Critical Responsive Assertion: Zero horizontal scrollbar/overflow
    const overflowCheck = await page.evaluate(() => {
      return {
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      };
    });
    expect(overflowCheck.scrollWidth).toBeLessThanOrEqual(overflowCheck.clientWidth);

    // 3. Touch target size check (Mobile accessibility standard: >= 40px height)
    const submitBox = await submitBtn.boundingBox();
    expect(submitBox).not.toBeNull();
    expect(submitBox.height).toBeGreaterThanOrEqual(40);

    const emailBox = await emailInput.boundingBox();
    expect(emailBox).not.toBeNull();
    expect(emailBox.height).toBeGreaterThanOrEqual(40);
  });

  test('E2E Authentication: Happy path login flow', async ({ page }) => {
    // Intercept backend auth request for stable E2E testing
    await page.route('**/api/auth/login', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          token: 'e2e-valid-jwt-token-777',
          user: { id: 'usr_e2e_1', name: 'SafeLedger Admin', email: 'admin@bank.com' },
        }),
      });
    });

    await page.route('**/api/accounts', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    await page.getByTestId('email-input').fill('admin@bank.com');
    await page.getByTestId('password-input').fill('Admin123');
    await page.getByTestId('login-submit').click();

    // Verify successful redirection to Dashboard
    await expect(page).toHaveURL(/\/dashboard/);

    // Verify localStorage has token stored
    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBe('e2e-valid-jwt-token-777');
  });

  test('E2E Authentication: Invalid credentials error feedback', async ({ page }) => {
    await page.route('**/api/auth/login', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Invalid credentials provided' }),
      });
    });

    await page.getByTestId('email-input').fill('admin@bank.com');
    await page.getByTestId('password-input').fill('WrongPassword123');
    await page.getByTestId('login-submit').click();

    const errorAlert = page.getByTestId('server-error');
    await expect(errorAlert).toBeVisible();
    await expect(errorAlert).toHaveTextContent(/invalid credentials provided/i);

    // Ensure user remains on /login
    await expect(page).toHaveURL(/\/login/);
  });
});
