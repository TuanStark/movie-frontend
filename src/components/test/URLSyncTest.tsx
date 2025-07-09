// Test component to verify URL sync functionality
'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';

export default function URLSyncTest() {
  const searchParams = useSearchParams();

  const urlParams = {
    page: searchParams.get('page'),
    limit: searchParams.get('limit'),
    search: searchParams.get('search'),
    categoryId: searchParams.get('categoryId'),
    genres: searchParams.get('genres'),
    tab: searchParams.get('tab'),
  };

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-xs">
      <h3 className="font-bold mb-2">URL Parameters:</h3>
      {Object.entries(urlParams).map(([key, value]) => (
        <div key={key} className="flex justify-between">
          <span className="text-gray-300">{key}:</span>
          <span className="text-yellow-300 ml-2">{value || 'null'}</span>
        </div>
      ))}
    </div>
  );
}
