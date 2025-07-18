'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';


interface CommentInputProps {
  movieId: number;
  onCommentAdded: () => void;
}

export const CommentInput = ({ movieId, onCommentAdded }: CommentInputProps) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [hasWatchedMovie, setHasWatchedMovie] = useState<boolean | null>(null);

  const { data: session, status } = useSession();
  const user = session?.user;
  const useId = session?.user.id;
  const acessToken = session?.user.accessToken;
  const isAuthenticated = status === 'authenticated';

  // Check if user has watched this movie
  useEffect(() => {
    const checkWatchedStatus = async () => {
      if (!isAuthenticated || !user) return;

      try {
        // Check if user has any bookings for this movie
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/booking/user/${user.id}/movie/${movieId}`,
          {
            headers: {
              'Authorization': `Bearer ${(session as any)?.accessToken}`
            }
          }
        );
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          // Check if user has bookings for this movie using the correct structure
          setHasWatchedMovie(data.data?.hasBooking || false);
        } else {
          setHasWatchedMovie(false);
        }
      } catch (error) {
        console.error('Error checking watched status:', error);
        setHasWatchedMovie(false);
      }
    };

    checkWatchedStatus();
  }, [movieId, isAuthenticated, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !user) {
      setError('Bạn cần đăng nhập để đánh giá phim');
      return;
    }

    if (rating === 0) {
      setError('Vui lòng chọn số sao đánh giá');
      return;
    }

    if (!content.trim()) {
      setError('Vui lòng nhập nội dung đánh giá');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/movie-review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${acessToken}`
        },
        body: JSON.stringify({
          movieId,
          rating,
          userId: user.id,
          comment: content.trim()
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể gửi đánh giá');
      }

      const result = await response.json();
      if (result.statusCode === 201) {
        // Reset form
        setRating(0);
        setContent('');
        onCommentAdded();
        setError('');
      } else {
        throw new Error(result.message || 'Không thể gửi đánh giá');
      }
      
    } catch (error) {
      console.error('Error submitting comment:', error);
      setError(error instanceof Error ? error.message : 'Có lỗi xảy ra khi gửi đánh giá');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStarInput = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <button
        key={index}
        type="button"
        className={`w-8 h-8 transition-colors ${
          index < (hoverRating || rating) 
            ? 'text-yellow-400' 
            : 'text-gray-300 dark:text-gray-600 hover:text-yellow-300'
        }`}
        onMouseEnter={() => setHoverRating(index + 1)}
        onMouseLeave={() => setHoverRating(0)}
        onClick={() => setRating(index + 1)}
      >
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      </button>
    ));
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
        <div className="text-gray-400 dark:text-gray-600 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Bạn cần đăng nhập để đánh giá phim
        </p>
        <button className="btn-primary">
          Đăng nhập
        </button>
      </div>
    );
  }

  if (hasWatchedMovie === false) {
    return (
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6 text-center">
        <div className="text-amber-400 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-amber-700 dark:text-amber-300 mb-4">
          Chỉ những khách hàng đã xem phim mới có thể đánh giá
        </p>
        <p className="text-sm text-amber-600 dark:text-amber-400">
          Hãy đặt vé và xem phim để chia sẻ cảm nhận của bạn!
        </p>
      </div>
    );
  }

  if (hasWatchedMovie === null) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Đánh giá phim
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Đánh giá của bạn
          </label>
          <div className="flex items-center space-x-1">
            {renderStarInput()}
            {rating > 0 && (
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                {rating}/5 sao
              </span>
            )}
          </div>
        </div>

        {/* Content Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nội dung đánh giá
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Chia sẻ cảm nhận của bạn về bộ phim..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            maxLength={500}
          />
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">
            {content.length}/500
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || rating === 0 || !content.trim()}
            className="px-6 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
          >
            {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
          </button>
        </div>
      </form>
    </div>
  );
};
