"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { UserCircle, Calendar, Ticket, Settings, LogOut, Trash } from "lucide-react";
import { Users } from "@/types/global-type";
import { signOut } from "next-auth/react";
import TicketCard from "./_components/ticketCard";

export default function ProfilePage() {
  const { data: session, status } = useSession();

  const [user, setUser] = useState<Users | null>(null);
  const [userBookings, setUserBookings] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"bookings" | "settings">("settings");

  const fetchUser = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/${session?.user?.id}`, {
        headers: {
          Authorization: `Bearer ${session?.user?.accessToken}`
        }
      });
      const data = await res.json();
      setUser(data.data);
      // Set user bookings from the API response
      if (data.data?.bookings) {
        setUserBookings(data.data.bookings);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login?callbackUrl=/profile");
    }

    if (status === "authenticated" && session?.user?.id) {
      fetchUser();
    }
  }, [status, session]);

  const handleLogout = async () => {

    try {
      const result = await signOut({
        callbackUrl: "/",
        redirect: false
      });


      if (result?.url) {
        window.location.href = result.url;
      } else {
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Profile logout error:", error);
      window.location.href = "/";
    }
  };

  const handleDeleteBooking = (bookingId: number) => {
    // In a real app, you would make an API call to delete the booking
    // setUserBookings(prev => prev.filter(b => b.id !== bookingId));
    console.log("Delete booking", bookingId);
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative h-24 w-24 md:h-32 md:w-32 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
              {user?.avatar ? (
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
                {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
              <div className="flex flex-raw gap-4">
                <p className="mt-1 inline-block px-2 py-1 text-xs font-medium rounded-full bg-primary-800 text-primary-100">
                  {user?.role === "ADMIN" ? "Quản trị viên" : "Thành viên"}
                </p>
                <p className={`mt-1 inline-block px-2 py-1 text-xs font-medium rounded-full ${user?.status === "active" ? "bg-green-800 text-green-100" : "bg-red-800 text-red-100"} `}>
                  {user?.status === "active" ? "Xác thực" : "Chưa xác thực"}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-4">
                
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`flex items-center gap-1 px-4 py-2 rounded-md ${activeTab === "settings"
                    ? "bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                    }`}
                >
                  <UserCircle className="h-4 w-4" />
                  <span>Hồ sơ</span>
                </button>
                <button
                  onClick={() => setActiveTab("bookings")}
                  className={`flex items-center gap-1 px-4 py-2 rounded-md ${activeTab === "bookings"
                    ? "bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                    }`}
                >
                  <Ticket className="h-4 w-4" />
                  <span>Vé của tôi</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-700 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {activeTab === "bookings" && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Vé của tôi</h2>

            {userBookings.length === 0 ? (
              <div className="text-center py-8">
                <Ticket className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium">Chưa có vé nào</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  Bạn chưa đặt vé xem phim nào
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {userBookings.map(booking => (
                  <TicketCard
                    key={booking.id}
                    booking={booking}
                    handleDeleteBooking={handleDeleteBooking}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "settings" && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Cài đặt tài khoản</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Thông tin cá nhân</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Họ
                    </label>
                    <input
                      type="text"
                      value={user?.firstName}
                      disabled
                      className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tên
                    </label>
                    <input
                      type="text"
                      value={user?.lastName}
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
                      value={user?.email}
                      disabled
                      className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-medium mb-3">Mật khẩu</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Mật khẩu hiện tại
                    </label>
                    <input
                      type="password"
                      placeholder="Nhập mật khẩu hiện tại"
                      className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Mật khẩu mới
                    </label>
                    <input
                      type="password"
                      placeholder="Nhập mật khẩu mới"
                      className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Xác nhận mật khẩu mới
                    </label>
                    <input
                      type="password"
                      placeholder="Xác nhận mật khẩu mới"
                      className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <button
                    className="btn-primary"
                    onClick={() => alert('Chức năng thay đổi mật khẩu sẽ được triển khai trong ứng dụng thực tế')}
                  >
                    Cập nhật mật khẩu
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