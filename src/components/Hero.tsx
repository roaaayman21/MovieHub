import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getTrending, enhancedImageUrls } from '../services/tmdb'

import { useMovieDataStore } from '../store/movieDataStore'

interface HeroProps {
  onExploreClick?: () => void
}

function Hero({ onExploreClick }: HeroProps) {
  const { addToRecentlyViewed, stats } = useMovieDataStore()
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0)

  const { data: trendingMovies, isLoading } = useQuery({
    queryKey: ['trending', 'day'],
    queryFn: () => getTrending('day'),
    staleTime: 1000 * 60 * 30, // 30 minutes
  })

  const featuredMovies = trendingMovies?.results?.slice(0, 5) || []
  const currentMovie = featuredMovies[currentMovieIndex]

  // Preload images for smooth transitions
  useEffect(() => {
    if (featuredMovies.length > 0) {
      featuredMovies.forEach((movie) => {
        if (movie.backdrop_path) {
          const img = new Image()
          img.src = enhancedImageUrls.backdrop.medium(movie.backdrop_path)
          const imgLarge = new Image()
          imgLarge.src = enhancedImageUrls.backdrop.large(movie.backdrop_path)
        }
      })
    }
  }, [featuredMovies])

  // Auto-rotate featured movies
  useEffect(() => {
    if (featuredMovies.length > 1) {
      const interval = setInterval(() => {
        setCurrentMovieIndex((prev) => (prev + 1) % featuredMovies.length)
      }, 8000) // Change every 8 seconds

      return () => clearInterval(interval)
    }
  }, [featuredMovies.length])

  const handleMovieClick = (movieId: number) => {
    addToRecentlyViewed(movieId)
  }

  if (isLoading || !currentMovie) {
    return (
      <div className="relative h-[70vh] bg-gradient-to-r from-blue-600 to-purple-700 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-pulse">
            <div className="w-32 h-32 bg-white/20 rounded-full mx-auto mb-4"></div>
            <div className="h-8 bg-white/20 rounded w-64 mx-auto mb-2"></div>
            <div className="h-4 bg-white/20 rounded w-48 mx-auto"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative hero-container min-h-screen overflow-hidden">
      {/* Fallback Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-gray-900" />

      {/* Background Image - Mobile Optimized */}
      {currentMovie.backdrop_path && (
        <div
          className="absolute inset-0 sm:hidden hero-bg bg-cover bg-no-repeat transition-all duration-1000"
          style={{
            backgroundImage: `url(${enhancedImageUrls.backdrop.medium(currentMovie.backdrop_path)})`,
          }}
        />
      )}

      {/* Background Image - Desktop */}
      {currentMovie.backdrop_path && (
        <div
          className="absolute inset-0 hidden sm:block bg-cover bg-center bg-no-repeat transition-all duration-1000"
          style={{
            backgroundImage: `url(${enhancedImageUrls.backdrop.large(currentMovie.backdrop_path)})`,
            backgroundPosition: 'center 30%',
          }}
        />
      )}

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/30 sm:from-black/90 sm:via-black/50 sm:to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative min-h-screen flex items-center pt-20 sm:pt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl">
            {/* Welcome Message */}
            <div className="mb-6 animate-fade-in">
              <span className="inline-block px-4 py-2 bg-blue-500/20 backdrop-blur-sm rounded-full text-blue-300 text-sm font-medium mb-4">
                🎬 Welcome to MovieHub
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4">
                Discover Your Next
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  Favorite Movie
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-white/80 max-w-2xl leading-relaxed">
                Explore millions of movies, create your personal watchlist, and discover hidden gems 
                tailored just for you.
              </p>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 mb-8 animate-slide-up">
              <div className="flex items-center gap-2 text-white/90">
                <span className="text-2xl">🎭</span>
                <span className="text-sm">
                  <span className="font-bold text-lg">{stats.totalMoviesViewed}</span> Movies Explored
                </span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <span className="text-2xl">⭐</span>
                <span className="text-sm">
                  <span className="font-bold text-lg">{Object.keys(stats.favoriteGenres).length}</span> Genres Loved
                </span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <span className="text-2xl">🔥</span>
                <span className="text-sm">
                  <span className="font-bold text-lg">{featuredMovies.length}</span> Trending Now
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-bounce-in">
              <button
                onClick={onExploreClick}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                🚀 Start Exploring
              </button>
              <Link
                to={`/movie/${currentMovie.id}`}
                onClick={() => handleMovieClick(currentMovie.id)}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 border border-white/20"
              >
                🎬 Watch Featured
              </Link>
            </div>

            {/* Featured Movie Info */}
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 max-w-md animate-scale-in">
              <div className="flex items-center gap-4 mb-3">
                <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                  TRENDING
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400">⭐</span>
                  <span className="text-white font-bold">{currentMovie.vote_average.toFixed(1)}</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{currentMovie.title}</h3>
              <p className="text-white/70 text-sm line-clamp-2 leading-relaxed">
                {currentMovie.overview}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Movie Navigation Dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
        {featuredMovies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentMovieIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentMovieIndex
                ? 'bg-white w-8'
                : 'bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to movie ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 right-6 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}

export default Hero
