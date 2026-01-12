/**
 * Analytics API - Orders Dashboard data fetching
 */

import { apiClient } from '@/lib/api-client';

import type {
  DateRange,
  DistributionField,
  DistributionResponse,
  Granularity,
  OrdersDataParams,
  OrdersDataResponse,
  OrdersSummary,
  TimeSeriesResponse,
} from '../types';

/**
 * Get summary metrics for orders
 */
export const getOrdersSummary = async (
  connectionId: string,
  dateRange?: DateRange
): Promise<OrdersSummary> => {
  const params = new URLSearchParams();

  if (dateRange?.from) {
    params.append('date_from', dateRange.from);
  }
  if (dateRange?.to) {
    params.append('date_to', dateRange.to);
  }

  const queryString = params.toString();
  const url = `/analytics/${connectionId}/summary${queryString ? `?${queryString}` : ''}`;

  return apiClient.get<OrdersSummary>(url);
};

/**
 * Get time series data for orders
 */
export const getOrdersTimeSeries = async (
  connectionId: string,
  dateRange: DateRange,
  granularity: Granularity = 'day'
): Promise<TimeSeriesResponse> => {
  const params = new URLSearchParams({
    date_from: dateRange.from,
    date_to: dateRange.to,
    granularity,
    metrics: 'both',
  });

  return apiClient.get<TimeSeriesResponse>(
    `/analytics/${connectionId}/time-series?${params.toString()}`
  );
};

/**
 * Get distribution data for a specific field
 */
export const getOrdersDistribution = async (
  connectionId: string,
  field: DistributionField,
  dateRange?: DateRange
): Promise<DistributionResponse> => {
  const params = new URLSearchParams();

  if (dateRange?.from) {
    params.append('date_from', dateRange.from);
  }
  if (dateRange?.to) {
    params.append('date_to', dateRange.to);
  }

  const queryString = params.toString();
  const url = `/analytics/${connectionId}/distribution/${field}${queryString ? `?${queryString}` : ''}`;

  return apiClient.get<DistributionResponse>(url);
};

/**
 * Get paginated orders data
 */
export const getOrdersData = async (
  connectionId: string,
  params: OrdersDataParams = {}
): Promise<OrdersDataResponse> => {
  const searchParams = new URLSearchParams();

  if (params.page) {
    searchParams.append('page', params.page.toString());
  }
  if (params.page_size) {
    searchParams.append('page_size', params.page_size.toString());
  }
  if (params.search) {
    searchParams.append('search', params.search);
  }
  if (params.sort_by) {
    searchParams.append('sort_by', params.sort_by);
  }
  if (params.sort_order) {
    searchParams.append('sort_order', params.sort_order);
  }
  if (params.date_from) {
    searchParams.append('date_from', params.date_from);
  }
  if (params.date_to) {
    searchParams.append('date_to', params.date_to);
  }

  const queryString = searchParams.toString();
  const url = `/analytics/${connectionId}/data${queryString ? `?${queryString}` : ''}`;

  return apiClient.get<OrdersDataResponse>(url);
};
