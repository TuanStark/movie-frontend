"use client";

import Link from "next/link";
import MovieCard from "@/components/MovieCard";
import { Movie } from "@/types/global-type";
import { useEffect, useState } from "react";
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json() as Promise<GenericResponse<Movie>>);

export const TrendingSection = () => {
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
  const nowShowingMovies = movies.filter(movie => movie.rating >= 7.8);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
            <polyline points="16 7 22 7 22 13" />
          </svg>
          <h2 className="text-2xl md:text-3xl font-bold">Đang thịnh hành</h2>
        </div>
        <Link href="/movies" className="text-primary-600 dark:text-primary-400 flex items-center hover:underline">
          Xem tất cả
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
              movie={movie}
            />
          ))}
      </div>
    </section>
  );
}; 