/**
 * Hook to get Products connection
 * Fetches all connections and filters for the one with sheet_name containing 'products'
 */

import { useQuery } from '@tanstack/react-query';

import { getConnections } from '../api';

import type { Connection, ProductsDataParams } from '../types';

/**
 * Query key factory for products analytics
 */
export const productsKeys = {
  all: ['products'] as const,
  connection: () => [...productsKeys.all, 'connection'] as const,
  summary: (connectionId: string) =>
    [...productsKeys.all, 'summary', connectionId] as const,
  data: (connectionId: string, params: ProductsDataParams) =>
    [...productsKeys.all, 'data', connectionId, params] as const,
};

/**
 * Find the Products connection from list of connections
 * Matches sheet_name containing 'products' (case-insensitive)
 */
const findProductsConnection = (
  connections: Connection[]
): Connection | undefined => {
  return connections.find((conn) =>
    conn.sheet_name.toLowerCase().includes('products')
  );
};

/**
 * Hook to get the Products sheet connection
 * Returns the connection_id needed for analytics API calls
 */
export const useProductsConnection = () => {
  const query = useQuery({
    queryKey: productsKeys.connection(),
    queryFn: getConnections,
    select: findProductsConnection,
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
