// Example of how to use Pagination component with URL sync

import React, { useState } from 'react';
import Pagination, { PaginationMeta } from '../ui/Pagination';
import { usePaginationURL } from '../../hooks/usePaginationURL';

export default function PaginationExample() {
  // Example 1: Using Pagination component directly with URL sync
  const [meta] = useState<PaginationMeta>({
    total: 100,
    pageNumber: 1,
    limitNumber: 10,
    totalPages: 10,
  });

  const handlePageChange = (page: number) => {
    console.log('Page changed to:', page);
  };

  const handleLimitChange = (limit: number) => {
    console.log('Limit changed to:', limit);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">Pagination Examples</h1>

      {/* Example 1: Basic Pagination with URL sync */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4">1. Basic Pagination with URL Sync</h2>
        <Pagination
          meta={meta}
          currentPage={1}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          showLimitSelector={true}
          limitOptions={[5, 10, 20, 50]}
          syncWithURL={true}
          basePath="/example"
          preserveParams={['search', 'filter']}
        />
      </div>

      {/* Example 2: Simple Pagination without URL sync */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4">2. Simple Pagination (No URL Sync)</h2>
        <Pagination
          meta={meta}
          currentPage={1}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          showLimitSelector={false}
          syncWithURL={false}
        />
      </div>

      {/* Example 3: Using the hook */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4">3. Using usePaginationURL Hook</h2>
        <PaginationWithHookExample />
      </div>
    </div>
  );
}

// Example component using the hook
function PaginationWithHookExample() {
  const {
    currentPage,
    limit,
    setCurrentPage,
    setLimit,
    updateURL,
  } = usePaginationURL({
    basePath: '/example',
    initialPage: 1,
    initialLimit: 10,
    preserveParams: ['search', 'category'],
  });

  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (search: string) => {
    setSearchTerm(search);
    setCurrentPage(1); // Reset to page 1
    updateURL({ search, page: 1 });
  };

  const meta: PaginationMeta = {
    total: 100,
    pageNumber: currentPage,
    limitNumber: limit,
    totalPages: Math.ceil(100 / limit),
  };

  return (
    <div className="space-y-4">
      <div>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="px-3 py-2 border rounded-md"
        />
      </div>
      
      <div>
        <p>Current Page: {currentPage}</p>
        <p>Limit: {limit}</p>
        <p>Search: {searchTerm}</p>
      </div>

      <Pagination
        meta={meta}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onLimitChange={setLimit}
        showLimitSelector={true}
        limitOptions={[5, 10, 20]}
        syncWithURL={true}
        basePath="/example"
        preserveParams={['search', 'category']}
      />
    </div>
  );
}
