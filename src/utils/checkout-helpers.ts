// Checkout helper functions

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface BookingData {
  movieId: number;
  showtimeId: number;
  seats: any[];
  totalPrice: number;
  movie: any;
  theater: any;
  showtime: any;
}

// Validation
export const validateCustomerInfo = (customerInfo: CustomerInfo): Partial<CustomerInfo> => {
  const errors: Partial<CustomerInfo> = {};
  
  if (!customerInfo.firstName.trim()) {
    errors.firstName = 'Họ là bắt buộc';
  }
  
  if (!customerInfo.lastName.trim()) {
    errors.lastName = 'Tên là bắt buộc';
  }
  
  if (!customerInfo.email.trim()) {
    errors.email = 'Email là bắt buộc';
  } else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) {
    errors.email = 'Email không hợp lệ';
  }
  
  if (!customerInfo.phone.trim()) {
    errors.phone = 'Số điện thoại là bắt buộc';
  } else if (!/^[0-9]{10,11}$/.test(customerInfo.phone.replace(/\s/g, ''))) {
    errors.phone = 'Số điện thoại không hợp lệ';
  }
  
  return errors;
};

// API helpers
export const createBookingFormData = (
  userId: string | undefined,
  bookingData: BookingData,
  paymentMethod: string,
  customerInfo: CustomerInfo
): FormData => {
  const seatIds = bookingData.seats.map(seat => seat.id);
  const formData = new FormData();
  
  formData.append('userId', userId?.toString() || '');
  formData.append('showtimeId', bookingData.showtimeId.toString());
  formData.append('seatIds', JSON.stringify(seatIds));
  formData.append('paymentMethod', paymentMethod.toUpperCase());
  formData.append('customerInfo', JSON.stringify(customerInfo));
  
  return formData;
};

export const getBookingApiEndpoint = (paymentMethod: string): string => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  return paymentMethod === 'vnpay' 
    ? `${baseUrl}/booking/vnpay`
    : `${baseUrl}/booking/momo`;
};

// URL helpers
export const createConfirmationUrl = (
  bookingCode: string,
  bookingData: BookingData,
  customerInfo: CustomerInfo,
  paymentMethod: string
): string => {
  const params = new URLSearchParams({
    title: bookingData.movie.title,
    posterPath: bookingData.movie.posterPath,
    time: bookingData.showtime.time,
    price: (bookingData.showtime.price / 1000).toString(),
    date: bookingData.showtime.date,
    paymentMethod: paymentMethod.toUpperCase(),
    totalPrice: bookingData.totalPrice.toString(),
    firstName: customerInfo.firstName,
    lastName: customerInfo.lastName,
    email: customerInfo.email,
    status: 'confirmed'
  });
  
  return `/confirmation/${bookingCode}?${params.toString()}`;
};

// Price calculations
export const calculatePeakHourSurcharge = (date: string, time: string): number => {
  const showDate = new Date(date);
  const isWeekend = showDate.getDay() >= 5 || showDate.getDay() === 0;
  const isEvening = time >= '18:00';
  
  return (isWeekend || isEvening) ? 20000 : 0;
};

export const calculateTotalPrice = (
  showtimePrice: number,
  seats: any[],
  date: string,
  time: string
): number => {
  const seatTotal = seats.reduce((total, seat) => total + seat.price, 0);
  const peakSurcharge = calculatePeakHourSurcharge(date, time);
  
  return showtimePrice + seatTotal + peakSurcharge;
};
