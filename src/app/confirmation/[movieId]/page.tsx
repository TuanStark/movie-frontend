"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import BackgroundGradient from "@/components/BackgroundGradient";
import { 
  Movie, Showtime, Theater, Seat, 
  movies, theaters, showtimes, sampleSeats 
} from "@/lib/mock-data";

interface PageProps {
  params: {
    movieId: string;
  };
}

export default function ConfirmationPage({ params }: PageProps) {
  const searchParams = useSearchParams();
  const showtimeId = searchParams.get('showtimeId');
  const seatIds = searchParams.get('seats')?.split(',') || [];
  const paymentMethod = searchParams.get('payment');
  
  const [movie, setMovie] = useState<Movie | null>(null);
  const [theater, setTheater] = useState<Theater | null>(null);
  const [showtime, setShowtime] = useState<Showtime | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [bookingId, setBookingId] = useState<string>("");
  
  useEffect(() => {
    const movieId = Number(params.movieId);
    const foundMovie = movies.find(m => m.id === movieId);
    
    if (foundMovie) {
      setMovie(foundMovie);
      
      // Find showtime and theater
      if (showtimeId) {
        const foundShowtime = showtimes.find(s => s.id === Number(showtimeId));
        if (foundShowtime) {
          setShowtime(foundShowtime);
          
          const foundTheater = theaters.find(t => t.id === foundShowtime.theaterId);
          if (foundTheater) {
            setTheater(foundTheater);
          }
        }
      }
      
      // Find selected seats
      if (seatIds.length > 0) {
        const foundSeats = sampleSeats.filter(seat => seatIds.includes(seat.id));
        setSelectedSeats(foundSeats);
      }
      
      // Generate a random booking ID
      setBookingId(`MT${Math.floor(100000 + Math.random() * 900000)}`);
    }
  }, [params.movieId, showtimeId, seatIds]);
  
  const getTotalAmount = () => {
    const subtotal = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
    const convenienceFee = selectedSeats.length * 1.5; // $1.50 per ticket
    return (subtotal + convenienceFee).toFixed(2);
  };
  
  const getPaymentMethodName = () => {
    if (paymentMethod === 'bank_transfer') return 'Bank Transfer';
    if (paymentMethod === 'vnpay') return 'VNPay';
    return 'Online Payment';
  };
  
  if (!movie || !theater || !showtime || selectedSeats.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <BackgroundGradient />
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <div className="flex justify-center items-center h-[40vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <BackgroundGradient />
      <Navbar />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900 p-2 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold">Booking Confirmed!</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Your tickets have been booked successfully
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          {/* QR Code */}
          <div className="flex justify-center py-8 bg-gray-50 dark:bg-gray-900">
            {/* In a real app, generate an actual QR code */}
            <div className="w-48 h-48 bg-white dark:bg-gray-800 p-2 relative">
              <div className="absolute inset-0 m-2 grid grid-cols-5 grid-rows-5 gap-2">
                {/* Mock QR code pattern */}
                {Array.from({ length: 25 }).map((_, i) => (
                  <div
                    key={i}
                    className={`
                      ${[0, 1, 2, 3, 4, 5, 9, 10, 14, 15, 19, 20, 21, 22, 23, 24].includes(i) ? 
                      'bg-black dark:bg-white' : 'bg-white dark:bg-gray-800'}
                    `}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h2 className="text-2xl font-bold">{movie.title}</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {new Date(showtime.date).toLocaleDateString()} at {showtime.time}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-gray-400">Booking ID</p>
                <p className="font-mono font-bold">{bookingId}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Theater</p>
                <p className="font-medium">{theater.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {theater.location}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Seats</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedSeats.map((seat) => (
                    <span
                      key={seat.id}
                      className="inline-flex items-center justify-center px-2 py-1 rounded-md text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200"
                    >
                      {seat.id}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Number of Tickets</p>
                <p className="font-medium">{selectedSeats.length}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Amount</p>
                <p className="font-medium">${getTotalAmount()}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Payment Method</p>
                <p className="font-medium">{getPaymentMethodName()}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {paymentMethod === 'bank_transfer' ? 'Payment pending verification' : 'Payment completed'}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                <div className="flex items-center">
                  <span className="inline-flex h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                  <span className="font-medium">Confirmed</span>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Please arrive at least 15 minutes before the movie starts. Show this QR code at the theater entrance for entry.
                </p>
              </div>
              
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button className="bg-primary-600 hover:bg-primary-700 text-white py-3 px-8 rounded-full">
                  Print Ticket
                </button>
                <button className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 py-3 px-8 rounded-full">
                  Email Ticket
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 