import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useSWR from 'swr';
import type { Showtime, Theater } from "@/types/global-type";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ScheduleMovie() {
    const [selectedDate, setSelectedDate] = useState<string>("");

    const { data: showtimesData, isLoading: showtimesLoading } = useSWR(
      `${process.env.NEXT_PUBLIC_API_URL}/show-times`,
      fetcher
    );

    // Set default selected date to today
    useEffect(() => {
      const today = new Date();
      setSelectedDate(today.toISOString().split('T')[0]);
    }, []);

    const showtimes: Showtime[] = showtimesData?.data?.data || [];
    const isLoading = showtimesLoading;

    if (isLoading) {
      return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-1/3"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-6 w-2/3"></div>
            <div className="flex gap-2 mb-8">
              {Array.from({ length: 7 }).map((_, idx) => (
                <div key={idx} className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              ))}
            </div>
            <div className="bg-gray-200 dark:bg-gray-700 rounded-xl h-96"></div>
          </div>
        </section>
      );
    }

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
              const normalizeDate = (dateStr: string) => {
                if (!dateStr) {
                  return '';
                }
                if (dateStr.includes('T')) {
                  const normalized = dateStr.split('T')[0];
                  return normalized;
                }
                const date = new Date(dateStr);
                const normalized = date.toISOString().split('T')[0];
                return normalized;
              };
              const hasShowtimesForDate = showtimes && showtimes.length > 0 && showtimes.some(st => {
                const showtimeDate = normalizeDate(st.date);
                const matches = showtimeDate === selectedDate;
                return matches;
              });
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
              
              // Group showtimes by theater for the selected date
              const filteredShowtimes = (showtimes || [])
                .filter(st => {
                  const showtimeDate = normalizeDate(st.date);
                  return showtimeDate === selectedDate;
                });

              // Group by theater
              const showtimesByTheater = filteredShowtimes
                .reduce((acc: Record<number, { theater: Theater; showtimes: Showtime[] }>, showtime) => {
                  const theaterId = showtime.theaterId;
                  if (!acc[theaterId]) {
                    acc[theaterId] = {
                      theater: showtime.theater,
                      showtimes: []
                    };
                  }
                  acc[theaterId].showtimes.push(showtime);
                  return acc;
                }, {});

              // Group showtimes by movie within each theater
              const theaterGroups = Object.values(showtimesByTheater).map(({ theater, showtimes: theaterShowtimes }) => {
                const movieGroups = theaterShowtimes.reduce((acc: Record<number, { movie: any; showtimes: Showtime[] }>, showtime) => {
                  const movieId = showtime.movieId;
                  if (!acc[movieId]) {
                    acc[movieId] = {
                      movie: showtime.movie,
                      showtimes: []
                    };
                  }
                  acc[movieId].showtimes.push(showtime);
                  return acc;
                }, {});

                return {
                  theater,
                  movieGroups: Object.values(movieGroups)
                };
              });

              return theaterGroups.map(({ theater, movieGroups }) => (
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

                  <div className="space-y-4">
                    {movieGroups.map(({ movie, showtimes: movieShowtimes }) => (
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
                            <span className="mx-2">
                              {movie.genres?.slice(0, 2).map((g: any) => g.genre.name).join(", ")}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {movieShowtimes.map((showtime: any) => (
                              <Link
                                key={showtime.id}
                                href={`/booking/${movie.id}?showtime=${showtime.id}`}
                                className="text-sm px-3 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
                              >
                                {showtime.time}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>
      </section>
    )
}