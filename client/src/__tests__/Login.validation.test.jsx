import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders, screen, userEvent } from '../test/test-utils';
import Login from '../pages/Login';
import * as bankingApi from '../services/bankingApi';

describe('Layer 1: Client-Side Validation Tests', () => {
  it('triggers inline errors on empty submit attempt without invoking API', async () => {
    const apiSpy = vi.spyOn(bankingApi, 'login');
    const user = userEvent.setup();
    renderWithProviders(<Login />);

    const submitBtn = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitBtn);

    // Verify inline errors
    expect(screen.getByTestId('email-error')).toHaveTextContent('Email is required');
    expect(screen.getByTestId('password-error')).toHaveTextContent('Password is required');

    // Assert that API was NOT called
    expect(apiSpy).not.toHaveBeenCalled();
  });

  it('validates malformed email formats and displays inline message', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Login />);

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitBtn = screen.getByRole('button', { name: /sign in/i });

    // Test malformed emails
    const invalidEmails = ['invalid-email', 'plainaddress', '@missingusername.com', 'user@domain'];

    for (const invalidEmail of invalidEmails) {
      await user.clear(emailInput);
      await user.type(emailInput, invalidEmail);
      await user.clear(passwordInput);
      await user.type(passwordInput, 'ValidPassword123');
      await user.click(submitBtn);

      expect(screen.getByTestId('email-error')).toHaveTextContent('Please enter a valid email address');
      expect(emailInput).toHaveAttribute('aria-invalid', 'true');
    }
  });

  it('validates short passwords and requires at least 6 characters', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Login />);

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitBtn = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'valid@bank.com');
    await user.type(passwordInput, '12345'); // 5 characters (below 6 min limit)
    await user.click(submitBtn);

    expect(screen.getByTestId('password-error')).toHaveTextContent('Password must be at least 6 characters');
    expect(passwordInput).toHaveAttribute('aria-invalid', 'true');
  });

  it('dynamically clears errors when user corrects the input on subsequent typing or blur', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Login />);

    const emailInput = screen.getByLabelText(/email address/i);
    const submitBtn = screen.getByRole('button', { name: /sign in/i });

    // 1. Trigger error
    await user.click(submitBtn);
    expect(screen.getByTestId('email-error')).toBeInTheDocument();

    // 2. Type valid email
    await user.type(emailInput, 'admin@bank.com');

    // 3. Error should disappear and aria-invalid reset
    expect(screen.queryByTestId('email-error')).not.toBeInTheDocument();
    expect(emailInput).toHaveAttribute('aria-invalid', 'false');
  });
});
