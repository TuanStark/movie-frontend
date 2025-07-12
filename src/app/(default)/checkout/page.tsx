'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ChevronLeft, CreditCard, User, MapPin, Calendar, Clock } from 'lucide-react';
import { Movie, Theater, Showtime, Seat } from '@/types/global-type';
import formatPrice from '@/types/format-price';
import { useSession } from 'next-auth/react';

interface BookingData {
  movieId: number;
  showtimeId: number;
  seats: Seat[];
  totalPrice: number;
  movie: Movie;
  theater: Theater;
  showtime: Showtime;
}

interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const user = useSession();
  const userId = user.data?.user.id;
  const token = user.data?.user.accessToken;
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<'vnpay' | 'momo'>('vnpay');


  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Partial<CustomerInfo>>({});

  useEffect(() => {
    // Get booking data from sessionStorage
    const storedData = sessionStorage.getItem('bookingData');
    if (storedData) {
      setBookingData(JSON.parse(storedData));
    } else {
      // Redirect back if no booking data
      router.push('/movies');
    }
  }, [router]);
  const validateForm = (): boolean => {
    const newErrors: Partial<CustomerInfo> = {};

    if (!customerInfo.firstName.trim()) {
      newErrors.firstName = 'Họ là bắt buộc';
    }
    if (!customerInfo.lastName.trim()) {
      newErrors.lastName = 'Tên là bắt buộc';
    }
    if (!customerInfo.email.trim()) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    if (!customerInfo.phone.trim()) {
      newErrors.phone = 'Số điện thoại là bắt buộc';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !bookingData) return;

    setIsProcessing(true);

    try {
      const seatIds = bookingData.seats.map(seat => seat.id);

      // Validate seatIds
      if (!seatIds || seatIds.length === 0) {
        alert('Vui lòng chọn ít nhất một ghế');
        setIsProcessing(false);
        return;
      }

      // Ensure all seat IDs are valid integers > 0
      const validSeatIds = seatIds.filter(id => Number.isInteger(id) && id > 0);
      if (validSeatIds.length !== seatIds.length) {
        alert('Dữ liệu ghế không hợp lệ');
        setIsProcessing(false);
        return;
      }

      // Determine API endpoint based on payment method
      const apiEndpoint = paymentMethod === 'vnpay'
        ? `${process.env.NEXT_PUBLIC_API_URL}/booking/vnpay`
        : `${process.env.NEXT_PUBLIC_API_URL}/booking/momo`;
      // Create FormData for the API call (matching your curl example)
      const formData = new FormData();
      formData.append('userId', userId?.toString() || '');
      formData.append('showtimeId', bookingData.showtimeId.toString());
      formData.append('seatIds', JSON.stringify(validSeatIds));
      formData.append('paymentMethod', paymentMethod.toUpperCase());

      // Add customer info
      formData.append('customerInfo', JSON.stringify(customerInfo));

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const bookingResult = await response.json();

      if (!response.ok) {
        throw new Error(bookingResult.message || 'Đặt vé thất bại');
      }
      const paymentUrl = bookingResult.data?.payment?.vnpUrl ||
                        bookingResult.data?.payment?.momoUrl;

      if (paymentUrl) {
        // Store booking data for when user returns from payment
        const tempBookingData = {
          ...bookingData,
          customerInfo,
          paymentMethod,
          bookingCode: bookingResult.data?.booking?.bookingCode || `BK${Date.now()}`,
          bookingDate: bookingResult.data?.booking?.bookingDate || new Date().toISOString(),
          bookingId: bookingResult.data?.booking?.id,
          paymentId: bookingResult.data?.payment?.id,
        };

        sessionStorage.setItem('pendingBookingData', JSON.stringify(tempBookingData));

        // Redirect to our payment page with the payment URL
        router.push(paymentUrl);
        return;
      }

      // Create URL for confirmation page
      const bookingCode = bookingResult.data?.booking?.bookingCode || `BK${Date.now()}`;
      const confirmationParams = new URLSearchParams({
        title: bookingData.movie.title,
        posterPath: bookingData.movie.posterPath,
        time: bookingData.showtime.time,
        price: (bookingData.showtime.price / 1000).toString(),
        date: bookingData.showtime.date,
        paymentMethod: paymentMethod.toUpperCase(),
        bookingDate: bookingResult.data?.booking?.bookingDate || new Date().toISOString(),
        totalPrice: bookingData.totalPrice.toString(),
        firstName: customerInfo.firstName,
        lastName: customerInfo.lastName,
        email: customerInfo.email,
        status: 'confirmed'
      });

      sessionStorage.removeItem('bookingData');

      // Navigate to confirmation with bookingCode in path and other data in searchParams
      router.push(`/confirmation/${bookingCode}?${confirmationParams.toString()}`);
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Đặt vé thất bại. Vui lòng thử lại.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const { movie, theater, showtime, seats, totalPrice } = bookingData;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <ChevronLeft className="h-5 w-5 mr-2" />
              Back
            </button>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Checkout
            </h1>
            <div></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer Information */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Customer Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={customerInfo.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.firstName
                          ? 'border-red-500'
                          : 'border-gray-300 dark:border-gray-600'
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={customerInfo.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.lastName
                          ? 'border-red-500'
                          : 'border-gray-300 dark:border-gray-600'
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.email
                          ? 'border-red-500'
                          : 'border-gray-300 dark:border-gray-600'
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.phone
                          ? 'border-red-500'
                          : 'border-gray-300 dark:border-gray-600'
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Phương thức thanh toán
                </h2>

                <div className="space-y-3">
                  {[
                    {
                      id: 'vnpay',
                      label: 'VNPay',
                      icon: 'https://res.cloudinary.com/dz6k5kcol/image/upload/v1752237805/vnpay_pjdpfx.png',
                      description: 'Thanh toán qua ví điện tử VNPay'
                    },
                    {
                      id: 'momo',
                      label: 'MoMo',
                      icon: 'https://res.cloudinary.com/dz6k5kcol/image/upload/v1752237805/momo_nkf2wr.png',
                      description: 'Thanh toán qua ví điện tử MoMo'
                    },
                  ].map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === method.id
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value as any)}
                        className="sr-only"
                      />
                      <Image
                            src={method.icon}
                            alt="MoMo Logo"
                            width={48}
                            height={48}
                            className="object-contain mr-5"
                          />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {method.label}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {method.description}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                {/* VNPay Instructions */}
                {paymentMethod === 'vnpay' && (
                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">
                      Thanh toán VNPay
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Payment Info */}
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-sm">
                            <Image
                              src="https://res.cloudinary.com/dz6k5kcol/image/upload/v1752237805/vnpay_pjdpfx.png"
                              alt="VNPay Logo"
                              width={48}
                              height={48}
                              className="object-contain"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                              Số tiền: <span className="font-bold">{(totalPrice / 1000).toLocaleString()}k VND</span>
                            </p>
                            <p className="text-xs text-blue-600 dark:text-blue-400">
                              Thanh toán an toàn qua ví điện tử VNPay
                            </p>
                          </div>
                        </div>

                        {/* Payment Details */}
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium text-blue-700 dark:text-blue-300">Ngân hàng:</span>
                            <span className="ml-2 text-blue-600 dark:text-blue-400">VNPay QR</span>
                          </div>
                          <div>
                            <span className="font-medium text-blue-700 dark:text-blue-300">Số tiền:</span>
                            <span className="ml-2 text-blue-600 dark:text-blue-400 font-bold">
                              {(totalPrice).toLocaleString()} VND
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-blue-700 dark:text-blue-300">Nội dung:</span>
                            <span className="ml-2 text-blue-600 dark:text-blue-400">
                              MOVIE {movie.title.substring(0, 10)}
                            </span>
                          </div>
                        </div>

                        <div className="bg-blue-100 dark:bg-blue-800/30 p-3 rounded-lg">
                          <p className="text-sm text-blue-700 dark:text-blue-300">
                            <strong>Hướng dẫn:</strong> Nhấn nút "Thanh toán VNPay" bên dưới để chuyển đến trang thanh toán VNPay.
                            Sau khi thanh toán thành công, bạn sẽ được chuyển về trang xác nhận.
                          </p>
                        </div>
                      </div>

                      {/* VNPay Action */}
                      <div className="flex justify-center">
                        <div className="bg-white p-6 rounded-lg shadow-md text-center">
                          <div className="w-24 h-24 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                            <Image
                              src="https://res.cloudinary.com/dz6k5kcol/image/upload/v1752237805/vnpay_pjdpfx.png"
                              alt="VNPay Logo"
                              width={48}
                              height={48}
                              className="object-contain"
                            />
                          </div>
                          <h4 className="font-semibold text-gray-900 mb-2">
                            Thanh toán VNPay
                          </h4>
                          <p className="text-sm text-gray-600 mb-4">
                            Nhấn "Thanh toán VNPay" để chuyển đến trang thanh toán an toàn
                          </p>
                          <div className="text-lg font-bold text-blue-600">
                            {(totalPrice / 1000).toLocaleString()}k VND
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* MoMo Instructions */}
                {paymentMethod === 'momo' && (
                  <div className="mt-6 p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                    <h3 className="font-semibold text-pink-800 dark:text-pink-200 mb-3">
                      Thanh toán MoMo
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Payment Info */}
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-sm">
                            <Image
                              src="https://res.cloudinary.com/dz6k5kcol/image/upload/v1752237805/momo_nkf2wr.png"
                              alt="MoMo Logo"
                              width={48}
                              height={48}
                              className="object-contain"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-pink-700 dark:text-pink-300 font-medium">
                              Số tiền: <span className="font-bold">{(totalPrice / 1000).toLocaleString()}k VND</span>
                            </p>
                            <p className="text-xs text-pink-600 dark:text-pink-400">
                              Thanh toán nhanh chóng qua ví điện tử MoMo
                            </p>
                          </div>
                        </div>

                        {/* Payment Details */}
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium text-pink-700 dark:text-pink-300">Ví điện tử:</span>
                            <span className="ml-2 text-pink-600 dark:text-pink-400">MoMo QR</span>
                          </div>
                          <div>
                            <span className="font-medium text-pink-700 dark:text-pink-300">Số tiền:</span>
                            <span className="ml-2 text-pink-600 dark:text-pink-400 font-bold">
                              {(totalPrice).toLocaleString()} VND
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-pink-700 dark:text-pink-300">Nội dung:</span>
                            <span className="ml-2 text-pink-600 dark:text-pink-400">
                              MOVIE {movie.title.substring(0, 10)}
                            </span>
                          </div>
                        </div>

                        <div className="bg-pink-100 dark:bg-pink-800/30 p-3 rounded-lg">
                          <p className="text-sm text-pink-700 dark:text-pink-300">
                            <strong>Hướng dẫn:</strong> Nhấn nút "Thanh toán MoMo" bên dưới để chuyển đến ứng dụng MoMo.
                            Sau khi thanh toán thành công, bạn sẽ được chuyển về trang xác nhận.
                          </p>
                        </div>
                      </div>

                      {/* MoMo Action */}
                      <div className="flex justify-center">
                        <div className="bg-white p-6 rounded-lg shadow-md text-center">
                          <div className="w-24 h-24 mx-auto mb-4 bg-pink-100 rounded-full flex items-center justify-center">
                            <Image
                              src="https://res.cloudinary.com/dz6k5kcol/image/upload/v1752237805/momo_nkf2wr.png"
                              alt="MoMo Logo"
                              width={48}
                              height={48}
                              className="object-contain"
                            />
                          </div>
                          <h4 className="font-semibold text-gray-900 mb-2">
                            Thanh toán MoMo
                          </h4>
                          <p className="text-sm text-gray-600 mb-4">
                            Nhấn "Thanh toán MoMo" để chuyển đến ứng dụng MoMo
                          </p>
                          <div className="text-lg font-bold text-pink-600">
                            {(totalPrice / 1000).toLocaleString()}k VND
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing
                  ? 'Đang xử lý...'
                  : `Thanh toán ${paymentMethod.toUpperCase()} - ${(totalPrice / 1000).toLocaleString()}k VND`
                }
              </button>
            </form>
          </div>

          {/* Order Summary */}
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
        </div>
      </div>


    </main>
  );
}
