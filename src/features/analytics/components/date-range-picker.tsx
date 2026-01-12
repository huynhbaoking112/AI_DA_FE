/**
 * Date Range Picker Component
 * Provides preset buttons (7D, 30D, 2M, QTR, YTD) and custom date range selection
 */

import { useState, useCallback } from 'react';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

import { DATE_PRESETS, formatApiDate } from '../utils';

import type { DatePresetKey, DateRange } from '../types';

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  activePreset?: DatePresetKey;
  onPresetChange?: (preset: DatePresetKey) => void;
}

export const DateRangePicker = ({
  value,
  onChange,
  activePreset = '2M',
  onPresetChange,
}: DateRangePickerProps) => {
  const [isCustomOpen, setIsCustomOpen] = useState(false);
  const [tempRange, setTempRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: value.from ? new Date(value.from) : undefined,
    to: value.to ? new Date(value.to) : undefined,
  });

  const handlePresetClick = useCallback(
    (preset: (typeof DATE_PRESETS)[number]) => {
      const range = preset.getRange();
      onChange(range);
      onPresetChange?.(preset.key);
      setIsCustomOpen(false);
    },
    [onChange, onPresetChange]
  );

  const handleCustomApply = useCallback(() => {
    if (tempRange.from && tempRange.to) {
      onChange({
        from: formatApiDate(tempRange.from),
        to: formatApiDate(tempRange.to),
      });
      onPresetChange?.('CUSTOM');
      setIsCustomOpen(false);
    }
  }, [tempRange, onChange, onPresetChange]);

  const handleDateSelect = useCallback(
    (range: { from: Date | undefined; to?: Date | undefined } | undefined) => {
      if (range) {
        setTempRange({
          from: range.from,
          to: range.to,
        });
      }
    },
    []
  );

  return (
    <div className="flex items-center gap-2">
      {/* Preset Buttons */}
      <div className="flex items-center gap-1">
        {DATE_PRESETS.map((preset) => (
          <Button
            key={preset.key}
            variant={activePreset === preset.key ? 'default' : 'outline'}
            size="sm"
            onClick={() => handlePresetClick(preset)}
            className="h-8 px-3"
          >
            {preset.label}
          </Button>
        ))}
      </div>

      {/* Custom Date Picker */}
      <Popover open={isCustomOpen} onOpenChange={setIsCustomOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={activePreset === 'CUSTOM' ? 'default' : 'outline'}
            size="sm"
            className={cn('h-8 gap-2', activePreset === 'CUSTOM' && 'pl-3')}
          >
            <CalendarIcon className="h-4 w-4" />
            {activePreset === 'CUSTOM' ? (
              <span className="text-xs">
                {format(new Date(value.from), 'MMM dd')} -{' '}
                {format(new Date(value.to), 'MMM dd')}
              </span>
            ) : (
              <span>Custom</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <div className="p-3">
            <Calendar
              mode="range"
              selected={{
                from: tempRange.from,
                to: tempRange.to,
              }}
              onSelect={handleDateSelect}
              numberOfMonths={2}
              defaultMonth={tempRange.from}
            />
            <div className="flex justify-end gap-2 mt-3 pt-3 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCustomOpen(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleCustomApply}
                disabled={!tempRange.from || !tempRange.to}
              >
                Apply
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
