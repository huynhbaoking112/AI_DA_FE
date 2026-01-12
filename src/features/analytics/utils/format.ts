/**
 * Formatting utilities for Orders Dashboard
 */

import {
  format,
  subDays,
  subMonths,
  startOfQuarter,
  startOfYear,
} from 'date-fns';

import type { DatePreset, DatePresetKey, DateRange } from '../types';

// ============================================================================
// Number Formatting
// ============================================================================

/**
 * Format number with thousand separators
 * @example formatNumber(1234567) => "1,234,567"
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('vi-VN').format(num);
};

/**
 * Format currency with Vietnamese Dong and abbreviations
 * @example formatCurrency(125500000) => "125.5M đ"
 * @example formatCurrency(40900) => "40.9K đ"
 * @example formatCurrency(500) => "500 đ"
 */
export const formatCurrency = (amount: number): string => {
  if (amount >= 1_000_000_000) {
    const value = amount / 1_000_000_000;
    return `${value.toFixed(1).replace(/\.0$/, '')}B đ`;
  }

  if (amount >= 1_000_000) {
    const value = amount / 1_000_000;
    return `${value.toFixed(1).replace(/\.0$/, '')}M đ`;
  }

  if (amount >= 1_000) {
    const value = amount / 1_000;
    return `${value.toFixed(1).replace(/\.0$/, '')}K đ`;
  }

  return `${formatNumber(amount)} đ`;
};

/**
 * Format currency for table display (full number with separators)
 * @example formatCurrencyFull(125500) => "125,500 đ"
 */
export const formatCurrencyFull = (amount: number): string => {
  return `${formatNumber(amount)} đ`;
};

// ============================================================================
// Date Formatting
// ============================================================================

/**
 * Format date for display
 * @example formatDisplayDate("2025-01-15") => "Jan 15, 2025"
 */
export const formatDisplayDate = (dateString: string): string => {
  return format(new Date(dateString), 'MMM dd, yyyy');
};

/**
 * Format date for API (ISO format)
 * @example formatApiDate(new Date()) => "2025-01-15"
 */
export const formatApiDate = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

/**
 * Format date range for display
 * @example formatDateRangeDisplay({ from: "2025-01-01", to: "2025-01-31" })
 *   => "Jan 01, 2025 - Jan 31, 2025"
 */
export const formatDateRangeDisplay = (range: DateRange): string => {
  return `${formatDisplayDate(range.from)} - ${formatDisplayDate(range.to)}`;
};

// ============================================================================
// Date Range Presets
// ============================================================================

/**
 * Get default date range (2 months ago to today)
 */
export const getDefaultDateRange = (): DateRange => {
  const today = new Date();
  const twoMonthsAgo = subMonths(today, 2);

  return {
    from: formatApiDate(twoMonthsAgo),
    to: formatApiDate(today),
  };
};

/**
 * Date preset configurations
 */
export const DATE_PRESETS: DatePreset[] = [
  {
    key: '7D',
    label: '7D',
    getRange: () => ({
      from: formatApiDate(subDays(new Date(), 7)),
      to: formatApiDate(new Date()),
    }),
  },
  {
    key: '30D',
    label: '30D',
    getRange: () => ({
      from: formatApiDate(subDays(new Date(), 30)),
      to: formatApiDate(new Date()),
    }),
  },
  {
    key: '2M',
    label: '2M',
    getRange: () => getDefaultDateRange(),
  },
  {
    key: 'QTR',
    label: 'QTR',
    getRange: () => ({
      from: formatApiDate(startOfQuarter(new Date())),
      to: formatApiDate(new Date()),
    }),
  },
  {
    key: 'YTD',
    label: 'YTD',
    getRange: () => ({
      from: formatApiDate(startOfYear(new Date())),
      to: formatApiDate(new Date()),
    }),
  },
];

/**
 * Get preset by key
 */
export const getPresetByKey = (key: DatePresetKey): DatePreset | undefined => {
  return DATE_PRESETS.find((preset) => preset.key === key);
};

// ============================================================================
// Chart Helpers
// ============================================================================

/**
 * Parse date string safely, handling various formats
 * Supports: YYYY-MM-DD, YYYY-Www (ISO week), YYYY-MM, YYYY
 */
const parseFlexibleDate = (dateString: string): Date | null => {
  if (!dateString) return null;

  // Handle ISO week format (e.g., "2025-W01", "2025-W52")
  const weekMatch = dateString.match(/^(\d{4})-W(\d{1,2})$/);
  if (weekMatch) {
    const year = parseInt(weekMatch[1], 10);
    const week = parseInt(weekMatch[2], 10);
    // Get first day of the ISO week
    // ISO week 1 is the week containing January 4th
    const jan4 = new Date(year, 0, 4);
    const dayOfWeek = jan4.getDay() || 7; // Convert Sunday (0) to 7
    const firstMonday = new Date(jan4);
    firstMonday.setDate(jan4.getDate() - dayOfWeek + 1);
    const targetDate = new Date(firstMonday);
    targetDate.setDate(firstMonday.getDate() + (week - 1) * 7);
    return targetDate;
  }

  // Handle year-month format (e.g., "2025-01")
  const monthMatch = dateString.match(/^(\d{4})-(\d{2})$/);
  if (monthMatch) {
    return new Date(parseInt(monthMatch[1], 10), parseInt(monthMatch[2], 10) - 1, 1);
  }

  // Handle year only format (e.g., "2025")
  const yearMatch = dateString.match(/^(\d{4})$/);
  if (yearMatch) {
    return new Date(parseInt(yearMatch[1], 10), 0, 1);
  }

  // Standard date parsing (YYYY-MM-DD or ISO string)
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return null;
  }
  return date;
};

/**
 * Format chart date based on granularity
 */
export const formatChartDate = (
  dateString: string,
  granularity: 'day' | 'week' | 'month' | 'year'
): string => {
  // Handle ISO week format directly without conversion
  const weekMatch = dateString.match(/^(\d{4})-W(\d{1,2})$/);
  if (weekMatch) {
    const date = parseFlexibleDate(dateString);
    if (date) {
      return `W${weekMatch[2]} ${format(date, 'MMM')}`;
    }
    return `W${weekMatch[2]}`;
  }

  const date = parseFlexibleDate(dateString);
  if (!date) {
    // Fallback: return original string if parsing fails
    return dateString;
  }

  switch (granularity) {
    case 'day':
      return format(date, 'MMM dd');
    case 'week':
      return format(date, 'MMM dd');
    case 'month':
      return format(date, 'MMM yyyy');
    case 'year':
      return format(date, 'yyyy');
    default:
      return format(date, 'MMM dd');
  }
};

// ============================================================================
// Status & Platform Colors
// ============================================================================

/**
 * Status color mapping for badges and charts
 */
export const STATUS_COLORS: Record<string, string> = {
  delivered: 'hsl(142, 76%, 36%)', // green
  completed: 'hsl(142, 76%, 36%)', // green
  shipped: 'hsl(221, 83%, 53%)', // blue
  paid: 'hsl(142, 76%, 50%)', // light green
  pending: 'hsl(45, 93%, 47%)', // amber
  cancelled: 'hsl(0, 84%, 60%)', // red
  returned: 'hsl(0, 0%, 45%)', // gray
};

/**
 * Platform color mapping for badges and charts
 */
export const PLATFORM_COLORS: Record<string, string> = {
  Shopee: 'hsl(24, 100%, 50%)', // orange
  Lazada: 'hsl(221, 83%, 53%)', // blue
  Tiki: 'hsl(142, 76%, 36%)', // green
  Website: 'hsl(0, 0%, 45%)', // gray
};

/**
 * Get color for status
 */
export const getStatusColor = (status: string): string => {
  const normalizedStatus = status.toLowerCase();
  return STATUS_COLORS[normalizedStatus] ?? STATUS_COLORS.pending;
};

/**
 * Get color for platform
 */
export const getPlatformColor = (platform: string): string => {
  return PLATFORM_COLORS[platform] ?? 'hsl(0, 0%, 60%)';
};

/**
 * Chart color palette for distributions
 */
export const CHART_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];
