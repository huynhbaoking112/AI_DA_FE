/**
 * Hook to fetch customers table data with pagination
 */

import { useQuery } from '@tanstack/react-query';

import { getCustomersData } from '../api';
import { customersKeys } from './use-customers-connection';

import type { CustomersDataParams } from '../types';

interface UseCustomersDataOptions {
  connectionId: string | undefined;
  params?: CustomersDataParams;
  enabled?: boolean;
}

/**
 * Hook to fetch paginated customers data
 * Supports search, sorting, and pagination
 */
export const useCustomersData = ({
  connectionId,
  params = {},
  enabled = true,
}: UseCustomersDataOptions) => {
  return useQuery({
    queryKey: customersKeys.data(connectionId ?? '', params),
    queryFn: () => getCustomersData(connectionId!, params),
    enabled: enabled && Boolean(connectionId),
    staleTime: 5 * 60 * 1000, // 5 minutes - matches backend cache
  });
};
