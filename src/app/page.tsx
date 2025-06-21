"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Star, Clock, Mail } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import MovieCard from "@/components/MovieCard";
import BackgroundGradient from "@/components/BackgroundGradient";
import { movies, theaters, showtimes, articles } from "@/lib/mock-data";

// Carousel component
const FeaturedCarousel = () => {
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

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: session } = useSession();
  const [featuredMovie, setFeaturedMovie] = useState(movies[0]);
  const [currentTab, setCurrentTab] = useState<'now-showing'|'coming-soon'>('now-showing');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [genreList, setGenreList] = useState<string[]>([]);
  const [emailSubscription, setEmailSubscription] = useState("");
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  
  // Extract all unique genres from movies
  useEffect(() => {
    const allGenres = movies.flatMap(movie => movie.genres);
    const uniqueGenres = Array.from(new Set(allGenres)).sort();
    setGenreList(uniqueGenres);
    
    // Set default selected date to today
    const today = new Date();
    setSelectedDate(today.toISOString().split('T')[0]);
  }, []);
  
  const nowShowingMovies = movies.filter(movie => !movie.upcoming);
  const upcomingMovies = movies.filter(movie => movie.upcoming);
  
  const filterMoviesByGenre = (movieList: typeof movies) => {
    return movieList.filter(movie => 
      (selectedGenres.length === 0 || selectedGenres.some(genre => movie.genres.includes(genre)))
    );
  };
  
  const filterMoviesBySearch = (movieList: typeof movies) => {
    return searchTerm
      ? movieList.filter(movie => 
          movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          movie.genres.some(genre => genre.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      : movieList;
  };
  
  const filteredNowShowing = filterMoviesBySearch(filterMoviesByGenre(nowShowingMovies));
  const filteredUpcoming = filterMoviesBySearch(filterMoviesByGenre(upcomingMovies));
  
  // Toggle genre selection
  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };
  
  // Clear all selected genres
  const clearGenreFilters = () => {
    setSelectedGenres([]);
  };
  
  // Handle newsletter subscription
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate subscription process
    if (emailSubscription && emailSubscription.includes('@')) {
      setSubscribeSuccess(true);
      setEmailSubscription("");
      setTimeout(() => {
        setSubscribeSuccess(false);
      }, 5000);
    }
  };
    
  // Select a random featured movie each day
  useEffect(() => {
    const topRatedMovies = movies
      .filter(movie => movie.rating >= 8.0)
      .sort((a, b) => b.rating - a.rating);
    const randomIndex = Math.floor(Math.random() * Math.min(3, topRatedMovies.length));
    setFeaturedMovie(topRatedMovies[randomIndex] || movies[0]);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <BackgroundGradient />
      <Navbar />
      
      {/* Hero Section */}
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
      
      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-grow relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search for movies by title, genre, actor..."
                className="w-full py-4 pl-12 pr-4 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex-shrink-0">
              <button 
                className={`px-6 py-4 rounded-xl flex items-center gap-2 font-medium transition-all ${
                  showFilters 
                    ? "bg-primary-500 text-white" 
                    : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
                }`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                {showFilters ? "Hide Filters" : "Filters"}
                {selectedGenres.length > 0 && (
                  <span className="ml-1 bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 text-sm px-2 py-0.5 rounded-full">
                    {selectedGenres.length}
                  </span>
                )}
              </button>
            </div>
          </div>
          
          {/* Filter dropdown */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Filter by Genre:</h3>
                {selectedGenres.length > 0 && (
                  <button 
                    onClick={clearGenreFilters}
                    className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {genreList.map(genre => (
                  <button
                    key={genre}
                    onClick={() => toggleGenre(genre)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                      selectedGenres.includes(genre)
                        ? "bg-primary-500 text-white"
                        : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
                    }`}
                  >
                    {selectedGenres.includes(genre) && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="inline w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {genre}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Featured Carousel */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Featured Movies</h2>
        <FeaturedCarousel />
      </section>
      
      {/* Weekly Schedule Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center">
          <svg className="w-6 h-6 mr-2 text-primary-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Lịch chiếu phim trong tuần
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Xem lịch chiếu phim chi tiết theo từng ngày và đặt vé trước</p>
        
        {/* Date Selection */}
        <div className="flex overflow-x-auto pb-4 mb-8 gap-2 scrollbar-hide">
          {Array.from({ length: 7 }).map((_, idx) => {
            const date = new Date();
            date.setDate(date.getDate() + idx);
            const formattedDate = date.toISOString().split('T')[0];
            const isToday = idx === 0;
            const isTomorrow = idx === 1;
            
            return (
              <button
                key={formattedDate}
                onClick={() => setSelectedDate(formattedDate)}
                className={`flex-shrink-0 flex flex-col items-center px-4 py-3 rounded-lg transition-all ${
                  selectedDate === formattedDate
                    ? "bg-primary-600 text-white"
                    : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700"
                }`}
              >
                <span className="text-sm font-medium">
                  {isToday
                    ? "Hôm nay"
                    : isTomorrow
                    ? "Ngày mai"
                    : date.toLocaleDateString('vi-VN', { weekday: 'short' })}
                </span>
                <span className="text-lg font-bold mt-1">{date.getDate()}</span>
                <span className="text-xs mt-1">
                  {date.toLocaleDateString('vi-VN', { month: 'short' })}
                </span>
              </button>
            );
          })}
        </div>
        
        {/* Movies Schedule for Selected Date */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">
              Lịch chiếu: {new Date(selectedDate).toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </h3>
          </div>
          
          <div className="space-y-8">
            {(() => {
              // Check if there are any showtimes for the selected date
              const hasShowtimesForDate = showtimes.some(st => st.date === selectedDate);
              
              if (!hasShowtimesForDate) {
                return (
                  <div className="py-12 text-center">
                    <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                      <svg className="w-8 h-8 text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 2V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M16 2V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M3 9H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-medium mb-2">Không có suất chiếu</h4>
                    <p className="text-gray-500 dark:text-gray-400">
                      Không có suất chiếu phim nào vào ngày {new Date(selectedDate).toLocaleDateString('vi-VN')}. Vui lòng chọn một ngày khác.
                    </p>
                  </div>
                );
              }
              
              return theaters.map((theater) => {
                // Check if this theater has any showtime for selected date
                const theaterHasShowtimes = showtimes.some(
                  st => st.theaterId === theater.id && st.date === selectedDate
                );
                
                if (!theaterHasShowtimes) return null;
                
                return (
                  <div key={theater.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-lg">
                        <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          <path d="M19 15L19 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          <path d="M5 15L5 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          <path d="M2 9V7C2 5.89543 2.89543 5 4 5H20C21.1046 5 22 5.89543 22 7V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          <path d="M4 19H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">{theater.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{theater.location}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {movies
                        .filter(movie => !movie.upcoming)
                        .map(movie => {
                          // Find showtimes for this movie and theater on selected date
                          const movieShowtimes = showtimes.filter(
                            (st) => st.movieId === movie.id && 
                                 st.theaterId === theater.id && 
                                 st.date === selectedDate
                          );
                          
                          // Only show movies that have showtimes
                          if (movieShowtimes.length === 0) return null;
                          
                          return (
                            <div key={movie.id} className="flex p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                              <div className="w-16 h-24 flex-shrink-0 relative overflow-hidden rounded">
                                <Image
                                  src={movie.posterPath}
                                  alt={movie.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="ml-4 flex-grow">
                                <h5 className="font-bold mb-1 line-clamp-1">{movie.title}</h5>
                                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-3">
                                  <span className="mr-2">{movie.duration}</span>
                                  <span>•</span>
                                  <span className="mx-2">{movie.genres.slice(0, 2).join(", ")}</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {movieShowtimes.map((st) => (
                                    <Link
                                      key={st.id}
                                      href={`/booking/${movie.id}?showtime=${st.id}`}
                                      className="text-sm px-3 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
                                    >
                                      {st.time}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      </section>
      {/* Trending Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
              <polyline points="16 7 22 7 22 13" />
            </svg>
            <h2 className="text-2xl md:text-3xl font-bold">Trending Now</h2>
          </div>
          <Link href="/movies" className="text-primary-600 dark:text-primary-400 flex items-center hover:underline">
            See all <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </Link>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
          {nowShowingMovies
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 5)
            .map((movie) => (
              <MovieCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                posterPath={movie.posterPath}
                genres={movie.genres}
                rating={movie.rating}
              />
            ))}
        </div>
      </section>
      
      {/* Movies Tabs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-8">
          <button
            className={`px-6 py-3 text-lg font-medium border-b-2 -mb-px ${
              currentTab === 'now-showing'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setCurrentTab('now-showing')}
          >
            Now Showing
          </button>
          <button
            className={`px-6 py-3 text-lg font-medium border-b-2 -mb-px ${
              currentTab === 'coming-soon'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setCurrentTab('coming-soon')}
          >
            Coming Soon
          </button>
        </div>
        
        {currentTab === 'now-showing' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
            {(searchTerm ? filteredNowShowing : nowShowingMovies).map((movie) => (
              <MovieCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                posterPath={movie.posterPath}
                genres={movie.genres}
                rating={movie.rating}
              />
            ))}
            {searchTerm && filteredNowShowing.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">No movies found matching your search</p>
              </div>
            )}
          </div>
        )}
        
        {currentTab === 'coming-soon' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
            {(searchTerm ? filteredUpcoming : upcomingMovies).map((movie) => (
              <MovieCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                posterPath={movie.posterPath}
                genres={movie.genres}
                rating={movie.rating}
              />
            ))}
            {searchTerm && filteredUpcoming.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">No upcoming movies found matching your search</p>
              </div>
            )}
          </div>
        )}
      </section>
      
      {/* Upcoming Premieres */}
      <section className="py-16 bg-gradient-to-r from-primary-900/30 to-primary-600/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Upcoming Premieres</h2>
              <p className="text-gray-600 dark:text-gray-400">Be the first to watch these anticipated movies</p>
            </div>
            <Link href="/movies?tab=coming-soon" className="text-primary-600 dark:text-primary-400 flex items-center hover:underline">
              View all premieres <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {upcomingMovies
              .sort((a, b) => b.rating - a.rating)
              .slice(0, 3)
              .map(movie => (
                <div key={movie.id} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg group hover:shadow-xl transition-shadow">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={movie.backdropPath}
                      alt={movie.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-md">
                      Coming Soon
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 line-clamp-1">{movie.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                      {movie.synopsis}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Release Date: {new Date().toLocaleDateString()}
                      </div>
                      <Link 
                        href={`/movies/${movie.id}`} 
                        className="text-primary-600 dark:text-primary-400 text-sm font-medium hover:underline"
                      >
                        More Info
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </section>
      
      {/* Promotions Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">Special Offers</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-r from-primary-600 to-primary-400 rounded-2xl overflow-hidden shadow-lg text-white relative">
            <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
              <div className="w-full h-full bg-[url('https://www.svgrepo.com/show/372589/ticket.svg')] bg-no-repeat bg-center transform rotate-12 scale-150"></div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-2">Weekend Special</h3>
              <p className="mb-4">Get 20% off on all movie tickets this weekend!</p>
              <div className="text-3xl font-bold mb-4">SAVE20</div>
              <p className="text-sm opacity-80">Valid from Friday to Sunday. Terms apply.</p>
              <button className="mt-4 bg-white text-primary-600 font-medium py-2 px-6 rounded-full inline-block hover:bg-opacity-90 transition-all">
                Claim Offer
              </button>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-secondary-600 to-secondary-400 rounded-2xl overflow-hidden shadow-lg text-white relative">
            <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
              <div className="w-full h-full bg-[url('https://www.svgrepo.com/show/431791/popcorn.svg')] bg-no-repeat bg-center transform rotate-12 scale-150"></div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-2">Combo Deal</h3>
              <p className="mb-4">Buy 2 tickets and get a free popcorn & drink!</p>
              <div className="text-3xl font-bold mb-4">COMBO2</div>
              <p className="text-sm opacity-80">For all movies. Limited time only.</p>
              <button className="mt-4 bg-white text-secondary-600 font-medium py-2 px-6 rounded-full inline-block hover:bg-opacity-90 transition-all">
                Claim Offer
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center">What Our Customers Say</h2>
        <p className="text-gray-600 dark:text-gray-400 text-center max-w-2xl mx-auto mb-12">
          Thousands of movie lovers choose our platform for the best cinema experience
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-card hover:shadow-card-hover transition-shadow">
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-yellow-500" />
                ))}
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-6 italic">
              "The booking process was seamless and the seat selection feature is amazing! I love being able to see the exact view from my seat before booking."
            </p>
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-lg">
                JD
              </div>
              <div className="ml-3">
                <h4 className="font-medium">Jane Doe</h4>
                <p className="text-sm text-gray-500">Movie Enthusiast</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-card hover:shadow-card-hover transition-shadow">
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-yellow-500" />
                ))}
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-6 italic">
              "I've been using this service for months and it's by far the best movie booking platform. The interface is intuitive and they always have great promotions!"
            </p>
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-secondary-100 dark:bg-secondary-900 flex items-center justify-center text-secondary-600 dark:text-secondary-400 font-bold text-lg">
                JS
              </div>
              <div className="ml-3">
                <h4 className="font-medium">John Smith</h4>
                <p className="text-sm text-gray-500">Film Critic</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-card hover:shadow-card-hover transition-shadow">
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className={i < 4 ? "fill-yellow-500" : ""} />
                ))}
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-6 italic">
              "The QR code ticket system is fantastic and their customer support team helped me quickly when I needed to reschedule. Very happy with the service!"
            </p>
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-400 font-bold text-lg">
                AK
              </div>
              <div className="ml-3">
                <h4 className="font-medium">Alex Kim</h4>
                <p className="text-sm text-gray-500">Regular User</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Movie News & Articles Section */}
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
              <Link href={`/articles/${articles[0].id}`} className="group">
                <div className="relative h-64 w-full">
                  <Image
                    src={articles[0].imagePath}
                    alt={articles[0].title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full">
                      {articles[0].category}
                    </span>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-500 mr-1" />
                      <span className="text-sm text-gray-500">{articles[0].readTime} phút đọc</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {articles[0].title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                    {articles[0].excerpt}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full overflow-hidden mr-2 border border-gray-200 dark:border-gray-700">
                        <Image
                          src={articles[0].authorAvatar}
                          alt={articles[0].author}
                          width={32}
                          height={32}
                          className="object-cover"
                        />
                      </div>
                      <span className="text-sm font-medium">{articles[0].author}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(articles[0].date).toLocaleDateString('vi-VN')}
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
                        {article.category}
                      </div>
                      <h3 className="font-bold mb-1 line-clamp-2 text-sm group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {article.title}
                      </h3>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>{article.author}</span>
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
      
      {/* Newsletter Section */}
      <section className="bg-primary-50 dark:bg-primary-900/30 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-1/2">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Stay Updated</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-lg mb-6">
                Subscribe to our newsletter to get the latest updates on new movie releases, 
                exclusive promotions, and special events right in your inbox.
              </p>
              
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <div className="flex-grow relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full py-3 pl-12 pr-4 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 border border-gray-300 dark:border-gray-600"
                    value={emailSubscription}
                    onChange={(e) => setEmailSubscription(e.target.value)}
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-xl transition-colors"
                >
                  Subscribe
                </button>
              </form>
              
              {subscribeSuccess && (
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg flex items-center animate-fade-in">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 0 0-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p>Thank you for subscribing! You'll now receive our latest movie updates.</p>
                </div>
              )}
              
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                By subscribing, you agree to our Terms and Privacy Policy. You can unsubscribe at any time.
              </p>
            </div>
            
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-72 h-56">
                <div className="absolute -top-2 -left-2 w-16 h-16 bg-primary-500 rounded-full opacity-20"></div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-secondary-500 rounded-full opacity-20"></div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 relative z-10 h-full flex flex-col justify-center">
                  <div className="flex justify-center mb-6">
                    <svg className="w-16 h-16 text-primary-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold mb-2">Weekly Movie Updates</h3>
                    <p className="text-gray-600 dark:text-gray-300">Get the latest releases and exclusive offers directly to your inbox</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-gray-100 dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Download Our Mobile App</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            Get exclusive offers, book tickets faster, and enjoy a seamless movie experience
            with our mobile application.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-black text-white flex items-center py-3 px-6 rounded-lg hover:bg-gray-900">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.57 12.66l-3.19 3.19a.75.75 0 1 0-1.06-1.06l3.75-3.75a.75.75 0 0 0 0-1.06l-3.75-3.75a.75.75 0 1 0-1.06 1.06l3.19 3.19 3.19-3.19a.75.75 0 1 0 1.06 1.06l-3.75 3.75a.75.75 0 0 0 0 1.06l3.75 3.75a.75.75 0 1 0-1.06 1.06l-3.19-3.19z"/>
                <path d="M17.004 4.06c.93.26 1.833.541 2.73.82a1.722 1.722 0 0 1 1.266 1.654V17.5c0 .703-.437 1.329-1.104 1.56-.995.345-1.979.694-2.955 1.041-.963.341-1.934.683-2.932.982-1.644.494-3.044-.456-3.043-2.037V4.954c0-1.58 1.396-2.529 3.039-2.037 1.003.301 1.978.642 2.946.983.982.346 1.955.693 2.944 1.036a1.722 1.722 0 0 1 1.109 1.638V17.5c0 .703-.436 1.33-1.104 1.561l-.401-.402A.749.749 0 0 0 17 18a.752.752 0 0 0-.75.75c0 .199.079.39.22.53l1.825 1.824a.748.748 0 0 0 1.06 0l1.823-1.823a.748.748 0 1 0-1.06-1.06l-.336.336a2.597 2.597 0 0 0 1.218-2.195V6.534c0-2.189-1.606-4.165-3.776-4.59a57.278 57.278 0 0 0-2.979-1.045c-1.02-.36-2.025-.719-3.006-1.04-2.46-.741-4.903.867-4.9 3.338v12.05c0 2.473 2.454 4.08 4.916 3.334.969-.292 1.949-.633 2.922-.973.984-.346 1.956-.692 2.928-1.04a2.603 2.603 0 0 0 1.891-2.482V6.469c0-2.264-1.86-4.091-4.088-4.091h-7.75C3.15 2.378 1.29 4.206 1.29 6.47V17.5c0 2.265 1.86 4.093 4.087 4.093h7.751c2.228 0 4.088-1.828 4.088-4.093V6.47c0-2.265-1.86-4.092-4.088-4.092H4.967a.75.75 0 0 0 0 1.5h8.16c1.5 0 2.588 1.275 2.588 2.591V17.5c0 1.317-1.088 2.593-2.588 2.593H5.377c-1.5 0-2.588-1.276-2.588-2.593V6.47c0-1.316 1.088-2.591 2.588-2.591h3.091a.75.75 0 0 0 0-1.5H5.377c-2.228 0-4.088 1.827-4.088 4.091V17.5c0 2.265 1.86 4.093 4.088 4.093h8.158c2.228 0 4.088-1.828 4.088-4.093V6.47c0-2.265-1.86-4.091-4.088-4.091H5.377c-2.228 0-4.088 1.826-4.088 4.09V17.5c0 2.265 1.86 4.093 4.088 4.093h7.75c2.229 0 4.088-1.828 4.088-4.093V6.47c0-2.265-1.86-4.091-4.088-4.091h-7.75c-2.228 0-4.088 1.826-4.088 4.09V17.5c0 2.265 1.86 4.093 4.088 4.093h7.75c2.228 0 4.088-1.828 4.088-4.093V6.47c0-2.264-1.86-4.091-4.088-4.091H5.377a.75.75 0 0 0-.75.75v14.873a.75.75 0 0 0 1.5 0V3.879h7.746" fillRule="evenodd"/>
              </svg>
              <div className="text-left">
                <div className="text-xs">Download on the</div>
                <div className="text-sm font-semibold">App Store</div>
              </div>
            </button>
            <button className="bg-black text-white flex items-center py-3 px-6 rounded-lg hover:bg-gray-900">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.523 8.646a.5.5 0 0 1 .71-.001l2.858 2.858a.5.5 0 0 1 0 .708l-2.858 2.857a.5.5 0 0 1-.708-.707l1.964-1.964H6.207a.5.5 0 1 1 0-1h13.293l-1.97-1.97a.5.5 0 0 1-.008-.78l.001-.001zM5.707 8.648a.5.5 0 0 0-.708-.002L2.141 11.5a.5.5 0 0 0 0 .708l2.858 2.857a.5.5 0 0 0 .708-.707l-1.965-1.964h13.262a.5.5 0 1 0 0-1H3.742L5.715 9.43a.5.5 0 0 0 .007-.778l-.015-.004z" fillRule="evenodd"/>
              </svg>
              <div className="text-left">
                <div className="text-xs">GET IT ON</div>
                <div className="text-sm font-semibold">Google Play</div>
              </div>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
} 