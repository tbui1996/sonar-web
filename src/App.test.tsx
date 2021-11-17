import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

window.scrollTo = jest.fn();

test('renders without crashing', () => {
  render(<App />);
  const logo = screen.getByAltText('logo');
  expect(logo).toBeInTheDocument();
});

afterAll(() => {
  jest.clearAllMocks();
});
