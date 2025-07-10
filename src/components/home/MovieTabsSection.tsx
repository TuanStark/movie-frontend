"use client";

import { useEffect, useState } from "react";
import MovieCard from "@/components/MovieCard";
import useSWR from 'swr';
import { Movie } from "@/types/global-type";

const fetcher = (url: string) => fetch(url).then((res) => res.json() as Promise<GenericResponse<Movie>>);

interface MovieTabsSectionProps {
  selectedGenres: string[];
  searchTerm: string;
}

export const MovieTabsSection = ({ selectedGenres, searchTerm }: MovieTabsSectionProps) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const { data, error, isLoading } = useSWR<GenericResponse<Movie>>(
    `${process.env.NEXT_PUBLIC_API_URL}/movies?limit=8&sortOrder=desc`, // Thay bằng endpoint thực tế
    fetcher,
    {
      revalidateIfStale: false,
      refreshInterval: 3000,
    }
  );

  useEffect(() => {
    if (data) {
      setMovies(data.data.data);
    }
  }, [data]);
  const [currentTab, setCurrentTab] = useState<'now-showing'|'coming-soon'>('now-showing');
  
  const nowShowingMovies = movies.filter(movie => !movie.upcoming);
  const upcomingMovies = movies.filter(movie => movie.upcoming);
  
  const filterMoviesByGenre = (movieList: typeof movies) => {
    return movieList.filter(movie => 
      selectedGenres.length === 0 || selectedGenres.some(genre => movie.genres.some(g => g.genre?.name === genre))
    );
  };
  
  const filterMoviesBySearch = (movieList: typeof movies) => {
    return searchTerm
      ? movieList.filter(movie => 
          movie.title.toLowerCase().includes(searchTerm.toLowerCase())
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
            Đang hiển thị
          </button>
          <button
            className={`px-6 py-3 text-lg font-medium border-b-2 -mb-px ${
              currentTab === 'coming-soon'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setCurrentTab('coming-soon')}
          >
            Sắp ra mắt
          </button>
        </div>
        
        {currentTab === 'now-showing' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-4 gap-6">
            {(searchTerm ? filteredNowShowing : nowShowingMovies).map((movie) => (
              <MovieCard
                movie={movie}
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
                movie={movie}
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