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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-8">
          <button
            className={`px-6 py-3 text-lg font-medium border-b-2 -mb-px ${
              currentTab === 'now-showing'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setCurrentTab('now-showing')}
          >
            Now Showing
          </button>
          <button
            className={`px-6 py-3 text-lg font-medium border-b-2 -mb-px ${
              currentTab === 'coming-soon'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setCurrentTab('coming-soon')}
          >
            Coming Soon
          </button>
        </div>
        
        {currentTab === 'now-showing' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-4 gap-6">
            {(searchTerm ? filteredNowShowing : nowShowingMovies).map((movie) => (
              <MovieCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                posterPath={movie.posterPath}
                genres={movie.genres}
                rating={movie.rating}
              />
            ))}
            {searchTerm && filteredNowShowing.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">No movies found matching your search</p>
              </div>
            )}
          </div>
        )}
        
        {currentTab === 'coming-soon' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
            {(searchTerm ? filteredUpcoming : upcomingMovies).map((movie) => (
              <MovieCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                posterPath={movie.posterPath}
                genres={movie.genres}
                rating={movie.rating}
              />
            ))}
            {searchTerm && filteredUpcoming.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">No upcoming movies found matching your search</p>
              </div>
            )}
          </div>
        )}
      </section>
  );
}; 