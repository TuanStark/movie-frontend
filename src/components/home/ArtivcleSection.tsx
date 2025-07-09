
"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";
import { Articles } from "@/types/global-type";
import { useEffect, useState } from "react";
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json() as Promise<GenericResponse<Articles>>);

export const ArticleSection = () => {
  const [articles, setArticles] = useState<Articles[]>([]);
  const { data, error, isLoading } = useSWR<GenericResponse<Articles>>(
    `${process.env.NEXT_PUBLIC_API_URL}/articles?limit=4`, // Thay bằng endpoint thực tế
    fetcher,
    {
      revalidateIfStale: false,
      refreshInterval: 3000,
    }
  );

  useEffect(() => {
    if (data) {
      setArticles(data.data?.data);
    }
  }, [data]);

  return (
    <section className="py-16 bg-gradient-to-r from-primary-900/10 to-primary-600/10 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Tin tức điện ảnh</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Cập nhật tin tức mới nhất về phim ảnh và hậu trường
            </p>
          </div>
          <Link
            href="/articles"
            className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-lg flex items-center transition-colors"
          >
            Xem tất cả
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-1 md:col-span-2 bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <Link href={`/articles/${articles[0]?.id}`} className="group">
              <div className="relative h-64 w-full">
                <Image
                  src={articles[0]?.imagePath}
                  alt={articles[0]?.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full">
                    {articles[0]?.category.name}
                  </span>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-500 mr-1" />
                    <span className="text-sm text-gray-500">{articles[0]?.readTime} phút đọc</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {articles[0]?.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                  {articles[0]?.excerpt}
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full overflow-hidden mr-2 border border-gray-200 dark:border-gray-700">
                      <Image
                        src={articles[0]?.author.avatar}
                        alt={articles[0]?.author.lastName}
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    </div>
                    <span className="text-sm font-medium">{articles[0]?.author.lastName}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(articles[0]?.date).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </div>
            </Link>
          </div>

          <div className="col-span-1 space-y-6">
            {articles.slice(1, 4).map(article => (
              <div key={article.id} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <Link href={`/articles/${article.id}`} className="flex group">
                  <div className="relative h-24 w-24 flex-shrink-0">
                    <Image
                      src={article.imagePath}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 flex-grow">
                    <div className="text-xs font-medium text-primary-600 dark:text-primary-400 mb-1">
                      {article.category.name}
                    </div>
                    <h3 className="font-bold mb-1 line-clamp-2 text-sm group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {article.title}
                    </h3>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{article.author.firstName}{article.author.lastName}</span>
                      <span>{new Date(article.date).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
            <div className="text-center">
              <Link
                href="/articles"
                className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:underline font-medium text-sm"
              >
                Xem tất cả bài viết
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}