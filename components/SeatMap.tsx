"use client";

import { useState, useEffect } from "react";
import { Ticket } from "lucide-react";
import { Seat as SeatType } from "@/lib/mock-data";

interface SeatProps {
  seat: SeatType;
  onSelect: (seat: SeatType) => void;
  isSelected: boolean;
}

const Seat = ({ seat, onSelect, isSelected }: SeatProps) => {
  const handleClick = () => {
    if (seat.status !== 'reserved') {
      onSelect(seat);
    }
  };

  let bgColor = 'bg-gray-200 dark:bg-gray-700';
  let textColor = 'text-gray-600 dark:text-gray-300';
  let scale = '';
  
  if (seat.status === 'reserved') {
    bgColor = 'bg-gray-400 dark:bg-gray-600';
    textColor = 'text-gray-500 dark:text-gray-400';
  } else if (isSelected) {
    bgColor = 'bg-primary-500';
    textColor = 'text-white';
    scale = 'scale-110';
  } else if (seat.type === 'premium') {
    bgColor = 'bg-secondary-100 dark:bg-secondary-900';
  } else if (seat.type === 'vip') {
    bgColor = 'bg-purple-100 dark:bg-purple-900';
  }

  return (
    <button
      className={`w-8 h-8 md:w-10 md:h-10 rounded-md flex items-center justify-center m-0.5 
                ${bgColor} ${textColor} ${scale} ${seat.status === 'reserved' ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:opacity-80'} 
                transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500`}
      onClick={handleClick}
      disabled={seat.status === 'reserved'}
      title={`${seat.id} - ${seat.type} - $${seat.price.toFixed(2)}`}
    >
      {isSelected ? <Ticket size={16} /> : seat.id.replace(/[A-Z]/g, '')}
    </button>
  );
};

interface SeatMapProps {
  seats: SeatType[];
  onSeatSelect: (selectedSeats: SeatType[]) => void;
}

export default function SeatMap({ seats, onSeatSelect }: SeatMapProps) {
  const [selectedSeats, setSelectedSeats] = useState<SeatType[]>([]);
  const [hoveredSeatType, setHoveredSeatType] = useState<string | null>(null);
  
  // Group seats by row
  const seatsByRow = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) {
      acc[seat.row] = [];
    }
    acc[seat.row].push(seat);
    return acc;
  }, {} as Record<string, SeatType[]>);

  const handleSeatSelect = (seat: SeatType) => {
    let newSelectedSeats: SeatType[];
    
    const isSelected = selectedSeats.some(s => s.id === seat.id);
    if (isSelected) {
      newSelectedSeats = selectedSeats.filter(s => s.id !== seat.id);
    } else {
      newSelectedSeats = [...selectedSeats, seat];
    }
    
    setSelectedSeats(newSelectedSeats);
    onSeatSelect(newSelectedSeats);
  };

  const isSeatSelected = (seatId: string) => {
    return selectedSeats.some(seat => seat.id === seatId);
  };

  const getSeatTypeInfo = (type: string) => {
    switch (type) {
      case 'standard':
        return {
          title: 'Standard Seats',
          description: 'Regular seating with good view of the screen.',
          price: '$9.99'
        };
      case 'premium':
        return {
          title: 'Premium Seats',
          description: 'Extra comfortable seats with optimal screen viewing position.',
          price: '$14.99'
        };
      case 'vip':
        return {
          title: 'VIP Seats',
          description: 'Spacious reclining seats with extra legroom and in-seat service.',
          price: '$19.99'
        };
      default:
        return { title: '', description: '', price: '' };
    }
  };

  return (
    <div className="w-full">
      {/* Movie screen */}
      <div className="w-4/5 md:w-2/3 h-8 mx-auto mb-12 bg-gradient-to-r from-blue-400 to-indigo-500 dark:from-blue-600 dark:to-indigo-700 rounded-lg transform perspective-500 rotate-x-12 shadow-lg">
        <div className="h-full w-full flex items-center justify-center text-xs text-white font-medium">
          SCREEN
        </div>
      </div>
      
      {/* Seat Map */}
      <div className="flex flex-col items-center gap-1 mb-8">
        {Object.entries(seatsByRow).map(([row, rowSeats]) => (
          <div key={row} className="flex items-center">
            <div className="w-6 text-center font-medium">{row}</div>
            <div className="flex flex-wrap justify-center">
              {rowSeats.map(seat => (
                <Seat
                  key={seat.id}
                  seat={seat}
                  onSelect={handleSeatSelect}
                  isSelected={isSeatSelected(seat.id)}
                />
              ))}
            </div>
            <div className="w-6 text-center font-medium">{row}</div>
          </div>
        ))}
      </div>
      
      {/* Seat Information */}
      {hoveredSeatType && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-start">
            <div>
              <h4 className="font-medium">{getSeatTypeInfo(hoveredSeatType).title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                {getSeatTypeInfo(hoveredSeatType).description}
              </p>
              <p className="text-sm font-medium mt-1">
                Price: {getSeatTypeInfo(hoveredSeatType).price} per seat
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Legend */}
      <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
        <div 
          className="flex items-center cursor-pointer hover:opacity-80"
          onMouseEnter={() => setHoveredSeatType('standard')}
          onMouseLeave={() => setHoveredSeatType(null)}
        >
          <div className="w-4 h-4 rounded bg-gray-200 dark:bg-gray-700 mr-2"></div>
          <span className="underline decoration-dotted">Standard</span>
        </div>
        <div 
          className="flex items-center cursor-pointer hover:opacity-80"
          onMouseEnter={() => setHoveredSeatType('premium')}
          onMouseLeave={() => setHoveredSeatType(null)}
        >
          <div className="w-4 h-4 rounded bg-secondary-100 dark:bg-secondary-900 mr-2"></div>
          <span className="underline decoration-dotted">Premium</span>
        </div>
        <div 
          className="flex items-center cursor-pointer hover:opacity-80"
          onMouseEnter={() => setHoveredSeatType('vip')}
          onMouseLeave={() => setHoveredSeatType(null)}
        >
          <div className="w-4 h-4 rounded bg-purple-100 dark:bg-purple-900 mr-2"></div>
          <span className="underline decoration-dotted">VIP</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded bg-gray-400 dark:bg-gray-600 opacity-50 mr-2"></div>
          <span>Reserved</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded bg-primary-500 mr-2 flex items-center justify-center text-white">
            <Ticket size={10} />
          </div>
          <span>Selected</span>
        </div>
      </div>
      
      {/* Selected seats summary */}
      {selectedSeats.length > 0 && (
        <div className="mt-8 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-100 dark:border-primary-800">
          <p className="font-medium mb-2">Selected Seats:</p>
          <div className="flex flex-wrap gap-2">
            {selectedSeats.map(seat => (
              <div key={seat.id} className="text-sm flex flex-col items-center">
                <span className={`px-2 py-1 rounded ${
                  seat.type === 'standard' ? 'bg-gray-200 dark:bg-gray-700' :
                  seat.type === 'premium' ? 'bg-secondary-100 dark:bg-secondary-900' :
                  'bg-purple-100 dark:bg-purple-900'
                } font-medium`}>
                  {seat.id}
                </span>
                <span className="text-xs text-gray-500 mt-1">${seat.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 