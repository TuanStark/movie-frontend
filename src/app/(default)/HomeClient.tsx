"use client";

import { useState, useEffect } from "react";
import BackgroundGradient from "@/components/BackgroundGradient";
import ScheduleMovie from "@/src/components/home/ScheduleMovie";
import { ArticleSection } from "@/src/components/home/ArtivcleSection";
import { MovieTabsSection } from "@/src/components/home/MovieTabsSection";
import { SearchFilterSection } from "@/src/components/home/SearchFilterSection";
import { HeroSection } from "@/src/components/home/HeroSection";
import { TrendingSection } from "@/src/components/home/TrendingSection";
import { UpcomingReleasesSection } from "@/src/components/home/UpcomingReleasesSection";
import { Movie } from "@/types/global-type";
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json() as Promise<GenericResponse<Movie>>);

export default function HomeClient() {
    const [searchTerm, setSearchTerm] = useState("");
    const [featuredMovie, setFeaturedMovie] = useState<Movie[]>([]);
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

    const { data, error, isLoading } = useSWR<GenericResponse<Movie>>(
        `${process.env.NEXT_PUBLIC_API_URL}/movies?limit=5&sortOrder=desc`, // Thay bằng endpoint thực tế
        fetcher,
        {
            revalidateIfStale: false,
            refreshInterval: 3000,
        }
    );

    useEffect(() => {
        if (data) {
            setFeaturedMovie(data.data.data);
        }
    }, [data]);


    // const nowShowingMovies = movies.filter(movie => !movie.upcoming);
    // const upcomingMovies = movies.filter(movie => movie.upcoming);

    // const filterMoviesByGenre = (movieList: typeof movies) => {
    //     return movieList.filter(movie =>
    //         (selectedGenres.length === 0 || selectedGenres.some(genre => movie.genres.includes(genre)))
    //     );
    // };

    // const filterMoviesBySearch = (movieList: typeof movies) => {
    //     return searchTerm
    //         ? movieList.filter(movie =>
    //             movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //             movie.genres.some(genre => genre.toLowerCase().includes(searchTerm.toLowerCase()))
    //         )
    //         : movieList;
    // };

    // // const filteredNowShowing = filterMoviesBySearch(filterMoviesByGenre(nowShowingMovies));
    // // const filteredUpcoming = filterMoviesBySearch(filterMoviesByGenre(upcomingMovies));

    // // Toggle genre selection
    // const toggleGenre = (genre: string) => {
    //     setSelectedGenres(prev =>
    //         prev.includes(genre)
    //             ? prev.filter(g => g !== genre)
    //             : [...prev, genre]
    //     );
    // };

    // // Clear all selected genres
    // const clearGenreFilters = () => {
    //     setSelectedGenres([]);
    // };

    // // Handle newsletter subscription
    // const handleSubscribe = (e: React.FormEvent) => {
    //     e.preventDefault();
    //     // Simulate subscription process
    //     if (emailSubscription && emailSubscription.includes('@')) {
    //         setSubscribeSuccess(true);
    //         setEmailSubscription("");
    //         setTimeout(() => {
    //             setSubscribeSuccess(false);
    //         }, 5000);
    //     }
    // };

    // Select a random featured movie each day
    // useEffect(() => {
    //     const topRatedMovies = movies
    //         .filter(movie => movie.rating >= 8.0)
    //         .sort((a, b) => b.rating - a.rating);
    //     const randomIndex = Math.floor(Math.random() * Math.min(3, topRatedMovies.length));
    //     setFeaturedMovie(topRatedMovies[randomIndex] || movies[0]);
    // }, []);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading movies</div>;

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <BackgroundGradient />

            {/* Hero Section */}
            <HeroSection featuredMovie={featuredMovie} />


            {/* Search and Filter Section */}
            <SearchFilterSection searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedGenres={selectedGenres} setSelectedGenres={setSelectedGenres} />

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