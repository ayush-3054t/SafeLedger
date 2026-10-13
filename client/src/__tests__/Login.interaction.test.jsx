import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders, screen, userEvent, waitFor } from '../test/test-utils';
import Login from '../pages/Login';
import * as bankingApi from '../services/bankingApi';

describe('Layer 1: User Interaction & State Transitions', () => {
  it('toggles password visibility between masked and plain text', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Login />);

    const passwordInput = screen.getByLabelText(/password/i);
    const toggleBtn = screen.getByTestId('password-toggle');

    expect(passwordInput).toHaveAttribute('type', 'password');

    // Toggle to visible
    await user.click(toggleBtn);
    expect(passwordInput).toHaveAttribute('type', 'text');

    // Toggle back to hidden
    await user.click(toggleBtn);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('triggers form submission when pressing the Enter key inside form inputs', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Login />);

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(emailInput, 'admin@bank.com');
    await user.type(passwordInput, 'Admin123{enter}');

    // Successful submit triggers dashboard navigation
    await waitFor(() => {
      expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
    });
  });

  it('transitions submit button to disabled state with loading spinner during submission', async () => {
    const user = userEvent.setup();
    // Delay API response to observe loading state
    let resolveLogin;
    const loginPromise = new Promise((resolve) => {
      resolveLogin = resolve;
    });

    vi.spyOn(bankingApi, 'login').mockReturnValue(loginPromise);

    renderWithProviders(<Login />);

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitBtn = screen.getByTestId('login-submit');

    await user.type(emailInput, 'admin@bank.com');
    await user.type(passwordInput, 'Admin123');

    // Initial state
    expect(submitBtn).not.toBeDisabled();
    expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();

    // Click submit
    await user.click(submitBtn);

    // In-flight state: button disabled, loading spinner displayed, aria-busy true
    expect(submitBtn).toBeDisabled();
    expect(submitBtn).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    expect(submitBtn).toHaveTextContent(/signing in…/i);

    // Resolve request
    resolveLogin({ data: { token: 'token-abc', user: { name: 'Alex' } } });

    await waitFor(() => {
      expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
    });
  });

  it('prevents duplicate submissions when button is in loading state', async () => {
    const user = userEvent.setup();
    let resolveLogin;
    const loginPromise = new Promise((resolve) => {
      resolveLogin = resolve;
    });

    const apiSpy = vi.spyOn(bankingApi, 'login').mockReturnValue(loginPromise);

    renderWithProviders(<Login />);

    await user.type(screen.getByLabelText(/email address/i), 'admin@bank.com');
    await user.type(screen.getByLabelText(/password/i), 'Admin123');

    const submitBtn = screen.getByTestId('login-submit');

    // First click
    await user.click(submitBtn);
    expect(apiSpy).toHaveBeenCalledTimes(1);

    // Second click while in-flight (disabled)
    await user.click(submitBtn);
    expect(apiSpy).toHaveBeenCalledTimes(1);

    resolveLogin({ data: { token: 'token-abc', user: { name: 'Alex' } } });
  });
});
