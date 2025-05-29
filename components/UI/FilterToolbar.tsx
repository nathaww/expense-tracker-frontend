"use client";

import React, { useState, useCallback } from 'react';
import { FaSort, FaFilter, FaSearch, FaTimesCircle, FaCalendarAlt } from 'react-icons/fa';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterToolbarProps {
  onFilterChange: (filters: Record<string, unknown>) => void;
  sortOptions: FilterOption[];
  filterFieldOptions: FilterOption[];
  dateFilterFields?: FilterOption[];
  rangeFilterFields?: FilterOption[];
  defaultPageSize?: number;
}

export const FilterToolbar = React.memo(({
  onFilterChange,
  sortOptions,
  filterFieldOptions,
  dateFilterFields = [],
  rangeFilterFields = [],
  defaultPageSize = 10
}: FilterToolbarProps) => {
  // Sort state
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Filter states
  const [filterField, setFilterField] = useState<string>('');
  const [filterValue, setFilterValue] = useState<string>('');
  
  // Range filter states
  const [rangeField, setRangeField] = useState<string>('');
  const [minValue, setMinValue] = useState<string>('');
  const [maxValue, setMaxValue] = useState<string>('');
  
  // Date filter states
  const [dateField, setDateField] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
    // Pagination state
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(defaultPageSize);
  
  // UI state
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [activeFilterType, setActiveFilterType] = useState<'basic' | 'range' | 'date'>('basic');  // Memoized handlers to prevent unnecessary re-renders
  const handleApplyFilters = useCallback(() => {
    const filters: Record<string, unknown> = { page, pageSize };
    
    // Add sort parameters if set
    if (sortBy) {
      filters.sortBy = sortBy;
      filters.sortOrder = sortOrder;
    }
    
    // Add basic filter if set
    if (filterField && filterValue) {
      filters.filterField = filterField;
      filters.filterValue = filterValue;
    }
    
    // Add range filter if set
    if (rangeField && (minValue || maxValue)) {
      filters.rangeField = rangeField;
      if (minValue) filters.minValue = Number(minValue);
      if (maxValue) filters.maxValue = Number(maxValue);
    }
    
    // Add date filter if set
    if (dateField && (startDate || endDate)) {
      filters.dateField = dateField;
      if (startDate) filters.startDate = startDate;
      if (endDate) filters.endDate = endDate;
    }
    
    onFilterChange(filters);
  }, [
    page, pageSize, sortBy, sortOrder, 
    filterField, filterValue, 
    rangeField, minValue, maxValue,
    dateField, startDate, endDate,
    onFilterChange
  ]);
  
  const handleResetFilters = useCallback(() => {
    setSortBy('');
    setSortOrder('asc');
    setFilterField('');
    setFilterValue('');
    setRangeField('');
    setMinValue('');
    setMaxValue('');
    setDateField('');
    setStartDate('');
    setEndDate('');
    setPage(1);
    
    onFilterChange({ page: 1, pageSize });
  }, [onFilterChange, pageSize]);
  
  const toggleSortOrder = useCallback(() => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  }, []);

  // Memoized filter type handlers to prevent unnecessary re-renders
  const setToBasicFilter = useCallback(() => setActiveFilterType('basic'), []);
  const setToRangeFilter = useCallback(() => setActiveFilterType('range'), []);
  const setToDateFilter = useCallback(() => setActiveFilterType('date'), []);
  
  // Memoized form field handlers
  const handleSortByChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value), []);
  const handleFilterFieldChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => setFilterField(e.target.value), []);
  const handleFilterValueChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setFilterValue(e.target.value), []);
  const handleRangeFieldChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => setRangeField(e.target.value), []);
  const handleMinValueChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setMinValue(e.target.value), []);
  const handleMaxValueChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setMaxValue(e.target.value), []);
  const handleDateFieldChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => setDateField(e.target.value), []);
  const handleStartDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value), []);
  const handleEndDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setEndDate(e.target.value), []);
  
  // Memoized filter chip removal handlers
  const handleClearSort = useCallback(() => {
    setSortBy('');
    setSortOrder('asc');
  }, []);
  
  const handleClearBasicFilter = useCallback(() => {
    setFilterField('');
    setFilterValue('');
  }, []);
  
  const handleClearRangeFilter = useCallback(() => {
    setRangeField('');
    setMinValue('');
    setMaxValue('');
  }, []);
  
  const handleClearDateFilter = useCallback(() => {
    setDateField('');
    setStartDate('');
    setEndDate('');
  }, []);

  return (
    <div className="mx-5 my-3 w-full">
      {/* Main controls */}      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex items-center gap-2">
          <button 
            onClick={useCallback(() => setShowFilters(prev => !prev), [])}
            className="transition-all active:scale-95 cursor-pointer flex items-center gap-2 px-3 py-2 bg-[var(--bg)] border border-[var(--border-color)] rounded-md hover:bg-[var(--bgSecondary)]"
          >
            <FaFilter className="w-4 h-4" />
            <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
          </button>
          
          <button
            onClick={handleResetFilters}
            className="px-3 py-2 bg-transparent border border-[var(--border-color)] rounded-md hover:bg-[var(--bgSecondary)] transition-all active:scale-95 cursor-pointer"
          >
            Reset
          </button>
        </div>
        
        <div className="flex-grow flex flex-col sm:flex-row gap-2">
          <div className="flex flex-grow max-w-xs">
            <select
              value={sortBy}
              onChange={handleSortByChange}
              className="w-full px-3 py-2 bg-[var(--bg)] border border-[var(--border-color)] rounded-l-md focus:outline-none"
            >
              <option value="">Sort By...</option>
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            
            <button
              onClick={toggleSortOrder}
              disabled={!sortBy}
              className="px-3 py-2 bg-[var(--bg)] border-t border-r border-b border-[var(--border-color)] rounded-r-md hover:bg-[var(--bgSecondary)] disabled:opacity-50 transition-all active:scale-95 cursor-pointer"
            >
              <FaSort className="w-4 h-4" />
              <span className="sr-only">{sortOrder === 'asc' ? 'Ascending' : 'Descending'}</span>
            </button>
          </div>
          
          <button
            onClick={handleApplyFilters}
            className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-md hover:opacity-90 transition-all active:scale-95 cursor-pointer"
          >
            Apply Filters
          </button>
        </div>
      </div>
      
      {/* Expanded filter options */}
      {showFilters && (
        <div className="p-4 bg-[var(--bg)] border border-[var(--border-color)] rounded-lg">
          <div className="flex gap-4 mb-4">
            <button
              onClick={setToBasicFilter}
              className={`px-3 py-1 rounded-md transition-all active:scale-95 cursor-pointer ${activeFilterType === 'basic' ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--bgSecondary)]'}`}
            >
              Basic Filter
            </button>
            
            {rangeFilterFields.length > 0 && (
              <button
                onClick={setToRangeFilter}
                className={`px-3 py-1 rounded-md transition-all active:scale-95 cursor-pointer ${activeFilterType === 'range' ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--bgSecondary)]'}`}
              >
                Range Filter
              </button>
            )}
            
            {dateFilterFields.length > 0 && (
              <button
                onClick={setToDateFilter}
                className={`px-3 py-1 rounded-md transition-all active:scale-95 cursor-pointer ${activeFilterType === 'date' ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--bgSecondary)]'}`}
              >
                Date Filter
              </button>
            )}
          </div>
          
          {activeFilterType === 'basic' && (
            <div className="flex flex-col md:flex-row gap-3">
              <div className="w-full md:w-1/3">
                <label className="block text-sm mb-1">Field</label>
                <select
                  value={filterField}
                  onChange={handleFilterFieldChange}
                  className="w-full px-3 py-2 bg-[var(--bg)] border border-[var(--border-color)] rounded-md focus:outline-none"
                >
                  <option value="">Select Field</option>
                  {filterFieldOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              
              <div className="w-full md:w-2/3">
                <label className="block text-sm mb-1">Value</label>
                <div className="relative">
                  <input
                    type="text"
                    value={filterValue}
                    onChange={handleFilterValueChange}
                    placeholder="Filter value..."
                    className="w-full px-3 py-2 pl-9 bg-[var(--bg)] border border-[var(--border-color)] rounded-md focus:outline-none"
                  />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          )}
          
          {activeFilterType === 'range' && (
            <div className="flex flex-col md:flex-row gap-3">
              <div className="w-full md:w-1/3">
                <label className="block text-sm mb-1">Field</label>
                <select
                  value={rangeField}
                  onChange={handleRangeFieldChange}
                  className="w-full px-3 py-2 bg-[var(--bg)] border border-[var(--border-color)] rounded-md focus:outline-none"
                >
                  <option value="">Select Field</option>
                  {rangeFilterFields.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              
              <div className="w-full md:w-1/3">
                <label className="block text-sm mb-1">Min Value</label>
                <input
                  type="number"
                  value={minValue}
                  onChange={handleMinValueChange}
                  placeholder="Min value"
                  className="w-full px-3 py-2 bg-[var(--bg)] border border-[var(--border-color)] rounded-md focus:outline-none"
                />
              </div>
              
              <div className="w-full md:w-1/3">
                <label className="block text-sm mb-1">Max Value</label>
                <input
                  type="number"
                  value={maxValue}
                  onChange={handleMaxValueChange}
                  placeholder="Max value"
                  className="w-full px-3 py-2 bg-[var(--bg)] border border-[var(--border-color)] rounded-md focus:outline-none"
                />
              </div>
            </div>
          )}
          
          {activeFilterType === 'date' && (
            <div className="flex flex-col md:flex-row gap-3">
              <div className="w-full md:w-1/3">
                <label className="block text-sm mb-1">Date Field</label>
                <select
                  value={dateField}
                  onChange={handleDateFieldChange}
                  className="w-full px-3 py-2 bg-[var(--bg)] border border-[var(--border-color)] rounded-md focus:outline-none"
                >
                  <option value="">Select Field</option>
                  {dateFilterFields.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              
              <div className="w-full md:w-1/3">
                <label className="block text-sm mb-1">Start Date</label>
                <div className="relative">
                  <input
                    type="date"
                    value={startDate}
                    onChange={handleStartDateChange}
                    className="w-full px-3 py-2 pl-9 bg-[var(--bg)] border border-[var(--border-color)] rounded-md focus:outline-none"
                  />
                  <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
              
              <div className="w-full md:w-1/3">
                <label className="block text-sm mb-1">End Date</label>
                <div className="relative">
                  <input
                    type="date"
                    value={endDate}
                    onChange={handleEndDateChange}
                    className="w-full px-3 py-2 pl-9 bg-[var(--bg)] border border-[var(--border-color)] rounded-md focus:outline-none"
                  />
                  <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          )}
          
          {/* Active filters display */}
          <div className="mt-4 flex flex-wrap gap-2">
            {sortBy && (
              <div className="flex items-center gap-1 text-xs px-2 py-1 bg-[var(--bgSecondary)] rounded-full">
                <span>Sort: {sortBy} ({sortOrder})</span>
                <FaTimesCircle 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={handleClearSort}
                />
              </div>
            )}
            
            {filterField && filterValue && (
              <div className="flex items-center gap-1 text-xs px-2 py-1 bg-[var(--bgSecondary)] rounded-full">
                <span>{filterField}: {filterValue}</span>
                <FaTimesCircle 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={handleClearBasicFilter}
                />
              </div>
            )}
            
            {rangeField && (minValue || maxValue) && (
              <div className="flex items-center gap-1 text-xs px-2 py-1 bg-[var(--bgSecondary)] rounded-full">
                <span>{rangeField}: {minValue || '∞'} - {maxValue || '∞'}</span>
                <FaTimesCircle 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={handleClearRangeFilter}
                />
              </div>
            )}
            
            {dateField && (startDate || endDate) && (
              <div className="flex items-center gap-1 text-xs px-2 py-1 bg-[var(--bgSecondary)] rounded-full">
                <span>{dateField}: {startDate || '∞'} to {endDate || '∞'}</span>
                <FaTimesCircle 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={handleClearDateFilter}
                />
              </div>
            )}
          </div>
        </div>
      )}    </div>  );
});

// Add displayName to fix ESLint "Component definition is missing display name" error
FilterToolbar.displayName = 'FilterToolbar';
