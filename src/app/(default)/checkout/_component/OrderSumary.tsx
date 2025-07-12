import Image from 'next/image';
import { MapPin, Calendar, Clock } from 'lucide-react';
import formatPrice from '@/types/format-price';
import { Movie, Theater, Showtime, Seat } from '@/types/global-type';

interface OrderSummaryProps {
  movie: Movie;
  theater: Theater;
  showtime: Showtime;
  seats: Seat[];
  totalPrice: number;
}

export default function OrderSummary({ movie, theater, showtime, seats, totalPrice }: OrderSummaryProps) {
    return (
        <>
            <div className="lg:col-span-1">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
                        Thông tin đơn hàng
                    </h2>

                    {/* Movie Info */}
                    <div className="flex items-start space-x-4 mb-6">
                        <div className="w-16 h-24 relative flex-shrink-0">
                            <Image
                                src={movie.posterPath}
                                alt={movie.title}
                                fill
                                className="object-cover rounded-lg"
                            />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                                {movie.title}
                            </h3>
                            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
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
                            Ghế đã chọn ({seats.length})
                        </h4>
                        <div className="space-y-2">
                            {seats.map(seat => (
                                <div key={seat.id} className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">
                                        Hàng {seat.row}, Ghế {seat.number}
                                    </span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {formatPrice(seat.price)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Price Breakdown */}
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                        {/* Showtime Fee */}
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">
                                Phí suất chiếu
                            </span>
                            <span className="font-medium text-gray-900 dark:text-white">
                                {formatPrice(showtime.price)}
                            </span>
                        </div>

                        {/* Seats Subtotal */}
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">
                                Ghế ({seats.length})
                            </span>
                            <span className="font-medium text-gray-900 dark:text-white">
                                {formatPrice(seats.reduce((total, seat) => total + seat.price, 0))}
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
                                            Phụ thu giờ cao điểm
                                            <span className="text-xs block text-gray-500">
                                                {showtimeDate.getDay() >= 5 || showtimeDate.getDay() === 0
                                                    ? 'Cuối tuần'
                                                    : showtimeTime >= "18:00"
                                                        ? 'Buổi tối'
                                                        : ''
                                                }
                                            </span>
                                        </span>
                                        <span className="font-medium text-orange-600 dark:text-orange-400">
                                            +20.000 VND
                                        </span>
                                    </div>
                                );
                            }
                            return null;
                        })()}

                        {/* Total */}
                        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-bold text-gray-900 dark:text-white">
                                    Tổng cộng
                                </span>
                                <span className="text-lg font-bold text-primary-600">
                                    {formatPrice(totalPrice)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}