import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Movie } from '../services/tmdb'

interface MovieStats {
  totalMoviesViewed: number
  favoriteGenres: { [key: number]: number }
  recentlyViewed: number[]
  searchHistory: string[]
  userPreferences: {
    preferredGenres: number[]
    preferredRating: number
    preferredYear: number
  }
}

interface MovieDataStore {
  // Cache management
  cachedMovies: { [key: number]: Movie }
  lastFetchTime: { [key: string]: number }
  
  // User analytics
  stats: MovieStats
  
  // UI state
  isLoading: boolean
  error: string | null
  
  // Actions
  setCachedMovie: (movie: Movie) => void
  getCachedMovie: (id: number) => Movie | undefined
  setLastFetchTime: (key: string, time: number) => void
  shouldRefetch: (key: string, staleTime?: number) => boolean
  
  // Analytics actions
  addToRecentlyViewed: (movieId: number) => void
  addToSearchHistory: (query: string) => void
  updateGenrePreference: (genreId: number) => void
  incrementMoviesViewed: () => void
  
  // UI actions
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  // Computed getters
  getRecommendedGenres: () => number[]
  getPopularSearches: () => string[]
  getUserEngagementScore: () => number
}

export const useMovieDataStore = create<MovieDataStore>()(
  persist(
    (set, get) => ({
      // Initial state
      cachedMovies: {},
      lastFetchTime: {},
      stats: {
        totalMoviesViewed: 0,
        favoriteGenres: {},
        recentlyViewed: [],
        searchHistory: [],
        userPreferences: {
          preferredGenres: [],
          preferredRating: 7.0,
          preferredYear: new Date().getFullYear()
        }
      },
      isLoading: false,
      error: null,

      // Cache management
      setCachedMovie: (movie) => {
        set((state) => ({
          cachedMovies: {
            ...state.cachedMovies,
            [movie.id]: movie
          }
        }))
      },

      getCachedMovie: (id) => {
        return get().cachedMovies[id]
      },

      setLastFetchTime: (key, time) => {
        set((state) => ({
          lastFetchTime: {
            ...state.lastFetchTime,
            [key]: time
          }
        }))
      },

      shouldRefetch: (key, staleTime = 5 * 60 * 1000) => {
        const lastFetch = get().lastFetchTime[key]
        if (!lastFetch) return true
        return Date.now() - lastFetch > staleTime
      },

      // Analytics actions
      addToRecentlyViewed: (movieId) => {
        set((state) => {
          const recentlyViewed = [movieId, ...state.stats.recentlyViewed.filter(id => id !== movieId)]
          return {
            stats: {
              ...state.stats,
              recentlyViewed: recentlyViewed.slice(0, 20) // Keep only last 20
            }
          }
        })
      },

      addToSearchHistory: (query) => {
        if (!query.trim()) return
        set((state) => {
          const searchHistory = [query, ...state.stats.searchHistory.filter(q => q !== query)]
          return {
            stats: {
              ...state.stats,
              searchHistory: searchHistory.slice(0, 10) // Keep only last 10
            }
          }
        })
      },

      updateGenrePreference: (genreId) => {
        set((state) => ({
          stats: {
            ...state.stats,
            favoriteGenres: {
              ...state.stats.favoriteGenres,
              [genreId]: (state.stats.favoriteGenres[genreId] || 0) + 1
            }
          }
        }))
      },

      incrementMoviesViewed: () => {
        set((state) => ({
          stats: {
            ...state.stats,
            totalMoviesViewed: state.stats.totalMoviesViewed + 1
          }
        }))
      },

      // UI actions
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),

      // Computed getters
      getRecommendedGenres: () => {
        const { favoriteGenres } = get().stats
        return Object.entries(favoriteGenres)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([genreId]) => parseInt(genreId))
      },

      getPopularSearches: () => {
        return get().stats.searchHistory.slice(0, 5)
      },

      getUserEngagementScore: () => {
        const { totalMoviesViewed, favoriteGenres, recentlyViewed } = get().stats
        const genreCount = Object.keys(favoriteGenres).length
        const recentActivity = recentlyViewed.length
        
        // Simple engagement score calculation
        return Math.min(100, (totalMoviesViewed * 2) + (genreCount * 5) + (recentActivity * 3))
      }
    }),
    {
      name: 'movie-data-storage',
      partialize: (state) => ({
        cachedMovies: state.cachedMovies,
        stats: state.stats,
        lastFetchTime: state.lastFetchTime
      })
    }
  )
)
