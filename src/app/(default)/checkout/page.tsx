'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ChevronLeft, CreditCard, User, MapPin, Calendar, Clock } from 'lucide-react';
import { Movie, Theater, Showtime, Seat } from '@/types/global-type';
import formatPrice from '@/types/format-price';

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
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<'bank_transfer' | 'vnpay'>('bank_transfer');
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState<string>('');
  const [showQRModal, setShowQRModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Partial<CustomerInfo & { paymentProof: string }>>({});

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

  // Handle ESC key to close QR modal
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showQRModal) {
        setShowQRModal(false);
      }
    };

    if (showQRModal) {
      document.addEventListener('keydown', handleEscKey);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [showQRModal]);

  const validateForm = (): boolean => {
    const newErrors: Partial<CustomerInfo & { paymentProof: string }> = {};

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

    // Validate payment proof
    if (!paymentProof) {
      newErrors.paymentProof = 'Ảnh chuyển khoản là bắt buộc';
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file ảnh');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File ảnh không được vượt quá 5MB');
        return;
      }

      setPaymentProof(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPaymentProofPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Clear error
      if (errors.paymentProof) {
        setErrors(prev => ({ ...prev, paymentProof: undefined }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !bookingData) return;

    setIsProcessing(true);

    try {
      // Upload payment proof first
      let paymentProofUrl = '';
      if (paymentProof) {
        const formData = new FormData();
        formData.append('image', paymentProof);

        const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
          method: 'POST',
          body: formData,
        });

        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json();
          paymentProofUrl = uploadResult.url || uploadResult.data?.url || '';
        }
      }

      // Create booking via API
      // Option 1: Array of IDs (current)
      const seatIds = bookingData.seats.map(seat => seat.id);

      // Option 2: Array of objects (if API needs this format)
      // const seatIds = bookingData.seats.map(seat => ({ seatId: seat.id }));

      // Option 3: String array (if API needs strings)
      // const seatIds = bookingData.seats.map(seat => seat.id.toString());

      console.log('Seat IDs to send:', seatIds);
      console.log('Seat IDs type:', typeof seatIds[0]);

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

      const bookingPayload = {
        userId: 3, // TODO: Get from auth context
        showtimeId: bookingData.showtimeId,
        seatIds: validSeatIds,
        totalPrice: bookingData.totalPrice,
        paymentMethod: paymentMethod.toUpperCase(),
        images: paymentProofUrl,
        customerInfo,
      };

      console.log('Original seats data:', bookingData.seats);
      console.log('Creating booking with payload:', bookingPayload);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/booking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Authorization: `Bearer ${token?.accessToken}`,
        },
        body: JSON.stringify(bookingPayload),
      });

      const bookingResult = await response.json();

      if (!response.ok) {
        throw new Error(bookingResult.message || 'Đặt vé thất bại');
      }
      console.log('Booking created:', bookingResult);

      // Store confirmation data
      const confirmationData = {
        ...bookingData,
        customerInfo,
        paymentMethod,
        paymentProofUrl,
        bookingCode: bookingResult.data?.bookingCode || `BK${Date.now()}`,
        bookingDate: bookingResult.data?.bookingDate || new Date().toISOString(),
        bookingId: bookingResult.data?.id,
      };

      sessionStorage.setItem('confirmationData', JSON.stringify(confirmationData));
      sessionStorage.removeItem('bookingData');

      // Navigate to confirmation
      router.push('/confirmation');
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
                    { id: 'bank_transfer', label: 'Chuyển khoản ngân hàng', icon: '🏦' },
                    { id: 'vnpay', label: 'VNPay', icon: '💳' },
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
                      <span className="text-2xl mr-3">{method.icon}</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {method.label}
                      </span>
                    </label>
                  ))}
                </div>

                {/* QR Code for Bank Transfer */}
                {paymentMethod === 'bank_transfer' && (
                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">
                      Thông tin chuyển khoản
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium text-blue-700 dark:text-blue-300">Ngân hàng:</span>
                          <span className="ml-2 text-blue-600 dark:text-blue-400">Vietcombank</span>
                        </div>
                        <div>
                          <span className="font-medium text-blue-700 dark:text-blue-300">Số tài khoản:</span>
                          <span className="ml-2 text-blue-600 dark:text-blue-400">1234567890</span>
                        </div>
                        <div>
                          <span className="font-medium text-blue-700 dark:text-blue-300">Chủ tài khoản:</span>
                          <span className="ml-2 text-blue-600 dark:text-blue-400">MOVIE TIX</span>
                        </div>
                        <div>
                          <span className="font-medium text-blue-700 dark:text-blue-300">Số tiền:</span>
                          <span className="ml-2 text-blue-600 dark:text-blue-400 font-bold">
                            {(totalPrice / 1000).toLocaleString()}k VND
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-blue-700 dark:text-blue-300">Nội dung:</span>
                          <span className="ml-2 text-blue-600 dark:text-blue-400">
                            MOVIE {movie.title.substring(0, 10)}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-center">
                        <div className="bg-white p-4 rounded-lg shadow-md">
                          <div
                            className="relative w-32 h-32 sm:w-40 sm:h-40 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => setShowQRModal(true)}
                          >
                            <Image
                              src="https://res.cloudinary.com/dz6k5kcol/image/upload/v1752157602/payment_plrycn.jpg"
                              alt="QR Code for Payment"
                              fill
                              className="object-contain rounded"
                              sizes="(max-width: 640px) 128px, 160px"
                              priority
                            />
                          </div>
                          <p className="text-xs text-center text-gray-600 mt-2">
                            Bấm để phóng to QR code
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* VNPay Instructions */}
                {paymentMethod === 'vnpay' && (
                  <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">
                      Thanh toán VNPay
                    </h3>
                    <p className="text-sm text-orange-700 dark:text-orange-300">
                      Sau khi đặt vé, bạn sẽ được chuyển đến trang VNPay để thanh toán.
                      Vui lòng chụp ảnh màn hình kết quả thanh toán và tải lên bên dưới.
                    </p>
                  </div>
                )}
              </div>

              {/* Payment Proof Upload */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
                  Ảnh xác nhận thanh toán *
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tải lên ảnh chuyển khoản hoặc ảnh kết quả thanh toán
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    {errors.paymentProof && (
                      <p className="text-red-500 text-sm mt-1">{errors.paymentProof}</p>
                    )}
                  </div>

                  {/* Image Preview */}
                  {paymentProofPreview && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Xem trước ảnh:
                      </p>
                      <div className="relative inline-block">
                        <img
                          src={paymentProofPreview}
                          alt="Payment proof preview"
                          className="max-w-xs max-h-48 rounded-lg border border-gray-300 dark:border-gray-600"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setPaymentProof(null);
                            setPaymentProofPreview('');
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      <strong>Lưu ý:</strong> Vui lòng chụp ảnh rõ nét, đầy đủ thông tin giao dịch
                      bao gồm số tiền, thời gian và nội dung chuyển khoản.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Đang xử lý...' : `Hoàn tất đặt vé - ${(totalPrice / 1000).toLocaleString()}k VND`}
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

      {/* QR Code Modal */}
      {showQRModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowQRModal(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                QR Code Chuyển Khoản
              </h3>
              <button
                onClick={() => setShowQRModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex justify-center mb-4">
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="relative w-64 h-64">
                  <Image
                    src="https://res.cloudinary.com/dz6k5kcol/image/upload/v1752157602/payment_plrycn.jpg"
                    alt="QR Code chuyển khoản"
                    fill
                    className="object-contain"
                    sizes="256px"
                  />
                </div>
              </div>
            </div>

            <div className="text-center space-y-2">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Quét mã QR để chuyển khoản
              </p>
              <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <div><strong>Ngân hàng:</strong> Vietcombank</div>
                <div><strong>Số tài khoản:</strong> 1234567890</div>
                <div><strong>Chủ tài khoản:</strong> MOVIE TIX</div>
                <div><strong>Số tiền:</strong> {(totalPrice / 1000).toLocaleString()}k VND</div>
                <div><strong>Nội dung:</strong> MOVIE {movie.title.substring(0, 10)}</div>
              </div>
            </div>

            <button
              onClick={() => setShowQRModal(false)}
              className="w-full mt-6 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
