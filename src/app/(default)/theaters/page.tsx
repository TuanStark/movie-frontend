import { MapPin, Clock } from "lucide-react";
import Image from "next/image";
import BackgroundGradient from "@/components/BackgroundGradient";
import { Theater } from "@/types/global-type";
import { Metadata } from "next";

// Fetch theaters data at build time
async function getTheaters(): Promise<Theater[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/theaters`, {
      next: { revalidate: 3600 } // Revalidate every hour
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();

    // Handle different response structures
    return data.data.data || [];
  } catch (error) {
    console.error('Error fetching theaters:', error);
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Our Theaters - Cinema Booking',
    description: 'Find the perfect cinema location for your movie experience. Each theater offers premium sound and visual quality.',
    keywords: [
      'theaters',
      'cinema',
      'movie theaters',
      'tickets',
      'booking',
      'locations',
      'IMAX',
      'premium seating'
    ].join(', '),
    openGraph: {
      title: 'Our Theaters - Cinema Booking',
      description: 'Find the perfect cinema location for your movie experience.',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Our Theaters - Cinema Booking',
      description: 'Find the perfect cinema location for your movie experience.',
    },
  };
}

export default async function TheatersPage() {
  const theaters = await getTheaters();

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <BackgroundGradient />
      {/* <Navbar /> */}

      {/* Page Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Rạp chiếu phim của chúng tôi
          </h1>
          <p className="text-white/80 max-w-2xl">
          Tìm địa điểm chiếu phim lý tưởng cho trải nghiệm xem phim của bạn. Mỗi rạp đều cung cấp chất lượng âm thanh và hình ảnh cao cấp.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="container mx-auto px-4 py-8">
        {/* Theaters List */}
        <div className="space-y-8 mb-12">
          {theaters && theaters.length >= 0 ? (
            theaters.map((theater: Theater) => (
              <div
                key={theater.id}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="md:flex">
                  {/* Theater Image */}
                  <div className="md:w-1/3 relative">
                    <div className="h-56 md:h-full relative bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      {theater.logo ? (
                        <Image
                          src={theater.logo}
                          alt={theater.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="text-gray-500 dark:text-gray-400 text-center">
                          <MapPin className="h-12 w-12 mx-auto mb-2" />
                          <p>Theater Image</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Theater Info */}
                  <div className="md:w-2/3 p-6">
                    <h2 className="text-2xl font-bold mb-2">{theater.name}</h2>

                    <div className="flex items-start mb-4">
                      <MapPin className="h-5 w-5 text-primary-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300">{theater.location}</span>
                    </div>

                    {/* Showtimes */}
                    <div className="flex items-center mb-4">
                      <Clock className="h-5 w-5 text-primary-500 mr-2" />
                      <div>
                        <span className="text-gray-700 dark:text-gray-300">
                          Open today: 10:00 AM - 12:00 AM
                        </span>
                      </div>
                    </div>

                    {/* Amenities */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">IMAX</span>
                      <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">Dolby Atmos</span>
                      <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">Premium Seating</span>
                      <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">Food Court</span>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3 mt-4">
                      <button className="bg-primary-600 hover:bg-primary-700 text-white py-2 px-6 rounded-full inline-flex items-center transition-all">
                        View Showtimes
                      </button>
                      <button className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 py-2 px-6 rounded-full inline-flex items-center transition-all">
                        <MapPin className="h-4 w-4 mr-2" />
                        Get Directions
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center">
              <h3 className="text-xl font-medium mb-2">No theaters found</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Try adjusting your search criteria
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}