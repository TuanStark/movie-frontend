import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
// Define PaginationMeta locally to avoid import issues
export interface PaginationMeta {
  total: number;
  pageNumber: number;
  limitNumber: number;
  totalPages: number;
}

export interface PaginationProps {
  meta: PaginationMeta;
  currentPage: number;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  showLimitSelector?: boolean;
  limitOptions?: number[];
  maxVisiblePages?: number;
  className?: string;
  // URL sync options
  syncWithURL?: boolean;
  basePath?: string; // e.g., '/movies', '/articles'
  preserveParams?: string[]; // Other params to preserve in URL
}

const Pagination: React.FC<PaginationProps> = ({
  meta,
  currentPage,
  onPageChange,
  onLimitChange,
  showLimitSelector = true,
  limitOptions = [5, 10, 20, 50],
  maxVisiblePages = 5,
  className = '',
  syncWithURL = false,
  basePath = '',
  preserveParams = [],
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Function to update URL with pagination params
  const updateURL = (newPage: number, newLimit?: number) => {
    if (!syncWithURL || !basePath) return;

    const params = new URLSearchParams();

    // Preserve existing params
    preserveParams.forEach(param => {
      const value = searchParams.get(param);
      if (value) {
        params.set(param, value);
      }
    });

    // Set pagination params
    params.set('page', String(newPage));
    if (newLimit !== undefined) {
      params.set('limit', String(newLimit));
    } else {
      const currentLimit = searchParams.get('limit');
      if (currentLimit) {
        params.set('limit', currentLimit);
      }
    }

    router.push(`${basePath}?${params.toString()}`);
  };

  // Wrapper functions that handle both callback and URL update
  const handlePageChange = (page: number) => {
    onPageChange(page);
    updateURL(page);
  };

  const handleLimitChange = (limit: number) => {
    if (onLimitChange) {
      onLimitChange(limit);
      updateURL(1, limit); // Reset to page 1 when limit changes
    }
  };
  const { total, totalPages, limitNumber } = meta;

  // Tính toán các trang cần hiển thị
  const getPageNumbers = () => {
    const pages: number[] = [];
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const halfVisible = Math.floor(maxVisiblePages / 2);
      let startPage = Math.max(1, currentPage - halfVisible);
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  // Tính toán thông tin hiển thị
  const startItem = (currentPage - 1) * limitNumber + 1;
  const endItem = Math.min(currentPage * limitNumber, total);

  if (totalPages <= 1) {
    return null; // Không hiển thị pagination nếu chỉ có 1 trang
  }

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
      {/* Thông tin trang */}
      <div className="text-sm text-gray-700 dark:text-gray-300">
        Hiển thị <span className="font-medium">{startItem}</span> đến{' '}
        <span className="font-medium">{endItem}</span> trong tổng số{' '}
        <span className="font-medium">{total}</span> kết quả
      </div>

      <div className="flex items-center gap-4">
        {/* Limit selector */}
        {showLimitSelector && onLimitChange && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700 dark:text-gray-300">Hiển thị:</span>
            <select
              value={limitNumber}
              onChange={(e) => handleLimitChange(Number(e.target.value))}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {limitOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Pagination controls */}
        <div className="flex items-center gap-1">
          {/* First page */}
          <button
            onClick={() => handlePageChange(1)}
            disabled={!canGoPrevious}
            className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
            title="Trang đầu"
          >
            ««
          </button>

          {/* Previous page */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!canGoPrevious}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
            title="Trang trước"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Page numbers */}
          <div className="flex items-center gap-1">
            {pageNumbers.map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  pageNumber === currentPage
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {pageNumber}
              </button>
            ))}
          </div>

          {/* Next page */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!canGoNext}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
            title="Trang sau"
          >
            <span>›</span>
          </button>

          {/* Last page */}
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={!canGoNext}
            className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
            title="Trang cuối"
          >
            »»
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
