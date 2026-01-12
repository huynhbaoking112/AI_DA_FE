/**
 * Products Dashboard Page
 * Main container component with all state management and data fetching
 */

import { useState, useCallback } from 'react';
import { AlertCircle, Database, Package } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

import {
  useProductsConnection,
  useProductsSummary,
  useProductsData,
} from '../hooks';
import { SingleSummaryCard } from './single-summary-card';
import { ProductsTable } from './products-table';
import { formatNumber } from '../utils';

import type { ProductsDataParams } from '../types';

export const ProductsDashboardPage = () => {
  // Table params state
  const [tableParams, setTableParams] = useState<ProductsDataParams>({
    page: 1,
    page_size: 20,
    sort_by: 'product_id',
    sort_order: 'asc',
  });

  // Get Products connection
  const {
    connectionId,
    isLoading: isConnectionLoading,
    isError: isConnectionError,
    hasConnection,
  } = useProductsConnection();

  // Fetch summary data
  const { data: summaryData, isLoading: isSummaryLoading } =
    useProductsSummary({
      connectionId,
      enabled: hasConnection,
    });

  // Fetch table data
  const { data: tableData, isLoading: isTableLoading } = useProductsData({
    connectionId,
    params: tableParams,
    enabled: hasConnection,
  });

  // Handler for table params change
  const handleTableParamsChange = useCallback(
    (newParams: Partial<ProductsDataParams>) => {
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
        <Skeleton className="h-24 w-full" />
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
            Vui lòng kết nối Google Sheet chứa dữ liệu Products để xem
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
        <h1 className="text-2xl font-semibold">Products</h1>
        <p className="text-sm text-muted-foreground">
          Danh sách sản phẩm trong hệ thống
        </p>
      </div>

      {/* Summary Card */}
      <SingleSummaryCard
        icon={Package}
        label="Tổng sản phẩm"
        value={summaryData ? formatNumber(summaryData.total_count) : '0'}
        isLoading={isSummaryLoading}
      />

      {/* Products Table */}
      <ProductsTable
        data={tableData}
        isLoading={isTableLoading}
        params={tableParams}
        onParamsChange={handleTableParamsChange}
      />
    </div>
  );
};
