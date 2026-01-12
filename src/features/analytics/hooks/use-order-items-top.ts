/**
 * Hook to fetch top products data
 */

import { useQuery } from '@tanstack/react-query';

import { getOrderItemsTop } from '../api';
import { orderItemsKeys } from './use-order-items-connection';

import type { TopProductsMetric } from '../types';

interface UseOrderItemsTopOptions {
  connectionId: string | undefined;
  limit?: number;
  metric?: TopProductsMetric;
  enabled?: boolean;
}

/**
 * Hook to fetch top products by quantity or amount
 */
export const useOrderItemsTop = ({
  connectionId,
  limit = 10,
  metric = 'quantity',
  enabled = true,
}: UseOrderItemsTopOptions) => {
  return useQuery({
    queryKey: orderItemsKeys.top(connectionId ?? '', metric, limit),
    queryFn: () => getOrderItemsTop(connectionId!, limit, metric),
    enabled: enabled && Boolean(connectionId),
    staleTime: 5 * 60 * 1000, // 5 minutes - matches backend cache
  });
};
