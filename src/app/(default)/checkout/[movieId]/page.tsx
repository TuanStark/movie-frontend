"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { User, Mail, Phone, CheckCircle } from "lucide-react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import BookingSummary from "@/components/BookingSummary";
import BackgroundGradient from "@/components/BackgroundGradient";
import { 
  Movie, Showtime, Theater, Seat, 
  movies, theaters, showtimes, sampleSeats 
} from "@/lib/mock-data";

interface PageProps {
  params: {
    movieId: string;
  };
}

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

type PaymentMethod = 'bank_transfer' | 'vnpay' | null;

export default function CheckoutPage({ params }: PageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const showtimeId = searchParams.get('showtimeId');
  const seatIds = searchParams.get('seats')?.split(',') || [];
  
  const [movie, setMovie] = useState<Movie | null>(null);
  const [theater, setTheater] = useState<Theater | null>(null);
  const [showtime, setShowtime] = useState<Showtime | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  
  const [formState, setFormState] = useState<FormState>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  
  const [errors, setErrors] = useState<Partial<FormState & { payment: string }>>({});
  
  useEffect(() => {
    const movieId = Number(params.movieId);
    const foundMovie = movies.find(m => m.id === movieId);
    
    if (foundMovie) {
      setMovie(foundMovie);
      
      // Find showtime and theater
      if (showtimeId) {
        const foundShowtime = showtimes.find(s => s.id === Number(showtimeId));
        if (foundShowtime) {
          setShowtime(foundShowtime);
          
          const foundTheater = theaters.find(t => t.id === foundShowtime.theaterId);
          if (foundTheater) {
            setTheater(foundTheater);
          }
        }
      }
      
      // Find selected seats
      if (seatIds.length > 0) {
        const foundSeats = sampleSeats.filter(seat => seatIds.includes(seat.id));
        setSelectedSeats(foundSeats);
      }
    }
  }, [params.movieId, showtimeId, seatIds]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name as keyof FormState]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Partial<FormState & { payment: string }> = {};
    
    if (!formState.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    
    if (!formState.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    
    if (!formState.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
      newErrors.email = "Email address is invalid";
    }
    
    if (!formState.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10,15}$/.test(formState.phone.replace(/\D/g, ''))) {
      newErrors.phone = "Phone number is invalid";
    }
    
    if (!paymentMethod) {
      newErrors.payment = "Please select a payment method";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // In a real app, you'd submit this data to your backend
      // For now, just navigate to confirmation
      router.push(`/confirmation/${params.movieId}?showtimeId=${showtimeId}&seats=${seatIds.join(',')}&payment=${paymentMethod}`);
    }
  };
  
  if (!movie || !theater || !showtime || selectedSeats.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <BackgroundGradient />
        {/* <Navbar /> */}
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          Loading checkout information...
        </div>
      </div>
    );
  }
  
  const calculateTotal = () => {
    const subtotal = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
    const convenienceFee = selectedSeats.length * 1.5; // $1.50 per ticket
    return (subtotal + convenienceFee).toFixed(2);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <BackgroundGradient />
      {/* <Navbar /> */}
      
      <div className="pt-8 pb-16 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start md:flex-row md:items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Checkout</h1>
          
          {movie && (
            <div className="flex items-center mt-4 md:mt-0">
              <div className="h-12 w-8 relative flex-shrink-0">
                <Image
                  src={movie.posterPath}
                  alt={movie.title}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <div>
                <h3 className="font-medium">{movie.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {theater?.name} • {new Date(showtime?.date || "").toLocaleDateString()} • {showtime?.time}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form column */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6">Contact Information</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* First Name */}
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      First Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        placeholder="Enter first name"
                        className={`block w-full pl-10 pr-3 py-2 rounded-md border ${
                          errors.firstName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500`}
                        value={formState.firstName}
                        onChange={handleInputChange}
                      />
                    </div>
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                    )}
                  </div>
                  
                  {/* Last Name */}
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Last Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        placeholder="Enter last name"
                        className={`block w-full pl-10 pr-3 py-2 rounded-md border ${
                          errors.lastName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500`}
                        value={formState.lastName}
                        onChange={handleInputChange}
                      />
                    </div>
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                    )}
                  </div>
                  
                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter email address"
                        className={`block w-full pl-10 pr-3 py-2 rounded-md border ${
                          errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500`}
                        value={formState.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>
                  
                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        placeholder="Enter phone number"
                        className={`block w-full pl-10 pr-3 py-2 rounded-md border ${
                          errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500`}
                        value={formState.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                    )}
                  </div>
                </div>
                
                {/* Payment Methods */}
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-semibold mb-6">Payment Method</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Bank Transfer */}
                    <div 
                      className={`p-4 border rounded-xl cursor-pointer transition-all ${
                        paymentMethod === 'bank_transfer' 
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                          : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                      }`}
                      onClick={() => setPaymentMethod('bank_transfer')}
                    >
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                          paymentMethod === 'bank_transfer' 
                            ? 'border-primary-500' 
                            : 'border-gray-400'
                        }`}>
                          {paymentMethod === 'bank_transfer' && (
                            <div className="w-3 h-3 rounded-full bg-primary-500"></div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium">Bank Transfer</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Transfer directly to our bank account
                          </p>
                        </div>
                      </div>
                      
                      {paymentMethod === 'bank_transfer' && (
                        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <p className="text-sm font-medium">Bank account details:</p>
                          <div className="mt-2 text-sm">
                            <p>Bank: <span className="font-medium">Vietcombank</span></p>
                            <p>Account number: <span className="font-medium">0123456789</span></p>
                            <p>Account name: <span className="font-medium">MOVIE TICKETS JSC</span></p>
                            <p>Content: <span className="font-medium">Payment for #{Math.floor(100000 + Math.random() * 900000)}</span></p>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            Please transfer the exact amount shown in your booking summary. 
                            Your seats will be reserved for 15 minutes.
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {/* VNPay */}
                    <div 
                      className={`p-4 border rounded-xl cursor-pointer transition-all ${
                        paymentMethod === 'vnpay' 
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                          : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                      }`}
                      onClick={() => setPaymentMethod('vnpay')}
                    >
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                          paymentMethod === 'vnpay' 
                            ? 'border-primary-500' 
                            : 'border-gray-400'
                        }`}>
                          {paymentMethod === 'vnpay' && (
                            <div className="w-3 h-3 rounded-full bg-primary-500"></div>
                          )}
                        </div>
                        <div className="flex items-center">
                          <div className="mr-2">
                            <Image
                              src="https://res.cloudinary.com/dz6k5kcol/image/upload/v1752157602/payment_plrycn.jpg"
                              alt="VNPay"
                              width={50}
                              height={25}
                              className="object-contain"
                            />
                          </div>
                          <div className="flex-shrink-0">
                            <Image
                              src="/images/vnpay-logo.png"
                              alt="VNPay"
                              width={50}
                              height={25}
                              className="object-contain"
                            />
                          </div>
                        </div>
                      </div>
                      
                      {paymentMethod === 'vnpay' && (
                        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="flex justify-center mb-3">
                            <div className="w-32 h-32 bg-white p-2 rounded-lg flex items-center justify-center">
                              {/* Mock QR code */}
                              <div className="w-full h-full grid grid-cols-4 grid-rows-4 gap-1">
                                {Array.from({ length: 16 }).map((_, i) => (
                                  <div 
                                    key={i}
                                    className={`${
                                      [0, 1, 4, 5, 10, 11, 14, 15].includes(i) 
                                        ? 'bg-black' 
                                        : 'bg-white border border-gray-200'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <p className="text-center text-sm">
                            Scan this QR code with your VNPay app or banking app
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                            You will be redirected to VNPay payment gateway after clicking "Complete Booking"
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {errors.payment && (
                    <p className="mt-2 text-sm text-red-500">{errors.payment}</p>
                  )}
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="submit"
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-medium flex items-center justify-center"
                  >
                    <CheckCircle size={20} className="mr-2" />
                    Complete Booking - ${calculateTotal()}
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          {/* Summary column */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <BookingSummary
                selectedSeats={selectedSeats}
                movieTitle={movie?.title}
                theater={theater?.name}
                showtime={showtime?.time}
                date={showtime?.date}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 