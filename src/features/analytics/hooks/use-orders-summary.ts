/**
 * Hook to fetch orders summary data
 */

import { useQuery } from '@tanstack/react-query';

import { getOrdersSummary } from '../api';
import { analyticsKeys } from './use-orders-connection';

import type { DateRange } from '../types';

interface UseOrdersSummaryOptions {
  connectionId: string | undefined;
  dateRange?: DateRange;
  enabled?: boolean;
}

/**
 * Hook to fetch orders summary metrics
 * Returns total_count, total_amount, avg_amount
 */
export const useOrdersSummary = ({
  connectionId,
  dateRange,
  enabled = true,
}: UseOrdersSummaryOptions) => {
  return useQuery({
    queryKey: analyticsKeys.summary(
      connectionId ?? '',
      dateRange?.from,
      dateRange?.to
    ),
    queryFn: () => getOrdersSummary(connectionId!, dateRange),
    enabled: enabled && Boolean(connectionId),
    staleTime: 5 * 60 * 1000, // 5 minutes - matches backend cache
  });
};
