import Input, { InputProps } from 'components/common/Input/Input';
import React from 'react';
import { screen } from '@testing-library/react';
import { render } from 'lib/testHelpers';

const setupWrapper = (props?: Partial<InputProps>) => (
  <Input name="test" {...props} />
);

vi.mock('react-hook-form', async () => {
  const actual: Record<string, string> = await vi.importActual(
    'react-hook-form'
  );
  return {
    ...actual,
    useFormContext: () => ({
      register: vi.fn(),
    }),
  };
});
describe('Custom Input', () => {
  describe('with no icons', () => {
    it('to be in the document', () => {
      render(setupWrapper());
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });
  });
});
