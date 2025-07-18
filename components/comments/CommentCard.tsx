'use client';

import Image from 'next/image';
import { Comment } from '../../types/types';

interface CommentCardProps {
  comment: Comment;
}

export const CommentCard = ({ comment }: CommentCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* User Info */}
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          {comment.user.avatar ? (
            <Image
              src={comment.user.avatar}
              alt={`${comment.user.firstName} ${comment.user.lastName}`}
              width={48}
              height={48}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                {comment.user.firstName.charAt(0)}{comment.user.lastName.charAt(0)}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {comment.user.firstName} {comment.user.lastName}
              </h4>
              <div className="flex items-center space-x-2 mt-1">
                <div className="flex items-center space-x-1">
                  {renderStars(comment.rating)}
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {comment.rating}/5
                </span>
              </div>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(comment.createdAt)}
            </span>
          </div>

          {/* Comment Content */}
          <div className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
            {comment.comment}
          </div>

          {/* Verified Badge */}
          <div className="mt-3 flex items-center">
            <div className="flex items-center space-x-1 text-xs text-green-600 dark:text-green-400">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Đã xem phim</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
