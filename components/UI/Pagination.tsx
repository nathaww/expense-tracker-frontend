"use client";

import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  pageSize: number;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100]
}) => {
  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    
    // Always show first page
    if (currentPage > 3) {
      pages.push(1);
      if (currentPage > 4) {
        pages.push('...');
      }
    }
    
    // Show current page and neighbors
    for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages, currentPage + 1); i++) {
      pages.push(i);
    }
    
    // Always show last page
    if (currentPage < totalPages - 2) {
      if (currentPage < totalPages - 3) {
        pages.push('...');
      }
      pages.push(totalPages);
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="mt-6 flex flex-col sm:flex-row justify-between items-center">
      <div className="mb-4 sm:mb-0 text-sm text-[var(--text-secondary)]">
        Showing {Math.min((currentPage - 1) * pageSize + 1, totalItems)} to {Math.min(currentPage * pageSize, totalItems)} of {totalItems} items
      </div>
      
      <div className="flex items-center">
        {/* Page size selector */}
        {onPageSizeChange && (
          <div className="mr-4">
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="px-2 py-1 text-sm border border-[var(--border-color)] rounded-md"
            >
              {pageSizeOptions.map(size => (
                <option key={size} value={size}>
                  {size} per page
                </option>
              ))}
            </select>
          </div>
        )}
        
        {/* Previous button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="mr-1 p-2 rounded-md disabled:opacity-50 hover:bg-[var(--bgSecondary)]"
        >
          <FaChevronLeft className="w-3 h-3" />
        </button>
        
        {/* Page numbers */}
        <div className="flex items-center">
          {getPageNumbers().map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="px-3 py-1">...</span>
              ) : (
                <button
                  onClick={() => typeof page === 'number' && onPageChange(page)}
                  className={`mx-1 px-3 py-1 rounded-md ${
                    page === currentPage
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'hover:bg-[var(--bgSecondary)]'
                  }`}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>
        
        {/* Next button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="ml-1 p-2 rounded-md disabled:opacity-50 hover:bg-[var(--bgSecondary)]"
        >
          <FaChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
