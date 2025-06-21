"use client";

import Link from "next/link";
import MovieCard from "@/components/MovieCard";
import { movies } from "@/lib/mock-data";

export const TrendingSection = () => {
  const nowShowingMovies = movies.filter(movie => !movie.upcoming);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
              <polyline points="16 7 22 7 22 13" />
            </svg>
            <h2 className="text-2xl md:text-3xl font-bold">Trending Now</h2>
          </div>
          <Link href="/movies" className="text-primary-600 dark:text-primary-400 flex items-center hover:underline">
            See all <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </Link>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-4 gap-6">
          {nowShowingMovies
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 5)
            .map((movie) => (
              <MovieCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                posterPath={movie.posterPath}
                genres={movie.genres}
                rating={movie.rating}
              />
            ))}
        </div>
      </section>
  );
}; 