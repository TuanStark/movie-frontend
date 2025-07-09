import { useState, useCallback } from 'react';

export interface PaginationMeta {
  total: number;
  pageNumber: number;
  limitNumber: number;
  totalPages: number;
}

export interface UsePaginationProps {
  initialPage?: number;
  initialLimit?: number;
}

export interface UsePaginationReturn {
  currentPage: number;
  limit: number;
  setCurrentPage: (page: number) => void;
  setLimit: (limit: number) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: (totalPages: number) => void;
  canGoNext: (totalPages: number) => boolean;
  canGoPrevious: () => boolean;
  getPageNumbers: (totalPages: number, maxVisible?: number) => number[];
}

export const usePagination = ({
  initialPage = 1,
  initialLimit = 10,
}: UsePaginationProps = {}): UsePaginationReturn => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const goToNextPage = useCallback(() => {
    setCurrentPage(prev => prev + 1);
  }, []);

  const goToPreviousPage = useCallback(() => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  }, []);

  const goToFirstPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const goToLastPage = useCallback((totalPages: number) => {
    setCurrentPage(totalPages);
  }, []);

  const canGoNext = useCallback((totalPages: number) => {
    return currentPage < totalPages;
  }, [currentPage]);

  const canGoPrevious = useCallback(() => {
    return currentPage > 1;
  }, [currentPage]);

  const getPageNumbers = useCallback((totalPages: number, maxVisible: number = 5) => {
    const pages: number[] = [];
    
    if (totalPages <= maxVisible) {
      // Nếu tổng số trang ít hơn hoặc bằng maxVisible, hiển thị tất cả
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Tính toán các trang cần hiển thị
      const halfVisible = Math.floor(maxVisible / 2);
      let startPage = Math.max(1, currentPage - halfVisible);
      let endPage = Math.min(totalPages, startPage + maxVisible - 1);

      // Điều chỉnh startPage nếu endPage đã đạt tối đa
      if (endPage - startPage + 1 < maxVisible) {
        startPage = Math.max(1, endPage - maxVisible + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  }, [currentPage]);

  return {
    currentPage,
    limit,
    setCurrentPage,
    setLimit,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
    canGoNext,
    canGoPrevious,
    getPageNumbers,
  };
};
