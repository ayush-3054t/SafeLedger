import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';

/**
 * Custom render helper that provides essential context providers:
 * - AuthProvider (handling authentication states)
 * - MemoryRouter (configured with initialEntries and routes)
 */
export const renderWithProviders = (
  ui,
  {
    initialEntries = ['/login'],
    routePath = '/login',
    destinationPath = '/dashboard',
    destinationElement = <div data-testid="dashboard-page">Dashboard Landing</div>,
    ...renderOptions
  } = {}
) => {
  const Wrapper = ({ children }) => {
    return (
      <MemoryRouter initialEntries={initialEntries}>
        <AuthProvider>
          <Routes>
            <Route path={routePath} element={children} />
            <Route path={destinationPath} element={destinationElement} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );
  };

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
};

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
