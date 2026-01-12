/**
 * Order Items Dashboard Page
 * Main container component with all state management and data fetching
 */

import { useState, useCallback } from 'react';
import { AlertCircle, Database } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

import {
  useOrderItemsConnection,
  useOrderItemsSummary,
  useOrderItemsTop,
  useOrderItemsData,
} from '../hooks';
import { OrderItemsSummaryCards } from './order-items-summary-cards';
import { TopProductsChart } from './top-products-chart';
import { OrderItemsTable } from './order-items-table';

import type { OrderItemsDataParams } from '../types';

export const OrderItemsDashboardPage = () => {
  // Table params state
  const [tableParams, setTableParams] = useState<OrderItemsDataParams>({
    page: 1,
    page_size: 20,
    sort_by: 'line_total',
    sort_order: 'desc',
  });

  // Get Order Items connection
  const {
    connectionId,
    isLoading: isConnectionLoading,
    isError: isConnectionError,
    hasConnection,
  } = useOrderItemsConnection();

  // Fetch summary data
  const { data: summaryData, isLoading: isSummaryLoading } =
    useOrderItemsSummary({
      connectionId,
      enabled: hasConnection,
    });

  // Fetch top products by quantity
  const { data: topByQuantity, isLoading: isTopQuantityLoading } =
    useOrderItemsTop({
      connectionId,
      limit: 10,
      metric: 'quantity',
      enabled: hasConnection,
    });

  // Fetch top products by revenue
  const { data: topByRevenue, isLoading: isTopRevenueLoading } =
    useOrderItemsTop({
      connectionId,
      limit: 10,
      metric: 'amount',
      enabled: hasConnection,
    });

  // Fetch table data
  const { data: tableData, isLoading: isTableLoading } = useOrderItemsData({
    connectionId,
    params: tableParams,
    enabled: hasConnection,
  });

  // Handler for table params change
  const handleTableParamsChange = useCallback(
    (newParams: Partial<OrderItemsDataParams>) => {
      setTableParams((prev) => ({ ...prev, ...newParams }));
    },
    []
  );

  // Loading state for connection
  if (isConnectionLoading) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-40" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-[340px]" />
          <Skeleton className="h-[340px]" />
        </div>
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
            Vui lòng kết nối Google Sheet chứa dữ liệu Order Items để xem
            dashboard.
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
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Order Items</h1>
        <p className="text-sm text-muted-foreground">
          Phân tích chi tiết sản phẩm đã bán
        </p>
      </div>

      {/* Summary Cards */}
      <OrderItemsSummaryCards data={summaryData} isLoading={isSummaryLoading} />

      {/* Top Products Charts - Row with 2 charts side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TopProductsChart
          title="Top 10 SP bán chạy (theo số lượng)"
          data={topByQuantity}
          isLoading={isTopQuantityLoading}
          metric="quantity"
          color="hsl(221, 83%, 53%)" // Blue
        />
        <TopProductsChart
          title="Top 10 SP theo doanh thu"
          data={topByRevenue}
          isLoading={isTopRevenueLoading}
          metric="amount"
          color="hsl(142, 76%, 36%)" // Green
        />
      </div>

      {/* Order Items Table */}
      <OrderItemsTable
        data={tableData}
        isLoading={isTableLoading}
        params={tableParams}
        onParamsChange={handleTableParamsChange}
      />
    </div>
  );
};
