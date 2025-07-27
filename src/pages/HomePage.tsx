import { useState, useMemo, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getNowPlaying, getTopRated, getUpcoming, getTrending, getPopular, getInTheaters, getHighlyRated, Movie } from '../services/tmdb'
import MovieSlider from '../components/MovieSlider'
import Hero from '../components/Hero'
import MovieStats from '../components/MovieStats'
import LoadingSkeleton from '../components/LoadingSkeleton'
import PersonalizedRecommendations from '../components/PersonalizedRecommendations'
import InteractiveCategories from '../components/InteractiveCategories'
import { useThemeStore } from '../store/themeStore'

import MovieFilters from '../components/MovieFilters'

function HomePage() {
  const { isDarkMode } = useThemeStore()

  const exploreRef = useRef<HTMLDivElement>(null)

  const [filters, setFilters] = useState<{
    search: string;
    sort: string;
    selectedGenres: number[];
  }>({
    search: '',
    sort: 'title',
    selectedGenres: []
  })

  // Use diverse React Query hooks for different content
  const { data: trending, isLoading: loadingTrending } = useQuery({
    queryKey: ['trending', 'day'],
    queryFn: () => getTrending('day'),
    staleTime: 1000 * 60 * 30,
  })

  const { data: nowPlaying, isLoading: loadingNowPlaying } = useQuery({
    queryKey: ['inTheaters'],
    queryFn: async () => {
      try {
        const result = await getInTheaters()
        // If no results, fallback to now playing
        if (!result.results || result.results.length === 0) {
          return await getNowPlaying()
        }
        return result
      } catch (error) {
        return await getNowPlaying()
      }
    },
    staleTime: 1000 * 60 * 15,
  })

  const { data: popular, isLoading: loadingPopular } = useQuery({
    queryKey: ['popular'],
    queryFn: getPopular,
    staleTime: 1000 * 60 * 25,
  })

  const { data: topRated, isLoading: loadingTopRated } = useQuery({
    queryKey: ['highlyRated'],
    queryFn: async () => {
      try {
        const result = await getHighlyRated()
        // If no results, fallback to top rated
        if (!result.results || result.results.length === 0) {
          return await getTopRated()
        }
        return result
      } catch (error) {
        return await getTopRated()
      }
    },
    staleTime: 1000 * 60 * 30,
  })

  const { data: upcoming, isLoading: loadingUpcoming } = useQuery({
    queryKey: ['upcoming'],
    queryFn: getUpcoming,
    staleTime: 1000 * 60 * 20,
  })

  const getFilteredAndSortedMovies = (movies: Movie[]) => {
    if (!movies) return []

    let filtered = movies.filter((movie) =>
      movie.title.toLowerCase().includes(filters.search.toLowerCase())
    )

    if (filters.selectedGenres.length > 0) {
      filtered = filtered.filter((movie) =>
        movie.genre_ids.some((genreId) => filters.selectedGenres.includes(genreId))
      )
    }

    return filtered.sort((a, b) => {
      switch (filters.sort) {
        case 'title':
          return a.title.localeCompare(b.title)
        case 'title-desc':
          return b.title.localeCompare(a.title)
        case 'rating':
          return b.vote_average - a.vote_average
        case 'rating-asc':
          return a.vote_average - b.vote_average
        default:
          return 0
      }
    })
  }

  const filteredNowPlaying = useMemo(
    () => getFilteredAndSortedMovies(nowPlaying?.results || []),
    [nowPlaying, filters]
  )

  const filteredTopRated = useMemo(
    () => getFilteredAndSortedMovies(topRated?.results || []),
    [topRated, filters]
  )

  const filteredUpcoming = useMemo(
    () => getFilteredAndSortedMovies(upcoming?.results || []),
    [upcoming, filters]
  )

  const filteredTrending = useMemo(
    () => getFilteredAndSortedMovies(trending?.results || []),
    [trending, filters]
  )

  const filteredPopular = useMemo(
    () => getFilteredAndSortedMovies(popular?.results || []),
    [popular, filters]
  )

  const handleExploreClick = () => {
    exploreRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const isLoading = loadingNowPlaying || loadingTopRated || loadingUpcoming || loadingTrending || loadingPopular

  if (isLoading) {
    return (
      <div>
        <LoadingSkeleton type="hero" />
        <LoadingSkeleton type="stats" />
        <div className="container mx-auto px-4 py-8 space-y-12">
          <LoadingSkeleton type="movieSlider" />
          <LoadingSkeleton type="movieSlider" />
          <LoadingSkeleton type="movieSlider" />
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Hero Section */}
      <Hero onExploreClick={handleExploreClick} />

      {/* Movie Statistics Dashboard */}
      <MovieStats />

      {/* Main Content */}
      <div ref={exploreRef} className={`${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} py-12`}>
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Explore Movies
            </h2>
            <p className="text-lg opacity-75 max-w-2xl mx-auto mb-8">
              Discover trending movies, top-rated classics, and upcoming releases
            </p>

            {/* Filters */}
            <div className="max-w-4xl mx-auto">
              <MovieFilters
                sortBy={filters.sort}
                selectedGenres={filters.selectedGenres}
                onSortChange={(value) => setFilters(prev => ({ ...prev, sort: value }))}
                onSearchChange={(value) => setFilters(prev => ({ ...prev, search: value }))}
                onGenreChange={(genreId) => setFilters(prev => ({
                  ...prev,
                  selectedGenres: prev.selectedGenres.includes(genreId)
                    ? prev.selectedGenres.filter(id => id !== genreId)
                    : [...prev.selectedGenres, genreId]
                } as { search: string; sort: string; selectedGenres: number[] }))}
                isDarkMode={isDarkMode}
              />
            </div>
          </div>

          {/* Movie Sections */}
          <div className="space-y-16">
            {/* Trending Today */}
            <section className="animate-fade-in">
              <MovieSlider
                title="🔥 Trending Today"
                movies={filteredTrending}
                isDarkMode={isDarkMode}
              />
            </section>

            {/* In Theaters Now */}
            <section className="animate-fade-in">
              <MovieSlider
                title="🎬 In Theaters Now"
                movies={filteredNowPlaying}
                isDarkMode={isDarkMode}
              />
            </section>

            {/* All-Time Popular */}
            <section className="animate-fade-in">
              <MovieSlider
                title="⭐ All-Time Popular"
                movies={filteredPopular}
                isDarkMode={isDarkMode}
              />
            </section>

            {/* Highly Rated Recent */}
            <section className="animate-fade-in">
              <MovieSlider
                title="🏆 Highly Rated Recent"
                movies={filteredTopRated}
                isDarkMode={isDarkMode}
              />
            </section>

            {/* Coming Soon */}
            <section className="animate-fade-in">
              <MovieSlider
                title="🚀 Coming Soon"
                movies={filteredUpcoming}
                isDarkMode={isDarkMode}
              />
            </section>
          </div>
        </div>
      </div>

      {/* Interactive Categories */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} py-16`}>
        <div className="container mx-auto px-4">
          <InteractiveCategories />
        </div>
      </div>

      {/* Personalized Recommendations */}
      <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} py-16`}>
        <div className="container mx-auto px-4">
          <PersonalizedRecommendations />
        </div>
      </div>
    </div>
  )
}

export default HomePage









