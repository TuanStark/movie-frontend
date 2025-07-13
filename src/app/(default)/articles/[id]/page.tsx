import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, Calendar, Clock, Share } from 'lucide-react';
import { Articles } from '@/types/global-type';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    id: string;
  };
}

async function getArticleById(id: string): Promise<Articles | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles/${id}`, {
      next: { revalidate: 10 } // Revalidate every hour
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    // Handle different response structures
    return data.data || null;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const article = await getArticleById(params.id);

  if (!article) {
    return {
      title: 'Article Not Found',
      description: 'The requested article could not be found.',
    };
  }

  return {
    title: `${article.title} - Cinema News`,
    description: article.excerpt,
    keywords: [
      article.title,
      'cinema',
      'movies',
      'news',
      'articles'
    ].join(', '),
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.imagePath ? [article.imagePath] : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: article.imagePath ? [article.imagePath] : [],
    },
  };
}

export default async function ArticleDetailPage({params} : PageProps) {
  const article = await getArticleById(params.id);

  if (!article) {
    notFound();
  }
  
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      
      {/* Article Header */}
      <div className="relative h-[50vh] md:h-[60vh]">
        <Image 
          src={article.imagePath}
          alt={article.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-7xl mx-auto">
          <div className="mb-4">
            <Link 
              href="/articles"
              className="inline-flex items-center text-white hover:text-primary-300 transition-colors"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Quay lại danh sách bài viết
            </Link>
          </div>
          
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-500/90 text-white text-sm font-medium mb-4">
            {article.category?.name}
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 max-w-4xl">
            {article.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-white/80">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full overflow-hidden mr-3 border-2 border-white/20">
                <Image
                  src={article.author?.avatar || '/default-avatar.png'}
                  alt={article.author?.firstName}
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
              <span className="font-medium">{article.author?.firstName} {article.author?.lastName}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              <span>{new Date(article.date).toLocaleDateString('vi-VN', {
                day: 'numeric', month: 'long', year: 'numeric'
              })}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              <span>{article.readTime} phút đọc</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-10">
          {/* Article excerpt */}
          <div className="border-l-4 border-primary-500 pl-5 py-2 mb-8">
            <p className="text-xl text-gray-700 dark:text-gray-300 italic font-serif">
              {article.excerpt}
            </p>
          </div>
          
          {/* Article content - generated paragraphs from content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {Array.from({ length: 5 }).map((_, index) => {
              // Add a quote in the middle
              if (index === 2) {
                return (
                  <div key={index}>
                    <p className="mb-6 text-gray-700 dark:text-gray-300">
                      {article.content} {article.content}
                    </p>
                    <blockquote className="border-l-4 border-primary-500 pl-5 py-2 my-8 italic text-gray-700 dark:text-gray-300 font-serif text-xl">
                      "Điện ảnh là nghệ thuật kể chuyện qua hình ảnh và âm thanh, tạo nên những trải nghiệm đánh thức mọi giác quan."
                    </blockquote>
                  </div>
                );
              }
              
              return (
                <p key={index} className="mb-6 text-gray-700 dark:text-gray-300">
                  {article.content} {article.content}
                </p>
              );
            })}
          </div>
          
          {/* Share buttons */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-gray-700 dark:text-gray-300">Chia sẻ bài viết:</span>
                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-sky-500 text-white hover:bg-sky-600 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors">
                  <Share className="w-4 h-4" />
                </button>
              </div>
              <Link
                href="/articles"
                className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
              >
                Xem tất cả bài viết
              </Link>
            </div>
          </div>
        </div>
      </div>

    </main>
  );
} 