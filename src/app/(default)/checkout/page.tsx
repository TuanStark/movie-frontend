'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { useSession } from 'next-auth/react';
import {
  validateCustomerInfo,
  createBookingFormData,
  getBookingApiEndpoint,
  createConfirmationUrl,
  type CustomerInfo,
  type BookingData
} from '../../../utils/checkout-helpers';
import OrderSummary from './_component/OrderSumary';
import CustomerInformation from './_component/CustomerInformation';
import PaymentMethod from './_component/PaymentMethod';

export default function CheckoutPage() {
  // Hooks
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const token = session?.user?.accessToken;

  // State
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


  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form using helper
    const validationErrors = validateCustomerInfo(customerInfo);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (!bookingData) return;
    setIsProcessing(true);

    try {
      // Use helper functions
      const apiEndpoint = getBookingApiEndpoint(paymentMethod);
      const formData = createBookingFormData(userId, bookingData, paymentMethod, customerInfo);

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

      // Create confirmation URL using helper
      const bookingCode = bookingResult.data?.booking?.bookingCode || `BK${Date.now()}`;
      const confirmationUrl = createConfirmationUrl(bookingCode, bookingData, customerInfo, paymentMethod);

      sessionStorage.removeItem('bookingData');

      // Navigate to confirmation
      router.push(confirmationUrl);
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
              <CustomerInformation
                customerInfo={customerInfo}
                errors={errors}
                onInputChange={handleInputChange}
              />

              {/* Payment Method */}
              <PaymentMethod
                paymentMethod={paymentMethod}
                totalPrice={totalPrice}
                movie={movie}
                onPaymentMethodChange={(method) => {
                  if (method === 'vnpay' || method === 'momo') {
                    setPaymentMethod(method);
                  }
                }}
              />

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
          <OrderSummary
            movie={movie}
            theater={theater}
            showtime={showtime}
            seats={seats}
            totalPrice={totalPrice} />
        </div>
      </div>


    </main>
  );
}
