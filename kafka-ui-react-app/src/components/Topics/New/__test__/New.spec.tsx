import React from 'react';
import New from 'components/Topics/New/New';
import { Route, Routes } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { RootState } from 'redux/interfaces';
import * as redux from 'react-redux';
import { act, screen, waitFor } from '@testing-library/react';
import {
  clusterTopicCopyPath,
  clusterTopicNewPath,
  clusterTopicPath,
} from 'lib/paths';
import userEvent from '@testing-library/user-event';
import { render } from 'lib/testHelpers';

const { Provider } = redux;

const mockStore = configureStore();

const clusterName = 'local';
const topicName = 'test-topic';

const initialState: Partial<RootState> = {};
const storeMock = mockStore(initialState);

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual: Record<string, string> = await vi.importActual(
    'react-router-dom'
  );
  return { ...actual, useNavigate: () => mockNavigate };
});

const renderComponent = (path: string, store = storeMock) => {
  render(
    <Routes>
      <Route
        path={clusterTopicNewPath()}
        element={
          <Provider store={store}>
            <New />
          </Provider>
        }
      />

      <Route
        path={clusterTopicCopyPath()}
        element={
          <Provider store={store}>
            <New />
          </Provider>
        }
      />

      <Route path={clusterTopicPath()} element="New topic path" />
    </Routes>,
    { initialEntries: [path] }
  );
};

describe('New', () => {
  afterEach(() => {
    mockNavigate.mockClear();
  });

  it('checks header for create new', async () => {
    await act(() => renderComponent(clusterTopicNewPath(clusterName)));

    expect(
      screen.getByRole('heading', { name: 'Create new Topic' })
    ).toHaveTextContent('Create new Topic');
  });

  it('checks header for copy', async () => {
    await act(() =>
      renderComponent(`${clusterTopicCopyPath(clusterName)}?name=test`)
    );
    expect(
      screen.getByRole('heading', { name: 'Copy Topic' })
    ).toHaveTextContent('Copy Topic');
  });

  it('validates form', async () => {
    await act(() => renderComponent(clusterTopicNewPath(clusterName)));
    userEvent.click(screen.getByText(/submit/i));
    await waitFor(() => {
      expect(screen.getByText('name is a required field')).toBeInTheDocument();
    });
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('submits valid form', async () => {
    const useDispatchMock = vi.fn(() => ({
      meta: { requestStatus: 'fulfilled' },
    }));
    vi.mock('redux', async () => {
      const actual: Record<string, string> = await vi.importActual('redux');
      return { ...actual, useDispatch: useDispatchMock };
    });

    await act(() => renderComponent(clusterTopicNewPath(clusterName)));

    userEvent.type(screen.getByPlaceholderText('Topic Name'), topicName);
    userEvent.click(screen.getByText(/submit/i));

    await waitFor(() => expect(mockNavigate).toBeCalledTimes(1));
    expect(mockNavigate).toHaveBeenLastCalledWith(`../${topicName}`);
    expect(useDispatchMock).toHaveBeenCalledTimes(1);
  });

  it('does not redirect page when request is not fulfilled', async () => {
    const useDispatchMock = vi.fn(() => ({
      meta: { requestStatus: 'pending' },
    }));
    vi.mock('redux', async () => {
      const actual: Record<string, string> = await vi.importActual('redux');
      return { ...actual, useDispatch: useDispatchMock };
    });

    await act(() => renderComponent(clusterTopicNewPath(clusterName)));
    await act(() =>
      userEvent.type(screen.getByPlaceholderText('Topic Name'), topicName)
    );
    await act(() => userEvent.click(screen.getByText(/submit/i)));
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('submits valid form that result in an error', async () => {
    const useDispatchMock = vi.fn();
    vi.mock('redux', async () => {
      const actual: Record<string, string> = await vi.importActual('redux');
      return { ...actual, useDispatch: useDispatchMock };
    });

    await act(() => renderComponent(clusterTopicNewPath(clusterName)));
    await act(() => {
      userEvent.type(screen.getByPlaceholderText('Topic Name'), topicName);
      userEvent.click(screen.getByText(/submit/i));
    });

    expect(useDispatchMock).toHaveBeenCalledTimes(1);
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
