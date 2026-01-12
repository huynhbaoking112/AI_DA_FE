/**
 * Hook to fetch paginated orders data for the table
 */

import { useQuery, keepPreviousData } from '@tanstack/react-query';

import { getOrdersData } from '../api';
import { analyticsKeys } from './use-orders-connection';

import type { OrdersDataParams } from '../types';

interface UseOrdersDataOptions {
  connectionId: string | undefined;
  params?: OrdersDataParams;
  enabled?: boolean;
}

/**
 * Hook to fetch paginated orders data
 * Supports search, sort, and pagination
 */
export const useOrdersData = ({
  connectionId,
  params = {},
  enabled = true,
}: UseOrdersDataOptions) => {
  return useQuery({
    queryKey: analyticsKeys.data(connectionId ?? '', params),
    queryFn: () => getOrdersData(connectionId!, params),
    enabled: enabled && Boolean(connectionId),
    staleTime: 1 * 60 * 1000, // 1 minute - more frequent updates for table
    placeholderData: keepPreviousData, // Keep showing previous data while fetching new page
  });
};
