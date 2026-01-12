/**
 * Hook to get Customers connection
 * Fetches all connections and filters for the one with sheet_name containing 'customers'
 */

import { useQuery } from '@tanstack/react-query';

import { getConnections } from '../api';

import type { Connection, CustomersDataParams } from '../types';

/**
 * Query key factory for customers analytics
 */
export const customersKeys = {
  all: ['customers'] as const,
  connection: () => [...customersKeys.all, 'connection'] as const,
  summary: (connectionId: string) =>
    [...customersKeys.all, 'summary', connectionId] as const,
  data: (connectionId: string, params: CustomersDataParams) =>
    [...customersKeys.all, 'data', connectionId, params] as const,
};

/**
 * Find the Customers connection from list of connections
 * Matches sheet_name containing 'customers' (case-insensitive)
 */
const findCustomersConnection = (
  connections: Connection[]
): Connection | undefined => {
  return connections.find((conn) =>
    conn.sheet_name.toLowerCase().includes('customers')
  );
};

/**
 * Hook to get the Customers sheet connection
 * Returns the connection_id needed for analytics API calls
 */
export const useCustomersConnection = () => {
  const query = useQuery({
    queryKey: customersKeys.connection(),
    queryFn: getConnections,
    select: findCustomersConnection,
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
