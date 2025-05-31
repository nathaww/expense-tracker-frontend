"use client";

import React, { useEffect, useMemo } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { RiArrowUpSLine, RiArrowDownSLine, RiArrowUpDownLine } from 'react-icons/ri';
import debounce from 'lodash/debounce';

interface FilterOption {
  label: string;
  value: string;
}

export interface BaseFilterParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface FilterToolbarProps {
  onFilterChange: (filters: BaseFilterParams) => void;
  sortOptions: FilterOption[];
}

export const FilterToolbar = React.memo(({
  onFilterChange,
  sortOptions,
}: FilterToolbarProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // URL-based state
  const sortBy = searchParams.get('sortBy') || '';
  const sortOrder = searchParams.get('sortOrder') as 'asc' | 'desc' || 'desc';  // Debounced filter update function
  const debouncedUpdateFilters = useMemo(
    () => debounce((newParams: URLSearchParams) => {
      const url = `${pathname}?${newParams.toString()}`;
      router.push(url, { scroll: false });
    }, 100),
    [pathname, router]
  );

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedUpdateFilters.cancel();
    };
  }, [debouncedUpdateFilters]);

  // Handle URL parameter changes and notify parent
  useEffect(() => {
    const filters: BaseFilterParams = {
      sortBy: sortBy || undefined,
      sortOrder: sortOrder,
    };

    onFilterChange(filters);
  }, [sortBy, sortOrder, onFilterChange]);  const handleSortChange = (field: string) => {
    const newOrder = sortBy === field && sortOrder === 'desc' ? 'asc' : 'desc';
    const params = new URLSearchParams(searchParams.toString());
    params.set('sortBy', field);
    params.set('sortOrder', newOrder);
    debouncedUpdateFilters(params);
  };

  const handleClearSort = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('sortBy');
    params.delete('sortOrder');
    debouncedUpdateFilters(params);
  };

  const getSortIcon = (field: string) => {
    if (sortBy === field) {
      return sortOrder === 'asc' ? <RiArrowUpSLine className="w-4 h-4" /> : <RiArrowDownSLine className="w-4 h-4" />;
    }
    return <RiArrowUpDownLine className="w-4 h-4 opacity-50" />;
  };

  return (
    <div className="p-4">
      {/* Quick Sort Buttons */}
      <div>
        <h4 className="text-sm font-medium text-[var(--text)] mb-3">Quick Sort</h4>        <div className="flex flex-wrap gap-2">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSortChange(option.value)}
              className={`px-3 py-2 rounded-lg border transition-all duration-200 flex items-center gap-2 hover:scale-105 cursor-pointer ${
                sortBy === option.value
                  ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-md'
                  : 'bg-[var(--bg)] border-[var(--border-color)] hover:bg-[var(--bgSecondary)] hover:border-[var(--color-primary)]'
              }`}
            >
              <span className="text-sm font-medium">{option.label}</span>
              {getSortIcon(option.value)}
            </button>
          ))}
          {sortBy && (
            <button
              onClick={handleClearSort}
              className="px-3 py-2 rounded-lg border border-red-300 bg-red-50 hover:bg-red-100 text-red-700 hover:border-red-400 transition-all duration-200 flex items-center gap-2 hover:scale-105 cursor-pointer"
              title="Clear sort"
            >
              <span className="text-sm font-medium">Clear Sort</span>
              <span className="text-sm">✕</span>
            </button>
          )}
        </div>
        {sortBy && (
          <p className="text-xs text-[var(--text)] opacity-70 mt-2">
            ✓ Sorting by {sortOptions.find(o => o.value === sortBy)?.label} ({sortOrder === 'asc' ? 'A→Z' : 'Z→A'})
          </p>
        )}
      </div>
    </div>
  );
});

FilterToolbar.displayName = 'FilterToolbar';
