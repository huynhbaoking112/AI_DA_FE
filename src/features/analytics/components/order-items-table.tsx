/**
 * Order Items Table Component
 * Displays paginated order items data with search, sort, and pagination
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

import { formatNumber, formatCurrencyFull } from '../utils';

import type { OrderItemsDataResponse, OrderItemsDataParams } from '../types';

interface OrderItemsTableProps {
  data: OrderItemsDataResponse | undefined;
  isLoading: boolean;
  params: OrderItemsDataParams;
  onParamsChange: (params: Partial<OrderItemsDataParams>) => void;
}

// Sortable column header component
interface SortableHeaderProps {
  label: string;
  sortKey: string;
  currentSortBy?: string;
  currentSortOrder?: 'asc' | 'desc';
  onSort: (key: string) => void;
  className?: string;
}

const SortableHeader = ({
  label,
  sortKey,
  currentSortBy,
  currentSortOrder,
  onSort,
  className,
}: SortableHeaderProps) => {
  const isActive = currentSortBy === sortKey;

  return (
    <Button
      variant="ghost"
      size="sm"
      className={`-ml-3 h-8 data-[state=open]:bg-accent ${className || ''}`}
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

export const OrderItemsTable = ({
  data,
  isLoading,
  params,
  onParamsChange,
}: OrderItemsTableProps) => {
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
          Chi tiết sản phẩm đã bán
        </CardTitle>
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm theo Order ID, Product ID, tên SP..."
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
                    label="Item ID"
                    sortKey="order_item_id"
                    currentSortBy={params.sort_by}
                    currentSortOrder={params.sort_order}
                    onSort={handleSort}
                  />
                </TableHead>
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
                    label="Product ID"
                    sortKey="product_id"
                    currentSortBy={params.sort_by}
                    currentSortOrder={params.sort_order}
                    onSort={handleSort}
                  />
                </TableHead>
                <TableHead>
                  <SortableHeader
                    label="Tên sản phẩm"
                    sortKey="product_name"
                    currentSortBy={params.sort_by}
                    currentSortOrder={params.sort_order}
                    onSort={handleSort}
                  />
                </TableHead>
                <TableHead className="text-right">
                  <SortableHeader
                    label="SL"
                    sortKey="quantity"
                    currentSortBy={params.sort_by}
                    currentSortOrder={params.sort_order}
                    onSort={handleSort}
                  />
                </TableHead>
                <TableHead className="text-right">
                  <SortableHeader
                    label="Đơn giá"
                    sortKey="unit_price"
                    currentSortBy={params.sort_by}
                    currentSortOrder={params.sort_order}
                    onSort={handleSort}
                  />
                </TableHead>
                <TableHead className="text-right">
                  <SortableHeader
                    label="Giá sau KM"
                    sortKey="final_price"
                    currentSortBy={params.sort_by}
                    currentSortOrder={params.sort_order}
                    onSort={handleSort}
                  />
                </TableHead>
                <TableHead className="text-right">
                  <SortableHeader
                    label="Thành tiền"
                    sortKey="line_total"
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
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-40" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-8 ml-auto" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20 ml-auto" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20 ml-auto" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : data?.data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="h-24 text-center text-muted-foreground"
                  >
                    {searchInput
                      ? 'Không tìm thấy sản phẩm phù hợp'
                      : 'Chưa có dữ liệu sản phẩm'}
                  </TableCell>
                </TableRow>
              ) : (
                data?.data.map((row) => (
                  <TableRow key={row._id}>
                    <TableCell className="font-medium text-sm">
                      {row.data.order_item_id}
                    </TableCell>
                    <TableCell className="text-sm">
                      {row.data.order_id}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {row.data.product_id}
                    </TableCell>
                    <TableCell
                      className="max-w-[200px] truncate text-sm"
                      title={row.data.product_name}
                    >
                      {row.data.product_name}
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      {formatNumber(row.data.quantity)}
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      {formatCurrencyFull(row.data.unit_price)}
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      {formatCurrencyFull(row.data.final_price)}
                    </TableCell>
                    <TableCell className="text-right font-medium text-sm">
                      {formatCurrencyFull(row.data.line_total)}
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
              Hiển thị {startItem}-{endItem} trong {formatNumber(total)} sản phẩm
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
