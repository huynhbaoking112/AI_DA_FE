/**
 * Hook to fetch order items table data with pagination
 */

import { useQuery } from '@tanstack/react-query';

import { getOrderItemsData } from '../api';
import { orderItemsKeys } from './use-order-items-connection';

import type { OrderItemsDataParams } from '../types';

interface UseOrderItemsDataOptions {
  connectionId: string | undefined;
  params?: OrderItemsDataParams;
  enabled?: boolean;
}

/**
 * Hook to fetch paginated order items data
 * Supports search, sorting, and pagination
 */
export const useOrderItemsData = ({
  connectionId,
  params = {},
  enabled = true,
}: UseOrderItemsDataOptions) => {
  return useQuery({
    queryKey: orderItemsKeys.data(connectionId ?? '', params),
    queryFn: () => getOrderItemsData(connectionId!, params),
    enabled: enabled && Boolean(connectionId),
    staleTime: 5 * 60 * 1000, // 5 minutes - matches backend cache
  });
};
