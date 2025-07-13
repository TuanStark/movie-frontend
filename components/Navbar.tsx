"use client";

import Link from "next/link";
import { Moon, Sun, Menu, X, User, LogIn, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "./providers/ThemeProvider";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { Users } from "@/types/global-type";

export default function Navbar() {
  const [user, setUser] = useState<Users | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { data: session, status } = useSession();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const fetchUser = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/${session?.user?.id}`, {
        headers: {
          Authorization: `Bearer ${session?.user?.accessToken}`
        }
      });
      const data = await res.json();
      setUser(data.data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      fetchUser();
    }
  }, [status, session]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };
  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Close dropdown immediately
    setIsOpen(false);

    try {
      await signOut({
        callbackUrl: "/",
        redirect: true
      });

    } catch (error) {
      console.error("Logout error:", error);
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/";
    }
  };

  const handleMobileLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsMenuOpen(false);
    try {

      await signOut({
        callbackUrl: "/",
        redirect: true
      });

    } catch (error) {
      console.error("Mobile logout error:", error);
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/";
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-900 sticky top-0 z-20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Image src="/logo1.jpg" alt="MovieTix" width={32} height={32} className="rounded-full" />
              <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                MovieTix
              </span>
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400">
                  Trang chủ
                </Link>
                <Link href="/movies" className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400">
                  Phim
                </Link>
                <Link href="/theaters" className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400">
                  Rạp chiếu phim
                </Link>
                <Link href="/articles" className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400">
                  Tin tức điện ảnh
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none"
              aria-label="Toggle dark mode"
            >
              {theme === "dark" ? (
                <Sun size={20} />
              ) : (
                <Moon size={20} />
              )}
            </button>

            {/* Auth buttons */}
            {status === "authenticated" && session?.user ? (
              <div className="flex items-center space-x-3"
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
              >
                <Link
                  href="/profile"
                  className="flex items-center space-x-1"
                >
                  <div className="relative w-8 h-8 mr-3 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                    {user?.avatar ? (
                      <Image
                        src={user?.avatar || "/default-avatar.png"}
                        alt={session.user.name || "User"}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 absolute inset-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400" />
                    )}
                  </div>
                  <span className="hidden lg:inline-block text-sm font-medium">
                    {user?.firstName || "Account"} {user?.lastName || ""}
                  </span>
                </Link>
                {isOpen && (
                  <div className="absolute top-[60%] right-[15%] mt-2 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >

                      <div className="flex items-center gap-2">
                        <User size={18} className="mr-2" />
                        Hồ sơ cá nhân
                      </div>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <div className="flex items-center gap-2">
                        <LogOut size={18} className="mr-2" />
                        Đăng xuất
                      </div>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  <LogIn size={18} />
                  <span>Đăng nhập</span>
                </Link>
                <Link
                  href="/register"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
          <div className="flex md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-xl text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none transition-all duration-200"
              aria-label="Main menu"
            >
              <div className="relative w-6 h-6">
                <span className={`absolute inset-0 transition-all duration-300 ${isMenuOpen ? 'rotate-180 opacity-0' : 'rotate-0 opacity-100'}`}>
                  <Menu size={24} />
                </span>
                <span className={`absolute inset-0 transition-all duration-300 ${isMenuOpen ? 'rotate-0 opacity-100' : 'rotate-180 opacity-0'}`}>
                  <X size={24} />
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu backdrop */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile menu */}
      <div className={`md:hidden relative z-20 transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {/* Navigation Links */}
            <div className="space-y-1">
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center px-4 py-3 rounded-xl text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200"
              >
                <span className="text-lg">🏠</span>
                <span className="ml-3">Trang chủ</span>
              </Link>
              <Link
                href="/movies"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center px-4 py-3 rounded-xl text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200"
              >
                <span className="text-lg">🎬</span>
                <span className="ml-3">Phim</span>
              </Link>
              <Link
                href="/theaters"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center px-4 py-3 rounded-xl text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200"
              >
                <span className="text-lg">🎭</span>
                <span className="ml-3">Rạp chiếu phim</span>
              </Link>
              <Link
                href="/articles"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center px-4 py-3 rounded-xl text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200"
              >
                <span className="text-lg">📰</span>
                <span className="ml-3">Tin tức điện ảnh</span>
              </Link>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>

            {/* User Section */}
            {status === "authenticated" && session?.user ? (
              <div className="space-y-1">
                {/* User Info */}
                <div className="flex items-center px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                    {user?.avatar ? (
                      <Image
                        src={user.avatar}
                        alt={user.firstName || "User"}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 absolute inset-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400" />
                    )}
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user?.email}
                    </p>
                  </div>
                </div>

                {/* Profile Link */}
                <Link
                  href="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center px-4 py-3 rounded-xl text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200"
                >
                  <User size={20} className="text-gray-400" />
                  <span className="ml-3">Hồ sơ cá nhân</span>
                </Link>

                {/* Logout Button */}
                <button
                  onClick={handleMobileLogout}
                  className="flex w-full items-center px-4 py-3 rounded-xl text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                >
                  <LogOut size={20} />
                  <span className="ml-3">Đăng xuất</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center px-4 py-3 rounded-xl text-base font-medium text-primary-600 dark:text-primary-400 border-2 border-primary-600 dark:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200"
                >
                  <LogIn size={20} className="mr-2" />
                  <span>Đăng nhập</span>
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center px-4 py-3 rounded-xl text-base font-medium text-white bg-primary-600 hover:bg-primary-700 transition-all duration-200"
                >
                  <User size={20} className="mr-2" />
                  <span>Đăng ký</span>
                </Link>
              </div>
            )}

            {/* Theme Toggle */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <button
                onClick={toggleTheme}
                className="flex w-full items-center px-4 py-3 rounded-xl text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
              >
                {theme === "dark" ? (
                  <>
                    <Sun size={20} className="text-yellow-500" />
                    <span className="ml-3">Chế độ sáng</span>
                  </>
                ) : (
                  <>
                    <Moon size={20} className="text-blue-500" />
                    <span className="ml-3">Chế độ tối</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 