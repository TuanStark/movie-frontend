"use client";

import { useEffect } from "react";
import { Star, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { movies } from "@/lib/mock-data";

interface HeroSectionProps {
  featuredMovie: typeof movies[0];
}

export const HeroSection = ({ featuredMovie }: HeroSectionProps) => {
  const { data: session } = useSession();

  return (
    <div className="relative h-[70vh] overflow-hidden">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0">
        <Image 
          src={featuredMovie.backdropPath}
          alt={featuredMovie.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
      </div>
      
      {/* Hero Content */}
      <div className="relative h-full container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
        <div className="max-w-xl">
          {session?.user && (
            <p className="text-primary-400 font-medium mb-2 animate-fade-in">
              Welcome back, {session.user.name?.split(' ')[0] || 'Friend'}!
            </p>
          )}

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 animate-fade-in">
            {featuredMovie.title}
          </h1>
          
          <div className="flex items-center gap-4 text-white/90 mb-4 animate-fade-in delay-100">
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 mr-1" />
              <span>{featuredMovie.rating.toFixed(1)}</span>
            </div>
            <span>•</span>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-1" />
              <span>{featuredMovie.duration}</span>
            </div>
            <span>•</span>
            <span>{featuredMovie.genres.join(", ")}</span>
          </div>
          
          <p className="text-white/80 mb-6 max-w-lg animate-fade-in delay-200 line-clamp-3">
            {featuredMovie.synopsis}
          </p>
          
          <div className="flex flex-wrap gap-4 animate-fade-in delay-300">
            <Link 
              href={`/movies/${featuredMovie.id}`}
              className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-full flex items-center transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Watch Trailer
            </Link>
            <Link 
              href={`/movies/${featuredMovie.id}`}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-medium py-3 px-6 rounded-full flex items-center transition-all"
            >
              Book Tickets
            </Link>
          </div>
        </div>
      </div>
      
      {/* Scrolldown indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-white animate-bounce">
        <span className="text-sm mb-1 opacity-80">Scroll Down</span>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </div>
  );
}; 