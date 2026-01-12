/**
 * Hook to get Orders connection
 * Fetches all connections and filters for the one with sheet_name === 'orders'
 */

import { useQuery } from '@tanstack/react-query';

import { getConnections } from '../api';

import type { Connection } from '../types';

/**
 * Query key factory for analytics
 */
export const analyticsKeys = {
  all: ['analytics'] as const,
  connections: () => [...analyticsKeys.all, 'connections'] as const,
  ordersConnection: () => [...analyticsKeys.connections(), 'orders'] as const,
  summary: (connectionId: string, dateFrom?: string, dateTo?: string) =>
    [...analyticsKeys.all, 'summary', connectionId, dateFrom, dateTo] as const,
  timeSeries: (
    connectionId: string,
    dateFrom: string,
    dateTo: string,
    granularity: string
  ) =>
    [
      ...analyticsKeys.all,
      'time-series',
      connectionId,
      dateFrom,
      dateTo,
      granularity,
    ] as const,
  distribution: (
    connectionId: string,
    field: string,
    dateFrom?: string,
    dateTo?: string
  ) =>
    [
      ...analyticsKeys.all,
      'distribution',
      connectionId,
      field,
      dateFrom,
      dateTo,
    ] as const,
  data: (connectionId: string, params: Record<string, unknown>) =>
    [...analyticsKeys.all, 'data', connectionId, params] as const,
};

/**
 * Find the Orders connection from list of connections
 */
const findOrdersConnection = (
  connections: Connection[]
): Connection | undefined => {
  return connections.find(
    (conn) => conn.sheet_name.toLowerCase().trim() === 'orders'
  );
};

/**
 * Hook to get the Orders sheet connection
 * Returns the connection_id needed for analytics API calls
 */
export const useOrdersConnection = () => {
  const query = useQuery({
    queryKey: analyticsKeys.ordersConnection(),
    queryFn: getConnections,
    select: findOrdersConnection,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    connection: query.data,
    connectionId: query.data?.id,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    hasConnection: Boolean(query.data),
  };
};
