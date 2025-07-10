"use client";

import Image from "next/image";
import Link from "next/link";
import { Movie } from "@/types/global-type";
import { useEffect, useState } from "react";
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json() as Promise<GenericResponse<Movie>>);

export const UpcomingReleasesSection = () => {
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
  const upcomingMovies = movies.filter(movie => movie.upcoming);

  return (
    <section className="py-16 bg-gradient-to-r from-primary-900/30 to-primary-600/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Các phim sắp ra mắt</h2>
              <p className="text-gray-600 dark:text-gray-400">Hãy là người đầu tiên xem những bộ phim được mong đợi này</p>
            </div>
            <Link href="/movies?tab=coming-soon" className="text-primary-600 dark:text-primary-400 flex items-center hover:underline">
              Xem tất cả
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                        Release Date: {new Date().toLocaleDateString()}
                      </div>
                      <Link 
                        href={`/movies/${movie.id}`} 
                        className="text-primary-600 dark:text-primary-400 text-sm font-medium hover:underline"
                      >
                        Xem thông tin
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </section>
  );
}; 