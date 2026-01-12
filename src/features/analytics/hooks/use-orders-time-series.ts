/**
 * Hook to fetch orders time series data
 */

import { useQuery } from '@tanstack/react-query';

import { getOrdersTimeSeries } from '../api';
import { analyticsKeys } from './use-orders-connection';

import type { DateRange, Granularity } from '../types';

interface UseOrdersTimeSeriesOptions {
  connectionId: string | undefined;
  dateRange: DateRange;
  granularity?: Granularity;
  enabled?: boolean;
}

/**
 * Hook to fetch time series data for orders
 * Returns data points with date, count, and total_amount
 */
export const useOrdersTimeSeries = ({
  connectionId,
  dateRange,
  granularity = 'day',
  enabled = true,
}: UseOrdersTimeSeriesOptions) => {
  return useQuery({
    queryKey: analyticsKeys.timeSeries(
      connectionId ?? '',
      dateRange.from,
      dateRange.to,
      granularity
    ),
    queryFn: () => getOrdersTimeSeries(connectionId!, dateRange, granularity),
    enabled: enabled && Boolean(connectionId) && Boolean(dateRange.from) && Boolean(dateRange.to),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
