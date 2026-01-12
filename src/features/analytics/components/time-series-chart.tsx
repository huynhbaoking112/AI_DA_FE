/**
 * Time Series Chart Component
 * Displays revenue and order count over time using a combo Area + Line chart
 */

import { useMemo } from 'react';
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

import { formatChartDate, formatCurrency, formatNumber } from '../utils';

import type { ChartConfig } from '@/components/ui/chart';
import type { Granularity, TimeSeriesResponse } from '../types';

interface TimeSeriesChartProps {
  data: TimeSeriesResponse | undefined;
  isLoading: boolean;
  granularity: Granularity;
  onGranularityChange: (value: Granularity) => void;
}

const chartConfig = {
  total_amount: {
    label: 'Doanh thu',
    color: 'hsl(var(--chart-1))',
  },
  count: {
    label: 'Số đơn',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export const TimeSeriesChart = ({
  data,
  isLoading,
  granularity,
  onGranularityChange,
}: TimeSeriesChartProps) => {
  // Transform data for chart display
  const chartData = useMemo(() => {
    if (!data?.data) return [];

    return data.data.map((point) => ({
      ...point,
      displayDate: formatChartDate(point.date, granularity),
    }));
  }, [data, granularity]);

  // Custom tooltip formatter
  const tooltipFormatter = (
    value: number,
    name: string
  ): [string, string] => {
    if (name === 'total_amount') {
      return [formatCurrency(value), 'Doanh thu'];
    }
    return [formatNumber(value), 'Số đơn'];
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">
          Doanh thu & Số đơn theo thời gian
        </CardTitle>
        <Select
          value={granularity}
          onValueChange={(value) => onGranularityChange(value as Granularity)}
        >
          <SelectTrigger className="w-24 h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Day</SelectItem>
            <SelectItem value="week">Week</SelectItem>
            <SelectItem value="month">Month</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        {isLoading ? (
          <Skeleton className="w-full h-[300px]" />
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            Không có dữ liệu trong khoảng thời gian này
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ComposedChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="fillAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-total_amount)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-total_amount)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="displayDate"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
              />
              <YAxis
                yAxisId="left"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatCurrency(value)}
                width={80}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatNumber(value)}
                width={50}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelKey="displayDate"
                    formatter={(value, name) =>
                      tooltipFormatter(value as number, name as string)
                    }
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="total_amount"
                stroke="var(--color-total_amount)"
                fill="url(#fillAmount)"
                strokeWidth={2}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="count"
                stroke="var(--color-count)"
                strokeWidth={2}
                dot={false}
              />
            </ComposedChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};
