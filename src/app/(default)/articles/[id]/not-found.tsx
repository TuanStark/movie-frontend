import Link from 'next/link';
import { ChevronLeft, FileText } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-4">
        <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-6">
          <FileText className="w-8 h-8 text-gray-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Bài viết không tồn tại
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
        </p>
        
        <Link
          href="/articles"
          className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Quay lại danh sách bài viết
        </Link>
      </div>
    </main>
  );
}
