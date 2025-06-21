"use client";

import { useState } from "react";
import { Mail } from "lucide-react";

export const NewsletterSection = () => {
  const [emailSubscription, setEmailSubscription] = useState("");
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);
  
  // Handle newsletter subscription
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate subscription process
    if (emailSubscription && emailSubscription.includes('@')) {
      setSubscribeSuccess(true);
      setEmailSubscription("");
      setTimeout(() => {
        setSubscribeSuccess(false);
      }, 5000);
    }
  };

  return (
    <section className="bg-primary-50 dark:bg-primary-900/30 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-1/2">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Stay Updated</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-lg mb-6">
                Subscribe to our newsletter to get the latest updates on new movie releases, 
                exclusive promotions, and special events right in your inbox.
              </p>
              
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <div className="flex-grow relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full py-3 pl-12 pr-4 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 border border-gray-300 dark:border-gray-600"
                    value={emailSubscription}
                    onChange={(e) => setEmailSubscription(e.target.value)}
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-xl transition-colors"
                >
                  Subscribe
                </button>
              </form>
              
              {subscribeSuccess && (
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg flex items-center animate-fade-in">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 0 0-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p>Thank you for subscribing! You'll now receive our latest movie updates.</p>
                </div>
              )}
              
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                By subscribing, you agree to our Terms and Privacy Policy. You can unsubscribe at any time.
              </p>
            </div>
            
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-72 h-56">
                <div className="absolute -top-2 -left-2 w-16 h-16 bg-primary-500 rounded-full opacity-20"></div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-secondary-500 rounded-full opacity-20"></div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 relative z-10 h-full flex flex-col justify-center">
                  <div className="flex justify-center mb-6">
                    <svg className="w-16 h-16 text-primary-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold mb-2">Weekly Movie Updates</h3>
                    <p className="text-gray-600 dark:text-gray-300">Get the latest releases and exclusive offers directly to your inbox</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
}; 