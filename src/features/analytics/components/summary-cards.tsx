/**
 * Summary Cards Component
 * Displays 3 key metrics: Total Orders, Total Revenue, Avg Order Value
 */

import { Package, DollarSign, TrendingUp } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import { formatNumber, formatCurrency } from '../utils';

import type { OrdersSummary } from '../types';

interface SummaryCardsProps {
  data: OrdersSummary | undefined;
  isLoading: boolean;
}

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  isLoading: boolean;
}

const MetricCard = ({ icon, label, value, isLoading }: MetricCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            {isLoading ? (
              <Skeleton className="h-8 w-24 mt-1" />
            ) : (
              <p className="text-2xl font-bold tracking-tight">{value}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const SummaryCards = ({ data, isLoading }: SummaryCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <MetricCard
        icon={<Package className="h-5 w-5" />}
        label="Tổng đơn hàng"
        value={data ? formatNumber(data.total_count) : '0'}
        isLoading={isLoading}
      />
      <MetricCard
        icon={<DollarSign className="h-5 w-5" />}
        label="Tổng doanh thu"
        value={data ? formatCurrency(data.total_amount) : '0 đ'}
        isLoading={isLoading}
      />
      <MetricCard
        icon={<TrendingUp className="h-5 w-5" />}
        label="Giá trị TB/đơn"
        value={data ? formatCurrency(data.avg_amount) : '0 đ'}
        isLoading={isLoading}
      />
    </div>
  );
};
