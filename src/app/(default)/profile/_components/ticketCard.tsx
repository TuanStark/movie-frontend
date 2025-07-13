import { Bookings } from "@/types/global-type";
import { Calendar, Trash } from "lucide-react";

interface TicketCardProps {
    booking: any;
    handleDeleteBooking: (bookingId: number) => void;
}

export default function TicketCard({ booking, handleDeleteBooking }: TicketCardProps) {
    return (
        <div
            key={booking.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
        >
            <div className="flex flex-col space-y-3">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-semibold">Đặt vé #{booking.id}</h3>
                        <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mt-1">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{new Date(booking.bookingDate).toLocaleDateString('vi-VN')}</span>
                        </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${booking.status === 'CONFIRMED'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : booking.status === 'CANCELLED'
                                ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                        }`}>
                        {booking.status === 'CONFIRMED' ? 'Đã xác nhận' :
                            booking.status === 'CANCLED' ? 'Đã hủy' : 'Chờ xác nhận'}
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Suất chiếu:</span>
                        <span className="ml-2">#{booking.showtimeId}</span>
                    </div>
                    <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Phương thức thanh toán:</span>
                        <span className="ml-2">{booking.paymentMethod || 'Chưa xác định'}</span>
                    </div>
                    <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Mã booking:</span>
                        <span className="ml-2 font-mono">{booking.bookingCode || `BK${booking.id}`}</span>
                    </div>
                    <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Tổng tiền:</span>
                        <span className="ml-2 font-semibold text-primary-600">
                            {booking.totalPrice?.toLocaleString('vi-VN')} VNĐ
                        </span>
                    </div>
                </div>

                {booking.status !== 'cancelled' && (
                    <div className="flex gap-2 justify-end pt-2 border-t border-gray-100 dark:border-gray-700">
                        <button
                            onClick={() => handleDeleteBooking(booking.id)}
                            className="flex items-center gap-1 px-3 py-1 text-sm rounded-md bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                        >
                            <Trash className="h-4 w-4" />
                            <span>Hủy vé</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
