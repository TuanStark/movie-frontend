import Link from "next/link";
// import { Camera } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-4">
        <div className="mb-8">
          {/* <Camera className="h-24 w-24 text-gray-400 mx-auto mb-4" /> */}
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Movie Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            The movie you're looking for doesn't exist or has been removed.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/movies"
            className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Browse All Movies
          </Link>
          
          <div>
            <Link
              href="/"
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
            >
              Go to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
