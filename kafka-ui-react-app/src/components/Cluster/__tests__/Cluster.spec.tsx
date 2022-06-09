import React from 'react';
import { ClusterFeaturesEnum } from 'generated-sources';
import { store } from 'redux/store';
import { onlineClusterPayload } from 'redux/reducers/clusters/__test__/fixtures';
import Cluster from 'components/Cluster/Cluster';
import { fetchClusters } from 'redux/reducers/clusters/clustersSlice';
import { screen } from '@testing-library/react';
import { render, WithRoute } from 'lib/testHelpers';
import {
  clusterBrokersPath,
  clusterConnectsPath,
  clusterConsumerGroupsPath,
  clusterKsqlDbPath,
  clusterPath,
  clusterSchemasPath,
  clusterTopicsPath,
} from 'lib/paths';
import { act } from 'react-dom/test-utils';

const CLusterCompText = {
  Topics: 'Topics',
  Schemas: 'Schemas',
  Connect: 'Connect',
  Brokers: 'Brokers',
  ConsumerGroups: 'ConsumerGroups',
  KsqlDb: 'KsqlDb',
};

vi.mock('components/Topics/Topics', () => ({
  default: () => <div>{CLusterCompText.Topics}</div>,
}));
vi.mock('components/Schemas/Schemas', () => ({
  default: () => <div>{CLusterCompText.Schemas}</div>,
}));
vi.mock('components/Connect/Connect', () => ({
  default: () => <div>{CLusterCompText.Connect}</div>,
}));
vi.mock('components/Brokers/Brokers', () => ({
  default: () => <div>{CLusterCompText.Brokers}</div>,
}));
vi.mock('components/ConsumerGroups/ConsumerGroups', () => ({
  default: () => <div>{CLusterCompText.ConsumerGroups}</div>,
}));
vi.mock('components/KsqlDb/KsqlDb', () => ({
  default: () => <div>{CLusterCompText.KsqlDb}</div>,
}));

describe('Cluster', () => {
  const renderComponent = (pathname: string) => {
    render(
      <WithRoute path={`${clusterPath()}/*`}>
        <Cluster />
      </WithRoute>,
      { initialEntries: [pathname], store }
    );
  };

  it('renders Brokers', async () => {
    await act(() => renderComponent(clusterBrokersPath('second')));
    expect(screen.getByText(CLusterCompText.Brokers)).toBeInTheDocument();
  });
  it('renders Topics', () => {
    renderComponent(clusterTopicsPath('second'));
    expect(screen.getByText(CLusterCompText.Topics)).toBeInTheDocument();
  });
  it('renders ConsumerGroups', () => {
    renderComponent(clusterConsumerGroupsPath('second'));
    expect(
      screen.getByText(CLusterCompText.ConsumerGroups)
    ).toBeInTheDocument();
  });

  describe('configured features', () => {
    it('does not render Schemas if SCHEMA_REGISTRY is not configured', () => {
      store.dispatch(
        fetchClusters.fulfilled(
          [
            {
              ...onlineClusterPayload,
              features: [],
            },
          ],
          '123'
        )
      );
      renderComponent(clusterSchemasPath('second'));
      expect(
        screen.queryByText(CLusterCompText.Schemas)
      ).not.toBeInTheDocument();
    });
    it('renders Schemas if SCHEMA_REGISTRY is configured', async () => {
      store.dispatch(
        fetchClusters.fulfilled(
          [
            {
              ...onlineClusterPayload,
              features: [ClusterFeaturesEnum.SCHEMA_REGISTRY],
            },
          ],
          '123'
        )
      );
      renderComponent(clusterSchemasPath(onlineClusterPayload.name));
      expect(screen.getByText(CLusterCompText.Schemas)).toBeInTheDocument();
    });
    it('renders Connect if KAFKA_CONNECT is configured', async () => {
      store.dispatch(
        fetchClusters.fulfilled(
          [
            {
              ...onlineClusterPayload,
              features: [ClusterFeaturesEnum.KAFKA_CONNECT],
            },
          ],
          'requestId'
        )
      );
      renderComponent(clusterConnectsPath(onlineClusterPayload.name));
      expect(screen.getByText(CLusterCompText.Connect)).toBeInTheDocument();
    });
    it('renders KSQL if KSQL_DB is configured', async () => {
      store.dispatch(
        fetchClusters.fulfilled(
          [
            {
              ...onlineClusterPayload,
              features: [ClusterFeaturesEnum.KSQL_DB],
            },
          ],
          'requestId'
        )
      );
      renderComponent(clusterKsqlDbPath(onlineClusterPayload.name));
      expect(screen.getByText(CLusterCompText.KsqlDb)).toBeInTheDocument();
    });
  });
});
