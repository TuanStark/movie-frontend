'use client';

import React, { useState } from 'react';
import {
  HomeSkeleton,
  HeroSkeleton,
  MovieGridSkeleton,
  MovieCardSkeleton,
  MovieListSkeleton,
  ArticleGridSkeleton,
  ArticleCardSkeleton,
  FormSkeleton,
  TableSkeleton,
  CardSkeleton,
  TextLineSkeleton,
  ButtonSkeleton,
  InputSkeleton
} from '../skeletons';

export default function SkeletonDemo() {
  const [activeDemo, setActiveDemo] = useState<string>('home');

  const demos = [
    { id: 'home', label: 'Home Page', component: <HomeSkeleton /> },
    { id: 'hero', label: 'Hero Section', component: <HeroSkeleton /> },
    { 
      id: 'movie-grid', 
      label: 'Movie Grid', 
      component: <MovieGridSkeleton count={8} className="grid grid-cols-1 md:grid-cols-4 gap-6" /> 
    },
    { 
      id: 'movie-list', 
      label: 'Movie List', 
      component: <MovieListSkeleton count={5} /> 
    },
    { 
      id: 'article-grid', 
      label: 'Article Grid', 
      component: <ArticleGridSkeleton count={6} layout="grid" /> 
    },
    { 
      id: 'article-list', 
      label: 'Article List', 
      component: <ArticleGridSkeleton count={5} layout="list" /> 
    },
    { 
      id: 'form', 
      label: 'Form', 
      component: (
        <CardSkeleton className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <FormSkeleton fields={5} />
        </CardSkeleton>
      )
    },
    { 
      id: 'table', 
      label: 'Table', 
      component: <TableSkeleton rows={6} columns={5} /> 
    },
    {
      id: 'cards',
      label: 'Card Components',
      component: (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MovieCardSkeleton />
          <ArticleCardSkeleton />
          <CardSkeleton>
            <TextLineSkeleton width="w-3/4" className="mb-3" />
            <TextLineSkeleton width="w-1/2" className="mb-4" />
            <div className="flex space-x-3">
              <ButtonSkeleton width="w-20" />
              <ButtonSkeleton width="w-24" />
            </div>
          </CardSkeleton>
        </div>
      )
    },
    {
      id: 'inputs',
      label: 'Form Elements',
      component: (
        <div className="max-w-md mx-auto space-y-4">
          <InputSkeleton />
          <InputSkeleton width="w-3/4" />
          <div className="flex space-x-3">
            <InputSkeleton width="w-1/2" />
            <InputSkeleton width="w-1/2" />
          </div>
          <div className="flex space-x-3">
            <ButtonSkeleton width="w-24" />
            <ButtonSkeleton width="w-32" />
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Skeleton Loading Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Preview different skeleton loading states
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Demo Types
              </h2>
              <nav className="space-y-2">
                {demos.map((demo) => (
                  <button
                    key={demo.id}
                    onClick={() => setActiveDemo(demo.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeDemo === demo.id
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {demo.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {demos.find(d => d.id === activeDemo)?.label}
                </h2>
                <button
                  onClick={() => window.location.reload()}
                  className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Refresh
                </button>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                This skeleton will be shown while content is loading. The animation and layout should match the actual content structure.
              </p>
            </div>

            {/* Demo Content */}
            <div className="min-h-[400px]">
              {demos.find(d => d.id === activeDemo)?.component}
            </div>
          </div>
        </div>
      </div>

      {/* Usage Example */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-900 rounded-xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-4">Usage Example:</h3>
          <pre className="text-sm bg-gray-800 rounded p-4 overflow-x-auto">
            <code>{`import { ${demos.find(d => d.id === activeDemo)?.id.split('-').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join('')}Skeleton } from '@/components/skeletons';

export default function MyComponent() {
  const { data, isLoading } = useSWR('/api/data');
  
  if (isLoading) {
    return <${demos.find(d => d.id === activeDemo)?.id.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join('')}Skeleton />;
  }
  
  return <ActualContent data={data} />;
}`}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
