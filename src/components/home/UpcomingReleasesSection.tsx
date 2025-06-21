"use client";

import Image from "next/image";
import Link from "next/link";
import { movies } from "@/lib/mock-data";

export const UpcomingReleasesSection = () => {
  const upcomingMovies = movies.filter(movie => movie.upcoming);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <h2 className="text-2xl md:text-3xl font-bold">Upcoming Releases</h2>
        </div>
        <Link href="/movies?filter=upcoming" className="text-primary-600 dark:text-primary-400 flex items-center hover:underline">
          See all <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14"></path>
            <path d="m12 5 7 7-7 7"></path>
          </svg>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {upcomingMovies
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 3)
          .map(movie => (
            <div key={movie.id} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg group hover:shadow-xl transition-shadow">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={movie.backdropPath}
                  alt={movie.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-md">
                  Coming Soon
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 line-clamp-1">{movie.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  {movie.synopsis}
                </p>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Release Date: {new Date(movie.releaseDate).toLocaleDateString()}
                  </div>
                  <Link 
                    href={`/movies/${movie.id}`} 
                    className="text-primary-600 dark:text-primary-400 text-sm font-medium hover:underline"
                  >
                    More Info
                  </Link>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </section>
  );
}; 