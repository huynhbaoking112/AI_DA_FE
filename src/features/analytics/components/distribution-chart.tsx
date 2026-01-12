/**
 * Distribution Chart Component
 * Reusable Donut chart for Platform and Status distributions
 */

import { useMemo } from 'react';
import { Label, Pie, PieChart } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';

import { formatNumber, CHART_COLORS, getStatusColor, getPlatformColor } from '../utils';

import type { ChartConfig } from '@/components/ui/chart';
import type { DistributionResponse, DistributionField } from '../types';

interface DistributionChartProps {
  title: string;
  data: DistributionResponse | undefined;
  isLoading: boolean;
  field: DistributionField;
}

export const DistributionChart = ({
  title,
  data,
  isLoading,
  field,
}: DistributionChartProps) => {
  // Transform data for chart with colors
  const { chartData, chartConfig, total } = useMemo(() => {
    if (!data?.data) {
      return { chartData: [], chartConfig: {}, total: 0 };
    }

    const totalCount = data.data.reduce((sum, item) => sum + item.count, 0);

    const transformedData = data.data.map((item, index) => {
      // Use semantic colors for status, platform colors for platform
      const color =
        field === 'order_status'
          ? getStatusColor(item.value)
          : field === 'platform'
            ? getPlatformColor(item.value)
            : CHART_COLORS[index % CHART_COLORS.length];

      return {
        name: item.value,
        value: item.count,
        percentage: item.percentage,
        fill: color,
      };
    });

    // Build chart config for legend
    const config: ChartConfig = {};
    transformedData.forEach((item) => {
      config[item.name] = {
        label: item.name,
        color: item.fill,
      };
    });

    return {
      chartData: transformedData,
      chartConfig: config,
      total: totalCount,
    };
  }, [data, field]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        {isLoading ? (
          <Skeleton className="w-full h-[250px]" />
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-[250px] text-muted-foreground">
            Không có dữ liệu
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="mx-auto h-[250px] w-full">
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={(value, name, item) => (
                      <div className="flex items-center gap-2">
                        <span>{name}</span>
                        <span className="font-medium">
                          {formatNumber(value as number)} ({item.payload.percentage}%)
                        </span>
                      </div>
                    )}
                  />
                }
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={45}
                outerRadius={70}
                strokeWidth={2}
                stroke="hsl(var(--background))"
                cx="50%"
                cy="45%"
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-xl font-bold"
                          >
                            {formatNumber(total)}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 18}
                            className="fill-muted-foreground text-xs"
                          >
                            đơn hàng
                          </tspan>
                        </text>
                      );
                    }
                    return null;
                  }}
                />
              </Pie>
              <ChartLegend
                content={<ChartLegendContent nameKey="name" />}
                verticalAlign="bottom"
                className="flex-wrap gap-2 [&>*]:justify-center"
              />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};
