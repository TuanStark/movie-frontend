"use client";

import { CreditCard } from "lucide-react";
import Link from "next/link";
import { Seat } from "@/lib/mock-data";
import { useRouter } from "next/navigation";

interface BookingSummaryProps {
  selectedSeats: Seat[];
  movieTitle?: string;
  theater?: string;
  showtime?: string;
  date?: string;
  movieId?: number;
  showtimeId?: number;
  onCheckout?: () => void;
}

export default function BookingSummary({
  selectedSeats,
  movieTitle,
  theater,
  showtime,
  date,
  movieId,
  showtimeId,
  onCheckout
}: BookingSummaryProps) {
  const router = useRouter();
  const totalSeats = selectedSeats.length;
  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  
  const handleCheckout = () => {
    if (onCheckout) {
      onCheckout();
    } else if (movieId && showtimeId && selectedSeats.length > 0) {
      router.push(`/checkout/${movieId}?showtimeId=${showtimeId}&seats=${selectedSeats.map(s => s.id).join(',')}`);
    }
  };
  
  // Calculate convenience fee (example: $1.50 per seat)
  const convenienceFee = totalSeats * 1.5;
  const grandTotal = totalPrice + convenienceFee;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h3 className="font-semibold text-lg mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
        Booking Summary
      </h3>
      
      {movieTitle && (
        <div className="mb-3">
          <p className="text-sm text-gray-500 dark:text-gray-400">Movie</p>
          <p className="font-medium">{movieTitle}</p>
        </div>
      )}
      
      {theater && (
        <div className="mb-3">
          <p className="text-sm text-gray-500 dark:text-gray-400">Theater</p>
          <p className="font-medium">{theater}</p>
        </div>
      )}
      
      {date && showtime && (
        <div className="mb-3">
          <p className="text-sm text-gray-500 dark:text-gray-400">Showtime</p>
          <p className="font-medium">{new Date(date).toLocaleDateString()} at {showtime}</p>
        </div>
      )}
      
      <div className="mb-3">
        <p className="text-sm text-gray-500 dark:text-gray-400">Selected Seats</p>
        {totalSeats > 0 ? (
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
        ) : (
          <p className="text-gray-500 italic text-sm">No seats selected</p>
        )}
      </div>
      
      <div className="mt-6 space-y-2 border-t border-gray-200 dark:border-gray-700 pt-4">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Number of Seats</span>
          <span>{totalSeats}</span>
        </div>
        
        {selectedSeats.length > 0 && (
          <div className="space-y-1 mb-2">
            {Array.from(new Set(selectedSeats.map(seat => seat.type))).map(type => {
              const seatsOfType = selectedSeats.filter(seat => seat.type === type);
              const count = seatsOfType.length;
              const price = seatsOfType[0].price;
              
              return (
                <div key={type} className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>{count} x {type[0].toUpperCase() + type.slice(1)}</span>
                  <span>${(price * count).toFixed(2)}</span>
                </div>
              );
            })}
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 pt-2">
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Convenience Fee</span>
              <span>${convenienceFee.toFixed(2)}</span>
            </div>
          </div>
        )}
        
        <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200 dark:border-gray-700">
          <span>Total</span>
          <span>${grandTotal.toFixed(2)}</span>
        </div>
      </div>
      
      <button 
        className={`w-full mt-6 flex items-center justify-center gap-2 py-3 rounded-full transition-colors 
        ${selectedSeats.length > 0 
          ? "bg-primary-600 hover:bg-primary-700 text-white" 
          : "bg-gray-300 dark:bg-gray-700 cursor-not-allowed text-gray-500 dark:text-gray-400"}
        `}
        disabled={selectedSeats.length === 0}
        onClick={handleCheckout}
      >
        <CreditCard size={18} />
        <span>Proceed to Checkout</span>
      </button>
      
      <div className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
        <p>By proceeding, you agree to our terms of service and privacy policy.</p>
      </div>
    </div>
  );
} 