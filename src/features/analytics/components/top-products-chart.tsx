/**
 * Top Products Chart Component
 * Reusable horizontal bar chart for displaying top products by quantity or revenue
 */

import { useMemo } from 'react';
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';

import { formatNumber, formatCurrency } from '../utils';

import type { ChartConfig } from '@/components/ui/chart';
import type { TopProductsResponse, TopProductsMetric } from '../types';

interface TopProductsChartProps {
  title: string;
  data: TopProductsResponse | undefined;
  isLoading: boolean;
  metric: TopProductsMetric;
  color?: string;
}

/**
 * Truncate product name for Y-axis display
 */
const truncateName = (name: string, maxLength: number = 20): string => {
  if (name.length <= maxLength) return name;
  return `${name.slice(0, maxLength)}...`;
};

export const TopProductsChart = ({
  title,
  data,
  isLoading,
  metric,
  color = 'hsl(var(--chart-1))',
}: TopProductsChartProps) => {
  // Transform data for chart
  const { chartData, chartConfig } = useMemo(() => {
    if (!data?.data) {
      return { chartData: [], chartConfig: {} as ChartConfig };
    }

    const transformedData = data.data.map((item) => ({
      name: item.value,
      displayName: truncateName(item.value),
      value: metric === 'quantity' ? item.total_quantity : item.total_amount,
      quantity: item.total_quantity,
      amount: item.total_amount,
      count: item.count,
    }));

    const config: ChartConfig = {
      value: {
        label: metric === 'quantity' ? 'Số lượng' : 'Doanh thu',
        color,
      },
    };

    return {
      chartData: transformedData,
      chartConfig: config,
    };
  }, [data, metric, color]);

  // Format value for display based on metric
  const formatValue = (value: number): string => {
    return metric === 'quantity' ? formatNumber(value) : formatCurrency(value);
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        {isLoading ? (
          <Skeleton className="w-full h-[300px]" />
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            Không có dữ liệu
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ left: 10, right: 30, top: 10, bottom: 10 }}
            >
              <CartesianGrid horizontal={false} strokeDasharray="3 3" />
              <XAxis
                type="number"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatValue(value)}
                fontSize={12}
              />
              <YAxis
                dataKey="displayName"
                type="category"
                width={130}
                tickLine={false}
                axisLine={false}
                fontSize={12}
                tickFormatter={(value) => value}
              />
              <ChartTooltip
                cursor={{ fill: 'hsl(var(--muted))', opacity: 0.3 }}
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={(value, _name, item) => (
                      <div className="flex flex-col gap-1">
                        <span className="font-medium">{item.payload.name}</span>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">Số lượng:</span>
                          <span>{formatNumber(item.payload.quantity)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">Doanh thu:</span>
                          <span>{formatCurrency(item.payload.amount)}</span>
                        </div>
                      </div>
                    )}
                  />
                }
              />
              <Bar
                dataKey="value"
                fill={color}
                radius={[0, 4, 4, 0]}
                barSize={24}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};
