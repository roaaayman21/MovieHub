import { useQuery } from '@tanstack/react-query'
import { getMoviesByGenre, getMovieRecommendations, getPopular } from '../services/tmdb'
import { useMovieDataStore } from '../store/movieDataStore'
import { useMovieListsStore } from '../store/movieListsStore'
import { useThemeStore } from '../store/themeStore'
import MovieSlider from './MovieSlider'
import LoadingSkeleton from './LoadingSkeleton'

function PersonalizedRecommendations() {
  const { isDarkMode } = useThemeStore()
  const { getRecommendedGenres, stats } = useMovieDataStore()
  const { favorites } = useMovieListsStore()

  const recommendedGenres = getRecommendedGenres()
  const hasUserData = stats.totalMoviesViewed > 0 || favorites.length > 0

  // Get movies from user's favorite genres
  const { data: genreBasedMovies, isLoading: loadingGenreMovies } = useQuery({
    queryKey: ['genreRecommendations', recommendedGenres],
    queryFn: async () => {
      if (recommendedGenres.length === 0) return null
      
      // Get movies from the top recommended genre
      const topGenre = recommendedGenres[0]
      return await getMoviesByGenre(topGenre)
    },
    enabled: recommendedGenres.length > 0,
    staleTime: 1000 * 60 * 30, // 30 minutes
  })

  // Get recommendations based on a favorite movie
  const { data: movieBasedRecommendations, isLoading: loadingMovieRecs } = useQuery({
    queryKey: ['movieRecommendations', favorites],
    queryFn: async () => {
      if (favorites.length === 0) return null
      
      // Get recommendations based on the most recent favorite
      const recentFavorite = favorites[0]
      return await getMovieRecommendations(recentFavorite.toString())
    },
    enabled: favorites.length > 0,
    staleTime: 1000 * 60 * 20, // 20 minutes
  })

  // Fallback to popular movies for new users
  const { data: popularMovies, isLoading: loadingPopular } = useQuery({
    queryKey: ['popularForNewUsers'],
    queryFn: getPopular,
    enabled: !hasUserData,
    staleTime: 1000 * 60 * 30, // 30 minutes
  })

  const isLoading = loadingGenreMovies || loadingMovieRecs || loadingPopular

  if (isLoading) {
    return (
      <div className="space-y-12">
        <LoadingSkeleton type="movieSlider" />
        <LoadingSkeleton type="movieSlider" />
      </div>
    )
  }

  if (!hasUserData && popularMovies) {
    return (
      <div className="space-y-8">
        {/* Welcome section for new users */}
        <div className={`text-center p-8 rounded-2xl border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="text-4xl mb-4">🎬</div>
          <h3 className="text-2xl font-bold mb-4">Welcome to MovieHub!</h3>
          <p className="text-lg opacity-75 max-w-2xl mx-auto mb-6">
            Start exploring movies to get personalized recommendations based on your preferences.
          </p>
          <div className="flex justify-center gap-4 text-sm opacity-60">
            <span>👀 Browse movies</span>
            <span>❤️ Add favorites</span>
            <span>🎯 Get recommendations</span>
          </div>
        </div>

        {/* Popular movies for new users */}
        <MovieSlider 
          title="🌟 Popular Movies to Get Started"
          movies={popularMovies.results || []}
          isDarkMode={isDarkMode}
        />
      </div>
    )
  }

  return (
    <div className="space-y-12">
      {/* Personalized header */}
      <div className="text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          🎯 Just for You
        </h2>
        <p className="text-lg opacity-75 max-w-2xl mx-auto">
          Personalized recommendations based on your movie preferences and viewing history
        </p>
      </div>

      {/* Genre-based recommendations */}
      {genreBasedMovies && genreBasedMovies.results && (
        <div className="animate-fade-in">
          <MovieSlider 
            title={`🎭 More Movies You'll Love`}
            movies={genreBasedMovies.results}
            isDarkMode={isDarkMode}
          />
        </div>
      )}

      {/* Movie-based recommendations */}
      {movieBasedRecommendations && movieBasedRecommendations.results && (
        <div className="animate-fade-in">
          <MovieSlider 
            title="🔮 Because You Liked..."
            movies={movieBasedRecommendations.results}
            isDarkMode={isDarkMode}
          />
        </div>
      )}

      {/* User insights */}
      {hasUserData && (
        <div className={`p-6 rounded-2xl border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } animate-slide-up`}>
          <h3 className="text-xl font-bold mb-4">📊 Your Movie Journey</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500 mb-1">
                {stats.totalMoviesViewed}
              </div>
              <div className="text-sm opacity-75">Movies Explored</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-500 mb-1">
                {favorites.length}
              </div>
              <div className="text-sm opacity-75">Favorites</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500 mb-1">
                {Object.keys(stats.favoriteGenres).length}
              </div>
              <div className="text-sm opacity-75">Genres Loved</div>
            </div>
          </div>
          
          {/* Top genres */}
          {recommendedGenres.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium mb-3">🎭 Your Favorite Genres:</h4>
              <div className="flex flex-wrap gap-2">
                {recommendedGenres.slice(0, 3).map((genreId, index) => {
                  // This would need genre name mapping - simplified for now
                  return (
                    <span
                      key={genreId}
                      className={`px-3 py-1 rounded-full text-sm ${
                        index === 0 
                          ? 'bg-blue-500 text-white' 
                          : isDarkMode 
                            ? 'bg-gray-700 text-gray-300' 
                            : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      Genre {genreId}
                    </span>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default PersonalizedRecommendations
