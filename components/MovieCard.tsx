"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Clock, Calendar } from "lucide-react";

interface MovieCardProps {
  id: number;
  title: string;
  posterPath: string;
  genres: string[];
  rating: number;
}

export default function MovieCard({ id, title, posterPath, genres, rating }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative group h-full rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-sm hover:shadow-xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/movies/${id}`} className="block h-full">
        <div className="relative aspect-[2/3] overflow-hidden">
          {/* Badge for high ratings */}
          {rating >= 8.0 && (
            <div className="absolute top-2 left-2 z-10 bg-yellow-500 text-black font-bold py-1 px-2 rounded-md text-xs flex items-center">
              <Star size={12} fill="currentColor" className="mr-0.5" /> Top Rated
            </div>
          )}
          
          <Image 
            src={posterPath} 
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`object-cover transform transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
            priority={false}
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Quick info on hover */}
          <div className="absolute inset-x-0 bottom-0 p-4 text-white translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center">
                <Star size={14} className="fill-yellow-500 text-yellow-500 mr-1" />
                <span>{rating.toFixed(1)}</span>
              </div>
              <span>|</span>
              <span className="line-clamp-1">{genres[0]}</span>
            </div>
            <button className="mt-2 w-full bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium py-2 px-3 rounded-md transition-colors">
              Book Now
            </button>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary-600 transition-colors">{title}</h3>
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
            {genres.join(", ")}
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center text-yellow-500">
              <Star size={16} className="fill-yellow-500 mr-1" />
              <span className="font-medium text-sm">{rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
} 