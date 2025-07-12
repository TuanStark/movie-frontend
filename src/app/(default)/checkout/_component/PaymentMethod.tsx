'use client';

import Image from 'next/image';
import { CreditCard } from 'lucide-react';
interface PaymentMethodProps {
  paymentMethod: 'vnpay' | 'momo' | 'bank_transfer' | null;
  totalPrice: number;
  movie: { title: string; [key: string]: any };
  onPaymentMethodChange: (method: 'vnpay' | 'momo' | 'bank_transfer') => void;
  includeBankTransfer?: boolean;
  errors?: { payment?: string };
}

export default function PaymentMethod({
  paymentMethod,
  totalPrice,
  movie,
  onPaymentMethodChange,
  includeBankTransfer = false,
  errors
}: PaymentMethodProps) {
  const paymentMethods = [
    ...(includeBankTransfer ? [{
      id: 'bank_transfer' as const,
      label: 'Bank Transfer',
      icon: null,
      description: 'Transfer directly to our bank account'
    }] : []),
    {
      id: 'vnpay' as const,
      label: 'VNPay',
      icon: 'https://res.cloudinary.com/dz6k5kcol/image/upload/v1752237805/vnpay_pjdpfx.png',
      description: 'Thanh toán qua ví điện tử VNPay'
    },
    {
      id: 'momo' as const,
      label: 'MoMo',
      icon: 'https://res.cloudinary.com/dz6k5kcol/image/upload/v1752237805/momo_nkf2wr.png',
      description: 'Thanh toán qua ví điện tử MoMo'
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center">
        <CreditCard className="h-5 w-5 mr-2" />
        Phương thức thanh toán
      </h2>

      <div className="space-y-3">
        {paymentMethods.map((method) => (
          <label
            key={method.id}
            className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
              paymentMethod === method.id
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={method.id}
              checked={paymentMethod === method.id}
              onChange={(e) => onPaymentMethodChange(e.target.value as any)}
              className="sr-only"
            />
            {method.icon ? (
              <Image
                src={method.icon}
                alt={`${method.label} Logo`}
                width={48}
                height={48}
                className="object-contain mr-5"
              />
            ) : (
              <div className="w-12 h-12 mr-5 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">
                <CreditCard className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </div>
            )}
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

      {/* Bank Transfer Instructions */}
      {paymentMethod === 'bank_transfer' && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-sm font-medium mb-3">Bank account details:</p>
          <div className="text-sm space-y-1">
            <p>Bank: <span className="font-medium">Vietcombank</span></p>
            <p>Account number: <span className="font-medium">0123456789</span></p>
            <p>Account name: <span className="font-medium">MOVIE TICKETS JSC</span></p>
            <p>Content: <span className="font-medium">Payment for #{Math.floor(100000 + Math.random() * 900000)}</span></p>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
            Please transfer the exact amount shown in your booking summary.
            Your seats will be reserved for 15 minutes.
          </p>
        </div>
      )}

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

      {/* Error Display */}
      {errors?.payment && (
        <p className="mt-2 text-sm text-red-500">{errors.payment}</p>
      )}
    </div>
  );
}
