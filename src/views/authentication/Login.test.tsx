import React from 'react';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import Login from './Login';

jest.mock('react-router-dom', () => ({
  useLocation: () => ({ pathname: 'here' })
}));

jest.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({ login: () => {} })
}));

it('Login component renders without crashing', () => {
  const { getByText, getByRole } = render(
    <HelmetProvider>
      <Login />
    </HelmetProvider>
  );

  const title = getByText(/Hi, Welcome Back/i);
  const loginButton = getByRole('button', { name: /login/i });
  const logo = getByRole('img', { name: /logo/i });
  const loginLogo = getByRole('img', { name: /login/i });

  expect(title).toBeInTheDocument();
  expect(loginButton).toBeInTheDocument();
  expect(logo).toBeInTheDocument();
  expect(loginLogo).toBeInTheDocument();
});
