'use client';

import Image from 'next/image';
import { CheckCircle, Calendar, Clock, MapPin, X } from 'lucide-react';
import formatPrice from '@/types/format-price';

interface PageProps {
  params: {
    bookingCode: string;
  };
  searchParams: {
    title?: string;
    time?: string;
    price?: string;
    date?: string;
    paymentMethod?: string;
    bookingDate?: string;
    status?: string;
    totalPrice?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  };
}

export default function ConfirmationPage({ params, searchParams }: PageProps) {
  const bookingCode = params.bookingCode;
  const {
    title = '',
    time = '',
    price = '0',
    date = '',
    paymentMethod = '',
    bookingDate = '',
    totalPrice: totalPriceParam = '0',
    firstName = '',
    lastName = '',
    email = '',
    status = '',
  } = searchParams;

  // Use totalPrice from params or calculate from price
  const finalTotalPrice = totalPriceParam ? parseInt(totalPriceParam) : parseInt(price) * 1000;

  if (!bookingCode) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Không tìm thấy thông tin đặt vé
          </h1>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          {status === 'confirmed' ? (
            <>
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Đặt vé thành công!
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Cảm ơn bạn đã đặt vé. Thông tin chi tiết được gửi qua email.
              </p>
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="h-12 w-12 text-red-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Đặt vé thất bại!
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Vui lòng thử lại sau.
              </p>
            </>
          )}
        </div>

        {/* Booking Details */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden mb-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
            <div className="flex justify-between items-center text-white">
              <div>
                <h2 className="text-xl font-bold">Thông tin đặt vé</h2>
                <p className="text-primary-100">Mã đặt vé: {bookingCode}</p>
              </div>
              <div className="text-right">
                <p className="text-primary-100">Ngày đặt vé</p>
                <p className="font-semibold">{new Date(bookingDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Movie Info */}
            <div className="mb-6">
              <div className="font-semibold text-gray-900 dark:text-white mb-3">
                Thông tin phim
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Tên phim</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {title}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Ngày chiếu</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {new Date(date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                Thông tin khách hàng
              </h4>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Họ tên</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {firstName} {lastName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Email</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {email}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                Thông tin thanh toán
              </h4>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Phương thức thanh toán</span>
                    <span className="font-medium text-gray-900 dark:text-white capitalize">
                      {paymentMethod === 'VNPAY' ? 'VNPay' :
                        paymentMethod === 'MOMO' ? 'MoMo' :
                          paymentMethod}
                    </span>
                  </div>
                  <div className="space-y-2">
                
                    <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Tổng tiền</span>
                        <span className="font-bold text-lg text-primary-600">
                          {formatPrice(finalTotalPrice)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Status */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Đặt vé thành công
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Thanh toán {paymentMethod}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {/* <button
            onClick={() => window.print()}
            className="flex items-center justify-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
          >
            <CheckCircle className="h-5 w-5 mr-2" />
            In vé
          </button> */}

          <button
            onClick={() => window.location.href = '/'}
            className="flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Về trang chủ
          </button>
        </div>

        {/* Important Notes */}
        <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
            Lưu ý quan trọng:
          </h4>
          <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
            <li>• Vui lòng có mặt tại rạp ít nhất 15 phút trước giờ chiếu</li>
            <li>• Mang theo giấy tờ tùy thân hợp lệ để xác minh</li>
            <li>• Xuất trình xác nhận này hoặc vé đã tải về tại lối vào</li>
            <li>• Vé không được hoàn tiền và không thể chuyển nhượng</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
