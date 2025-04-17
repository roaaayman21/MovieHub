import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getMovieDetails, imageUrls } from '../services/tmdb'
import { useMovieListsStore } from '../store/movieListsStore'
import { useThemeStore } from '../store/themeStore'
import MovieFilters from '../components/MovieFilters'

function ListsPage() {
  const [activeTab, setActiveTab] = useState<'favorites' | 'watchlist'>('favorites')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('title')
  const [selectedGenres, setSelectedGenres] = useState<number[]>([])
  const { favorites, watchlist } = useMovieListsStore()
  const { isDarkMode } = useThemeStore()

  const { data: favoriteMovies } = useQuery({
    queryKey: ['favorites', favorites],
    queryFn: async () => {
      const movies = await Promise.all(
        favorites.map((id) => getMovieDetails(id.toString()))
      )
      return movies
    },
    enabled: favorites.length > 0,
  })

  const { data: watchlistMovies } = useQuery({
    queryKey: ['watchlist', watchlist],
    queryFn: async () => {
      const movies = await Promise.all(
        watchlist.map((id) => getMovieDetails(id.toString()))
      )
      return movies
    },
    enabled: watchlist.length > 0,
  })

  const filteredAndSortedMovies = useMemo(() => {
    const movies = activeTab === 'favorites' ? favoriteMovies : watchlistMovies
    if (!movies) return []

    let filtered = movies.filter((movie) =>
      movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Apply genre filtering
    if (selectedGenres.length > 0) {
      filtered = filtered.filter((movie) =>
        movie.genres?.some((genre) => selectedGenres.includes(genre.id))
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
  }, [activeTab, favoriteMovies, watchlistMovies, searchQuery, sortBy, selectedGenres])

  const handleGenreChange = (genreId: number) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId]
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Modern Tab Design */}
      <div className="flex gap-3 mb-8">
        <button
          onClick={() => setActiveTab('favorites')}
          className={`
            px-6 py-2.5 rounded-xl text-sm font-medium
            transition-all duration-300 ease-out
            ${activeTab === 'favorites'
              ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
              : isDarkMode
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }
          `}
        >
          Favorites
        </button>
        <button
          onClick={() => setActiveTab('watchlist')}
          className={`
            px-6 py-2.5 rounded-xl text-sm font-medium
            transition-all duration-300 ease-out
            ${activeTab === 'watchlist'
              ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
              : isDarkMode
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }
          `}
        >
          Watchlist
        </button>
      </div>

      <MovieFilters
        sortBy={sortBy}
        selectedGenres={selectedGenres}
        onSortChange={setSortBy}
        onSearchChange={setSearchQuery}
        onGenreChange={handleGenreChange}
        isDarkMode={isDarkMode}
      />

      {/* Modern Grid Layout */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-8">
        {filteredAndSortedMovies.map((movie) => (
          <Link
            to={`/movie/${movie.id}`}
            key={movie.id}
            className="group relative rounded-2xl overflow-hidden"
          >
            <div className="aspect-[2/3] w-full">
              <img
                src={imageUrls.poster(movie.poster_path)}
                alt={movie.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-medium text-lg truncate">
                    {movie.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-yellow-400 text-sm">★</span>
                    <span className="text-white/90 text-sm">
                      {movie.vote_average.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredAndSortedMovies.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-xl opacity-60">No movies found</p>
          <p className="text-sm opacity-40 mt-2">Try adjusting your filters</p>
        </div>
      )}
    </div>
  )
}

export default ListsPage



