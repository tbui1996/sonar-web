import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';
import { makeServer } from '../../server';
import Files from './Root';

let server: any;

beforeEach(() => {
  server = makeServer();
});

afterEach(() => {
  server.shutdown();
});

const mockHistoryPush = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush
  })
}));

const setup = () => {
  render(
    <MemoryRouter>
      <HelmetProvider>
        <Files />
      </HelmetProvider>
    </MemoryRouter>
  );

  const filesWords = screen.getAllByText(/Files/i);

  return {
    filesWords,
    ...screen
  };
};

test('Renders with no crashing', async () => {
  const { filesWords } = setup();
  expect(filesWords).toHaveLength(2);
});
