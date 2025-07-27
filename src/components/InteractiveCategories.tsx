import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getMoviesByGenre, getGenres } from '../services/tmdb'
import { useThemeStore } from '../store/themeStore'
import { useMovieDataStore } from '../store/movieDataStore'
import MovieSlider from './MovieSlider'
import LoadingSkeleton from './LoadingSkeleton'

interface Genre {
  id: number
  name: string
}

const categoryEmojis: { [key: string]: string } = {
  'Action': '💥',
  'Adventure': '🗺️',
  'Animation': '🎨',
  'Comedy': '😂',
  'Crime': '🕵️',
  'Documentary': '📽️',
  'Drama': '🎭',
  'Family': '👨‍👩‍👧‍👦',
  'Fantasy': '🧙‍♂️',
  'History': '📚',
  'Horror': '👻',
  'Music': '🎵',
  'Mystery': '🔍',
  'Romance': '💕',
  'Science Fiction': '🚀',
  'TV Movie': '📺',
  'Thriller': '😱',
  'War': '⚔️',
  'Western': '🤠'
}

function InteractiveCategories() {
  const { isDarkMode } = useThemeStore()
  const { updateGenrePreference, getRecommendedGenres } = useMovieDataStore()
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null)

  // Use simple React Query hooks
  const { data: genres } = useQuery({
    queryKey: ['genres'],
    queryFn: getGenres,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  })

  const { data: genreMovies, isLoading: loadingGenreMovies } = useQuery({
    queryKey: ['genreMovies', selectedGenre],
    queryFn: () => getMoviesByGenre(selectedGenre!),
    enabled: !!selectedGenre,
    staleTime: 1000 * 60 * 15,
  })

  const recommendedGenres = getRecommendedGenres()
  const allGenres = genres?.genres || []

  // Sort genres: recommended first, then alphabetically
  const sortedGenres = allGenres.sort((a: Genre, b: Genre) => {
    const aIsRecommended = recommendedGenres.includes(a.id)
    const bIsRecommended = recommendedGenres.includes(b.id)
    
    if (aIsRecommended && !bIsRecommended) return -1
    if (!aIsRecommended && bIsRecommended) return 1
    return a.name.localeCompare(b.name)
  })

  const handleGenreClick = (genreId: number) => {
    setSelectedGenre(genreId)
    updateGenrePreference(genreId)
  }

  const getGenreEmoji = (genreName: string) => {
    return categoryEmojis[genreName] || '🎬'
  }

  return (
    <div className="py-12 sm:py-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            🎭 Explore by Category
          </h2>
          <p className="text-lg opacity-75 max-w-2xl mx-auto">
            Discover movies by your favorite genres and explore new categories
          </p>
        </div>

        {/* Genre Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 mb-12">
          {sortedGenres.map((genre: Genre, index: number) => {
            const isRecommended = recommendedGenres.includes(genre.id)
            const isSelected = selectedGenre === genre.id
            
            return (
              <button
                key={genre.id}
                type="button"
                onClick={() => handleGenreClick(genre.id)}
                className={`
                  relative p-4 sm:p-6 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95
                  animate-scale-in border-2
                  ${isSelected
                    ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white border-blue-400 shadow-lg shadow-blue-500/30'
                    : isRecommended
                      ? isDarkMode
                        ? 'bg-gradient-to-br from-gray-700 to-gray-800 border-blue-400 text-white hover:from-gray-600 hover:to-gray-700'
                        : 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 text-gray-800 hover:from-blue-100 hover:to-purple-100'
                      : isDarkMode
                        ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700'
                        : 'bg-white border-gray-200 text-gray-800 hover:bg-gray-50'
                  }
                `}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Recommended badge */}
                {isRecommended && !isSelected && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-xs">⭐</span>
                  </div>
                )}
                
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl mb-2">
                    {getGenreEmoji(genre.name)}
                  </div>
                  <div className="font-medium text-sm sm:text-base leading-tight">
                    {genre.name}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Selected Genre Movies */}
        {selectedGenre && (
          <div className="animate-fade-in">
            {loadingGenreMovies ? (
              <LoadingSkeleton type="movieSlider" />
            ) : genreMovies?.results ? (
              <MovieSlider
                title={`${getGenreEmoji(
                  allGenres.find((g: Genre) => g.id === selectedGenre)?.name || ''
                )} ${allGenres.find((g: Genre) => g.id === selectedGenre)?.name || 'Movies'}`}
                movies={genreMovies.results}
                isDarkMode={isDarkMode}
              />
            ) : (
              <div className={`text-center py-12 rounded-2xl border ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <div className="text-4xl mb-4">🎬</div>
                <p className="text-lg opacity-75">No movies found for this genre</p>
              </div>
            )}
          </div>
        )}

        {/* Recommended Genres Section */}
        {recommendedGenres.length > 0 && !selectedGenre && (
          <div className={`mt-12 p-6 sm:p-8 rounded-2xl border ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } animate-slide-up`}>
            <h3 className="text-xl font-bold mb-4">⭐ Recommended for You</h3>
            <p className="opacity-75 mb-6">
              Based on your viewing history, we think you'll love these genres:
            </p>
            <div className="flex flex-wrap gap-3">
              {recommendedGenres.slice(0, 5).map((genreId) => {
                const genre = allGenres.find((g: Genre) => g.id === genreId)
                if (!genre) return null
                
                return (
                  <button
                    key={genreId}
                    type="button"
                    onClick={() => handleGenreClick(genreId)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200
                      ${isDarkMode 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }
                    `}
                  >
                    <span>{getGenreEmoji(genre.name)}</span>
                    <span>{genre.name}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Call to Action for New Users */}
        {recommendedGenres.length === 0 && !selectedGenre && (
          <div className={`text-center p-8 rounded-2xl border ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } animate-bounce-in`}>
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold mb-4">Discover Your Taste</h3>
            <p className="opacity-75 mb-6">
              Click on any genre above to explore movies and help us learn your preferences!
            </p>
            <div className="flex justify-center gap-2 text-sm opacity-60">
              <span>👆 Click genres</span>
              <span>•</span>
              <span>❤️ Add favorites</span>
              <span>•</span>
              <span>🎯 Get recommendations</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default InteractiveCategories
