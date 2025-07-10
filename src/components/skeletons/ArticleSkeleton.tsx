import React from 'react';

interface ArticleSkeletonProps {
  count?: number;
  layout?: 'grid' | 'list';
  showImage?: boolean;
}

// Single Article Card Skeleton
export const ArticleCardSkeleton: React.FC<{ showImage?: boolean; layout?: 'grid' | 'list' }> = ({ 
  showImage = true, 
  layout = 'grid' 
}) => {
  if (layout === 'list') {
    return (
      <div className="flex items-start space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm animate-pulse">
        {showImage && (
          <div className="w-24 h-16 bg-gray-200 dark:bg-gray-700 rounded flex-shrink-0"></div>
        )}
        <div className="flex-1">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-3/4"></div>
          <div className="flex items-center justify-between text-sm">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm animate-pulse">
      {showImage && (
        <div className="aspect-video bg-gray-200 dark:bg-gray-700"></div>
      )}
      <div className="p-6">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4"></div>
        <div className="flex items-center justify-between text-sm">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
        </div>
      </div>
    </div>
  );
};

// Article Grid Skeleton
export const ArticleGridSkeleton: React.FC<ArticleSkeletonProps> = ({ 
  count = 6, 
  layout = 'grid',
  showImage = true 
}) => {
  const gridClass = layout === 'grid' 
    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    : "space-y-4";

  return (
    <div className={gridClass}>
      {Array.from({ length: count }).map((_, index) => (
        <ArticleCardSkeleton 
          key={index} 
          showImage={showImage} 
          layout={layout}
        />
      ))}
    </div>
  );
};

// Featured Article Skeleton
export const FeaturedArticleSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg animate-pulse">
    <div className="aspect-[16/9] bg-gray-200 dark:bg-gray-700"></div>
    <div className="p-8">
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-3"></div>
      <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded mb-6 w-4/5"></div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
        </div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
      </div>
    </div>
  </div>
);

// Article Section with Title Skeleton
export const ArticleSectionSkeleton: React.FC<{ 
  title?: boolean; 
  count?: number; 
  layout?: 'grid' | 'list' 
}> = ({ 
  title = true, 
  count = 6, 
  layout = 'grid' 
}) => (
  <section className="py-16 bg-gray-50 dark:bg-gray-900">
    <div className="container mx-auto px-4">
      {title && (
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-8 w-48 animate-pulse"></div>
      )}
      <ArticleGridSkeleton count={count} layout={layout} />
    </div>
  </section>
);

export default ArticleGridSkeleton;
