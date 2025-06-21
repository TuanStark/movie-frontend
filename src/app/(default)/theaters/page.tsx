"use client";

import { useState } from "react";
import { Search, MapPin, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import BackgroundGradient from "@/components/BackgroundGradient";
import { theaters, movies, showtimes } from "@/lib/mock-data";

// Mock images for theaters
const theaterImages = [
  "/images/theater1.jpg",
  "/images/theater2.jpg",
  "/images/theater3.jpg",
];

// Function to get a random image for each theater
const getTheaterImage = (theaterId: number) => {
  // For consistency, use theater ID to select image
  return theaterImages[theaterId % theaterImages.length] || theaterImages[0];
};

export default function TheatersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter theaters based on search
  const filteredTheaters = theaters.filter(theater => {
    return searchTerm === "" || 
      theater.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      theater.location.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Get movies showing at a specific theater
  const getTheaterMovies = (theaterId: number) => {
    const theaterShowtimeIds = showtimes
      .filter(showtime => showtime.theaterId === theaterId)
      .map(showtime => showtime.movieId);
    
    // Convert to array before using it with Set
    const uniqueMovieIds = Array.from(new Set(theaterShowtimeIds));
    return movies.filter(movie => uniqueMovieIds.includes(movie.id));
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <BackgroundGradient />
      {/* <Navbar /> */}
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Our Theaters
          </h1>
          <p className="text-white/80 max-w-2xl">
            Find the perfect cinema location for your movie experience. Each theater offers premium sound and visual quality.
          </p>
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="container mx-auto px-4 py-8">
        <div className="relative mb-8 max-w-xl">
          <input
            type="text"
            placeholder="Search theaters by name or location..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-primary-500 focus:border-primary-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        </div>
        
        {/* Theaters List */}
        <div className="space-y-8 mb-12">
          {filteredTheaters.length > 0 ? (
            filteredTheaters.map(theater => {
              const theaterMovies = getTheaterMovies(theater.id);
              
              return (
                <div 
                  key={theater.id}
                  className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="md:flex">
                    {/* Theater Image */}
                    <div className="md:w-1/3 relative">
                      <div className="h-56 md:h-full relative">
                        <Image
                          src={getTheaterImage(theater.id)}
                          alt={theater.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                    
                    {/* Theater Info */}
                    <div className="md:w-2/3 p-6">
                      <h2 className="text-2xl font-bold mb-2">{theater.name}</h2>
                      
                      <div className="flex items-start mb-4">
                        <MapPin className="h-5 w-5 text-primary-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 dark:text-gray-300">{theater.location}</span>
                      </div>
                      
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">Now Showing</h3>
                        {theaterMovies.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {theaterMovies.slice(0, 5).map(movie => (
                              <Link
                                key={movie.id}
                                href={`/movies/${movie.id}`}
                                className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                              >
                                {movie.title}
                              </Link>
                            ))}
                            {theaterMovies.length > 5 && (
                              <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm">
                                +{theaterMovies.length - 5} more
                              </span>
                            )}
                          </div>
                        ) : (
                          <p className="text-gray-500 dark:text-gray-400">
                            No movies currently showing
                          </p>
                        )}
                      </div>
                      
                      {/* Showtimes */}
                      <div className="flex items-center mb-4">
                        <Clock className="h-5 w-5 text-primary-500 mr-2" />
                        <div>
                          <span className="text-gray-700 dark:text-gray-300">
                            Open today: 10:00 AM - 12:00 AM
                          </span>
                        </div>
                      </div>
                      
                      {/* Amenities */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">IMAX</span>
                        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">Dolby Atmos</span>
                        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">Premium Seating</span>
                        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">Food Court</span>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex flex-wrap gap-3 mt-4">
                        <button className="bg-primary-600 hover:bg-primary-700 text-white py-2 px-6 rounded-full inline-flex items-center transition-all">
                          View Showtimes
                        </button>
                        <button className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 py-2 px-6 rounded-full inline-flex items-center transition-all">
                          <MapPin className="h-4 w-4 mr-2" />
                          Get Directions
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center">
              <h3 className="text-xl font-medium mb-2">No theaters found</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Try adjusting your search criteria
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 