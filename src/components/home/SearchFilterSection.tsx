"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { Genre } from "@/types/global-type";

interface SearchFilterSectionProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedGenres: number[];
  setSelectedGenres: React.Dispatch<React.SetStateAction<number[]>>;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const SearchFilterSection = ({
  searchTerm,
  setSearchTerm,
  selectedGenres,
  setSelectedGenres
}: SearchFilterSectionProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const router = useRouter();

  // Fetch genres from API
  const { data: genresData, isLoading: isLoadingGenres } = useSWR<GenericResponse<Genre>>(
    `${process.env.NEXT_PUBLIC_API_URL}/genres`,
    fetcher
  );

  const genres = genresData?.data.data || [];
  console.log(genres);

  // Toggle genre selection
  const toggleGenre = (genreId: number) => {
    setSelectedGenres(prev =>
      prev.includes(genreId)
        ? prev.filter(g => g !== genreId)
        : [...prev, genreId]
    );
  };

  // Clear all selected genres
  const clearGenreFilters = () => {
    setSelectedGenres([]);
  };

  // Handle search - navigate to movies page with filters
  const handleSearch = () => {
    const urlParts = [];
    if (searchTerm) urlParts.push(`search=${encodeURIComponent(searchTerm)}`);
    if (selectedGenres.length > 0) urlParts.push(`genreIds=${selectedGenres.join(',')}`);

    const newUrl = `/movies${urlParts.length > 0 ? `?${urlParts.join('&')}` : ''}`;
    router.push(newUrl);
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-grow relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm phim theo tiêu đề, thể loại, diễn viên..."
              className="w-full py-4 pl-12 pr-4 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyPress}
            />
          </div>

          <div className="flex gap-2">
            <button
              className={`px-6 py-4 rounded-xl flex items-center gap-2 font-medium transition-all ${
                showFilters
                  ? "bg-primary-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
              }`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              {showFilters ? "Ẩn bộ lọc" : "Bộ lọc"}
              {selectedGenres.length > 0 && (
                <span className="ml-1 bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 text-sm px-2 py-0.5 rounded-full">
                  {selectedGenres.length}
                </span>
              )}
            </button>

            <button
              onClick={handleSearch}
              className="px-6 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-all flex items-center gap-2"
            >
              <Search className="h-5 w-5" />
              Tìm kiếm
            </button>
          </div>
        </div>
        
        {/* Filter dropdown */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Lọc theo thể loại:</h3>
              {selectedGenres.length > 0 && (
                <button
                  onClick={clearGenreFilters}
                  className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Xóa tất cả bộ lọc
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {isLoadingGenres ? (
                // Skeleton for genres
                Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                ))
              ) : (
                genres.map(genre => (
                  <button
                    key={genre.id}
                    onClick={() => toggleGenre(genre.id)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                      selectedGenres.includes(genre.id)
                        ? "bg-primary-500 text-white"
                        : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
                    }`}
                  >
                    {selectedGenres.includes(genre.id) && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="inline w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {genre.name}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 