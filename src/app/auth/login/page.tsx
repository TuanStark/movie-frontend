"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { Mail, Lock, LogIn, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import BackgroundGradient from "@/components/BackgroundGradient";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const error = searchParams.get("error");
  const justRegistered = searchParams.get("registered");
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  useEffect(() => {
    if (justRegistered === 'true') {
      setShowSuccessMessage(true);
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [justRegistered]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    // Clear error when typing
    if (formError) {
      setFormError("");
    }
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError("");
    
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });
      
      if (result?.error) {
        setFormError("Invalid email or password");
        setIsLoading(false);
      } else {
        // Redirect to callbackUrl or home page
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (error) {
      setFormError("An unexpected error occurred");
      setIsLoading(false);
    }
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Navbar />
      <BackgroundGradient />
      
      <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 shadow-2xl rounded-3xl overflow-hidden">
          {/* Left side - Form */}
          <div className="bg-white dark:bg-gray-800 p-8 sm:p-10 flex flex-col justify-center">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Welcome back!</h1>
              <p className="text-gray-600 dark:text-gray-400">Sign in to continue to MovieTix</p>
            </div>
            
            {showSuccessMessage && (
              <div className="mb-6 p-3 rounded bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 flex items-center animate-fade-in">
                <div className="shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center mr-3">
                  <span className="text-green-800 dark:text-green-200 text-sm">✓</span>
                </div>
                <p>Registration successful! Please log in with your new account.</p>
              </div>
            )}
            
            {(error || formError) && (
              <div className="mb-6 p-3 rounded bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center animate-fade-in">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                <p>{error === "CredentialsSignin" ? "Invalid email or password" : formError || "Authentication error"}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                    className="block w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex justify-between">
                  <span>Password</span>
                  <Link href="/auth/forgot-password" className="text-primary-600 dark:text-primary-400 hover:underline text-sm font-normal">
                    Forgot password?
                  </Link>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    required
                    className="block w-full pl-10 pr-10 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button 
                    type="button" 
                    className="absolute inset-y-0 right-0 pr-3 flex items-center" 
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <span className="text-gray-400 hover:text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                        </svg>
                      </span>
                    ) : (
                      <span className="text-gray-400 hover:text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </span>
                    )}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Remember me
                </label>
              </div>
              
              <div>
                <button
                  type="submit"
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing In...
                    </>
                  ) : (
                    <>
                      <LogIn className="h-5 w-5" />
                      Sign In
                    </>
                  )}
                </button>
              </div>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Don&apos;t have an account?{" "}
                <Link href="/auth/register" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">
                  Sign up
                </Link>
              </p>
            </div>
            
            <div className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="mb-1">Demo accounts:</p>
              <p className="mb-1"><span className="font-medium">User:</span> john@example.com / password123</p>
              <p><span className="font-medium">Admin:</span> admin@example.com / admin123</p>
            </div>
          </div>
          
          {/* Right side - Image */}
          <div className="hidden md:block bg-gradient-to-br from-primary-500 to-primary-800 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <div className="text-white max-w-md text-center">
                <h2 className="text-3xl font-bold mb-4">Movie magic awaits you</h2>
                <p className="text-white/80 text-lg">
                  Sign in to book tickets for the latest blockbusters and enjoy an immersive cinema experience
                </p>
                <div className="mx-auto mt-8 w-64 h-32">
                  <svg viewBox="0 0 300 150" className="w-full h-full drop-shadow-lg">
                    <rect x="10" y="10" width="280" height="130" rx="10" fill="#ffffff" />
                    <rect x="10" y="10" width="280" height="40" rx="10" fill="#d4145a" />
                    <rect x="10" y="50" width="280" height="90" rx="0" fill="#ffffff" />
                    <circle cx="50" cy="95" r="20" fill="#f5f5f5" />
                    <rect x="90" y="75" width="180" height="10" rx="2" fill="#f5f5f5" />
                    <rect x="90" y="95" width="100" height="10" rx="2" fill="#f5f5f5" />
                    <rect x="90" y="115" width="150" height="10" rx="2" fill="#f5f5f5" />
                    <circle cx="250" cy="30" r="15" fill="#ffffff" />
                    <text x="30" y="35" fontFamily="Arial" fontSize="20" fill="#ffffff" fontWeight="bold">MOVIE TICKET</text>
                    <path d="M250,20 L250,40" stroke="#d4145a" strokeWidth="2" />
                    <path d="M240,30 L260,30" stroke="#d4145a" strokeWidth="2" />
                    {/* Perforated edge */}
                    {Array.from({ length: 15 }).map((_, i) => (
                      <circle key={i} cx={i * 20 + 10} cy="50" r="3" fill="#f0f0f0" />
                    ))}
                  </svg>
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  );
} 