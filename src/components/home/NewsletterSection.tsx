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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 my-8">
      <div className="bg-gradient-to-r from-primary-700 to-primary-500 rounded-3xl p-8 md:p-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Stay Updated with the Latest Movies</h2>
          <p className="text-primary-100 mb-8">
            Subscribe to our newsletter and be the first to know about new releases, exclusive promotions, and special screenings.
          </p>
          
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <div className="flex-grow relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                placeholder="Your email address"
                className="w-full py-3 pl-12 pr-4 rounded-xl text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-white/20"
                value={emailSubscription}
                onChange={(e) => setEmailSubscription(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="py-3 px-6 bg-black text-white font-medium rounded-xl hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-white/20 transition-colors"
            >
              Subscribe
            </button>
          </form>
          
          {subscribeSuccess && (
            <div className="mt-4 text-sm text-white bg-primary-800/30 py-2 px-4 rounded-lg inline-block">
              Thank you for subscribing! We've sent a confirmation to your email.
            </div>
          )}
          
          <p className="mt-6 text-xs text-primary-200">
            By subscribing, you agree to our Privacy Policy. You can unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
}; 