import React from 'react';

interface MovieSkeletonProps {
  count?: number;
  className?: string;
}

const MovieSkeleton: React.FC<MovieSkeletonProps> = ({ 
  count = 10, 
  className = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6" 
}) => {
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm animate-pulse">
          {/* Movie Poster Skeleton */}
          <div className="aspect-[2/3] bg-gray-200 dark:bg-gray-700"></div>
          
          {/* Movie Info Skeleton */}
          <div className="p-4">
            {/* Title */}
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            
            {/* Genres */}
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-3/4"></div>
            
            {/* Rating and Duration */}
            <div className="flex items-center justify-between mt-3">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
            </div>
            
            {/* Release Date */}
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 mt-2"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MovieSkeleton;
