"use client";

import { useState, useEffect } from "react";
import BackgroundGradient from "@/components/BackgroundGradient";
import { movies } from "@/lib/mock-data";
import ScheduleMovie from "@/src/components/home/ScheduleMovie";
import { ArticleSection } from "@/src/components/home/ArtivcleSection";
import { MovieTabsSection } from "@/src/components/home/MovieTabsSection";
import { SearchFilterSection } from "@/src/components/home/SearchFilterSection";
import { HeroSection } from "@/src/components/home/HeroSection";
import { TrendingSection } from "@/src/components/home/TrendingSection";
import { UpcomingReleasesSection } from "@/src/components/home/UpcomingReleasesSection";

export default function DefaultHome() {
  const [searchTerm, setSearchTerm] = useState("");
  // const { data: session } = useSession();
  const [featuredMovie, setFeaturedMovie] = useState(movies[0]);
  // const [currentTab, setCurrentTab] = useState<'now-showing'|'coming-soon'>('now-showing');
  // const [showFilters, setShowFilters] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  // const [genreList, setGenreList] = useState<string[]>([]);
  const [emailSubscription, setEmailSubscription] = useState("");
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);
  
  
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
  
  // const filteredNowShowing = filterMoviesBySearch(filterMoviesByGenre(nowShowingMovies));
  // const filteredUpcoming = filterMoviesBySearch(filterMoviesByGenre(upcomingMovies));
  
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
      {/* <Navbar /> */}
      
      {/* Hero Section */}
      <HeroSection featuredMovie={featuredMovie} />

      
      {/* Search and Filter Section */}
      <SearchFilterSection searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedGenres={selectedGenres} setSelectedGenres={setSelectedGenres}/>
      
      {/* Weekly Schedule Section */}
      <ScheduleMovie />

      {/* Trending Section */}
      <TrendingSection />
      
      {/* Movies Tabs Section */}
      <MovieTabsSection selectedGenres={[]} searchTerm={""} />
      
      {/* Upcoming Premieres */}
      <UpcomingReleasesSection />
      
      {/* Promotions Section */}
      {/* <SpecialOffers /> */}
      
      {/* Testimonials Section */}
      {/* <FeedBackSection /> */}
      
      {/* Movie News & Articles Section */}
      <ArticleSection />
      
      {/* Newsletter Section */}
      {/* <NewsletterSection /> */}

    </main>
  );
} 