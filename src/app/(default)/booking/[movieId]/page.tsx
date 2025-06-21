"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Clock, MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";
import SeatMap from "@/components/SeatMap";
import BookingSummary from "@/components/BookingSummary";
import BackgroundGradient from "@/components/BackgroundGradient";
import { 
  Movie, Theater, Showtime, Seat, 
  movies, theaters, showtimes, generateSeats
} from "@/lib/mock-data";

interface PageProps {
  params: {
    movieId: string;
  };
}

export default function BookingPage({ params }: PageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const showtimeId = searchParams.get('showtimeId');
  
  const [movie, setMovie] = useState<Movie | null>(null);
  const [theater, setTheater] = useState<Theater | null>(null);
  const [showtime, setShowtime] = useState<Showtime | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  
  useEffect(() => {
    const movieId = Number(params.movieId);
    const foundMovie = movies.find(m => m.id === movieId);
    
    if (foundMovie) {
      setMovie(foundMovie);
      
      // If showtimeId is provided, find the theater and showtime
      if (showtimeId) {
        const foundShowtime = showtimes.find(s => s.id === Number(showtimeId));
        if (foundShowtime) {
          setShowtime(foundShowtime);
          
          const foundTheater = theaters.find(t => t.id === foundShowtime.theaterId);
          if (foundTheater) {
            setTheater(foundTheater);
          }
        }
      } else {
        // If no showtimeId provided, find first available showtime for this movie
        const movieShowtimes = showtimes.filter(s => s.movieId === movieId);
        if (movieShowtimes.length > 0) {
          setShowtime(movieShowtimes[0]);
          
          const foundTheater = theaters.find(t => t.id === movieShowtimes[0].theaterId);
          if (foundTheater) {
            setTheater(foundTheater);
          }
        }
      }
      
      // Generate seats based on the theater
      const generatedSeats = generateSeats(8, 12);  // 8 rows, 12 seats per row
      setSeats(generatedSeats);
    }
  }, [params.movieId, showtimeId]);
  
  const handleSeatSelect = (seats: Seat[]) => {
    setSelectedSeats(seats);
  };
  
  const handleProceedToCheckout = () => {
    if (selectedSeats.length > 0 && movie && theater && showtime) {
      router.push(`/checkout/${params.movieId}?showtimeId=${showtime.id}&seats=${selectedSeats.map(s => s.id).join(',')}`);
    }
  };
  
  if (!movie || !theater || !showtime) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* <Navbar /> */}
        <div className="flex justify-center items-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <BackgroundGradient />
      {/* <Navbar /> */}
      
      {/* Movie header */}
      <div className="relative">
        <div className="h-48 md:h-64 w-full overflow-hidden">
          <Image 
            src={movie.backdropPath}
            alt={movie.title}
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-gray-900 dark:to-gray-900"></div>
        </div>
        
        <div className="absolute inset-0 flex items-center container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl">
            <h1 className="text-3xl md:text-4xl font-bold text-white">{movie.title}</h1>
            <div className="flex items-center mt-2 text-white/80 gap-3">
              <span>{movie.duration}</span>
              <span className="text-white/50">•</span>
              <span>{movie.genres.join(', ')}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Booking info bar */}
      <div className="bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex items-center mb-3 md:mb-0">
              <MapPin className="h-5 w-5 text-primary-500 mr-2" />
              <div>
                <h3 className="font-medium">{theater.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{theater.location}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-primary-500 mr-2" />
              <div>
                <h3 className="font-medium">{showtime.time}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(showtime.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6">Select Your Seats</h2>
              
              <div className="mb-6 px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-sm">
                  <p className="font-medium">Theater Information:</p>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    This theater offers standard seating at the front, premium seating in the middle rows, 
                    and VIP seating at the back with extra legroom and reclining capabilities.
                  </p>
                </div>
              </div>
              
              <SeatMap seats={seats} onSeatSelect={handleSeatSelect} />
              
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p>Please select your preferred seats from the seating chart above.</p>
                    <p>You can select multiple seats by clicking on them.</p>
                  </div>
                  {selectedSeats.length > 0 && (
                    <button 
                      onClick={handleProceedToCheckout}
                      className="md:hidden bg-primary-600 hover:bg-primary-700 text-white py-2 px-6 rounded-full"
                    >
                      Continue to Checkout
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <BookingSummary
                selectedSeats={selectedSeats}
                movieTitle={movie.title}
                theater={theater.name}
                showtime={showtime.time}
                date={showtime.date}
                movieId={movie.id}
                showtimeId={showtime.id}
                onCheckout={handleProceedToCheckout}
              />
              
              <div className="mt-4 hidden md:block">
                <button
                  onClick={() => router.push(`/movies/${movie.id}`)}
                  className="w-full text-center py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Change Showtime
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 