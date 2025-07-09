import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export interface UsePaginationURLProps {
  basePath: string;
  initialPage?: number;
  initialLimit?: number;
  preserveParams?: string[];
}

export interface UsePaginationURLReturn {
  currentPage: number;
  limit: number;
  setCurrentPage: (page: number) => void;
  setLimit: (limit: number) => void;
  updateURL: (params: Record<string, string | number | string[]>) => void;
}

export const usePaginationURL = ({
  basePath,
  initialPage = 1,
  initialLimit = 10,
  preserveParams = [],
}: UsePaginationURLProps): UsePaginationURLReturn => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL parameters
  const [currentPage, setCurrentPageState] = useState(
    Number(searchParams.get('page')) || initialPage
  );
  const [limit, setLimitState] = useState(
    Number(searchParams.get('limit')) || initialLimit
  );

  // Function to update URL with current state
  const updateURL = (newParams: Record<string, string | number | string[]>) => {
    const params = new URLSearchParams();
    
    // Preserve existing params
    preserveParams.forEach(param => {
      const value = searchParams.get(param);
      if (value) {
        params.set(param, value);
      }
    });

    // Set pagination params
    params.set('page', String(newParams.page || currentPage));
    params.set('limit', String(newParams.limit || limit));

    // Set other params
    Object.entries(newParams).forEach(([key, value]) => {
      if (key !== 'page' && key !== 'limit') {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            params.set(key, value.join(','));
          }
        } else if (value) {
          params.set(key, String(value));
        }
      }
    });

    router.push(`${basePath}?${params.toString()}`);
  };

  // Wrapper functions that update both state and URL
  const setCurrentPage = (page: number) => {
    setCurrentPageState(page);
    updateURL({ page });
  };

  const setLimit = (newLimit: number) => {
    setLimitState(newLimit);
    setCurrentPageState(1); // Reset to page 1 when limit changes
    updateURL({ limit: newLimit, page: 1 });
  };

  // Sync state with URL changes (for browser back/forward)
  useEffect(() => {
    const urlPage = Number(searchParams.get('page')) || initialPage;
    const urlLimit = Number(searchParams.get('limit')) || initialLimit;
    
    if (urlPage !== currentPage) {
      setCurrentPageState(urlPage);
    }
    if (urlLimit !== limit) {
      setLimitState(urlLimit);
    }
  }, [searchParams, initialPage, initialLimit, currentPage, limit]);

  return {
    currentPage,
    limit,
    setCurrentPage,
    setLimit,
    updateURL,
  };
};
