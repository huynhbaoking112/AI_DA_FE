/**
 * Hook to fetch products summary data
 */

import { useQuery } from '@tanstack/react-query';

import { getProductsSummary } from '../api';
import { productsKeys } from './use-products-connection';

interface UseProductsSummaryOptions {
  connectionId: string | undefined;
  enabled?: boolean;
}

/**
 * Hook to fetch products summary metrics
 * Returns total_count
 */
export const useProductsSummary = ({
  connectionId,
  enabled = true,
}: UseProductsSummaryOptions) => {
  return useQuery({
    queryKey: productsKeys.summary(connectionId ?? ''),
    queryFn: () => getProductsSummary(connectionId!),
    enabled: enabled && Boolean(connectionId),
    staleTime: 5 * 60 * 1000, // 5 minutes - matches backend cache
  });
};
