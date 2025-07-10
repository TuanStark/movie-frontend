import React from 'react';

// Generic Section Title Skeleton
export const SectionTitleSkeleton: React.FC<{ width?: string }> = ({ width = "w-48" }) => (
  <div className={`h-8 bg-gray-200 dark:bg-gray-700 rounded mb-8 ${width} animate-pulse`}></div>
);

// Generic Button Skeleton
export const ButtonSkeleton: React.FC<{ width?: string; height?: string }> = ({ 
  width = "w-32", 
  height = "h-10" 
}) => (
  <div className={`${width} ${height} bg-gray-200 dark:bg-gray-700 rounded animate-pulse`}></div>
);

// Generic Input Skeleton
export const InputSkeleton: React.FC<{ width?: string }> = ({ width = "w-full" }) => (
  <div className={`${width} h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse`}></div>
);

// Generic Card Skeleton
export const CardSkeleton: React.FC<{ 
  children?: React.ReactNode; 
  className?: string;
  padding?: string;
}> = ({ 
  children, 
  className = "bg-white dark:bg-gray-800 rounded-xl shadow-sm",
  padding = "p-6"
}) => (
  <div className={`${className} ${padding} animate-pulse`}>
    {children}
  </div>
);

// Generic Image Skeleton
export const ImageSkeleton: React.FC<{ 
  aspectRatio?: string; 
  className?: string;
}> = ({ 
  aspectRatio = "aspect-video", 
  className = "" 
}) => (
  <div className={`${aspectRatio} bg-gray-200 dark:bg-gray-700 rounded ${className} animate-pulse`}></div>
);

// Generic Text Line Skeleton
export const TextLineSkeleton: React.FC<{ 
  width?: string; 
  height?: string;
  className?: string;
}> = ({ 
  width = "w-full", 
  height = "h-4",
  className = ""
}) => (
  <div className={`${width} ${height} bg-gray-200 dark:bg-gray-700 rounded ${className} animate-pulse`}></div>
);

// Generic Avatar Skeleton
export const AvatarSkeleton: React.FC<{ size?: string }> = ({ size = "w-8 h-8" }) => (
  <div className={`${size} bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse`}></div>
);

// Generic Badge Skeleton
export const BadgeSkeleton: React.FC<{ width?: string }> = ({ width = "w-16" }) => (
  <div className={`${width} h-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse`}></div>
);

// Generic Stats Skeleton
export const StatsSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => (
  <div className="flex space-x-6">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="text-center">
        <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
        <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
    ))}
  </div>
);

// Generic Table Skeleton
export const TableSkeleton: React.FC<{ 
  rows?: number; 
  columns?: number;
}> = ({ 
  rows = 5, 
  columns = 4 
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm">
    {/* Table Header */}
    <div className="border-b border-gray-200 dark:border-gray-700 p-4">
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, index) => (
          <div key={index} className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        ))}
      </div>
    </div>
    
    {/* Table Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={colIndex} className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

// Generic Form Skeleton
export const FormSkeleton: React.FC<{ fields?: number }> = ({ fields = 4 }) => (
  <div className="space-y-6">
    {Array.from({ length: fields }).map((_, index) => (
      <div key={index}>
        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
        <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
      </div>
    ))}
    <div className="h-12 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
  </div>
);

// Generic Navigation Skeleton
export const NavigationSkeleton = () => (
  <nav className="bg-white dark:bg-gray-800 shadow-sm">
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between h-16">
        <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="flex space-x-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          ))}
        </div>
        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
      </div>
    </div>
  </nav>
);

// Generic Footer Skeleton
export const FooterSkeleton = () => (
  <footer className="bg-gray-900 text-white py-12">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index}>
            <div className="h-5 w-24 bg-gray-700 rounded mb-4 animate-pulse"></div>
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, linkIndex) => (
                <div key={linkIndex} className="h-4 w-20 bg-gray-700 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </footer>
);

export default CardSkeleton;
