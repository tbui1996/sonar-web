import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { UseMutationOptions } from 'react-query';
import CreateFeatureFlagDialog, {
  CreateFeatureFlagDialogProps
} from './CreateFeatureFlagDialog';
import { CreateFeatureFlagRequest } from '../../hooks/domain/mutations/useCreateFeatureFlag';

const mockCreateFlag = jest.fn();
const mockIsCreating = jest.fn(() => true);

const useCreateFeatureFlagMock = (options: UseMutationOptions) => ({
  mutate: (args: CreateFeatureFlagRequest) => {
    mockCreateFlag(args);
    options.onSuccess?.(null, undefined, null);
  },
  isLoading: mockIsCreating()
});

jest.mock('../../hooks/domain/mutations/useCreateFeatureFlag', () => ({
  ...(jest.requireActual(
    '../../hooks/domain/mutations/useCreateFeatureFlag'
  ) as {}),
  __esModule: true,
  default: useCreateFeatureFlagMock
}));

const renderDialog = ({
  isOpen = true,
  onClose = jest.fn()
}: Partial<CreateFeatureFlagDialogProps> = {}) =>
  render(<CreateFeatureFlagDialog isOpen={isOpen} onClose={onClose} />);

describe('CreateFeatureFlagDialog', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('the dialog renders', async () => {
    renderDialog();
    const root = await screen.queryByRole('dialog');

    expect(root).toBeInTheDocument();
  });

  test('cancel', () => {
    const onClose = jest.fn();
    renderDialog({ onClose });
    const cancelButton = screen.getByRole('button', { name: /cancel/i });

    fireEvent.click(cancelButton);

    expect(onClose).toHaveBeenCalled();
  });

  describe('create flag form', () => {
    test('name is required', async () => {
      renderDialog();

      const input = screen.getByLabelText('Name');

      fireEvent.blur(input);

      expect(
        await screen.findByText(/name is a required field/i)
      ).toBeInTheDocument();
    });

    test('key is required', async () => {
      renderDialog();
      const input = screen.getByLabelText('Key');

      fireEvent.blur(input);

      expect(
        await screen.findByText(/key is a required field/i)
      ).toBeInTheDocument();
    });

    test('key cannot have spaces', async () => {
      renderDialog();
      const input = screen.getByLabelText('Key');

      fireEvent.change(input, { target: { value: 'some key' } });
      fireEvent.blur(input);

      expect(
        await screen.findByText(/not allowed to have spaces/i)
      ).toBeInTheDocument();
    });

    test('submits the correct data', async () => {
      const onClose = jest.fn();
      renderDialog({ onClose });
      const keyInput = screen.getByLabelText('Key');
      const nameInput = screen.getByLabelText('Name');

      fireEvent.change(keyInput, { target: { value: 'someKey' } });
      fireEvent.change(nameInput, { target: { value: 'some name' } });
      fireEvent.click(screen.getByRole('button', { name: /create/i }));

      await waitFor(() =>
        expect(mockCreateFlag).toHaveBeenCalledWith({
          name: 'some name',
          key: 'someKey'
        })
      );

      expect(onClose).toHaveBeenCalled();
    });
  });
});
