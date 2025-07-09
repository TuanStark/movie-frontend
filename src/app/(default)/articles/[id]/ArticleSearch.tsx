"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { articles } from '@/lib/mock-data';

interface ArticleSearchProps {
  articleId: number;
}

export default function ArticleSearch({ articleId }: ArticleSearchProps) {
  const router = useRouter();

  useEffect(() => {
    // Verify if the article exists on the client side
    const foundArticle = articles.find((a) => a.id === articleId);
    
    if (!foundArticle) {
      router.push('/articles'); // Redirect to articles list if article not found
    }
    
    // Add additional client-side search logic here if needed
    // For example, dynamic filtering or search based on user input
  }, [articleId, router]);

  return null; // This component doesn't render anything; it's for logic only
}