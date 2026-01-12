/**
 * Hook to fetch orders distribution data
 */

import { useQuery } from '@tanstack/react-query';

import { getOrdersDistribution } from '../api';
import { analyticsKeys } from './use-orders-connection';

import type { DateRange, DistributionField } from '../types';

interface UseOrdersDistributionOptions {
  connectionId: string | undefined;
  field: DistributionField;
  dateRange?: DateRange;
  enabled?: boolean;
}

/**
 * Hook to fetch distribution data for a specific field
 * Reusable for both platform and order_status distributions
 */
export const useOrdersDistribution = ({
  connectionId,
  field,
  dateRange,
  enabled = true,
}: UseOrdersDistributionOptions) => {
  return useQuery({
    queryKey: analyticsKeys.distribution(
      connectionId ?? '',
      field,
      dateRange?.from,
      dateRange?.to
    ),
    queryFn: () => getOrdersDistribution(connectionId!, field, dateRange),
    enabled: enabled && Boolean(connectionId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
