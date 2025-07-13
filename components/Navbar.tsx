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
      console.log(data.data);
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

    console.log("Logout button clicked");

    // Close dropdown immediately
    setIsOpen(false);

    // Add a small delay to ensure state updates
    setTimeout(async () => {
      try {
        console.log("Attempting to sign out...");

        // Try the NextAuth signOut first
        await signOut({
          callbackUrl: "/",
          redirect: true
        });

      } catch (error) {
        console.error("Logout error:", error);
        // Fallback: force redirect to home page and clear session
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/";
      }
    }, 100);
  };

  const handleMobileLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    console.log("Mobile logout button clicked");

    // Close mobile menu immediately
    setIsMenuOpen(false);

    setTimeout(async () => {
      try {
        console.log("Attempting mobile sign out...");

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
    }, 100);
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
                  Home
                </Link>
                <Link href="/movies" className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400">
                  Movies
                </Link>
                <Link href="/theaters" className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400">
                  Theaters
                </Link>
                <Link href="/articles" className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400">
                  Articles
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
                  <span>Log In</span>
                </Link>
                <Link
                  href="/register"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
          <div className="flex md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none"
              aria-label="Main menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400">
              Home
            </Link>
            <Link href="/movies" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400">
              Movies
            </Link>
            <Link href="/theaters" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400">
              Theaters
            </Link>

            {/* Mobile auth buttons */}
            {status === "authenticated" && session?.user ? (
              <>
                <Link
                  href="/profile"
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  <User size={18} className="mr-2" />
                  <span>My Profile</span>
                </Link>
                <button
                  onClick={handleMobileLogout}
                  className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  <LogOut size={18} className="mr-2" />
                  <span>Đăng xuất</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  <LogIn size={18} className="mr-2" />
                  <span>Log In</span>
                </Link>
                <Link
                  href="/auth/register"
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-primary-600 dark:text-primary-400"
                >
                  <User size={18} className="mr-2" />
                  <span>Sign Up</span>
                </Link>
              </>
            )}

            <button
              onClick={toggleTheme}
              className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400"
            >
              {theme === "dark" ? (
                <>
                  <Sun size={18} className="mr-2" />
                  Light Mode
                </>
              ) : (
                <>
                  <Moon size={18} className="mr-2" />
                  Dark Mode
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
} 