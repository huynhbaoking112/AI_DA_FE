/**
 * Hook to fetch order items summary data
 */

import { useQuery } from '@tanstack/react-query';

import { getOrderItemsSummary } from '../api';
import { orderItemsKeys } from './use-order-items-connection';

interface UseOrderItemsSummaryOptions {
  connectionId: string | undefined;
  enabled?: boolean;
}

/**
 * Hook to fetch order items summary metrics
 * Returns total_quantity, total_line_total, unique_products
 * Note: Order Items API does not support date filtering
 */
export const useOrderItemsSummary = ({
  connectionId,
  enabled = true,
}: UseOrderItemsSummaryOptions) => {
  return useQuery({
    queryKey: orderItemsKeys.summary(connectionId ?? ''),
    queryFn: () => getOrderItemsSummary(connectionId!),
    enabled: enabled && Boolean(connectionId),
    staleTime: 5 * 60 * 1000, // 5 minutes - matches backend cache
  });
};
