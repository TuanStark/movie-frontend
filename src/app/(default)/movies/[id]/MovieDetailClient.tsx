"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, MapPin } from "lucide-react";
import type { Showtime } from "@/types/global-type";
import useSWR from 'swr';

interface MovieDetailClientProps {
  movieId: number;
}

const fetcherShowtimes = (url: string) => fetch(url).then((res) => res.json());

export default function MovieDetailClient({ movieId }: MovieDetailClientProps) {
  const router = useRouter();
  const [movieShowtimes, setMovieShowtimes] = useState<Showtime[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");

  // Fetch showtimes from API with SWR for real-time updates
  const { data: showtimesData, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/show-times/movie/${movieId}`,
    fetcherShowtimes,
    {
      refreshInterval: 30000, // Refresh every 30 seconds for real-time updates
      revalidateOnFocus: true,
      fallbackData: null
    }
  );
  console.log("showtimesData", showtimesData);

  useEffect(() => {
    // Use API data if available
    if (showtimesData?.data) {
      setMovieShowtimes(showtimesData.data);

      // Set default selected date to first available date
      if (showtimesData.data.length > 0) {
        const uniqueDates = Array.from(new Set(showtimesData.data.map((s: Showtime) => s.date))) as string[];
        if (uniqueDates.length > 0) {
          setSelectedDate(uniqueDates[0]);
        }
      }
    }
  }, [movieId, showtimesData]);

  const handleBookNow = (id: number) => {
    router.push(`/booking/${movieId}?showtimeId=${id}`);
  };

  // Get all unique dates for the date selector
  const uniqueDates = Array.from(new Set(movieShowtimes.map(s => s.date)));

  if (isLoading) {
    return (
      <div className="lg:col-span-1">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Showtimes</h2>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
            <div className="space-y-4">
              <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-1">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Lịch chiếu</h2>
        
        {/* Date selector */}
        {uniqueDates.length > 0 && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Chọn ngày
            </label>
            <select 
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            >
              {uniqueDates.map(date => (
                <option key={date} value={date}>
                  {new Date(date).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>
        )}
        
        {/* Theater showtimes */}
        {movieShowtimes.length > 0 ? (
          // Group showtimes by theater
          Object.entries(
            movieShowtimes
              .filter(showtime => showtime.date === selectedDate)
              .reduce((acc: Record<number, Showtime[]>, showtime) => {
                const theaterId = showtime.theaterId;
                if (!acc[theaterId]) {
                  acc[theaterId] = [];
                }
                acc[theaterId].push(showtime);
                return acc;
              }, {})
          ).map(([theaterId, showtimes]) => {
            const theater = showtimes[0]?.theater; // Get theater info from first showtime

            return (
              <div key={theaterId} className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700 last:border-b-0 last:pb-0 last:mb-0">
                <div className="flex items-start mb-3">
                  <MapPin className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium">{theater?.name || 'Unknown Theater'}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {theater?.location || 'Location not available'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  {showtimes.map(showtime => (
                    <button
                      key={showtime.id}
                      onClick={() => handleBookNow(showtime.id)}
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
            No showtimes available for this movie.
          </p>
        )}

        {movieShowtimes.length > 0 && (
          <button className="btn-primary w-full mt-4">
            Show All Showtimes
          </button>
        )}
      </div>
    </div>
  );
}
