/**
 * Hook to fetch products table data with pagination
 */

import { useQuery } from '@tanstack/react-query';

import { getProductsData } from '../api';
import { productsKeys } from './use-products-connection';

import type { ProductsDataParams } from '../types';

interface UseProductsDataOptions {
  connectionId: string | undefined;
  params?: ProductsDataParams;
  enabled?: boolean;
}

/**
 * Hook to fetch paginated products data
 * Supports search, sorting, and pagination
 */
export const useProductsData = ({
  connectionId,
  params = {},
  enabled = true,
}: UseProductsDataOptions) => {
  return useQuery({
    queryKey: productsKeys.data(connectionId ?? '', params),
    queryFn: () => getProductsData(connectionId!, params),
    enabled: enabled && Boolean(connectionId),
    staleTime: 5 * 60 * 1000, // 5 minutes - matches backend cache
  });
};
