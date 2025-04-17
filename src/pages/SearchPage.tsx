import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { searchMovies,  imageUrls } from '../services/tmdb'
import { useThemeStore } from '../store/themeStore'
import { Link } from 'react-router-dom'
import MovieFilters from '../components/MovieFilters'

function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('title')
  const [selectedGenres, setSelectedGenres] = useState<number[]>([])
  const { isDarkMode } = useThemeStore()

  const { data, isLoading } = useQuery({
    queryKey: ['search', searchQuery],
    queryFn: () => searchMovies(searchQuery),
    enabled: searchQuery.length > 0,
  })

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
      <MovieFilters
        sortBy={sortBy}
        selectedGenres={selectedGenres}
        onSortChange={setSortBy}
        onSearchChange={setSearchQuery}
        onGenreChange={handleGenreChange}
        isDarkMode={isDarkMode}
      />

      {isLoading && (
        <div className="text-center py-12">
          <div className="animate-bounce text-2xl">Searching...</div>
        </div>
      )}

      {filteredAndSortedMovies.length > 0 && (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {filteredAndSortedMovies.map((movie, index) => (
            <Link
              to={`/movie/${movie.id}`}
              key={movie.id}
              className="animate-scale-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={`
                rounded-xl overflow-hidden shadow-lg
                ${isDarkMode ? 'bg-gray-800' : 'bg-white'}
                transform hover:scale-105 transition-all duration-300
                hover:shadow-2xl
              `}>
                {movie.poster_path ? (
                  <img
                    src={imageUrls.poster(movie.poster_path)}
                    alt={movie.title}
                    className="w-full h-auto aspect-[2/3] object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full aspect-[2/3] bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
                <div className="p-3 sm:p-4">
                  <h3 className="font-bold text-base sm:text-lg truncate">{movie.title}</h3>
                  <div className="flex items-center mt-1 sm:mt-2">
                    <span className="text-yellow-400">★</span>
                    <span className="ml-1 text-sm sm:text-base">{movie.vote_average.toFixed(1)}</span>
                  </div>
                  <p className="mt-2 text-xs sm:text-sm opacity-75 line-clamp-2">
                    {movie.overview}
                  </p>
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



