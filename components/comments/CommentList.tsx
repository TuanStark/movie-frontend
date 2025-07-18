'use client';

import { useState, useEffect } from 'react';
import { CommentCard } from './CommentCard';
import { CommentInput } from './CommentInput';
import { Comment } from '../../types/types';

interface CommentListProps {
  movieId: number;
  initialComments?: Comment[];
}

interface CommentResponse {
  data?: {
    data?: Comment[];
    meta?: {
      total?: number;
      pageNumber?: number;
      limitNumber?: number;
      totalPages?: number;
    };
  } | null;
  statusCode?: number;
  message?: string;
}

export const CommentList = ({ movieId, initialComments = [] }: CommentListProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'rating'>('newest');

  const fetchComments = async (page = 1, sort = sortBy) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/movie-review/movie/${movieId}`
      );

      if (!response.ok) {
        throw new Error('Không thể tải danh sách đánh giá');
      }

      const response_data: CommentResponse = await response.json();

      // Handle case where data might be null or undefined
      if (response_data.data && response_data.data.data) {
        const { data, meta } = response_data.data;

        if (page === 1) {
          setComments(data || []);
        } else {
          setComments(prev => [...prev, ...(data || [])]);
        }

        setCurrentPage(meta?.pageNumber || 1);
        setTotalPages(meta?.totalPages || 1);
      } else {
        // Handle empty response or different structure
        console.log('No data in response or unexpected structure');

        // Try alternative structure (direct array)
        if (Array.isArray(response_data)) {
          if (page === 1) {
            setComments(response_data);
          } else {
            setComments(prev => [...prev, ...response_data]);
          }
          setCurrentPage(page);
          setTotalPages(page);
        } else {
          // Fallback to empty
          if (page === 1) {
            setComments([]);
          }
          setCurrentPage(1);
          setTotalPages(1);
        }
      }
      
    } catch (error) {
      console.error('Error fetching comments:', error);
      setError(error instanceof Error ? error.message : 'Có lỗi xảy ra khi tải đánh giá');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Set initial comments if provided
    if (initialComments.length > 0) {
      setComments(initialComments);
      setCurrentPage(1);
      setTotalPages(1);
    } else {
      // Fetch comments if no initial data
      fetchComments(1, sortBy);
    }
  }, [movieId, sortBy, initialComments]);

  const handleCommentAdded = () => {
    // Refresh comments when new comment is added
    fetchComments(1, sortBy);
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      fetchComments(currentPage + 1, sortBy);
    }
  };

  const handleSortChange = (newSort: 'newest' | 'oldest' | 'rating') => {
    setSortBy(newSort);
    setCurrentPage(1);
    fetchComments(1, newSort);
  };

  const averageRating = comments.length > 0
    ? comments.reduce((sum, comment) => sum + comment.rating, 0) / comments.length
    : 0;

  // Calculate rating distribution
  const ratingDistribution = Array.from({ length: 5 }, (_, index) => {
    const rating = 5 - index;
    const count = comments.filter(comment => comment.rating === rating).length;
    const percentage = comments.length > 0 ? (count / comments.length) * 100 : 0;
    return { rating, count, percentage };
  });

  return (
    <div className="space-y-6">
      {/* Comment Input */}
      <CommentInput movieId={movieId} onCommentAdded={handleCommentAdded} />

      {/* Comments Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Đánh giá từ khán giả
            </h3>

            {comments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Average Rating */}
                <div className="text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                    <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      {averageRating.toFixed(1)}
                    </span>
                    <div className="flex items-center">
                      {Array.from({ length: 5 }, (_, index) => (
                        <svg
                          key={index}
                          className={`w-5 h-5 ${
                            index < Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Dựa trên {comments.length} đánh giá
                  </p>
                </div>

                {/* Rating Distribution */}
                <div className="space-y-2">
                  {ratingDistribution.map(({ rating, count, percentage }) => (
                    <div key={rating} className="flex items-center space-x-2 text-sm">
                      <span className="w-8 text-gray-600 dark:text-gray-400">{rating}★</span>
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="w-8 text-xs text-gray-500 dark:text-gray-400">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                Chưa có đánh giá nào cho bộ phim này
              </p>
            )}
          </div>

          {/* Sort Options */}
          {comments.length > 0 && (
            <div className="flex items-center space-x-2 ml-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">Sắp xếp:</span>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value as 'newest' | 'oldest' | 'rating')}
                className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="newest">Mới nhất</option>
                <option value="oldest">Cũ nhất</option>
                <option value="rating">Đánh giá cao</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 && !isLoading ? (
          <div className="text-center py-8">
            <div className="text-gray-400 dark:text-gray-600 mb-2">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Chưa có đánh giá nào cho bộ phim này
            </p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentCard key={comment.id} comment={comment} />
          ))
        )}
      </div>

      {/* Load More Button */}
      {currentPage < totalPages && (
        <div className="text-center">
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Đang tải...' : 'Xem thêm đánh giá'}
          </button>
        </div>
      )}
    </div>
  );
};
