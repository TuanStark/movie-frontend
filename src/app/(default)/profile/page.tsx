"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { UserCircle, Calendar, Ticket, Settings, LogOut, Trash } from "lucide-react";
import Navbar from "@/components/Navbar";
import { User, Booking, Movie, Theater, users, bookings, movies, theaters } from "@/lib/mock-data";
import { signOut } from "next-auth/react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  
  const [user, setUser] = useState<User | null>(null);
  const [userBookings, setUserBookings] = useState<(Booking & { movie: Movie; theater: Theater })[]>([]);
  const [activeTab, setActiveTab] = useState<"bookings" | "settings">("bookings");
  
  useEffect(() => {
    // If not authenticated, redirect to login
    if (status === "unauthenticated") {
      redirect("/auth/login?callbackUrl=/profile");
    }
    
    // If authenticated, find the user and their bookings
    if (status === "authenticated" && session?.user?.email) {
      const foundUser = users.find(u => u.email === session.user.email);
      if (foundUser) {
        setUser(foundUser);
        
        // Get user bookings and add movie and theater data
        const userBookingsWithDetails = bookings
          .filter(booking => booking.userId === foundUser.id)
          .map(booking => {
            const movie = movies.find(m => m.id === booking.movieId) || movies[0];
            const showtime = booking.showtimeId ? { id: booking.showtimeId } : null;
            const theater = showtime ? 
              theaters.find(t => t.id === theaters.find(t => t.id === 1)?.id) || theaters[0] : 
              theaters[0];
              
            return {
              ...booking,
              movie,
              theater
            };
          });
          
        setUserBookings(userBookingsWithDetails);
      }
    }
  }, [status, session]);
  
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };
  
  const handleDeleteBooking = (bookingId: number) => {
    // In a real app, you would make an API call to delete the booking
    setUserBookings(prev => prev.filter(b => b.id !== bookingId));
  };
  
  // Loading state
  if (status === "loading" || !user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* <Navbar /> */}
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          Loading profile...
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative h-24 w-24 md:h-32 md:w-32 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
              {user.avatar ? (
                <Image 
                  src={user.avatar} 
                  alt={`${user.firstName} ${user.lastName}`}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <UserCircle className="h-20 w-20 md:h-24 md:w-24 text-gray-400" />
                </div>
              )}
            </div>
            
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
              <p className="mt-1 inline-block px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                {user.role === "admin" ? "Admin" : "Member"}
              </p>
              
              <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-4">
                <button 
                  onClick={() => setActiveTab("bookings")} 
                  className={`flex items-center gap-1 px-4 py-2 rounded-md ${
                    activeTab === "bookings" 
                      ? "bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200" 
                      : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  <Ticket className="h-4 w-4" />
                  <span>My Bookings</span>
                </button>
                <button 
                  onClick={() => setActiveTab("settings")} 
                  className={`flex items-center gap-1 px-4 py-2 rounded-md ${
                    activeTab === "settings" 
                      ? "bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200" 
                      : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </button>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-1 px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-700 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Content Area */}
        {activeTab === "bookings" && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">My Bookings</h2>
            
            {userBookings.length === 0 ? (
              <div className="text-center py-8">
                <Ticket className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium">No Bookings Yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  You haven't booked any movie tickets yet
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {userBookings.map(booking => (
                  <div 
                    key={booking.id} 
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex flex-col md:flex-row gap-4"
                  >
                    <div className="flex items-center">
                      <div className="relative h-16 w-12 flex-shrink-0 mr-4 rounded overflow-hidden">
                        <Image
                          src={booking.movie.posterPath}
                          alt={booking.movie.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{booking.movie.title}</h3>
                      <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mt-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{new Date(booking.bookingDate).toLocaleDateString()}</span>
                      </div>
                      <div className="mt-2 space-y-1">
                        <p>
                          <span className="font-medium">Theater:</span>{" "}
                          {booking.theater.name}
                        </p>
                        <p>
                          <span className="font-medium">Seats:</span>{" "}
                          {booking.seats.join(", ")}
                        </p>
                        <p>
                          <span className="font-medium">Booking ID:</span>{" "}
                          <span className="font-mono">{booking.bookingId}</span>
                        </p>
                        <p>
                          <span className="font-medium">Total:</span>{" "}
                          ${booking.totalPrice.toFixed(2)}
                        </p>
                      </div>
                      
                      <div className="mt-4 flex gap-2 justify-end">
                        <button 
                          onClick={() => handleDeleteBooking(booking.id)}
                          className="flex items-center gap-1 px-3 py-1 text-sm rounded-md bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                        >
                          <Trash className="h-4 w-4" />
                          <span>Cancel</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {activeTab === "settings" && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Account Settings</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={user.firstName}
                      disabled
                      className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={user.lastName}
                      disabled
                      className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-medium mb-3">Password</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      placeholder="Enter current password"
                      className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <button 
                    className="btn-primary"
                    onClick={() => alert('Password change functionality would be implemented in a real app')}
                  >
                    Update Password
                  </button>
                </div>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-medium mb-3">Preferences</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      id="email-notifications"
                      type="checkbox"
                      checked
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded"
                    />
                    <label htmlFor="email-notifications" className="ml-2 block text-gray-700 dark:text-gray-300">
                      Receive email notifications for new movie releases
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="promo-notifications"
                      type="checkbox"
                      checked
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded"
                    />
                    <label htmlFor="promo-notifications" className="ml-2 block text-gray-700 dark:text-gray-300">
                      Receive promotional offers and discounts
                    </label>
                  </div>
                </div>
                
                <div className="mt-4">
                  <button 
                    className="btn-primary"
                    onClick={() => alert('Preference update functionality would be implemented in a real app')}
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 