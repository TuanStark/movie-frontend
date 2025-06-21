import { Star } from "lucide-react";

export const FeedBackSection = () => {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center">What Our Customers Say</h2>
        <p className="text-gray-600 dark:text-gray-400 text-center max-w-2xl mx-auto mb-12">
          Thousands of movie lovers choose our platform for the best cinema experience
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-card hover:shadow-card-hover transition-shadow">
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-yellow-500" />
                ))}
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-6 italic">
              "The booking process was seamless and the seat selection feature is amazing! I love being able to see the exact view from my seat before booking."
            </p>
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-lg">
                JD
              </div>
              <div className="ml-3">
                <h4 className="font-medium">Jane Doe</h4>
                <p className="text-sm text-gray-500">Movie Enthusiast</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-card hover:shadow-card-hover transition-shadow">
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-yellow-500" />
                ))}
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-6 italic">
              "I've been using this service for months and it's by far the best movie booking platform. The interface is intuitive and they always have great promotions!"
            </p>
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-secondary-100 dark:bg-secondary-900 flex items-center justify-center text-secondary-600 dark:text-secondary-400 font-bold text-lg">
                JS
              </div>
              <div className="ml-3">
                <h4 className="font-medium">John Smith</h4>
                <p className="text-sm text-gray-500">Film Critic</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-card hover:shadow-card-hover transition-shadow">
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className={i < 4 ? "fill-yellow-500" : ""} />
                ))}
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-6 italic">
              "The QR code ticket system is fantastic and their customer support team helped me quickly when I needed to reschedule. Very happy with the service!"
            </p>
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-400 font-bold text-lg">
                AK
              </div>
              <div className="ml-3">
                <h4 className="font-medium">Alex Kim</h4>
                <p className="text-sm text-gray-500">Regular User</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
}