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
import { HomeSkeleton } from "../../components/skeletons/HomeSkeleton";
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json() as Promise<GenericResponse<Movie>>);

export default function HomeClient() {
    const [searchTerm, setSearchTerm] = useState("");
    const [featuredMovie, setFeaturedMovie] = useState<Movie[]>([]);
    const [selectedGenres, setSelectedGenres] = useState<number[]>([]);

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

    if (isLoading) return <HomeSkeleton />;
    if (error) return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Error loading movies
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Please try refreshing the page
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="btn-primary"
                >
                    Refresh Page
                </button>
            </div>
        </div>
    );

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