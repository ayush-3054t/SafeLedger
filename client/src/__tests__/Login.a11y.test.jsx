import { describe, it, expect } from 'vitest';
import { renderWithProviders, screen, userEvent } from '../test/test-utils';
import Login from '../pages/Login';

describe('Layer 1: Form Rendering & Accessibility (A11y)', () => {
  it('renders form inputs, labels, and submit button with accessible associations', () => {
    renderWithProviders(<Login />);

    // 1. Heading structure
    const heading = screen.getByRole('heading', { level: 1, name: /sign in to safeledger/i });
    expect(heading).toBeInTheDocument();

    // 2. Email label and input mapping
    const emailInput = screen.getByLabelText(/email address/i);
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toHaveAttribute('id', 'email');
    expect(emailInput).toHaveAttribute('aria-invalid', 'false');

    // 3. Password label and input mapping
    const passwordInput = screen.getByLabelText(/password/i);
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(passwordInput).toHaveAttribute('id', 'password');
    expect(passwordInput).toHaveAttribute('aria-invalid', 'false');

    // 4. Submit button
    const submitBtn = screen.getByRole('button', { name: /sign in/i });
    expect(submitBtn).toBeInTheDocument();
    expect(submitBtn).toHaveAttribute('type', 'submit');
    expect(submitBtn).toHaveAttribute('aria-busy', 'false');

    // 5. Theme toggle accessible label
    const themeToggle = screen.getByTestId('theme-toggle');
    expect(themeToggle).toHaveAttribute('aria-label');
  });

  it('updates aria-invalid and aria-describedby when validation fails', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Login />);

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitBtn = screen.getByRole('button', { name: /sign in/i });

    // Submit without input values
    await user.click(submitBtn);

    // Verify aria-invalid attributes
    expect(emailInput).toHaveAttribute('aria-invalid', 'true');
    expect(emailInput).toHaveAttribute('aria-describedby', 'email-error');

    expect(passwordInput).toHaveAttribute('aria-invalid', 'true');
    expect(passwordInput).toHaveAttribute('aria-describedby', 'password-error');

    // Verify error messages have role="alert"
    const emailError = screen.getByTestId('email-error');
    expect(emailError).toHaveAttribute('role', 'alert');
    expect(emailError).toHaveTextContent(/email is required/i);

    const passwordError = screen.getByTestId('password-error');
    expect(passwordError).toHaveAttribute('role', 'alert');
    expect(passwordError).toHaveTextContent(/password is required/i);
  });

  it('maintains a logical keyboard Tab order through interactive elements', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Login />);

    // Sequential Tab traversal test
    await user.tab();
    expect(screen.getByTestId('theme-toggle')).toHaveFocus();

    await user.tab();
    expect(screen.getByLabelText(/email address/i)).toHaveFocus();

    await user.tab();
    expect(screen.getByLabelText(/password/i)).toHaveFocus();

    await user.tab();
    expect(screen.getByTestId('password-toggle')).toHaveFocus();

    await user.tab();
    expect(screen.getByRole('button', { name: /sign in/i })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole('link', { name: /register/i })).toHaveFocus();
  });

  it('provides correct aria-label state toggles on the password visibility button', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Login />);

    const toggleBtn = screen.getByTestId('password-toggle');
    expect(toggleBtn).toHaveAttribute('aria-label', 'Show password');

    await user.click(toggleBtn);
    expect(toggleBtn).toHaveAttribute('aria-label', 'Hide password');

    await user.click(toggleBtn);
    expect(toggleBtn).toHaveAttribute('aria-label', 'Show password');
  });
});
