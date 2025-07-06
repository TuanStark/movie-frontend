"use client";

import { useState, useEffect } from "react";
import { Search, Menu } from "lucide-react";
import MovieCard from "@/components/MovieCard";
import BackgroundGradient from "@/components/BackgroundGradient";
// import { movies } from "@/lib/mock-data";
import useSWR from 'swr';
import { Genre, Movie } from "@/types/global-type";

const fetcherMovie = (url: string) => fetch(url).then((res) => res.json() as Promise<GenericResponse<Movie>>);
const fetcherGenre = (url: string) => fetch(url).then((res) => res.json() as Promise<GenericResponse<Genre>>);


export default function MoviesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovie] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [currentTab, setCurrentTab] = useState<'all' | 'now-showing' | 'coming-soon'>('all');

  const { data, error, isLoading } = useSWR<GenericResponse<Movie>>(
    `${process.env.NEXT_PUBLIC_API_URL}/movies?limit=10&sortOrder=desc`,
    fetcherMovie,
    {
      revalidateIfStale: false,
      refreshInterval: 3000,
    }
  );

  const { data: genresData, error: genresError, isLoading: isLoadingGenres } = useSWR<GenericResponse<Genre>>(
    `${process.env.NEXT_PUBLIC_API_URL}/genres?limit=20`,
    fetcherGenre,
    {
      revalidateIfStale: false,
      refreshInterval: 3000,
    }
  );

  useEffect(() => {
    if (data && genresData) {
      setGenres(genresData.data?.data);
      setMovie(data.data.data);
    }
  }, [data, genresData]);
  console.log("movies", movies);
  console.log('genres', genres);
  // Get all unique genres
  const allGenres = movies.map(movie => movie.genres).sort();
  console.log(allGenres);

  // Filter movies based on search, genres, and tab
  const filteredMovies = movies.filter(movie => {
    // Filter by search term
    const matchesSearch = searchTerm === "" || movie.title.toLowerCase().includes(searchTerm.toLowerCase())

    // Filter by selected genres
    const matchesGenres = selectedGenres.length === 0 || movie.genres.some(genre => selectedGenres.includes(genre.genre?.name));

    // Filter by tab
    const matchesTab =
      currentTab === 'all' ||
      (currentTab === 'now-showing' && !movie.upcoming) ||
      (currentTab === 'coming-soon' && movie.upcoming);

    return matchesSearch && matchesGenres && matchesTab;
  });

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const clearFilters = () => {
    setSelectedGenres([]);
    setSearchTerm("");
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <BackgroundGradient />
      {/* <Navbar /> */}

      {/* Page Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Explore Our Movies
          </h1>
          <p className="text-white/80 max-w-2xl">
            Browse our collection of now-showing and upcoming movies. Find the perfect film for your next cinema experience.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search box */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search movies..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-primary-500 focus:border-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          </div>

          {/* Filters dropdown */}
          <div className="relative group">
            <button className="flex items-center px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750">
              <Menu className="h-5 w-5 mr-2" />
              Filters {selectedGenres.length > 0 && `(${selectedGenres.length})`}
            </button>

            <div className="absolute right-0 top-full mt-2 w-60 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 z-20 hidden group-hover:block">
              <div className="grid grid-cols-2 items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Genres</h3>
                {selectedGenres.length > 0 && (
                  <div className="text-right">
                    <button
                      onClick={clearFilters}
                      className="text-sm text-primary-600 hover:underline"
                    >
                      Clear All
                    </button>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {genres.map(genre => (
                  <button
                    key={genre.id}
                    onClick={() => handleGenreToggle(genre.name)}
                    className={`px-3 py-1 rounded-full text-xs ${selectedGenres.includes(genre.name)
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-8">
          <button
            onClick={() => setCurrentTab('all')}
            className={`px-6 py-3 font-medium text-sm ${currentTab === 'all'
              ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500'
              : 'text-gray-500 dark:text-gray-400'
              }`}
          >
            All Movies
          </button>
          <button
            onClick={() => setCurrentTab('now-showing')}
            className={`px-6 py-3 font-medium text-sm ${currentTab === 'now-showing'
              ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500'
              : 'text-gray-500 dark:text-gray-400'
              }`}
          >
            Now Showing
          </button>
          <button
            onClick={() => setCurrentTab('coming-soon')}
            className={`px-6 py-3 font-medium text-sm ${currentTab === 'coming-soon'
              ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500'
              : 'text-gray-500 dark:text-gray-400'
              }`}
          >
            Coming Soon
          </button>
        </div>

        {/* Movie Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
          {filteredMovies.length > 0 ? (
            filteredMovies.map(movie => (
              <MovieCard
                movie={movie}
              />
            ))
          ) : (
            <div className="col-span-full py-12 text-center">
              <h3 className="text-xl font-medium mb-2">No movies found</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 