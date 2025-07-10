// Test component to verify booking flow
'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function BookingFlowTest() {
  const router = useRouter();

  const testBookingFlow = () => {
    // Mock booking data for testing
    const mockBookingData = {
      movieId: 1,
      showtimeId: 1,
      seats: [
        { id: 1, theaterId: 1, row: 'A', number: 1, type: 'standard', price: 12 },
        { id: 2, theaterId: 1, row: 'A', number: 2, type: 'standard', price: 12 },
      ],
      totalPrice: 24,
      movie: {
        id: 1,
        title: 'Test Movie',
        posterPath: '/test-poster.jpg',
        backdropPath: '/test-backdrop.jpg',
        genres: [{ id: 1, movieId: 1, genreId: 1, genre: { id: 1, name: 'Action' } }],
        rating: 8.5,
        synopsis: 'Test synopsis',
        duration: '120 min',
        director: 'Test Director',
        actors: 'Test Actors',
        casts: [],
        releaseDate: '2024-01-01',
        trailerUrl: 'https://youtube.com/test',
        upcoming: false,
      },
      theater: {
        id: 1,
        name: 'Test Theater',
        location: 'Test Location',
        logo: '/test-logo.jpg',
      },
      showtime: {
        id: 1,
        movieId: 1,
        theaterId: 1,
        date: '2024-01-15',
        time: '19:00',
        price: 12,
        movie: {} as any,
        theater: {} as any,
      },
    };

    // Store in sessionStorage and navigate to checkout
    sessionStorage.setItem('bookingData', JSON.stringify(mockBookingData));
    router.push('/checkout');
  };

  const testConfirmation = () => {
    // Mock confirmation data for testing
    const mockConfirmationData = {
      movieId: 1,
      showtimeId: 1,
      seats: [
        { id: 1, theaterId: 1, row: 'A', number: 1, type: 'standard', price: 12 },
        { id: 2, theaterId: 1, row: 'A', number: 2, type: 'standard', price: 12 },
      ],
      totalPrice: 24,
      movie: {
        id: 1,
        title: 'Test Movie',
        posterPath: '/test-poster.jpg',
        backdropPath: '/test-backdrop.jpg',
        genres: [{ id: 1, movieId: 1, genreId: 1, genre: { id: 1, name: 'Action' } }],
        rating: 8.5,
        synopsis: 'Test synopsis',
        duration: '120 min',
        director: 'Test Director',
        actors: 'Test Actors',
        casts: [],
        releaseDate: '2024-01-01',
        trailerUrl: 'https://youtube.com/test',
        upcoming: false,
      },
      theater: {
        id: 1,
        name: 'Test Theater',
        location: 'Test Location',
        logo: '/test-logo.jpg',
      },
      showtime: {
        id: 1,
        movieId: 1,
        theaterId: 1,
        date: '2024-01-15',
        time: '19:00',
        price: 12,
        movie: {} as any,
        theater: {} as any,
      },
      customerInfo: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
      },
      paymentMethod: 'credit',
      bookingCode: 'BK1234567890',
      bookingDate: new Date().toISOString(),
    };

    // Store in sessionStorage and navigate to confirmation
    sessionStorage.setItem('confirmationData', JSON.stringify(mockConfirmationData));
    router.push('/confirmation');
  };

  return (
    <div className="fixed bottom-4 left-4 bg-black/80 text-white p-4 rounded-lg text-sm max-w-xs space-y-2">
      <h3 className="font-bold mb-2">Booking Flow Test:</h3>
      
      <div className="space-y-2">
        <Link 
          href="/booking/1?showtime=1"
          className="block w-full text-center py-2 bg-blue-600 hover:bg-blue-700 rounded text-xs"
        >
          Test Booking Page
        </Link>
        
        <button
          onClick={testBookingFlow}
          className="w-full py-2 bg-green-600 hover:bg-green-700 rounded text-xs"
        >
          Test Checkout Flow
        </button>
        
        <button
          onClick={testConfirmation}
          className="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded text-xs"
        >
          Test Confirmation
        </button>
        
        <Link 
          href="/movies"
          className="block w-full text-center py-2 bg-gray-600 hover:bg-gray-700 rounded text-xs"
        >
          Back to Movies
        </Link>
      </div>
    </div>
  );
}
