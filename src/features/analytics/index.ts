// Components
export { OrdersDashboardPage } from './components';

// Hooks
export {
  useOrdersConnection,
  useOrdersSummary,
  useOrdersTimeSeries,
  useOrdersDistribution,
  useOrdersData,
  analyticsKeys,
} from './hooks';

// API
export {
  getConnections,
  getConnectionById,
  getOrdersSummary,
  getOrdersTimeSeries,
  getOrdersDistribution,
  getOrdersData,
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
