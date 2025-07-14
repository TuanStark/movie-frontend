import Image from 'next/image';
import Link from 'next/link';
import { Movie } from '../../types/types';

interface MovieCardProps {
  movie: Movie;
}

export const MovieCard = ({ movie }: MovieCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden hover:shadow-sm transition-all hover:border-primary-300 dark:hover:border-primary-600">
      <div className="flex">
        {/* Movie Poster */}
        <div className="w-16 h-24 flex-shrink-0 relative">
          <Image
            src={movie.posterPath}
            alt={movie.title}
            fill
            className="object-cover rounded-l-lg"
            sizes="64px"
          />
          {movie.upcoming && (
            <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-1 rounded">
              Sắp chiếu
            </div>
          )}
        </div>
        
        {/* Movie Info */}
        <div className="flex-1 p-2">
          <h4 className="font-semibold text-xs text-gray-900 dark:text-gray-100 truncate mb-1">
            {movie.title}
          </h4>
          
          <div className="space-y-1">
            <div className="flex items-center space-x-1 text-xs text-gray-600 dark:text-gray-400">
              <span className="flex items-center">
                <svg className="w-3 h-3 text-yellow-400 mr-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {movie.rating}
              </span>
              <span>•</span>
              <span>{movie.duration}</span>
            </div>
            
            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
              <span className="font-medium">Đạo diễn:</span> {movie.director}
            </p>
            
            <p className="text-xs text-gray-600 dark:text-gray-400">
              <span className="font-medium">
                {movie.upcoming ? 'Khởi chiếu:' : 'Phát hành:'}
              </span> {formatDate(movie.releaseDate)}
            </p>
          </div>
          
          {/* Action Button */}
          <div className="mt-2">
            <Link
              href={`/movies/${movie.id}`}
              className="inline-flex items-center px-2 py-1 text-xs bg-primary-500 hover:bg-primary-600 text-white rounded transition-colors"
            >
              {movie.upcoming ? 'Chi tiết' : 'Đặt vé'}
              <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
