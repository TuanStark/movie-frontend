import { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { movies, showtimes, theaters } from "@/lib/mock-data";

export default function ScheduleMovie() {
    const [genreList, setGenreList] = useState<string[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>("");
    
  // Extract all unique genres from movies
  useEffect(() => {
    const allGenres = movies.flatMap(movie => movie.genres);
    const uniqueGenres = Array.from(new Set(allGenres)).sort();
    setGenreList(uniqueGenres);
    
    // Set default selected date to today
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
                  <div className="py-12 text-center">
                    <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                      <svg className="w-8 h-8 text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 2V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M16 2V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M3 9H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-medium mb-2">Không có suất chiếu</h4>
                    <p className="text-gray-500 dark:text-gray-400">
                      Không có suất chiếu phim nào vào ngày {new Date(selectedDate).toLocaleDateString('vi-VN')}. Vui lòng chọn một ngày khác.
                    </p>
                  </div>
                );
              }
              
              return theaters.map((theater) => {
                // Check if this theater has any showtime for selected date
                const theaterHasShowtimes = showtimes.some(
                  st => st.theaterId === theater.id && st.date === selectedDate
                );
                
                if (!theaterHasShowtimes) return null;
                
                return (
                  <div key={theater.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-lg">
                        <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          <path d="M19 15L19 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          <path d="M5 15L5 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          <path d="M2 9V7C2 5.89543 2.89543 5 4 5H20C21.1046 5 22 5.89543 22 7V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          <path d="M4 19H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">{theater.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{theater.location}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {movies
                        .filter(movie => !movie.upcoming)
                        .map(movie => {
                          // Find showtimes for this movie and theater on selected date
                          const movieShowtimes = showtimes.filter(
                            (st) => st.movieId === movie.id && 
                                 st.theaterId === theater.id && 
                                 st.date === selectedDate
                          );
                          
                          // Only show movies that have showtimes
                          if (movieShowtimes.length === 0) return null;
                          
                          return (
                            <div key={movie.id} className="flex p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                              <div className="w-16 h-24 flex-shrink-0 relative overflow-hidden rounded">
                                <Image
                                  src={movie.posterPath}
                                  alt={movie.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="ml-4 flex-grow">
                                <h5 className="font-bold mb-1 line-clamp-1">{movie.title}</h5>
                                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-3">
                                  <span className="mr-2">{movie.duration}</span>
                                  <span>•</span>
                                  <span className="mx-2">{movie.genres.slice(0, 2).join(", ")}</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {movieShowtimes.map((st) => (
                                    <Link
                                      key={st.id}
                                      href={`/booking/${movie.id}?showtime=${st.id}`}
                                      className="text-sm px-3 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
                                    >
                                      {st.time}
                                    </Link>
                                  ))}
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
    )
}