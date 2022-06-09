import React, { EventHandler, TextareaHTMLAttributes } from 'react';
import { render, WithRoute } from 'lib/testHelpers';
import {
  clusterConnectConnectorPath,
  clusterConnectorNewPath,
} from 'lib/paths';
import New, { NewProps } from 'components/Connect/New/New';
import { connects, connector } from 'redux/reducers/connect/__test__/fixtures';
import { fireEvent, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('components/common/PageLoader/PageLoader', () => ({
  default: () => 'mock-PageLoader',
}));

const navigateMock = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual: Record<string, string> = await vi.importActual(
    'react-router-dom'
  );
  return { ...actual, useNavigate: () => navigateMock };
});

const useDispatchMock = vi.fn(() => ({
  unwrap: () => ({ connector }),
}));

vi.mock('redux', async () => {
  const actual: Record<string, string> = await vi.importActual('redux');
  return { ...actual, useDispatch: useDispatchMock };
});

beforeEach(() => {
  vi.resetAllMocks();
});

describe('New', () => {
  const clusterName = 'my-cluster';
  const simulateFormSubmit = async () => {
    const nameFiled = screen.getByPlaceholderText('Connector Name');
    const jsonFiled = screen.getAllByRole('textbox')[1];

    await act(() => userEvent.type(nameFiled, 'my-connector'));
    expect(nameFiled).toHaveValue('my-connector');

    await act(() =>
      userEvent.paste(jsonFiled, 'data'.replace(/[{[]/g, '$&$&'))
    );
    expect(jsonFiled);

    expect(screen.getByText('Submit1')).toBeEnabled();
    await act(() => {
      fireEvent.submit(screen.getByRole('form'));
    });
  };

  const renderComponent = (props: Partial<NewProps> = {}) =>
    render(
      <WithRoute path={clusterConnectorNewPath()}>
        <New
          fetchConnects={vi.fn()}
          areConnectsFetching={false}
          connects={connects}
          {...props}
        />
      </WithRoute>,
      { initialEntries: [clusterConnectorNewPath(clusterName)] }
    );

  it('fetches connects on mount', async () => {
    const fetchConnects = vi.fn();
    await act(() => {
      renderComponent({ fetchConnects });
    });
    expect(fetchConnects).toHaveBeenCalledTimes(1);
    expect(fetchConnects).toHaveBeenCalledWith(clusterName);
  });

  it('calls createConnector on form submit', async () => {
    renderComponent();
    await simulateFormSubmit();
    expect(useDispatchMock).toHaveBeenCalledTimes(1);
  });

  it('redirects to connector details view on successful submit', async () => {
    const route = clusterConnectConnectorPath(
      clusterName,
      connects[0].name,
      connector.name
    );
    renderComponent();
    await simulateFormSubmit();

    expect(navigateMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith(route);
  });

  it('does not redirect to connector details view on unsuccessful submit', async () => {
    vi.mock('redux', async () => {
      const actual: Record<string, string> = await vi.importActual('redux');
      return {
        ...actual,
        useDispatch: vi.fn(async () => ({
          unwrap: () => ({}),
        })),
      };
    });
    renderComponent();
    await simulateFormSubmit();
    expect(navigateMock).not.toHaveBeenCalled();
  });
});
