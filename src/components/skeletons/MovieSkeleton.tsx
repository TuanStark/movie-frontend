import React from 'react';

interface MovieSkeletonProps {
  count?: number;
  className?: string;
  showRating?: boolean;
  showGenres?: boolean;
}

// Single Movie Card Skeleton
export const MovieCardSkeleton: React.FC<{ showRating?: boolean; showGenres?: boolean }> = ({ 
  showRating = true, 
  showGenres = true 
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm animate-pulse">
    {/* Movie Poster Skeleton */}
    <div className="aspect-[2/3] bg-gray-200 dark:bg-gray-700"></div>
    
    {/* Movie Info Skeleton */}
    <div className="p-4">
      {/* Title */}
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
      
      {/* Genres */}
      {showGenres && (
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-3/4"></div>
      )}
      
      {/* Rating and Duration */}
      <div className="flex items-center justify-between mt-3">
        {showRating && (
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
        )}
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
      </div>
      
      {/* Release Date */}
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 mt-2"></div>
    </div>
  </div>
);

// Movie Grid Skeleton
export const MovieGridSkeleton: React.FC<MovieSkeletonProps> = ({ 
  count = 10, 
  className = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6",
  showRating = true,
  showGenres = true
}) => (
  <div className={className}>
    {Array.from({ length: count }).map((_, index) => (
      <MovieCardSkeleton 
        key={index} 
        showRating={showRating} 
        showGenres={showGenres} 
      />
    ))}
  </div>
);

// Movie List Skeleton (horizontal layout)
export const MovieListSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm animate-pulse">
        <div className="w-16 h-24 bg-gray-200 dark:bg-gray-700 rounded flex-shrink-0"></div>
        <div className="flex-1">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-3/4"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    ))}
  </div>
);

// Featured Movie Skeleton (large card)
export const FeaturedMovieSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg animate-pulse">
    <div className="aspect-video bg-gray-200 dark:bg-gray-700"></div>
    <div className="p-6">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-3/4"></div>
      <div className="flex items-center justify-between">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
        <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
  </div>
);

// Movie Carousel Skeleton
export const MovieCarouselSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <div className="flex space-x-4 overflow-hidden">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="flex-shrink-0 w-48">
        <MovieCardSkeleton />
      </div>
    ))}
  </div>
);

export default MovieGridSkeleton;
