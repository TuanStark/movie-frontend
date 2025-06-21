"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { theaters, showtimes, movies } from "@/lib/mock-data";

export const WeeklyScheduleSection = () => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  
  // Set default selected date to today
  useEffect(() => {
    const today = new Date();
    setSelectedDate(today.toISOString().split('T')[0]);
  }, []);
  
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center">
        <svg className="w-6 h-6 mr-2 text-primary-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
          <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        Lịch chiếu phim trong tuần
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">Xem lịch chiếu phim chi tiết theo từng ngày và đặt vé trước</p>
      
      {/* Date Selection */}
      <div className="flex overflow-x-auto pb-4 mb-8 gap-2 scrollbar-hide">
        {Array.from({ length: 7 }).map((_, idx) => {
          const date = new Date();
          date.setDate(date.getDate() + idx);
          const formattedDate = date.toISOString().split('T')[0];
          const isToday = idx === 0;
          const isTomorrow = idx === 1;
          
          return (
            <button
              key={formattedDate}
              onClick={() => setSelectedDate(formattedDate)}
              className={`flex-shrink-0 flex flex-col items-center px-4 py-3 rounded-lg transition-all ${
                selectedDate === formattedDate
                  ? "bg-primary-600 text-white"
                  : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700"
              }`}
            >
              <span className="text-sm font-medium">
                {isToday
                  ? "Hôm nay"
                  : isTomorrow
                  ? "Ngày mai"
                  : date.toLocaleDateString('vi-VN', { weekday: 'short' })}
              </span>
              <span className="text-lg font-bold mt-1">{date.getDate()}</span>
              <span className="text-xs mt-1">
                {date.toLocaleDateString('vi-VN', { month: 'short' })}
              </span>
            </button>
          );
        })}
      </div>
      
      {/* Movies Schedule for Selected Date */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">
            Lịch chiếu: {new Date(selectedDate).toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </h3>
        </div>
        
        <div className="space-y-8">
          {(() => {
            // Check if there are any showtimes for the selected date
            const hasShowtimesForDate = showtimes.some(st => st.date === selectedDate);
            
            if (!hasShowtimesForDate) {
              return (
                <div className="text-center py-12">
                  <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Không có suất chiếu nào</h4>
                  <p className="text-gray-600 dark:text-gray-400">Không có suất chiếu phim nào được lên lịch cho ngày này.</p>
                </div>
              );
            }
            
            // Get theaters that have showtimes on the selected date
            const theatersWithShowtimes = theaters.filter(theater => 
              showtimes.some(st => st.date === selectedDate && st.theaterId === theater.id)
            );
            
            return theatersWithShowtimes.map(theater => {
              // Get showtimes for this theater on the selected date
              const theaterShowtimes = showtimes.filter(
                st => st.date === selectedDate && st.theaterId === theater.id
              );
              
              // Group showtimes by movie
              const movieIds = Array.from(new Set(theaterShowtimes.map(st => st.movieId)));
              
              return (
                <div key={theater.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0 last:pb-0">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-lg">{theater.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{theater.location}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    {movieIds.map(movieId => {
                      const movie = movies.find(m => m.id === movieId);
                      if (!movie) return null;
                      
                      const movieShowtimes = theaterShowtimes.filter(st => st.movieId === movieId);
                      
                      return (
                        <div key={movieId} className="flex flex-col md:flex-row gap-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                          <div className="md:w-1/5">
                            <Link href={`/movies/${movie.id}`} className="block relative w-full aspect-[2/3] rounded-lg overflow-hidden group">
                              <Image 
                                src={movie.posterPath}
                                alt={movie.title}
                                fill
                                className="object-cover transition-transform group-hover:scale-105"
                              />
                            </Link>
                          </div>
                          
                          <div className="flex-1">
                            <Link href={`/movies/${movie.id}`} className="text-lg font-medium hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                              {movie.title}
                            </Link>
                            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4 mt-1">
                              <span>{movie.duration}</span>
                              <span>•</span>
                              <span>{movie.genres.join(", ")}</span>
                            </div>
                            
                            <div>
                              <div className="text-sm font-medium mb-2">Suất chiếu:</div>
                              <div className="flex flex-wrap gap-2">
                                {movieShowtimes.map(st => (
                                  <Link
                                    key={st.id}
                                    href={`/booking/${movie.id}?showtimeId=${st.id}`}
                                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors text-sm font-medium"
                                  >
                                    {st.time}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            });
          })()}
        </div>
      </div>
    </section>
  );
}; 