import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface MovieListsStore {
  favorites: number[]
  watchlist: number[]
  toggleFavorite: (movieId: number) => void
  toggleWatchlist: (movieId: number) => void
  isFavorite: (movieId: number) => boolean
  isInWatchlist: (movieId: number) => boolean
}

export const useMovieListsStore = create<MovieListsStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      watchlist: [],
      toggleFavorite: (movieId) => {
        set((state) => ({
          favorites: state.favorites.includes(movieId)
            ? state.favorites.filter((id) => id !== movieId)
            : [...state.favorites, movieId],
        }))
      },
      toggleWatchlist: (movieId) => {
        set((state) => ({
          watchlist: state.watchlist.includes(movieId)
            ? state.watchlist.filter((id) => id !== movieId)
            : [...state.watchlist, movieId],
        }))
      },
      isFavorite: (movieId) => get().favorites.includes(movieId),
      isInWatchlist: (movieId) => get().watchlist.includes(movieId),
    }),
    {
      name: 'movie-lists-storage',
    }
  )
)