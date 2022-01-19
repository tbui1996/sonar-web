import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';
import {
  fireEvent,
  render,
  RenderResult,
  screen
} from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { makeServer } from '../../server';
import Root from './Root';

let server = makeServer();

jest.mock('notistack', () => ({
  ...(jest.requireActual('notistack') as {}),
  useSnackbar: () => ({ enqueueSnackbar: jest.fn() })
}));

const renderView = (): RenderResult => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <HelmetProvider>
          <Root />
        </HelmetProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('feature flags root', () => {
  beforeEach(() => {
    server.shutdown();
    server = makeServer();
  });

  test('renders', async () => {
    renderView();
    const rootElement = await screen.findAllByText(/flags/i);

    expect(rootElement.length).toBeGreaterThan(0);
  });

  test('should be able to open create flag dialog', async () => {
    renderView();
    const createFlagBtn = await screen.findByRole('button', {
      name: /new/i
    });

    expect(createFlagBtn).toBeInTheDocument();
    fireEvent.click(createFlagBtn);

    const dialogRoot = await screen.findByRole('dialog');

    expect(dialogRoot).toBeInTheDocument();
  });

  test('delete is disabled without selection', async () => {
    renderView();
    const deleteFlagBtn = await screen.findByRole('button', {
      name: /delete/i
    });

    expect(deleteFlagBtn).toBeDisabled();
  });

  describe('flag rows', () => {
    beforeEach(() => {
      server.createList('flag', 2);
      renderView();
    });
    test('renders a flag row for each flag', async () => {
      const flagRows = await screen.findAllByTestId('flag-row-root');
      expect(flagRows.length).toEqual(2);
    });

    test('renders the correct text', async () => {
      const flag1Key = await screen.findByText(/FlagKey0/i);
      const flag2Key = await screen.findByText(/FlagKey1/i);
      const flag1Name = await screen.findByText(/FlagName 0/i);
      const flag2Name = await screen.findByText(/FlagName 1/i);

      expect(flag1Key).toBeInTheDocument();
      expect(flag2Key).toBeInTheDocument();
      expect(flag1Name).toBeInTheDocument();
      expect(flag2Name).toBeInTheDocument();
    });

    test('clicking a name makes it editable', async () => {
      const nameBtn = await screen.findByTestId('name-btn-FlagKey0');

      fireEvent.click(nameBtn);

      const nameInput = await screen.findByTestId('name-input-FlagKey0');

      expect(nameInput).toBeInTheDocument();
      fireEvent.change(nameInput, { target: { value: 'new name' } });
      fireEvent.blur(nameInput);

      const updatedName = await screen.findByText(/new name/i);

      expect(updatedName).toBeInTheDocument();
    });

    test('there is a flow to toggle the flag', async () => {
      const isEnabledSwitch = await screen.findByRole('checkbox', {
        name: 'disable flag with key FlagKey0'
      });

      isEnabledSwitch.click();

      const confirmButton = await screen.findByRole('button', {
        name: /confirm/i
      });

      expect(confirmButton).toBeInTheDocument();
    });

    test('delete is enabled if rows are selected', async () => {
      const selectRowBox = await screen.findByRole('checkbox', {
        name: 'select flag with key FlagKey0'
      });

      selectRowBox.click();

      const deleteFlagBtn = await screen.findByRole('button', {
        name: /delete/i
      });
      expect(deleteFlagBtn).not.toBeDisabled();

      deleteFlagBtn.click();

      expect(
        await screen.findByRole('button', {
          name: /confirm/i
        })
      ).toBeInTheDocument();
    });
  });
});
