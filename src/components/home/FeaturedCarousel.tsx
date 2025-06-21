"use client";

import { useState, useEffect, useRef } from "react";
import { Star, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { movies } from "@/lib/mock-data";

export const FeaturedCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const featuredMovies = movies
    .filter(movie => movie.rating >= 7.8)
    .slice(0, 5);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === featuredMovies.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => {
      resetTimeout();
    };
  }, [currentIndex, featuredMovies.length]);

  return (
    <div className="relative w-full mb-16 overflow-hidden rounded-2xl">
      {/* Slides */}
      <div 
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {featuredMovies.map((movie) => (
          <div key={movie.id} className="w-full flex-shrink-0">
            <div className="relative h-80 md:h-96 overflow-hidden rounded-2xl">
              <Image
                src={movie.backdropPath}
                alt={movie.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <span className="text-white font-medium">{movie.rating.toFixed(1)}</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{movie.title}</h3>
                <div className="flex items-center text-white/80 mb-4">
                  <Clock className="w-4 h-4 mr-1" />
                  <span className="mr-3">{movie.duration}</span>
                  <span className="text-sm">{movie.genres.join(", ")}</span>
                </div>
                <Link
                  href={`/movies/${movie.id}`}
                  className="bg-primary-600 hover:bg-primary-700 text-white py-2 px-6 rounded-full inline-flex items-center transition-all"
                >
                  Book Tickets
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Indicators */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {featuredMovies.map((_, index) => (
          <button
            key={index}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              currentIndex === index ? "bg-white scale-125" : "bg-white/50"
            }`}
            onClick={() => setCurrentIndex(index)}
          ></button>
        ))}
      </div>
    </div>
  );
}; 