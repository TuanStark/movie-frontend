"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Menu } from "lucide-react";
import MovieCard from "@/components/MovieCard";
import BackgroundGradient from "@/components/BackgroundGradient";
import useSWR from 'swr';
import { Genre, Movie } from "@/types/global-type";
import Pagination, { PaginationMeta } from '../../../components/ui/Pagination';
import MovieSkeleton from '../../../components/ui/MovieSkeleton';

interface GenericResponse<T> {
  data: T[];
  meta: {
    total: number;
    pageNumber: number;
    limitNumber: number;
    totalPages: number;
  };
}


const fetcherMovie = (url: string) => fetch(url).then((res) => res.json() as Promise<GenericResponse<Movie>>);
const fetcherGenre = (url: string) => fetch(url).then((res) => res.json() as Promise<GenericResponse<Genre>>);


export default function MoviesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [movies, setMovie] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);

  // Get state from URL parameters
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
  const [limit, setLimit] = useState(Number(searchParams.get('limit')) || 10);
  const [selectedGenres, setSelectedGenres] = useState<number[]>(
    searchParams.get('genreIds')?.split(',').map(Number).filter(Boolean) || []
  );
  const [currentTab, setCurrentTab] = useState<'all' | 'now-showing' | 'coming-soon'>(
    searchParams.get('upcoming') === 'true' ? 'coming-soon' : 'all'
  );

  // Derived state: upcoming is true when tab is 'coming-soon'
  const upcoming = currentTab === 'coming-soon';

  // Function to update URL with current state
  const updateURL = () => {
    const params = new URLSearchParams();

    if (searchTerm) params.set('search', searchTerm);
    if (selectedGenres.length > 0) params.set('genreIds', selectedGenres.join(','));
    if (upcoming) params.set('upcoming', 'true');
    if (currentPage !== 1) params.set('page', currentPage.toString());
    if (limit !== 10) params.set('limit', limit.toString());

    const newUrl = `/movies${params.toString() ? `?${params.toString()}` : ''}`;
    router.replace(newUrl);
  };

  // Sync state with URL parameters when they change
  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '');
    setCurrentPage(Number(searchParams.get('page')) || 1);
    setLimit(Number(searchParams.get('limit')) || 10);
    setSelectedGenres(searchParams.get('genreIds')?.split(',').map(Number).filter(Boolean) || []);
    setCurrentTab(searchParams.get('upcoming') === 'true' ? 'coming-soon' : 'all');
  }, [searchParams]);



  // Tạo URL với search và filter parameters
  const buildApiUrl = () => {
    const params = new URLSearchParams({
      page: currentPage.toString(),
      limit: limit.toString(),
    });

    if (searchTerm) {
      params.append('search', searchTerm);
    }

    if (selectedGenres.length > 0) {
      params.append('genreIds', selectedGenres.join(','));
    }

    if (upcoming) {
      params.append('upcoming', 'true');
    }

    return `${process.env.NEXT_PUBLIC_API_URL}/movies?${params.toString()}`;
  };

  const apiUrl = buildApiUrl();
  const { data, isLoading } = useSWR<GenericResponse<Movie>>(
    apiUrl,
    fetcherMovie,
    {
      revalidateIfStale: false,
      refreshInterval: 3000,
    }
  );

  const { data: genresData, isLoading: isLoadingGenres } = useSWR<GenericResponse<Genre>>(
    `${process.env.NEXT_PUBLIC_API_URL}/genres?limit=20`,
    fetcherGenre,
    {
      revalidateIfStale: false,
      refreshInterval: 3000,
    }
  );

  useEffect(() => {
    if (data) {
      // Handle flat structure: { data: [...], meta: {...} }
      if (data.data && Array.isArray(data.data) && data.meta) {
        setMovie(data.data);
        setMeta(data.meta);
      }
      // Handle nested structure: { data: { data: [...], meta: {...} } }
      else if ((data as any).data?.data && (data as any).data?.meta) {
        setMovie((data as any).data.data);
        setMeta((data as any).data.meta);
      }
    }
  }, [data]);

  useEffect(() => {
    if (genresData) {
      // Handle flat structure: { data: [...], meta: {...} }
      if (genresData.data && Array.isArray(genresData.data)) {
        setGenres(genresData.data);
      }
      // Handle nested structure: { data: { data: [...], meta: {...} } }
      else if ((genresData as any).data?.data) {
        setGenres((genresData as any).data.data);
      }
    }
  }, [genresData]);


  // Sử dụng movies trực tiếp vì đã được filter từ server
  const filteredMovies = movies;



  const handleGenreToggle = (id: number) => {
    const newGenres = selectedGenres.includes(id)
      ? selectedGenres.filter(g => g !== id)
      : [...selectedGenres, id];

    setSelectedGenres(newGenres);
    setCurrentPage(1); // Reset to page 1 when genres change

    // Build URL manually to avoid encoding issues
    const urlParts = [];
    if (searchTerm) urlParts.push(`search=${encodeURIComponent(searchTerm)}`);
    if (newGenres.length > 0) urlParts.push(`genreIds=${newGenres.join(',')}`);
    if (upcoming) urlParts.push(`upcoming=true`);
    if (limit !== 10) urlParts.push(`limit=${limit}`);

    const newUrl = `/movies${urlParts.length > 0 ? `?${urlParts.join('&')}` : ''}`;
    router.replace(newUrl);
  };

  const clearFilters = () => {
    setSelectedGenres([]);
    setSearchTerm("");
    setCurrentPage(1);

    // Build URL manually
    const urlParts = [];
    if (upcoming) urlParts.push(`upcoming=true`);
    if (limit !== 10) urlParts.push(`limit=${limit}`);

    const newUrl = `/movies${urlParts.length > 0 ? `?${urlParts.join('&')}` : ''}`;
    router.replace(newUrl);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);

    // Build URL manually
    const urlParts = [];
    if (value) urlParts.push(`search=${encodeURIComponent(value)}`);
    if (selectedGenres.length > 0) urlParts.push(`genreIds=${selectedGenres.join(',')}`);
    if (upcoming) urlParts.push(`upcoming=true`);
    if (limit !== 10) urlParts.push(`limit=${limit}`);

    const newUrl = `/movies${urlParts.length > 0 ? `?${urlParts.join('&')}` : ''}`;
    router.replace(newUrl);
  };

  const handleTabChange = (tab: 'all' | 'now-showing' | 'coming-soon') => {
    setCurrentTab(tab);
    setCurrentPage(1);

    // Build URL manually
    const urlParts = [];
    if (searchTerm) urlParts.push(`search=${encodeURIComponent(searchTerm)}`);
    if (selectedGenres.length > 0) urlParts.push(`genreIds=${selectedGenres.join(',')}`);
    if (tab === 'coming-soon') urlParts.push(`upcoming=true`);
    if (limit !== 10) urlParts.push(`limit=${limit}`);

    const newUrl = `/movies${urlParts.length > 0 ? `?${urlParts.join('&')}` : ''}`;
    router.replace(newUrl);
  };
  

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <BackgroundGradient />
      {/* <Navbar /> */}

      {/* Page Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Khám phá Phim của Chúng tôi
          </h1>
          <p className="text-white/80 max-w-2xl">
            Duyệt qua bộ sưu tập phim đang chiếu và sắp chiếu của chúng tôi. Tìm bộ phim hoàn hảo cho trải nghiệm điện ảnh tiếp theo của bạn.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search box */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search movies..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-primary-500 focus:border-primary-500"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          </div>

          {/* Filters dropdown */}
          <div className="relative group">
            <button className="flex items-center px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750">
              <Menu className="h-5 w-5 mr-2" />
              Filters {selectedGenres.length > 0 && `(${selectedGenres.length})`}
            </button>

            <div className="absolute right-0 top-full mt-2 w-60 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 z-20 hidden group-hover:block">
              <div className="grid grid-cols-2 items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Genres</h3>
                {selectedGenres.length > 0 && (
                  <div className="text-right">
                    <button
                      onClick={clearFilters}
                      className="text-sm text-primary-600 hover:underline"
                    >
                      Clear All
                    </button>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {isLoadingGenres ? (
                  // Skeleton for genres
                  Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                  ))
                ) : (
                  genres.map(genre => (
                    <button
                      key={genre.id}
                      onClick={() => handleGenreToggle(genre.id)}
                      className={`px-3 py-1 rounded-full text-xs ${selectedGenres.includes(genre.id)
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                    >
                      {genre.name}
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-8">
          <button
            onClick={() => handleTabChange('all')}
            className={`px-6 py-3 font-medium text-sm ${currentTab === 'all'
              ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500'
              : 'text-gray-500 dark:text-gray-400'
              }`}
          >
            Tất cả phim
          </button>
          <button
            onClick={() => handleTabChange('now-showing')}
            className={`px-6 py-3 font-medium text-sm ${currentTab === 'now-showing'
              ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500'
              : 'text-gray-500 dark:text-gray-400'
              }`}
          >
            Đang chiếu
          </button>
          <button
            onClick={() => handleTabChange('coming-soon')}
            className={`px-6 py-3 font-medium text-sm ${currentTab === 'coming-soon'
              ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500'
              : 'text-gray-500 dark:text-gray-400'
              }`}
          >
            Sắp ra mắt
          </button>
        </div>

        {/* Movie Grid */}
        {isLoading ? (
          <MovieSkeleton
            count={limit}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
            {filteredMovies.length > 0 ? (
              filteredMovies.map(movie => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                />
              ))
            ) : (
              <div className="col-span-full py-12 text-center">
                <h3 className="text-xl font-medium mb-2">No movies found</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>
        )}


        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div className="mt-12">
            <Pagination
              meta={meta}
              currentPage={currentPage}
              onPageChange={(page) => {
                setCurrentPage(page);
                // Build URL manually
                const urlParts = [];
                if (searchTerm) urlParts.push(`search=${encodeURIComponent(searchTerm)}`);
                if (selectedGenres.length > 0) urlParts.push(`genreIds=${selectedGenres.join(',')}`);
                if (currentTab === 'coming-soon') urlParts.push(`upcoming=true`);
                if (page !== 1) urlParts.push(`page=${page}`);
                if (limit !== 10) urlParts.push(`limit=${limit}`);

                const newUrl = `/movies${urlParts.length > 0 ? `?${urlParts.join('&')}` : ''}`;
                router.replace(newUrl);
              }}
              onLimitChange={(newLimit) => {
                setLimit(newLimit);
                setCurrentPage(1);
                // Build URL manually
                const urlParts = [];
                if (searchTerm) urlParts.push(`search=${encodeURIComponent(searchTerm)}`);
                if (selectedGenres.length > 0) urlParts.push(`genreIds=${selectedGenres.join(',')}`);
                if (currentTab === 'coming-soon') urlParts.push(`upcoming=true`);
                if (newLimit !== 10) urlParts.push(`limit=${newLimit}`);

                const newUrl = `/movies${urlParts.length > 0 ? `?${urlParts.join('&')}` : ''}`;
                router.replace(newUrl);
              }}
              showLimitSelector={true}
              limitOptions={[5, 8, 10, 20]}
              className="justify-center"
              syncWithURL={false}
            />
          </div>
        )}
      </div>
    </main>
  );
} 