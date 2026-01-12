/**
 * Orders Table Component
 * Displays paginated orders data with search, sort, and status badges
 */

import { useState, useCallback, useMemo } from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

import { formatDisplayDate, formatCurrencyFull } from '../utils';

import type { OrdersDataResponse, OrdersDataParams } from '../types';

interface OrdersTableProps {
  data: OrdersDataResponse | undefined;
  isLoading: boolean;
  params: OrdersDataParams;
  onParamsChange: (params: Partial<OrdersDataParams>) => void;
}

// Status badge styling with semantic colors
const getStatusBadgeStyle = (status: string): string => {
  const normalizedStatus = status.toLowerCase();

  const statusStyles: Record<string, string> = {
    // Success states - Green
    delivered: 'bg-green-100 text-green-800 border-green-200',
    completed: 'bg-green-100 text-green-800 border-green-200',
    // Info states - Blue
    shipped: 'bg-blue-100 text-blue-800 border-blue-200',
    processing: 'bg-blue-100 text-blue-800 border-blue-200',
    // Warning states - Amber/Yellow
    pending: 'bg-amber-100 text-amber-800 border-amber-200',
    paid: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    // Danger states - Red
    cancelled: 'bg-red-100 text-red-800 border-red-200',
    returned: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  return statusStyles[normalizedStatus] || 'bg-gray-100 text-gray-800 border-gray-200';
};

// Status display text
const getStatusDisplay = (status: string): string => {
  const statusMap: Record<string, string> = {
    pending: 'Chờ xử lý',
    paid: 'Đã thanh toán',
    processing: 'Đang xử lý',
    shipped: 'Đang giao',
    delivered: 'Hoàn thành',
    completed: 'Hoàn thành',
    cancelled: 'Đã hủy',
    returned: 'Hoàn trả',
  };

  return statusMap[status.toLowerCase()] || status;
};

// Platform badge styling
const getPlatformStyle = (platform: string): string => {
  const platformStyles: Record<string, string> = {
    Shopee: 'bg-orange-100 text-orange-800 border-orange-200',
    Lazada: 'bg-blue-100 text-blue-800 border-blue-200',
    Tiki: 'bg-green-100 text-green-800 border-green-200',
    Website: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  return platformStyles[platform] || 'bg-gray-100 text-gray-800 border-gray-200';
};

// Sortable column header component
interface SortableHeaderProps {
  label: string;
  sortKey: string;
  currentSortBy?: string;
  currentSortOrder?: 'asc' | 'desc';
  onSort: (key: string) => void;
}

const SortableHeader = ({
  label,
  sortKey,
  currentSortBy,
  currentSortOrder,
  onSort,
}: SortableHeaderProps) => {
  const isActive = currentSortBy === sortKey;

  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 data-[state=open]:bg-accent"
      onClick={() => onSort(sortKey)}
    >
      {label}
      {isActive ? (
        currentSortOrder === 'asc' ? (
          <ArrowUp className="ml-2 h-4 w-4" />
        ) : (
          <ArrowDown className="ml-2 h-4 w-4" />
        )
      ) : (
        <ArrowUpDown className="ml-2 h-4 w-4" />
      )}
    </Button>
  );
};

export const OrdersTable = ({
  data,
  isLoading,
  params,
  onParamsChange,
}: OrdersTableProps) => {
  const [searchInput, setSearchInput] = useState(params.search || '');

  // Debounced search
  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchInput(value);
      // Debounce the API call
      const timeoutId = setTimeout(() => {
        onParamsChange({ search: value || undefined, page: 1 });
      }, 300);
      return () => clearTimeout(timeoutId);
    },
    [onParamsChange]
  );

  // Handle sort
  const handleSort = useCallback(
    (sortKey: string) => {
      const newOrder =
        params.sort_by === sortKey && params.sort_order === 'asc'
          ? 'desc'
          : 'asc';
      onParamsChange({
        sort_by: sortKey,
        sort_order: newOrder,
        page: 1,
      });
    },
    [params.sort_by, params.sort_order, onParamsChange]
  );

  // Pagination helpers
  const currentPage = params.page || 1;
  const totalPages = data?.total_pages || 1;
  const pageSize = params.page_size || 20;
  const total = data?.total || 0;
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, total);

  // Page numbers to display
  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push(-1); // Ellipsis
      }

      // Pages around current
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push(-2); // Ellipsis
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  }, [currentPage, totalPages]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-base font-medium">
          Chi tiết đơn hàng
        </CardTitle>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm theo Order ID, Platform..."
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <SortableHeader
                    label="Order ID"
                    sortKey="order_id"
                    currentSortBy={params.sort_by}
                    currentSortOrder={params.sort_order}
                    onSort={handleSort}
                  />
                </TableHead>
                <TableHead>
                  <SortableHeader
                    label="Platform"
                    sortKey="platform"
                    currentSortBy={params.sort_by}
                    currentSortOrder={params.sort_order}
                    onSort={handleSort}
                  />
                </TableHead>
                <TableHead>
                  <SortableHeader
                    label="Status"
                    sortKey="order_status"
                    currentSortBy={params.sort_by}
                    currentSortOrder={params.sort_order}
                    onSort={handleSort}
                  />
                </TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>
                  <SortableHeader
                    label="Order Date"
                    sortKey="order_date"
                    currentSortBy={params.sort_by}
                    currentSortOrder={params.sort_order}
                    onSort={handleSort}
                  />
                </TableHead>
                <TableHead className="text-right">
                  <SortableHeader
                    label="Amount"
                    sortKey="total_amount"
                    currentSortBy={params.sort_by}
                    currentSortOrder={params.sort_order}
                    onSort={handleSort}
                  />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Loading skeleton rows
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : data?.data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-muted-foreground"
                  >
                    {searchInput
                      ? 'Không tìm thấy đơn hàng phù hợp'
                      : 'Chưa có đơn hàng nào'}
                  </TableCell>
                </TableRow>
              ) : (
                data?.data.map((row) => (
                  <TableRow key={row._id}>
                    <TableCell className="font-medium">
                      {row.data.order_id}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          'font-normal',
                          getPlatformStyle(row.data.platform)
                        )}
                      >
                        {row.data.platform}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          'font-normal',
                          getStatusBadgeStyle(row.data.order_status)
                        )}
                      >
                        {getStatusDisplay(row.data.order_status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {row.data.customer_id}
                    </TableCell>
                    <TableCell>
                      {formatDisplayDate(row.data.order_date)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrencyFull(row.data.total_amount)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {!isLoading && data && data.total > 0 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Hiển thị {startItem}-{endItem} trong {total} đơn hàng
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onParamsChange({ page: 1 })}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onParamsChange({ page: currentPage - 1 })}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {pageNumbers.map((page, index) =>
                page < 0 ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-2 text-muted-foreground"
                  >
                    ...
                  </span>
                ) : (
                  <Button
                    key={page}
                    variant={page === currentPage ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onParamsChange({ page })}
                    className="min-w-8"
                  >
                    {page}
                  </Button>
                )
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => onParamsChange({ page: currentPage + 1 })}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onParamsChange({ page: totalPages })}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
