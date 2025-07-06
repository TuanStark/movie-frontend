"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Movie, Theater, Showtime, movies, theaters, showtimes } from "@/lib/mock-data";

interface PageProps {
  params: {
    id: string;
  };
}

export default function MovieDetail({ params }: PageProps) {
  const router = useRouter();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [movieShowtimes, setMovieShowtimes] = useState<Record<number, Showtime[]>>({});
  const [theaterMap, setTheaterMap] = useState<Record<number, Theater>>({});
  const [selectedDate, setSelectedDate] = useState<string>("");
  
  useEffect(() => {
    // Find the movie
    const id = Number(params.id);
    const foundMovie = movies.find(m => m.id === id);
    
    if (foundMovie) {
      setMovie(foundMovie);
      
      // Create a map of theaters for quick lookup
      const theatersMap = theaters.reduce((acc, theater) => {
        acc[theater.id] = theater;
        return acc;
      }, {} as Record<number, Theater>);
      setTheaterMap(theatersMap);
      
      // Filter showtimes for this movie
      const movieShowtimes = showtimes.filter(s => s.movieId === id);
      
      // Group by theater
      const showtimesByTheater = movieShowtimes.reduce((acc, showtime) => {
        if (!acc[showtime.theaterId]) {
          acc[showtime.theaterId] = [];
        }
        acc[showtime.theaterId].push(showtime);
        return acc;
      }, {} as Record<number, Showtime[]>);
      
      setMovieShowtimes(showtimesByTheater);
      
      // Set default selected date to first available date
      if (movieShowtimes.length > 0) {
        setSelectedDate(movieShowtimes[0].date);
      }
    }
  }, [params.id]);
  
  if (!movie) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          Movie not found
        </div>
      </div>
    );
  }

  const handleBookNow = (showtime: Showtime) => {
    router.push(`/booking/${movie.id}?showtimeId=${showtime.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* <Navbar /> */}
      
      {/* Movie backdrop */}
      <div className="relative h-72 md:h-96 w-full">
        <Image 
          src={movie.backdropPath}
          alt={movie.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h1 className="text-3xl md:text-4xl font-bold">{movie.title}</h1>
          <div className="flex items-center mt-2 text-sm md:text-base space-x-4">
            <p className="flex items-center">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
              {movie.rating.toFixed(1)}/10
            </p>
            <p>{movie.duration}</p>
            <p>{movie.genres.join(', ')}</p>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Movie info column */}
          <div className="lg:col-span-2">
            {/* Trailer */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Trailer</h2>
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <iframe
                  src={movie.trailerUrl.replace('watch?v=', 'embed/')}
                  title={`${movie.title} Trailer`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                ></iframe>
              </div>
            </div>
            
            {/* Synopsis */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Synopsis</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {movie.synopsis}
              </p>
            </div>
            
            {/* Details */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Director</p>
                  <p>{movie.director}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Release Date</p>
                  <p>{new Date(movie.releaseDate).toLocaleDateString()}</p>
                </div>
                <div className="col-span-1 md:col-span-2">
                  <p className="text-gray-500 dark:text-gray-400">Cast</p>
                  <p>{movie.cast.join(', ')}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Showtimes column */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Showtimes</h2>
              
              {/* Date selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Date
                </label>
                <select 
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                >
                  {/* Get unique dates from showtimes */}
                  {Array.from(new Set(showtimes.map(s => s.date))).map(date => (
                    <option key={date} value={date}>
                      {new Date(date).toLocaleDateString()}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Theater showtimes */}
              {Object.keys(movieShowtimes).length > 0 ? (
                Object.entries(movieShowtimes).map(([theaterId, showtimes]) => {
                  const theater = theaterMap[Number(theaterId)];
                  const filteredShowtimes = showtimes.filter(s => s.date === selectedDate);
                  
                  if (filteredShowtimes.length === 0) return null;
                  
                  return (
                    <div key={theaterId} className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700 last:border-b-0 last:pb-0 last:mb-0">
                      <div className="flex items-start mb-3">
                        <MapPin className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-medium">{theater.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {theater.location}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-3">
                        {filteredShowtimes.map(showtime => (
                          <button
                            key={showtime.id}
                            onClick={() => handleBookNow(showtime)}
                            className="flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          >
                            <Clock className="h-4 w-4 mr-2 text-primary-500" />
                            <span>{showtime.time}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-center py-4 text-gray-500 dark:text-gray-400">
                  {movie.upcoming 
                    ? "This movie is not yet available for booking."
                    : "No showtimes available for this movie."}
                </p>
              )}
              
              {!movie.upcoming && (
                <button className="btn-primary w-full mt-4">
                  Show All Showtimes
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 