/**
 * Customers Analytics Types
 * Types specific to Customers Dashboard
 */

// ============================================================================
// Summary Types
// ============================================================================

export interface CustomersSummary {
  total_count: number;
}

// ============================================================================
// Customer Data Table Types
// ============================================================================

export interface CustomerData {
  customer_id: string;
  customer_name: string;
  phone: string;
}

export interface CustomerRow {
  _id: string;
  connection_id: string;
  row_number: number;
  data: CustomerData;
}

export interface CustomersDataResponse {
  data: CustomerRow[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface CustomersDataParams {
  page?: number;
  page_size?: number;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}
