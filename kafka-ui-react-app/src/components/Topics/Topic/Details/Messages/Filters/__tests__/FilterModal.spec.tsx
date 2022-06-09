import React from 'react';
import FilterModal, {
  FilterModalProps,
} from 'components/Topics/Topic/Details/Messages/Filters/FilterModal';
import { render } from 'lib/testHelpers';
import { MessageFilters } from 'components/Topics/Topic/Details/Messages/Filters/Filters';
import { screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const filters: MessageFilters[] = [{ name: 'name', code: 'code' }];

const renderComponent = (props?: Partial<FilterModalProps>) =>
  render(
    <FilterModal
      toggleIsOpen={vi.fn()}
      filters={filters}
      addFilter={vi.fn()}
      deleteFilter={vi.fn()}
      activeFilterHandler={vi.fn()}
      editSavedFilter={vi.fn()}
      {...props}
    />
  );
describe('FilterModal component', () => {
  beforeEach(async () => {
    await act(() => {
      renderComponent();
    });
  });
  it('renders component with add filter modal', () => {
    expect(
      screen.getByRole('heading', { name: /add filter/i, level: 3 })
    ).toBeInTheDocument();
  });
  it('renders component with edit filter modal', () => {
    userEvent.click(screen.getByRole('savedFilterText'));
    userEvent.click(screen.getByText('Edit'));
    expect(
      screen.getByRole('heading', { name: /edit saved filter/i, level: 3 })
    ).toBeInTheDocument();
  });
});
