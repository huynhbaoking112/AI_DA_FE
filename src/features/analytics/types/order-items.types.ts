/**
 * Order Items Analytics Types
 * Types specific to Order Items Dashboard
 */

// ============================================================================
// Summary Types
// ============================================================================

export interface OrderItemsSummary {
  total_quantity: number;
  total_line_total: number;
  unique_products: number;
}

// ============================================================================
// Top Products Types
// ============================================================================

export type TopProductsMetric = 'quantity' | 'amount';

export interface TopProductDataPoint {
  value: string; // product_name
  count: number; // number of order items
  total_amount: number; // total line_total
  total_quantity: number;
}

export interface TopProductsResponse {
  field: string;
  metric: TopProductsMetric;
  data: TopProductDataPoint[];
}

// ============================================================================
// Order Items Data Table Types
// ============================================================================

export interface OrderItemData {
  order_item_id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  final_price: number;
  line_total: number;
}

export interface OrderItemRow {
  _id: string;
  connection_id: string;
  row_number: number;
  data: OrderItemData;
}

export interface OrderItemsDataResponse {
  data: OrderItemRow[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface OrderItemsDataParams {
  page?: number;
  page_size?: number;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}
