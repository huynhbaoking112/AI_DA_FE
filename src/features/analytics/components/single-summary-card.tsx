/**
 * Single Summary Card Component
 * Reusable component for displaying a single metric with icon
 * Used by Customers and Products dashboards
 */

import type { LucideIcon } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface SingleSummaryCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  isLoading: boolean;
}

export const SingleSummaryCard = ({
  icon: Icon,
  label,
  value,
  isLoading,
}: SingleSummaryCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
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
