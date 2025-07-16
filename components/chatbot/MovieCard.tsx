import Image from 'next/image';
import Link from 'next/link';
import { Movie, Showtime } from '../../types/types';

interface MovieCardProps {
  movie?: Movie;
  showtime?: Showtime;
  displayMode?: 'movie' | 'showtime';
}

export const MovieCard = ({ movie, showtime, displayMode = 'movie' }: MovieCardProps) => {
  const movieData = showtime?.movie || movie;
  console.log('movieData',movieData?.id);

  if (!movieData) {
    return null;
  }
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 
    overflow-hidden hover:shadow-sm transition-all hover:border-primary-300 
    dark:hover:border-primary-600 max-w-[300px]">
      <div className='max-w-[300px]'>
        <div className="flex">
        {/* Movie Poster */}
        <div className="w-16 h-[full] flex-shrink-0 relative">
          <Image
            src={movieData.posterPath}
            alt={movieData.title}
            fill
            className="object-cover rounded-l-lg"
            sizes="64px"
          />
          {movieData.upcoming && (
            <div className="absolute top-1 left-0 bg-green-500 text-white text-xs px-1 rounded whitespace-nowrap">
              Sắp chiếu
            </div>
          )}
        </div>
        
        {/* Movie Info */}
        <div className="flex-1 p-2 w-[300px]">
          <h4 className="font-semibold text-xs text-gray-900 dark:text-gray-100 mb-1 max-w-[300px] line-clamp-2">
            {movieData.title}
          </h4>

          <div className="space-y-1 max-w-[300px]">
            <div className="flex items-center space-x-1 text-xs text-gray-600 dark:text-gray-400">
              <span className="flex items-center">
                <svg className="w-3 h-3 text-yellow-400 mr-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {movieData.rating}
              </span>
              <span>•</span>
              <span>{movieData.duration}</span>
            </div>

            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
              <span className="font-medium">Đạo diễn:</span> {movieData.director}
            </p>

            {/* Conditional display based on mode */}
            {displayMode === 'showtime' && showtime ? (
              <div className="space-y-1">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Rạp:</span> {showtime.theater.name}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Suất chiếu:</span> {formatDate(showtime.date)} - {showtime.time}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Giá vé:</span> {showtime.price.toLocaleString('vi-VN')} VNĐ
                </p>
              </div>
            ) : (
              <p className="text-xs text-gray-600 dark:text-gray-400">
                <span className="font-medium">
                  {movieData.upcoming ? 'Khởi chiếu:' : 'Phát hành:'}
                </span> {formatDate(movieData.releaseDate)}
              </p>
            )}
          </div>
          
          {/* Action Button */}
          <div className="mt-2">
            <Link
              href={displayMode === 'showtime' && showtime
                ? `/booking/${showtime.id}`
                : `/movies/${movieData.id}`
              }
              className="inline-flex items-center px-2 py-1 text-xs bg-primary-500 hover:bg-primary-600 text-white rounded transition-colors"
            >
              {displayMode === 'showtime'
                ? 'Đặt vé'
                : movieData.upcoming
                  ? 'Chi tiết'
                  : 'Đặt vé'
              }
              <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};
