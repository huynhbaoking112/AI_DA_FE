/**
 * Products Analytics Types
 * Types specific to Products Dashboard
 */

// ============================================================================
// Summary Types
// ============================================================================

export interface ProductsSummary {
  total_count: number;
}

// ============================================================================
// Product Data Table Types
// ============================================================================

export interface ProductData {
  product_id: string;
  product_name: string;
}

export interface ProductRow {
  _id: string;
  connection_id: string;
  row_number: number;
  data: ProductData;
}

export interface ProductsDataResponse {
  data: ProductRow[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface ProductsDataParams {
  page?: number;
  page_size?: number;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}
