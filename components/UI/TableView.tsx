"use client";

import React from 'react';
import { FaSort, FaSortUp, FaSortDown, FaEye, FaEdit, FaTrash } from 'react-icons/fa';

interface Column<T> {
  header: string;
  key: keyof T | string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

interface TableViewProps<T> {
  data: T[];
  columns: Column<T>[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (key: string, order: 'asc' | 'desc') => void;
  keyExtractor: (item: T) => string;
  onView?: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

export const TableView = <T extends object>({
  data,
  columns,
  sortBy,
  sortOrder = 'asc',
  onSort,
  keyExtractor,
  onView,
  onEdit,
  onDelete,
  isLoading = false,
  emptyMessage = "No items found"
}: TableViewProps<T>) => {
  const handleSort = (key: string) => {
    if (!onSort) return;
    
    const newOrder = sortBy === key && sortOrder === 'asc' ? 'desc' : 'asc';
    onSort(key, newOrder);
  };

  const getSortIcon = (key: string) => {
    if (key !== sortBy) return <FaSort className="w-3 h-3 ml-1 opacity-40" />;
    return sortOrder === 'asc' ? 
      <FaSortUp className="w-3 h-3 ml-1 text-[var(--color-primary)]" /> : 
      <FaSortDown className="w-3 h-3 ml-1 text-[var(--color-primary)]" />;
  };  // Helper to access nested properties (e.g., "user.name")
  const getNestedProperty = (obj: T, path: string): React.ReactNode => {
    return path.split('.').reduce((prev, curr) => {
      if (prev && typeof prev === 'object' && curr in (prev as Record<string, unknown>)) {
        return (prev as Record<string, unknown>)[curr];
      }
      return null;
    }, obj as unknown) as React.ReactNode;
  };

  if (isLoading) {
    return (
      <div className="bg-[var(--bg)] border border-[var(--border-color)] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[var(--border-color)]">
            <thead className="bg-[var(--bgSecondary)]">
              <tr>
                {columns.map(column => (
                  <th 
                    key={column.key.toString()}
                    className="px-4 py-3 text-left text-xs font-medium text-[var(--text)] uppercase tracking-wider"
                  >
                    {column.header}
                  </th>
                ))}
                {(onView || onEdit || onDelete) && (
                  <th className="px-4 py-3 text-right text-xs font-medium text-[var(--text)] uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  {columns.map(column => (
                    <td key={`${index}-${column.key.toString()}`} className="px-4 py-3">
                      <div className="h-4 bg-[var(--bgSecondary)] rounded animate-pulse"></div>
                    </td>
                  ))}
                  {(onView || onEdit || onDelete) && (
                    <td className="px-4 py-3">
                      <div className="h-4 bg-[var(--bgSecondary)] rounded animate-pulse"></div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-[var(--bg)] border border-[var(--border-color)] rounded-lg">
        <p className="text-[var(--text-secondary)]">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg)] border border-[var(--border-color)] rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[var(--border-color)]">
          <thead className="bg-[var(--bgSecondary)]">
            <tr>
              {columns.map(column => (
                <th 
                  key={column.key.toString()}
                  className={`px-4 py-3 text-left text-xs font-medium text-[var(--text)] uppercase tracking-wider ${column.sortable ? 'cursor-pointer hover:bg-[var(--bg)]' : ''} ${column.className || ''}`}
                  onClick={() => column.sortable && handleSort(column.key.toString())}
                >
                  <div className="flex items-center">
                    {column.header}
                    {column.sortable && getSortIcon(column.key.toString())}
                  </div>
                </th>
              ))}
              {(onView || onEdit || onDelete) && (
                <th className="px-4 py-3 text-right text-xs font-medium text-[var(--text)] uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-[var(--bg)] divide-y divide-[var(--border-color)]">
            {data.map((item: T) => (
              <tr key={keyExtractor(item)} className="hover:bg-[var(--bgSecondary)]">
                {columns.map((column) => (
                  <td key={`${keyExtractor(item)}-${column.key.toString()}`} className={`px-4 py-3 ${column.className || ''}`}>
                    {column.render ? column.render(item) : getNestedProperty(item, column.key.toString())}
                  </td>
                ))}
                {(onView || onEdit || onDelete) && (
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end space-x-2">
                      {onView && (                        <button 
                          onClick={() => onView(item)}
                          className="p-1.5 text-gray-500 hover:text-blue-500 hover:bg-blue-100 rounded-full cursor-pointer"
                        >
                          <FaEye className="w-4 h-4" />
                        </button>
                      )}                      {onEdit && (
                        <button 
                          onClick={() => onEdit(item)}
                          className="p-1.5 text-gray-500 hover:text-green-500 hover:bg-green-100 rounded-full cursor-pointer"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button 
                          onClick={() => onDelete(item)}
                          className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-100 rounded-full cursor-pointer"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
