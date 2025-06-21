"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Search } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { articles } from '@/lib/mock-data';

export default function ArticlesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  
  // Lấy danh sách các category
  const categories = Array.from(new Set(articles.map(article => article.category)));
  
  // Lọc bài viết theo search và category
  const filteredArticles = articles.filter(article => {
    const matchesSearch = searchTerm === '' || 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === '' || article.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* <Navbar /> */}
      
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Tin tức điện ảnh</h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl">
            Cập nhật những tin tức mới nhất về phim ảnh, đánh giá phim và hậu trường sản xuất
          </p>
        </div>
      </div>
      
      {/* Search and Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-grow relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                className="w-full py-3 pl-12 pr-4 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex-shrink-0">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full py-3 px-4 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              >
                <option value="">Tất cả chuyên mục</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Articles Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <div key={article.id} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <Link href={`/articles/${article.id}`} className="group">
                  <div className="relative h-48 w-full">
                    <Image
                      src={article.imagePath}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-medium text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/30 px-2 py-0.5 rounded">
                        {article.category}
                      </span>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>{article.readTime} phút đọc</span>
                      </div>
                    </div>
                    <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full overflow-hidden mr-2 border border-gray-200 dark:border-gray-700">
                          <Image
                            src={article.authorAvatar}
                            alt={article.author}
                            width={32}
                            height={32}
                            className="object-cover"
                          />
                        </div>
                        <span className="text-sm font-medium">{article.author}</span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(article.date).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
              <Search className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">Không tìm thấy bài viết</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Không có bài viết nào phù hợp với tìm kiếm của bạn. Vui lòng thử lại với từ khóa khác.
            </p>
          </div>
        )}
      </div>
    </main>
  );
} 