"use client";

import { useEffect, useState } from "react";
import { Star, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import type { Movie } from "@/types/global-type";

interface HeroSectionProps {
  featuredMovie: Movie[];
}

export const HeroSection = ({ featuredMovie }: HeroSectionProps) => {
  const { data: session } = useSession();
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
  const [isChanging, setIsChanging] = useState(false);

  const currentMovie = featuredMovie[currentMovieIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsChanging(true);
      setTimeout(() => {
        setCurrentMovieIndex((prev) => (prev + 1) % featuredMovie.length);
        setIsChanging(false);
      }, 800); // Đợi 500ms để hiệu ứng fade-out hoàn thành trước khi đổi phim
    }, 9000);

    return () => clearInterval(interval);
  }, [featuredMovie.length]);

  return (
    <div className="relative h-[70vh] overflow-hidden">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0">
        <Image
          src={currentMovie?.backdropPath}
          alt={currentMovie?.title}
          fill
          className={`object-cover transition-opacity duration-500 ${isChanging ? 'opacity-0' : 'opacity-100'}`}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
      </div>

      {/* Hero Content */}
      <div className="relative h-full container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
        <div className={`max-w-xl transition-opacity duration-500 ${isChanging ? 'opacity-0' : 'opacity-100'}`}>
          {session?.user && (
            <p className="text-primary-400 font-medium mb-2 animate-fade-in">
              Welcome back, {session.user.name?.split(' ')[0] || 'Friend'}!
            </p>
          )}

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 animate-fade-in">
            {currentMovie?.title}
          </h1>

          <div className="flex items-center gap-4 text-white/90 mb-4 animate-fade-in delay-100">
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 mr-1" />
              <span>{currentMovie?.rating.toFixed(1)}</span>
            </div>
            <span>•</span>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-1" />
              <span>{currentMovie?.duration}</span>
            </div>
            <span>•</span>
            <span>{currentMovie?.genres.map((genre) => genre.genre?.name).join(", ")}</span>
          </div>

          <p className="text-white/80 mb-6 max-w-lg animate-fade-in delay-200 line-clamp-3">
            {currentMovie?.synopsis}
          </p>

          <div className="flex flex-wrap gap-4 animate-fade-in delay-300">
            <Link
              href={`/movies/${currentMovie?.id}`}
              className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-full flex items-center transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Xem Trailer
            </Link>
            <Link
              href={`/movies/${currentMovie?.id}`}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-medium py-3 px-6 rounded-full flex items-center transition-all"
            >
              Đặt vé
            </Link>
          </div>

          {/* Indicators */}
          <div className="flex mt-6 gap-2">
            {featuredMovie.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsChanging(true);
                  setTimeout(() => {
                    setCurrentMovieIndex(index);
                    setIsChanging(false);
                  }, 500);
                }}
                className={`w-2 h-2 rounded-full transition-all ${currentMovieIndex === index ? 'bg-primary-500 w-6' : 'bg-white/40'
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 