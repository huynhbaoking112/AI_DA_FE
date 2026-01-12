/**
 * Hook to fetch customers summary data
 */

import { useQuery } from '@tanstack/react-query';

import { getCustomersSummary } from '../api';
import { customersKeys } from './use-customers-connection';

interface UseCustomersSummaryOptions {
  connectionId: string | undefined;
  enabled?: boolean;
}

/**
 * Hook to fetch customers summary metrics
 * Returns total_count
 */
export const useCustomersSummary = ({
  connectionId,
  enabled = true,
}: UseCustomersSummaryOptions) => {
  return useQuery({
    queryKey: customersKeys.summary(connectionId ?? ''),
    queryFn: () => getCustomersSummary(connectionId!),
    enabled: enabled && Boolean(connectionId),
    staleTime: 5 * 60 * 1000, // 5 minutes - matches backend cache
  });
};
