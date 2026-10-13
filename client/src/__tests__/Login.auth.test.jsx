import { describe, it, expect } from 'vitest';
import { renderWithProviders, screen, userEvent, waitFor } from '../test/test-utils';
import Login from '../pages/Login';
import { server } from '../test/mocks/server';
import { http, HttpResponse } from 'msw';

describe('Layer 1: Authentication Workflow (MSW Mocked Flows)', () => {
  it('handles successful login: stores token & user in localStorage and redirects to dashboard', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Login />);

    await user.type(screen.getByLabelText(/email address/i), 'admin@bank.com');
    await user.type(screen.getByLabelText(/password/i), 'Admin123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    // Wait for redirect to destination element
    await waitFor(() => {
      expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
    });

    // Check localStorage persistence
    expect(localStorage.getItem('token')).toBeTruthy();
    const storedUser = JSON.parse(localStorage.getItem('user'));
    expect(storedUser.email).toBe('admin@bank.com');
  });

  it('displays invalid credentials error message on 401 response', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Login />);

    await user.type(screen.getByLabelText(/email address/i), 'admin@bank.com');
    await user.type(screen.getByLabelText(/password/i), 'WrongPassword123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    const errorAlert = await screen.findByTestId('server-error');
    expect(errorAlert).toBeInTheDocument();
    expect(errorAlert).toHaveTextContent(/invalid email or password/i);

    // Ensure user is not redirected and credentials are not saved
    expect(screen.queryByTestId('dashboard-page')).not.toBeInTheDocument();
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('handles server rate-limiting (HTTP 429) and displays retry warning banner', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Login />);

    await user.type(screen.getByLabelText(/email address/i), 'ratelimited@bank.com');
    await user.type(screen.getByLabelText(/password/i), 'Admin123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    const errorAlert = await screen.findByTestId('server-error');
    expect(errorAlert).toBeInTheDocument();
    expect(errorAlert).toHaveTextContent(/too many requests/i);
  });

  it('gracefully handles server gateway timeout (HTTP 504) or network failure', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Login />);

    await user.type(screen.getByLabelText(/email address/i), 'timeout@bank.com');
    await user.type(screen.getByLabelText(/password/i), 'Admin123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    const errorAlert = await screen.findByTestId('server-error');
    expect(errorAlert).toBeInTheDocument();
    expect(errorAlert).toHaveTextContent(/gateway timeout|failed to respond/i);
  });

  it('handles unexpected network error (server.use error simulation)', async () => {
    // Dynamic override for complete network disconnect
    server.use(
      http.post('*/auth/login', () => {
        return HttpResponse.error();
      })
    );

    const user = userEvent.setup();
    renderWithProviders(<Login />);

    await user.type(screen.getByLabelText(/email address/i), 'admin@bank.com');
    await user.type(screen.getByLabelText(/password/i), 'Admin123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    const errorAlert = await screen.findByTestId('server-error');
    expect(errorAlert).toBeInTheDocument();
    expect(errorAlert).toHaveTextContent(/cannot reach the api server|unexpected error/i);
  });
});
