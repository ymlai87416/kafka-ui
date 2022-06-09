import React from 'react';
import Schemas from 'components/Schemas/Schemas';
import { render, WithRoute } from 'lib/testHelpers';
import {
  clusterSchemaEditPath,
  clusterSchemaNewPath,
  clusterSchemaPath,
  clusterSchemasPath,
  getNonExactPath,
} from 'lib/paths';
import { screen, waitFor } from '@testing-library/dom';
import fetchMock from 'fetch-mock';
import { schemaVersion } from 'redux/reducers/schemas/__test__/fixtures';

const renderComponent = (pathname: string) =>
  render(
    <WithRoute path={getNonExactPath(clusterSchemasPath())}>
      <Schemas />
    </WithRoute>,
    { initialEntries: [pathname] }
  );

const clusterName = 'secondLocal';

const SchemaCompText = {
  List: 'List',
  Details: 'Details',
  New: 'New',
  Edit: 'Edit',
};

vi.mock('components/Schemas/List/List', () => ({
  default: () => <div>{SchemaCompText.List}</div>,
}));
vi.mock('components/Schemas/Details/Details', () => ({
  default: () => <div>{SchemaCompText.Details}</div>,
}));
vi.mock('components/Schemas/New/New', () => ({
  default: () => <div>{SchemaCompText.New}</div>,
}));
vi.mock('components/Schemas/Edit/Edit', () => ({
  default: () => <div>{SchemaCompText.Edit}</div>,
}));

describe('Schemas', () => {
  beforeEach(() => {
    fetchMock.getOnce(`/api/clusters/${clusterName}/schemas`, [schemaVersion]);
  });
  afterEach(() => fetchMock.restore());
  it('renders List', async () => {
    renderComponent(clusterSchemasPath(clusterName));
    await waitFor(() =>
      expect(screen.queryByText(SchemaCompText.List)).toBeInTheDocument()
    );
  });
  it('renders New', async () => {
    renderComponent(clusterSchemaNewPath(clusterName));
    await waitFor(() =>
      expect(screen.queryByText(SchemaCompText.New)).toBeInTheDocument()
    );
  });
  it('renders Details', async () => {
    renderComponent(clusterSchemaPath(clusterName, schemaVersion.subject));
    await waitFor(() =>
      expect(screen.queryByText(SchemaCompText.Details)).toBeInTheDocument()
    );
  });
  it('renders Edit', async () => {
    renderComponent(clusterSchemaEditPath(clusterName, schemaVersion.subject));
    await waitFor(() =>
      expect(screen.queryByText(SchemaCompText.Edit)).toBeInTheDocument()
    );
  });
});
