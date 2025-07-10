'use client';

import React from 'react';

export default function ShowtimeBookingTest() {
  // Mock data to demonstrate the logic
  const mockSeatsData = [
    {
      id: 1,
      row: 'A',
      number: 1,
      type: 'STANDARD',
      price: 100000,
      bookingSeats: [
        {
          id: 1,
          status: 'BOOKED',
          booking: {
            id: 1,
            showtimeId: 1, // Booked for showtime 1
            bookingCode: 'BK-001',
            user: { firstName: 'John', lastName: 'Doe' }
          }
        }
      ]
    },
    {
      id: 2,
      row: 'A',
      number: 2,
      type: 'VIP',
      price: 150000,
      bookingSeats: [
        {
          id: 2,
          status: 'BOOKED',
          booking: {
            id: 2,
            showtimeId: 2, // Booked for showtime 2
            bookingCode: 'BK-002',
            user: { firstName: 'Jane', lastName: 'Smith' }
          }
        }
      ]
    },
    {
      id: 3,
      row: 'A',
      number: 3,
      type: 'STANDARD',
      price: 100000,
      bookingSeats: [] // Not booked
    }
  ];

  const testShowtimeLogic = (currentShowtimeId: number) => {
    return mockSeatsData.map(seat => {
      // Check if seat is booked for THIS specific showtime
      const relevantBookings = seat.bookingSeats?.filter((bs: any) => 
        bs.status === 'BOOKED' && 
        bs.booking?.showtimeId === currentShowtimeId
      ) || [];
      
      const isBooked = relevantBookings.length > 0;
      
      return {
        ...seat,
        isBooked,
        relevantBookings
      };
    });
  };

  const showtime1Results = testShowtimeLogic(1);
  const showtime2Results = testShowtimeLogic(2);

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 max-w-md shadow-lg">
      <h3 className="font-bold text-gray-900 dark:text-white mb-3">
        Showtime Booking Logic Test
      </h3>
      
      <div className="space-y-4 text-sm">
        <div>
          <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Showtime 1 Results:
          </h4>
          {showtime1Results.map(seat => (
            <div key={seat.id} className="flex justify-between items-center py-1">
              <span className="text-gray-600 dark:text-gray-400">
                Seat {seat.row}{seat.number}:
              </span>
              <span className={`px-2 py-1 rounded text-xs ${
                seat.isBooked 
                  ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                  : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              }`}>
                {seat.isBooked ? 'BOOKED' : 'AVAILABLE'}
              </span>
            </div>
          ))}
        </div>

        <div>
          <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Showtime 2 Results:
          </h4>
          {showtime2Results.map(seat => (
            <div key={seat.id} className="flex justify-between items-center py-1">
              <span className="text-gray-600 dark:text-gray-400">
                Seat {seat.row}{seat.number}:
              </span>
              <span className={`px-2 py-1 rounded text-xs ${
                seat.isBooked 
                  ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                  : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              }`}>
                {seat.isBooked ? 'BOOKED' : 'AVAILABLE'}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            ✅ Seat A1: Booked for showtime 1 only<br/>
            ✅ Seat A2: Booked for showtime 2 only<br/>
            ✅ Seat A3: Available for both showtimes
          </p>
        </div>
      </div>
    </div>
  );
}
