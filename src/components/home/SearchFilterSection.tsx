"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { movies } from "@/lib/mock-data";

interface SearchFilterSectionProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedGenres: string[];
  setSelectedGenres: React.Dispatch<React.SetStateAction<string[]>>;
}

export const SearchFilterSection = ({
  searchTerm,
  setSearchTerm,
  selectedGenres,
  setSelectedGenres
}: SearchFilterSectionProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const [genreList, setGenreList] = useState<string[]>([]);
  
  // Extract all unique genres from movies
  useEffect(() => {
    const allGenres = movies.flatMap(movie => movie.genres);
    const uniqueGenres = Array.from(new Set(allGenres)).sort();
    setGenreList(uniqueGenres);
  }, []);
  
  // Toggle genre selection
  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };
  
  // Clear all selected genres
  const clearGenreFilters = () => {
    setSelectedGenres([]);
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
            />
          </div>
          
          <div className="flex-shrink-0">
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
              {showFilters ? "Hide Filters" : "Filters"}
              {selectedGenres.length > 0 && (
                <span className="ml-1 bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 text-sm px-2 py-0.5 rounded-full">
                  {selectedGenres.length}
                </span>
              )}
            </button>
          </div>
        </div>
        
        {/* Filter dropdown */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Filter by Genre:</h3>
              {selectedGenres.length > 0 && (
                <button 
                  onClick={clearGenreFilters}
                  className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {genreList.map(genre => (
                <button
                  key={genre}
                  onClick={() => toggleGenre(genre)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                    selectedGenres.includes(genre)
                      ? "bg-primary-500 text-white"
                      : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
                  }`}
                >
                  {selectedGenres.includes(genre) && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="inline w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {genre}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 