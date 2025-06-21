"use client";

import { useState } from "react";
import MovieCard from "@/components/MovieCard";
import { movies } from "@/lib/mock-data";

interface MovieTabsSectionProps {
  selectedGenres: string[];
  searchTerm: string;
}

export const MovieTabsSection = ({ selectedGenres, searchTerm }: MovieTabsSectionProps) => {
  const [currentTab, setCurrentTab] = useState<'now-showing'|'coming-soon'>('now-showing');
  
  const nowShowingMovies = movies.filter(movie => !movie.upcoming);
  const upcomingMovies = movies.filter(movie => movie.upcoming);
  
  const filterMoviesByGenre = (movieList: typeof movies) => {
    return movieList.filter(movie => 
      (selectedGenres.length === 0 || selectedGenres.some(genre => movie.genres.includes(genre)))
    );
  };
  
  const filterMoviesBySearch = (movieList: typeof movies) => {
    return searchTerm
      ? movieList.filter(movie => 
          movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          movie.genres.some(genre => genre.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      : movieList;
  };
  
  const filteredNowShowing = filterMoviesBySearch(filterMoviesByGenre(nowShowingMovies));
  const filteredUpcoming = filterMoviesBySearch(filterMoviesByGenre(upcomingMovies));

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Tab Navigation */}
      <div className="flex items-center gap-4 border-b border-gray-200 dark:border-gray-700 mb-8">
        <button
          className={`pb-4 px-1 font-medium text-lg transition-colors relative ${
            currentTab === 'now-showing' 
              ? 'text-primary-600 dark:text-primary-400' 
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
          }`}
          onClick={() => setCurrentTab('now-showing')}
        >
          Now Showing
          {currentTab === 'now-showing' && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 dark:bg-primary-400"></span>
          )}
        </button>
        <button
          className={`pb-4 px-1 font-medium text-lg transition-colors relative ${
            currentTab === 'coming-soon' 
              ? 'text-primary-600 dark:text-primary-400' 
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
          }`}
          onClick={() => setCurrentTab('coming-soon')}
        >
          Coming Soon
          {currentTab === 'coming-soon' && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 dark:bg-primary-400"></span>
          )}
        </button>
      </div>
      
      {/* Now Showing Tab */}
      {currentTab === 'now-showing' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredNowShowing.length === 0 ? (
            <div className="col-span-full py-12 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
              <h3 className="text-xl font-medium mb-2">No movies found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {selectedGenres.length > 0 
                  ? "Try selecting different genres or clear your filters."
                  : "There are no movies matching your search."}
              </p>
            </div>
          ) : (
            filteredNowShowing.map(movie => (
              <MovieCard 
                key={movie.id}
                id={movie.id}
                title={movie.title}
                posterPath={movie.posterPath}
                genres={movie.genres}
                rating={movie.rating}
              />
            ))
          )}
        </div>
      )}
      
      {/* Coming Soon Tab */}
      {currentTab === 'coming-soon' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredUpcoming.length === 0 ? (
            <div className="col-span-full py-12 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
              <h3 className="text-xl font-medium mb-2">No upcoming movies found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {selectedGenres.length > 0 
                  ? "Try selecting different genres or clear your filters."
                  : "There are no upcoming movies matching your search."}
              </p>
            </div>
          ) : (
            filteredUpcoming.map(movie => (
              <MovieCard 
                key={movie.id}
                id={movie.id}
                title={movie.title}
                posterPath={movie.posterPath}
                genres={movie.genres}
                rating={movie.rating}
              />
            ))
          )}
        </div>
      )}
    </section>
  );
}; 