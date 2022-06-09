import React from 'react';
import FiltersContainer from 'components/Topics/Topic/Details/Messages/Filters/FiltersContainer';
import { screen } from '@testing-library/react';
import { render } from 'lib/testHelpers';

vi.mock('components/Topics/Topic/Details/Messages/Filters/Filters', () => ({
  default: () => <div>mock-Filters</div>,
}));

describe('FiltersContainer', () => {
  it('renders Filters component', () => {
    render(<FiltersContainer />);
    expect(screen.getByText('mock-Filters')).toBeInTheDocument();
  });
});
