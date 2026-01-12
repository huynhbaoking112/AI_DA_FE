/**
 * Analytics Types - Orders Dashboard
 */

// ============================================================================
// Connection Types
// ============================================================================

export interface Connection {
  id: string;
  sheet_id: string;
  sheet_name: string;
  column_mappings: Record<string, string>;
  sync_enabled: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// Date Range Types
// ============================================================================

export interface DateRange {
  from: string; // ISO date string YYYY-MM-DD
  to: string; // ISO date string YYYY-MM-DD
}

export type DatePresetKey = '7D' | '30D' | '2M' | 'QTR' | 'YTD' | 'CUSTOM';

export interface DatePreset {
  key: DatePresetKey;
  label: string;
  getRange: () => DateRange;
}

// ============================================================================
// Granularity Types
// ============================================================================

export type Granularity = 'day' | 'week' | 'month' | 'year';

// ============================================================================
// Summary Types
// ============================================================================

export interface OrdersSummary {
  total_count: number;
  total_amount: number;
  avg_amount: number;
}

// ============================================================================
// Time Series Types
// ============================================================================

export interface TimeSeriesDataPoint {
  date: string;
  count: number;
  total_amount: number;
}

export interface TimeSeriesResponse {
  granularity: Granularity;
  data: TimeSeriesDataPoint[];
}

// ============================================================================
// Distribution Types
// ============================================================================

export type DistributionField = 'platform' | 'order_status';

export interface DistributionDataPoint {
  value: string;
  count: number;
  percentage: number;
}

export interface DistributionResponse {
  field: DistributionField;
  data: DistributionDataPoint[];
}

// ============================================================================
// Orders Data Table Types
// ============================================================================

export interface OrderData {
  order_id: string;
  platform: string;
  order_status: string;
  customer_id: string;
  order_date: string;
  subtotal: number;
  total_amount: number;
}

export interface OrderRow {
  _id: string;
  connection_id: string;
  row_number: number;
  data: OrderData;
}

export interface OrdersDataResponse {
  data: OrderRow[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface OrdersDataParams {
  page?: number;
  page_size?: number;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  date_from?: string;
  date_to?: string;
}

// ============================================================================
// Order Status Types
// ============================================================================

export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'shipped'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'returned';

// ============================================================================
// Platform Types
// ============================================================================

export type Platform = 'Shopee' | 'Lazada' | 'Tiki' | 'Website' | string;
