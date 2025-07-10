'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { CheckCircle, Download, Mail, Calendar, Clock, MapPin, User, CreditCard } from 'lucide-react';
import { Movie, Theater, Showtime, Seat } from '@/types/global-type';

interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface ConfirmationData {
  movieId: number;
  showtimeId: number;
  seats: Seat[];
  totalPrice: number;
  movie: Movie;
  theater: Theater;
  showtime: Showtime;
  customerInfo: CustomerInfo;
  paymentMethod: string;
  bookingCode: string;
  bookingDate: string;
  bookingId?: number;
}

export default function ConfirmationPage() {
  const router = useRouter();
  const [confirmationData, setConfirmationData] = useState<ConfirmationData | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    // Get confirmation data from sessionStorage
    const storedData = sessionStorage.getItem('confirmationData');
    if (storedData) {
      setConfirmationData(JSON.parse(storedData));
      // Simulate sending confirmation email
      setTimeout(() => setEmailSent(true), 2000);
    } else {
      // Redirect if no confirmation data
      router.push('/movies');
    }
  }, [router]);

  const handleDownloadTicket = () => {
    // In a real app, this would generate and download a PDF ticket
    alert('Ticket download feature would be implemented here');
  };

  const handleSendEmail = () => {
    // In a real app, this would send the confirmation email
    alert('Confirmation email sent!');
    setEmailSent(true);
  };

  const handleBackToMovies = () => {
    // Clear confirmation data and go back to movies
    sessionStorage.removeItem('confirmationData');
    router.push('/movies');
  };

  if (!confirmationData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const { movie, theater, showtime, seats, totalPrice, customerInfo, paymentMethod, bookingCode, bookingDate } = confirmationData;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your movie tickets have been successfully booked
          </p>
        </div>

        {/* Booking Details Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 px-6 py-4">
            <div className="flex justify-between items-center text-white">
              <div>
                <h2 className="text-xl font-bold">Booking Confirmation</h2>
                <p className="text-primary-100">Booking Code: {bookingCode}</p>
                {confirmationData.bookingId && (
                  <p className="text-primary-100 text-sm">ID: #{confirmationData.bookingId}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-primary-100">Booking Date</p>
                <p className="font-semibold">{new Date(bookingDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Movie & Showtime Info */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Movie Details
                </h3>
                
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-20 h-28 relative flex-shrink-0">
                    <Image
                      src={movie.posterPath}
                      alt={movie.title}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                      {movie.title}
                    </h4>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {theater.name}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(showtime.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        {showtime.time}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Seats */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Your Seats ({seats.length})
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {seats.map(seat => (
                      <div key={seat.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
                        <div className="font-medium text-gray-900 dark:text-white">
                          Row {seat.row}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Seat {seat.number}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Customer & Payment Info */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Booking Information
                </h3>
                
                {/* Customer Info */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Customer Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Name</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {customerInfo.firstName} {customerInfo.lastName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Email</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {customerInfo.email}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Phone</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {customerInfo.phone}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Payment Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Payment Method</span>
                      <span className="font-medium text-gray-900 dark:text-white capitalize">
                        {paymentMethod} Card
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Showtime Fee</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {(showtime.price / 1000).toLocaleString()}k VND
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          Seats ({seats.length})
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {(seats.reduce((total, seat) => total + seat.price, 0) / 1000).toLocaleString()}k VND
                        </span>
                      </div>

                      {/* Peak Hour Surcharge */}
                      {(() => {
                        const showtimeDate = new Date(showtime.date);
                        const showtimeTime = showtime.time;
                        const isPeakHour = showtimeDate.getDay() >= 5 || showtimeDate.getDay() === 0 || showtimeTime >= "18:00";

                        if (isPeakHour) {
                          return (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">
                                Peak Hour Surcharge
                                <span className="text-xs block text-gray-500">
                                  {showtimeDate.getDay() >= 5 || showtimeDate.getDay() === 0
                                    ? 'Weekend'
                                    : showtimeTime >= "18:00"
                                    ? 'Evening'
                                    : ''
                                  }
                                </span>
                              </span>
                              <span className="font-medium text-orange-600 dark:text-orange-400">
                                +20k VND
                              </span>
                            </div>
                          );
                        }
                        return null;
                      })()}

                      <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Total Amount</span>
                          <span className="font-bold text-lg text-primary-600">
                            {(totalPrice / 1000).toLocaleString()}k VND
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Email Status */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-400 mr-3" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Confirmation Email
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {emailSent 
                          ? `Sent to ${customerInfo.email}` 
                          : 'Sending confirmation email...'
                        }
                      </p>
                    </div>
                    {emailSent && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleDownloadTicket}
            className="flex items-center justify-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
          >
            <Download className="h-5 w-5 mr-2" />
            Download Ticket
          </button>
          
          {!emailSent && (
            <button
              onClick={handleSendEmail}
              className="flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Mail className="h-5 w-5 mr-2" />
              Resend Email
            </button>
          )}
          
          <button
            onClick={handleBackToMovies}
            className="flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Back to Movies
          </button>
        </div>

        {/* Important Notes */}
        <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
            Important Notes:
          </h4>
          <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
            <li>• Please arrive at the theater at least 15 minutes before showtime</li>
            <li>• Bring a valid ID for verification</li>
            <li>• Show this confirmation or your downloaded ticket at the entrance</li>
            <li>• Tickets are non-refundable and non-transferable</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
