/**
 * Order Items Analytics API
 * API functions for Order Items Dashboard data fetching
 */

import { apiClient } from '@/lib/api-client';

import type {
  OrderItemsSummary,
  TopProductsResponse,
  TopProductsMetric,
  OrderItemsDataParams,
  OrderItemsDataResponse,
} from '../types';

/**
 * Get summary metrics for order items
 * Note: Order Items API does not support date filtering
 */
export const getOrderItemsSummary = async (
  connectionId: string
): Promise<OrderItemsSummary> => {
  return apiClient.get<OrderItemsSummary>(`/analytics/${connectionId}/summary`);
};

/**
 * Get top products by quantity or amount
 */
export const getOrderItemsTop = async (
  connectionId: string,
  limit: number = 10,
  metric: TopProductsMetric = 'quantity'
): Promise<TopProductsResponse> => {
  const params = new URLSearchParams({
    limit: limit.toString(),
    metric,
  });

  return apiClient.get<TopProductsResponse>(
    `/analytics/${connectionId}/top/product_name?${params.toString()}`
  );
};

/**
 * Get paginated order items data with search and sorting
 */
export const getOrderItemsData = async (
  connectionId: string,
  params: OrderItemsDataParams = {}
): Promise<OrderItemsDataResponse> => {
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

  const queryString = searchParams.toString();
  const url = `/analytics/${connectionId}/data${queryString ? `?${queryString}` : ''}`;

  return apiClient.get<OrderItemsDataResponse>(url);
};
