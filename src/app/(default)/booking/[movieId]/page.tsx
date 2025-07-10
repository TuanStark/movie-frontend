"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Clock, MapPin } from "lucide-react";
// import SeatMap from "@/components/SeatMap";
// import BookingSummary from "@/components/BookingSummary";
import BackgroundGradient from "@/components/BackgroundGradient";
import { Movie, Theater, Showtime, Seat } from "@/types/global-type";
import useSWR from 'swr';
import formatPrice from "@/types/format-price";

interface SeatWithStatus extends Seat {
  isBooked?: boolean;
  isSelected?: boolean;
}

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
  const [seats, setSeats] = useState<SeatWithStatus[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<SeatWithStatus[]>([]);
  
  // Fetch movie data
  const { data: movieData } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/movies/${params.movieId}`,
    (url: string) => fetch(url).then(res => res.json())
  );

  // Fetch showtime data if showtimeId is provided
  const { data: showtimeData } = useSWR(
    showtimeId ? `${process.env.NEXT_PUBLIC_API_URL}/show-times/${showtimeId}` : null,
    (url: string) => fetch(url).then(res => res.json())
  );

  // Fetch seats for the theater with all booking information
  const { data: seatsData } = useSWR(
    showtimeData?.data?.theaterId ?
      `${process.env.NEXT_PUBLIC_API_URL}/seats/theater/${showtimeData.data.theaterId}` :
      null,
    (url: string) => fetch(url).then(res => res.json())
  );

  useEffect(() => {
    if (movieData?.data) {
      setMovie(movieData.data);
    }
  }, [movieData]);

  useEffect(() => {
    if (showtimeData?.data) {
      setShowtime(showtimeData.data);
      setTheater(showtimeData.data.theater);
    }
  }, [showtimeData]);

  useEffect(() => {
    if (seatsData?.data && showtimeId) {
      // Add booking status from real API data - only for current showtime
      const seatsWithStatus: SeatWithStatus[] = seatsData.data.map((seat: Seat) => {
        // Check if seat is booked for THIS specific showtime
        const relevantBookings = seat.bookingSeats?.filter((bs) =>
          bs.status === 'BOOKED' &&
          bs.booking?.showtimeId === Number(showtimeId)
        ) || [];

        const isBooked = relevantBookings.length > 0;

        return {
          ...seat,
          isBooked,
          isSelected: false,
        };
      });
      setSeats(seatsWithStatus);
    }
  }, [seatsData, showtimeId]);
  
  const handleSeatClick = (seatId: number) => {
    const seat = seats.find(s => s.id === seatId);
    if (!seat || seat.isBooked) return;

    setSeats(prev => prev.map(s =>
      s.id === seatId
        ? { ...s, isSelected: !s.isSelected }
        : s
    ));

    setSelectedSeats(prev => {
      const isCurrentlySelected = prev.some(s => s.id === seatId);
      if (isCurrentlySelected) {
        return prev.filter(s => s.id !== seatId);
      } else {
        return [...prev, { ...seat, isSelected: true }];
      }
    });
  };

  const getTotalPrice = () => {
    const seatsTotal = selectedSeats.reduce((total, seat) => total + seat.price, 0);
    const showtimePrice = showtime?.price || 0;
    let totalPrice = seatsTotal + showtimePrice;

    // Peak hour surcharge logic
    if (showtime) {
      const showtimeDate = new Date(showtime.date);
      const showtimeTime = showtime.time;

      // Weekend (Friday = 5, Saturday = 6, Sunday = 0) or evening (after 18:00)
      const isPeakHour = showtimeDate.getDay() >= 5 || showtimeDate.getDay() === 0 || showtimeTime >= "18:00";

      if (isPeakHour) {
        totalPrice += 20000; // Peak hour surcharge 20,000 VND
      }
    }

    return totalPrice;
  };

  // Helper function to get peak hour surcharge
  const getPeakHourSurcharge = () => {
    if (!showtime) return 0;

    const showtimeDate = new Date(showtime.date);
    const showtimeTime = showtime.time;

    const isPeakHour = showtimeDate.getDay() >= 5 || showtimeDate.getDay() === 0 || showtimeTime >= "18:00";

    return isPeakHour ? 20000 : 0;
  };

  // Group seats by row
  const groupedSeats = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) {
      acc[seat.row] = [];
    }
    acc[seat.row].push(seat);
    return acc;
  }, {} as Record<string, SeatWithStatus[]>);

  const sortedRows = Object.keys(groupedSeats).sort();
  
  const handleProceedToCheckout = () => {
    if (selectedSeats.length > 0 && movie && theater && showtime) {
      const bookingData = {
        movieId: Number(params.movieId),
        showtimeId: showtime.id,
        seats: selectedSeats,
        totalPrice: getTotalPrice(),
        movie: movie,
        theater: theater,
        showtime: showtime,
      };

      // Store booking data in sessionStorage
      sessionStorage.setItem('bookingData', JSON.stringify(bookingData));

      // Navigate to checkout
      router.push('/checkout');
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
              <span>{movie.genres.map(g => g.genre.name).join(', ')}</span>
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
              <h2 className="text-xl font-semibold mb-6">Chọn ghế</h2>
              
              <div className="mb-6 px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-sm">
                  <p className="font-medium">Thông tin rạp chiếu phim:</p>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Rạp chiếu phim này có chỗ ngồi tiêu chuẩn ở hàng ghế đầu, chỗ ngồi cao cấp ở hàng ghế giữa và chỗ ngồi VIP ở hàng ghế sau với không gian để chân rộng rãi và khả năng ngả lưng.
                  </p>
                </div>
              </div>
              
              {/* Seat Map */}
              <div className="space-y-4">
                {/* Screen */}
                <div className="text-center mb-8">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-t-full h-4 w-3/4 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">MÀN HÌNH</p>
                </div>

                {/* Legend */}
                <div className="flex justify-center flex-wrap gap-4 mb-6 text-sm">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-gray-200 dark:bg-gray-600 rounded mr-2"></div>
                    <span className="text-gray-600 dark:text-gray-400">Tiêu chuẩn</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-yellow-400 rounded mr-2 relative">
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-600 rounded-full"></span>
                    </div>
                    <span className="text-gray-600 dark:text-gray-400">VIP</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-primary-500 rounded mr-2"></div>
                    <span className="text-gray-600 dark:text-gray-400">Đã chọn</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
                    <span className="text-gray-600 dark:text-gray-400">Đã đặt</span>
                  </div>
                </div>

                {/* Seats */}
                <div className="space-y-3">
                  {sortedRows.map(row => (
                    <div key={row} className="flex items-center justify-center space-x-2">
                      <div className="w-8 text-center text-sm font-medium text-gray-600 dark:text-gray-400">
                        {row}
                      </div>
                      <div className="flex space-x-1">
                        {groupedSeats[row]
                          .sort((a, b) => a.number - b.number)
                          .map(seat => {
                            // Find booking info for current showtime only
                            const currentShowtimeBooking = seat.bookingSeats?.find((bs) =>
                              bs.status === 'BOOKED' &&
                              bs.booking?.showtimeId === Number(showtimeId)
                            );
                            const isVIP = seat.type === 'VIP';

                            return (
                              <button
                                key={seat.id}
                                onClick={() => handleSeatClick(seat.id)}
                                disabled={seat.isBooked}
                                title={
                                  seat.isBooked && currentShowtimeBooking
                                    ? `Booked by ${currentShowtimeBooking.booking?.user?.firstName} ${currentShowtimeBooking.booking?.user?.lastName} - ${currentShowtimeBooking.booking?.bookingCode}`
                                    : `${seat.type} - ${(seat.price / 1000).toLocaleString()}k VND`
                                }
                                className={`w-8 h-8 rounded text-xs font-medium transition-colors relative ${
                                  seat.isBooked
                                    ? 'bg-red-500 text-white cursor-not-allowed'
                                    : seat.isSelected
                                    ? 'bg-primary-500 text-white'
                                    : isVIP
                                    ? 'bg-yellow-400 text-yellow-900 hover:bg-yellow-500'
                                    : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                                }`}
                              >
                                {seat.number}
                                {isVIP && !seat.isBooked && (
                                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-600 rounded-full"></span>
                                )}
                              </button>
                            );
                          })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p>Vui lòng chọn chỗ ngồi ưa thích của bạn từ sơ đồ chỗ ngồi ở trên.</p>
                    <p>Bạn có thể chọn nhiều chỗ ngồi bằng cách nhấp vào chúng.</p>
                  </div>
                  {selectedSeats.length > 0 && (
                    <button 
                      onClick={handleProceedToCheckout}
                      className="md:hidden bg-primary-600 hover:bg-primary-700 text-white py-2 px-6 rounded-full"
                    >
                      Tiếp tục thanh toán
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {/* Booking Summary */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Thông tin đặt vé
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Phim</span>
                    <span className="font-medium text-gray-900 dark:text-white">{movie.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Rạp chiếu phim</span>
                    <span className="font-medium text-gray-900 dark:text-white">{theater?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Ngày chiếu</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {showtime && new Date(showtime.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Giờ chiếu</span>
                    <span className="font-medium text-gray-900 dark:text-white">{showtime?.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Giá vé</span>
                    <span className="font-medium text-gray-900 dark:text-white">{formatPrice(showtime?.price)}</span>
                  </div>
                </div>

                {selectedSeats.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Chọn ghế ({selectedSeats.length})
                    </h4>
                    <div className="space-y-2">
                      {selectedSeats.map(seat => (
                        <div key={seat.id} className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            Hàng {seat.row}, Ghế {seat.number}
                            <span className={`ml-1 px-1 py-0.5 rounded text-xs ${
                              seat.type === 'VIP'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                            }`}>
                              {seat.type === 'VIP' ? 'VIP' : 'Tiêu chuẩn'}
                            </span>
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {formatPrice(seat.price)}
                          </span>
                        </div>
                      ))}
                      <div className="pt-2 border-t border-gray-200 dark:border-gray-700 space-y-2">
                        {/* Showtime Price */}
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Phí suất chiếu</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {formatPrice(showtime?.price || 0)}
                          </span>
                        </div>

                        {/* Seats Subtotal */}
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            Ghế ({selectedSeats.length})
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {formatPrice(selectedSeats.reduce((total, seat) => total + seat.price, 0))}
                          </span>
                        </div>

                        {/* Peak Hour Surcharge */}
                        {getPeakHourSurcharge() > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">
                              Phụ thu giờ cao điểm
                              <span className="text-xs block text-gray-500">
                                {showtime && (
                                  new Date(showtime.date).getDay() >= 5 || new Date(showtime.date).getDay() === 0
                                    ? 'Cuối tuần'
                                    : showtime.time >= "18:00"
                                    ? 'Buổi tối'
                                    : ''
                                )}
                              </span>
                            </span>
                            <span className="font-medium text-orange-600 dark:text-orange-400">
                              +{formatPrice(getPeakHourSurcharge())}
                            </span>
                          </div>
                        )}

                        {/* Total */}
                        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex justify-between font-bold text-gray-900 dark:text-white">
                            <span>Tổng cộng</span>
                            <span>{formatPrice(getTotalPrice())}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleProceedToCheckout}
                  disabled={selectedSeats.length === 0}
                  className="w-full mt-6 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Tiếp tục thanh toán
                </button>
              </div>
              
              <div className="mt-4 hidden md:block">
                <button
                  onClick={() => router.push(`/movies/${movie.id}`)}
                  className="w-full text-center py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Thay đổi thời gian chiếu
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 