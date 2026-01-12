/**
 * Customers Analytics API
 * API functions for Customers Dashboard data fetching
 */

import { apiClient } from '@/lib/api-client';

import type {
  CustomersSummary,
  CustomersDataParams,
  CustomersDataResponse,
} from '../types';

/**
 * Get summary metrics for customers
 */
export const getCustomersSummary = async (
  connectionId: string
): Promise<CustomersSummary> => {
  return apiClient.get<CustomersSummary>(`/analytics/${connectionId}/summary`);
};

/**
 * Get paginated customers data with search and sorting
 */
export const getCustomersData = async (
  connectionId: string,
  params: CustomersDataParams = {}
): Promise<CustomersDataResponse> => {
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

  return apiClient.get<CustomersDataResponse>(url);
};
