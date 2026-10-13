import { describe, it, expect } from 'vitest';
import { renderWithProviders, screen, userEvent, waitFor } from '../test/test-utils';
import Login from '../pages/Login';

describe('Layer 2: Performance, Timing & Layout Stability Tests', () => {
  it('achieves perceived performance: transitions submit button to loading state within 100ms of click', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Login />);

    await user.type(screen.getByLabelText(/email address/i), 'admin@bank.com');
    await user.type(screen.getByLabelText(/password/i), 'Admin123');

    const submitBtn = screen.getByTestId('login-submit');

    // Measure high-precision execution timestamp
    const startTimestamp = performance.now();
    await user.click(submitBtn);
    const endTimestamp = performance.now();

    // Verify loading state is active immediately
    expect(submitBtn).toBeDisabled();
    expect(submitBtn).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();

    const elapsedMs = endTimestamp - startTimestamp;
    // Perceived latency threshold: strictly under 100ms
    expect(elapsedMs).toBeLessThan(100);
  });

  it('guarantees layout stability: error and alert containers use reserved dimensions to prevent CLS', async () => {
    const user = userEvent.setup();
    const { container } = renderWithProviders(<Login />);

    // Inspect server error slot container
    const serverErrorSlot = container.querySelector('[aria-live="assertive"]');
    expect(serverErrorSlot).toHaveClass('min-h-[48px]');

    // Inspect field error slots
    const fieldErrorSlots = container.querySelectorAll('.min-h-\\[20px\\]');
    expect(fieldErrorSlots.length).toBeGreaterThanOrEqual(2);

    // Initial state: no errors present, but slot occupies reserved height
    expect(screen.queryByTestId('email-error')).not.toBeInTheDocument();

    // Trigger validation error
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    // Errors appear within the reserved slot without causing layout jump
    expect(screen.getByTestId('email-error')).toBeInTheDocument();
    expect(screen.getByTestId('password-error')).toBeInTheDocument();
  });

  it('verifies localStorage caching for theme preferences and non-sensitive layout tokens', async () => {
    const user = userEvent.setup();

    // 1. Initial render without pre-existing localStorage
    renderWithProviders(<Login />);

    // Verify layout tokens are initialized and cached
    const cachedTokensRaw = localStorage.getItem('safeledger_layout_tokens');
    expect(cachedTokensRaw).toBeTruthy();
    const cachedTokens = JSON.parse(cachedTokensRaw);
    expect(cachedTokens).toHaveProperty('density', 'comfortable');
    expect(cachedTokens).toHaveProperty('surface', 'glassmorphism');

    // 2. Theme switching caching
    const themeBtn = screen.getByTestId('theme-toggle');
    await user.click(themeBtn);

    // Assert theme was cached to localStorage
    expect(localStorage.getItem('theme')).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    // Toggle back to light
    await user.click(themeBtn);
    expect(localStorage.getItem('theme')).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('restores cached theme preference directly from localStorage on component mount', () => {
    localStorage.setItem('theme', 'dark');

    renderWithProviders(<Login />);

    // Must immediately apply .dark class to root element without flickering
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(screen.getByTestId('theme-toggle')).toHaveAttribute('aria-label', 'Switch to light mode');
  });
});
