import { useQuery } from '@tanstack/react-query'
import { getTrending, getPopular, getGenres } from '../services/tmdb'
import { useThemeStore } from '../store/themeStore'
import { useMovieDataStore } from '../store/movieDataStore'
import { useMovieListsStore } from '../store/movieListsStore'

function MovieStats() {
  const { isDarkMode } = useThemeStore()
  const { stats, getUserEngagementScore, getRecommendedGenres } = useMovieDataStore()
  const { favorites } = useMovieListsStore()

  const { data: trendingMovies } = useQuery({
    queryKey: ['trending', 'week'],
    queryFn: () => getTrending('week'),
  })

  const { data: popularMovies } = useQuery({
    queryKey: ['popular'],
    queryFn: getPopular,
  })

  const { data: genres } = useQuery({
    queryKey: ['genres'],
    queryFn: getGenres,
  })

  const engagementScore = getUserEngagementScore()
  const recommendedGenres = getRecommendedGenres()
  const topGenres = recommendedGenres
    .map(id => genres?.genres.find((g: any) => g.id === id))
    .filter(Boolean)
    .slice(0, 3)

  const statsData = [
    {
      icon: '🎬',
      label: 'Movies Explored',
      value: stats.totalMoviesViewed,
      color: 'from-blue-500 to-cyan-500',
      bgColor: isDarkMode ? 'bg-blue-500/10' : 'bg-blue-50',
    },
    {
      icon: '❤️',
      label: 'Favorites',
      value: favorites.length,
      color: 'from-pink-500 to-rose-500',
      bgColor: isDarkMode ? 'bg-pink-500/10' : 'bg-pink-50',
    },
    {
      icon: '🔥',
      label: 'Trending This Week',
      value: trendingMovies?.results?.length || 0,
      color: 'from-orange-500 to-red-500',
      bgColor: isDarkMode ? 'bg-orange-500/10' : 'bg-orange-50',
    },
    {
      icon: '⭐',
      label: 'Popular Movies',
      value: popularMovies?.results?.length || 0,
      color: 'from-yellow-500 to-amber-500',
      bgColor: isDarkMode ? 'bg-yellow-500/10' : 'bg-yellow-50',
    },
  ]

  return (
    <div className="py-12 sm:py-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Your Movie Journey
          </h2>
          <p className="text-lg opacity-75 max-w-2xl mx-auto">
            Track your movie exploration and discover personalized insights
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {statsData.map((stat, index) => (
            <div
              key={stat.label}
              className={`
                ${stat.bgColor} rounded-2xl p-4 sm:p-6 
                transform hover:scale-105 transition-all duration-300
                animate-scale-in border
                ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}
              `}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-center">
                <div className="text-3xl sm:text-4xl mb-2">{stat.icon}</div>
                <div className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}>
                  {stat.value}
                </div>
                <div className="text-sm opacity-75 font-medium">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Engagement Score & Recommendations */}
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          {/* Engagement Score */}
          <div className={`
            rounded-2xl p-6 sm:p-8 border
            ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
            animate-slide-up
          `}>
            <div className="text-center">
              <h3 className="text-xl font-bold mb-4">Your Engagement Score</h3>
              <div className="relative w-32 h-32 mx-auto mb-4">
                {/* Circular Progress */}
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    stroke={isDarkMode ? '#374151' : '#e5e7eb'}
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${(engagementScore / 100) * 314} 314`}
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">{engagementScore}%</span>
                </div>
              </div>
              <p className="text-sm opacity-75">
                Based on your movie exploration activity
              </p>
            </div>
          </div>

          {/* Top Genres */}
          <div className={`
            rounded-2xl p-6 sm:p-8 border
            ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
            animate-slide-up
          `}>
            <h3 className="text-xl font-bold mb-6">Your Favorite Genres</h3>
            {topGenres.length > 0 ? (
              <div className="space-y-4">
                {topGenres.map((genre: any, index) => {
                  const count = stats.favoriteGenres[genre.id] || 0
                  const maxCount = Math.max(...Object.values(stats.favoriteGenres))
                  const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0

                  return (
                    <div key={genre.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{genre.name}</span>
                        <span className="text-sm opacity-75">{count} movies</span>
                      </div>
                      <div className={`h-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000 ease-out"
                          style={{ 
                            width: `${percentage}%`,
                            animationDelay: `${index * 200}ms`
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">🎭</div>
                <p className="opacity-75">Start exploring movies to see your favorite genres!</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        {stats.recentlyViewed.length > 0 && (
          <div className={`
            mt-8 rounded-2xl p-6 sm:p-8 border
            ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
            animate-fade-in
          `}>
            <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
            <div className="flex items-center gap-2 text-sm opacity-75">
              <span>🕒</span>
              <span>You've viewed {stats.recentlyViewed.length} movies recently</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MovieStats
