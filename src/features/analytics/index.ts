// Components
export {
  OrdersDashboardPage,
  OrderItemsDashboardPage,
  CustomersDashboardPage,
  ProductsDashboardPage,
} from './components';

// Hooks
export {
  useOrdersConnection,
  useOrdersSummary,
  useOrdersTimeSeries,
  useOrdersDistribution,
  useOrdersData,
  analyticsKeys,
  // Order Items hooks
  useOrderItemsConnection,
  useOrderItemsSummary,
  useOrderItemsTop,
  useOrderItemsData,
  orderItemsKeys,
  // Customers hooks
  useCustomersConnection,
  useCustomersSummary,
  useCustomersData,
  customersKeys,
  // Products hooks
  useProductsConnection,
  useProductsSummary,
  useProductsData,
  productsKeys,
} from './hooks';

// API
export {
  getConnections,
  getConnectionById,
  getOrdersSummary,
  getOrdersTimeSeries,
  getOrdersDistribution,
  getOrdersData,
  // Order Items API
  getOrderItemsSummary,
  getOrderItemsTop,
  getOrderItemsData,
  // Customers API
  getCustomersSummary,
  getCustomersData,
  // Products API
  getProductsSummary,
  getProductsData,
} from './api';

// Types
export type {
  Connection,
  DateRange,
  DatePresetKey,
  DatePreset,
  Granularity,
  OrdersSummary,
  TimeSeriesDataPoint,
  TimeSeriesResponse,
  DistributionField,
  DistributionDataPoint,
  DistributionResponse,
  OrderData,
  OrderRow,
  OrdersDataResponse,
  OrdersDataParams,
  OrderStatus,
  Platform,
  // Order Items types
  OrderItemsSummary,
  TopProductsMetric,
  TopProductDataPoint,
  TopProductsResponse,
  OrderItemData,
  OrderItemRow,
  OrderItemsDataResponse,
  OrderItemsDataParams,
  // Customers types
  CustomersSummary,
  CustomerData,
  CustomerRow,
  CustomersDataResponse,
  CustomersDataParams,
  // Products types
  ProductsSummary,
  ProductData,
  ProductRow,
  ProductsDataResponse,
  ProductsDataParams,
} from './types';

// Utils
export {
  formatNumber,
  formatCurrency,
  formatCurrencyFull,
  formatDisplayDate,
  formatApiDate,
  formatDateRangeDisplay,
  getDefaultDateRange,
  DATE_PRESETS,
  getPresetByKey,
  formatChartDate,
  STATUS_COLORS,
  PLATFORM_COLORS,
  getStatusColor,
  getPlatformColor,
  CHART_COLORS,
} from './utils';
