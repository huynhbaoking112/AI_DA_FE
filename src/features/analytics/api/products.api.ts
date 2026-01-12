/**
 * Products Analytics API
 * API functions for Products Dashboard data fetching
 */

import { apiClient } from '@/lib/api-client';

import type {
  ProductsSummary,
  ProductsDataParams,
  ProductsDataResponse,
} from '../types';

/**
 * Get summary metrics for products
 */
export const getProductsSummary = async (
  connectionId: string
): Promise<ProductsSummary> => {
  return apiClient.get<ProductsSummary>(`/analytics/${connectionId}/summary`);
};

/**
 * Get paginated products data with search and sorting
 */
export const getProductsData = async (
  connectionId: string,
  params: ProductsDataParams = {}
): Promise<ProductsDataResponse> => {
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

  return apiClient.get<ProductsDataResponse>(url);
};
