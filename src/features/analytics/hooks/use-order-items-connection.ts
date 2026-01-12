/**
 * Hook to get Order Items connection
 * Fetches all connections and filters for the one with sheet_name containing 'order_items'
 */

import { useQuery } from '@tanstack/react-query';

import { getConnections } from '../api';

import type { Connection } from '../types';

/**
 * Query key factory for order items analytics
 */
export const orderItemsKeys = {
  all: ['order-items'] as const,
  connection: () => [...orderItemsKeys.all, 'connection'] as const,
  summary: (connectionId: string) =>
    [...orderItemsKeys.all, 'summary', connectionId] as const,
  top: (connectionId: string, metric: string, limit: number) =>
    [...orderItemsKeys.all, 'top', connectionId, metric, limit] as const,
  data: (connectionId: string, params: Record<string, unknown>) =>
    [...orderItemsKeys.all, 'data', connectionId, params] as const,
};

/**
 * Find the Order Items connection from list of connections
 * Matches sheet_name containing 'order_items' (case-insensitive)
 */
const findOrderItemsConnection = (
  connections: Connection[]
): Connection | undefined => {
  return connections.find((conn) =>
    conn.sheet_name.toLowerCase().includes('order_items')
  );
};

/**
 * Hook to get the Order Items sheet connection
 * Returns the connection_id needed for analytics API calls
 */
export const useOrderItemsConnection = () => {
  const query = useQuery({
    queryKey: orderItemsKeys.connection(),
    queryFn: getConnections,
    select: findOrderItemsConnection,
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
