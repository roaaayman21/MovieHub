import { useState, useMemo, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { searchMovies, imageUrls } from '../services/tmdb'
import { useThemeStore } from '../store/themeStore'
import { useMovieDataStore } from '../store/movieDataStore'
import { Link } from 'react-router-dom'
import MovieFilters from '../components/MovieFilters'
import LoadingSkeleton from '../components/LoadingSkeleton'

function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('title')
  const [selectedGenres, setSelectedGenres] = useState<number[]>([])
  const { isDarkMode } = useThemeStore()
  const { addToSearchHistory, addToRecentlyViewed, getPopularSearches } = useMovieDataStore()

  // Use simple React Query hook
  const { data, isLoading } = useQuery({
    queryKey: ['search', searchQuery],
    queryFn: () => searchMovies(searchQuery),
    enabled: searchQuery.length > 0,
    staleTime: 1000 * 60 * 5,
  })

  const popularSearches = getPopularSearches()

  // Track search queries
  useEffect(() => {
    if (searchQuery.trim() && searchQuery.length > 2) {
      const timeoutId = setTimeout(() => {
        addToSearchHistory(searchQuery)
      }, 1000) // Debounce search history tracking

      return () => clearTimeout(timeoutId)
    }
  }, [searchQuery, addToSearchHistory])

  const handleMovieClick = (movieId: number) => {
    addToRecentlyViewed(movieId)
  }

  const filteredAndSortedMovies = useMemo(() => {
    if (!data?.results) return []

    let filtered = data.results

    // Apply genre filtering
    if (selectedGenres.length > 0) {
      filtered = filtered.filter((movie) =>
        movie.genre_ids.some((genreId) => selectedGenres.includes(genreId))
      )
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
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
  }, [data, selectedGenres, sortBy])

  const handleGenreChange = (genreId: number) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId]
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      {/* Page Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
          🔍 Search Movies
        </h1>
        <p className="text-lg opacity-75 max-w-2xl mx-auto">
          Discover your next favorite movie from millions of titles
        </p>
      </div>

      {/* Search Filters */}
      <div className="mb-8">
        <MovieFilters
          sortBy={sortBy}
          selectedGenres={selectedGenres}
          onSortChange={setSortBy}
          onSearchChange={setSearchQuery}
          onGenreChange={handleGenreChange}
          isDarkMode={isDarkMode}
        />
      </div>

      {/* Popular Searches */}
      {!searchQuery && popularSearches.length > 0 && (
        <div className={`mb-8 p-6 rounded-2xl border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h3 className="text-lg font-bold mb-4">🔥 Popular Searches</h3>
          <div className="flex flex-wrap gap-2">
            {popularSearches.map((search, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setSearchQuery(search)}
                className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                  isDarkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }`}
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      )}

      {isLoading && (
        <div className="text-center py-12">
          <LoadingSkeleton type="movieGrid" count={12} />
        </div>
      )}

      {filteredAndSortedMovies.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
          {filteredAndSortedMovies.map((movie, index) => (
            <Link
              to={`/movie/${movie.id}`}
              key={movie.id}
              className="group animate-scale-in"
              style={{ animationDelay: `${index * 30}ms` }}
              onClick={() => handleMovieClick(movie.id)}
            >
              <div className={`
                rounded-xl overflow-hidden shadow-lg
                ${isDarkMode ? 'bg-gray-800' : 'bg-white'}
                transform hover:scale-105 active:scale-95 transition-all duration-300
                hover:shadow-2xl
              `}>
                <div className="aspect-[2/3] relative overflow-hidden">
                  {movie.poster_path ? (
                    <img
                      src={imageUrls.poster(movie.poster_path)}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">No Image</span>
                    </div>
                  )}
                </div>
                <div className="p-2 sm:p-3 md:p-4">
                  <h3 className="font-bold text-sm sm:text-base md:text-lg truncate">{movie.title}</h3>
                  <div className="flex items-center mt-1 sm:mt-2">
                    <span className="text-yellow-400 text-sm sm:text-base">★</span>
                    <span className="ml-1 text-xs sm:text-sm">{movie.vote_average.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {filteredAndSortedMovies.length === 0 && (
        <div className="text-center py-12">
          <p className="text-2xl opacity-75">No movies found</p>
        </div>
      )}
    </div>
  )
}

export default SearchPage



