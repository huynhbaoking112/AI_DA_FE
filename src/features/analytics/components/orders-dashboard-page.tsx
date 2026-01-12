/**
 * Orders Dashboard Page
 * Main container component with all state management and data fetching
 */

import { useState, useCallback, useMemo } from 'react';
import { AlertCircle, Database } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

import {
  useOrdersConnection,
  useOrdersSummary,
  useOrdersTimeSeries,
  useOrdersDistribution,
  useOrdersData,
} from '../hooks';
import { getDefaultDateRange, formatDateRangeDisplay } from '../utils';
import { DateRangePicker } from './date-range-picker';
import { SummaryCards } from './summary-cards';
import { TimeSeriesChart } from './time-series-chart';
import { DistributionChart } from './distribution-chart';
import { OrdersTable } from './orders-table';

import type { DateRange, DatePresetKey, Granularity, OrdersDataParams } from '../types';

export const OrdersDashboardPage = () => {
  // Date range state
  const [dateRange, setDateRange] = useState<DateRange>(getDefaultDateRange);
  const [activePreset, setActivePreset] = useState<DatePresetKey>('2M');

  // Granularity state for time series chart
  const [granularity, setGranularity] = useState<Granularity>('day');

  // Table params state
  const [tableParams, setTableParams] = useState<OrdersDataParams>({
    page: 1,
    page_size: 20,
    sort_by: 'order_date',
    sort_order: 'desc',
  });

  // Get Orders connection
  const {
    connectionId,
    isLoading: isConnectionLoading,
    isError: isConnectionError,
    hasConnection,
  } = useOrdersConnection();

  // Fetch summary data
  const { data: summaryData, isLoading: isSummaryLoading } = useOrdersSummary({
    connectionId,
    dateRange,
    enabled: hasConnection,
  });

  // Fetch time series data
  const { data: timeSeriesData, isLoading: isTimeSeriesLoading } =
    useOrdersTimeSeries({
      connectionId,
      dateRange,
      granularity,
      enabled: hasConnection,
    });

  // Fetch platform distribution
  const { data: platformData, isLoading: isPlatformLoading } =
    useOrdersDistribution({
      connectionId,
      field: 'platform',
      dateRange,
      enabled: hasConnection,
    });

  // Fetch status distribution
  const { data: statusData, isLoading: isStatusLoading } =
    useOrdersDistribution({
      connectionId,
      field: 'order_status',
      dateRange,
      enabled: hasConnection,
    });

  // Fetch table data
  const tableParamsWithDate = useMemo(
    () => ({
      ...tableParams,
      date_from: dateRange.from,
      date_to: dateRange.to,
    }),
    [tableParams, dateRange]
  );

  const { data: tableData, isLoading: isTableLoading } = useOrdersData({
    connectionId,
    params: tableParamsWithDate,
    enabled: hasConnection,
  });

  // Handlers
  const handleDateRangeChange = useCallback((range: DateRange) => {
    setDateRange(range);
    // Reset table to first page when date changes
    setTableParams((prev) => ({ ...prev, page: 1 }));
  }, []);

  const handlePresetChange = useCallback((preset: DatePresetKey) => {
    setActivePreset(preset);
  }, []);

  const handleGranularityChange = useCallback((value: Granularity) => {
    setGranularity(value);
  }, []);

  const handleTableParamsChange = useCallback(
    (newParams: Partial<OrdersDataParams>) => {
      setTableParams((prev) => ({ ...prev, ...newParams }));
    },
    []
  );

  // Loading state for connection
  if (isConnectionLoading) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-[280px]" />
          <Skeleton className="h-[280px]" />
        </div>
        <Skeleton className="h-[380px]" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  // Error state
  if (isConnectionError) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-6 min-h-[400px]">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Lỗi kết nối</AlertTitle>
          <AlertDescription>
            Không thể tải dữ liệu. Vui lòng thử lại sau.
          </AlertDescription>
        </Alert>
        <Button onClick={() => window.location.reload()}>Thử lại</Button>
      </div>
    );
  }

  // No connection state
  if (!hasConnection) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-6 min-h-[400px]">
        <div className="flex flex-col items-center gap-2 text-center">
          <Database className="h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-semibold">Chưa có kết nối dữ liệu</h3>
          <p className="text-muted-foreground max-w-md">
            Vui lòng kết nối Google Sheet chứa dữ liệu Orders để xem dashboard.
          </p>
        </div>
        <Button onClick={() => (window.location.href = '/settings/integrations')}>
          Đi đến Integrations
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Orders</h1>
          <p className="text-sm text-muted-foreground">
            {formatDateRangeDisplay(dateRange)}
          </p>
        </div>
        <DateRangePicker
          value={dateRange}
          onChange={handleDateRangeChange}
          activePreset={activePreset}
          onPresetChange={handlePresetChange}
        />
      </div>

      {/* Summary Cards */}
      <SummaryCards data={summaryData} isLoading={isSummaryLoading} />

      {/* Distribution Charts - Row 1: Platform + Status side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DistributionChart
          title="Đơn hàng theo Platform"
          data={platformData}
          isLoading={isPlatformLoading}
          field="platform"
        />
        <DistributionChart
          title="Trạng thái đơn hàng"
          data={statusData}
          isLoading={isStatusLoading}
          field="order_status"
        />
      </div>

      {/* Time Series Chart - Row 2: Full width */}
      <TimeSeriesChart
        data={timeSeriesData}
        isLoading={isTimeSeriesLoading}
        granularity={granularity}
        onGranularityChange={handleGranularityChange}
      />

      {/* Orders Table */}
      <OrdersTable
        data={tableData}
        isLoading={isTableLoading}
        params={tableParams}
        onParamsChange={handleTableParamsChange}
      />
    </div>
  );
};
