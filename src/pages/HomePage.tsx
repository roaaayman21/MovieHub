import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getNowPlaying, getTopRated, getUpcoming, Movie } from '../services/tmdb'
import MovieSlider from '../components/MovieSlider'
import { useThemeStore } from '../store/themeStore'
import MovieFilters from '../components/MovieFilters'

function HomePage() {
  const { isDarkMode } = useThemeStore()
  const [filters, setFilters] = useState<{
    search: string;
    sort: string;
    selectedGenres: number[];
  }>({
    search: '',
    sort: 'title',
    selectedGenres: []
  })

  const { data: nowPlaying, isLoading: loadingNowPlaying } = useQuery({
    queryKey: ['nowPlaying'],
    queryFn: getNowPlaying,
  })

  const { data: topRated, isLoading: loadingTopRated } = useQuery({
    queryKey: ['topRated'],
    queryFn: getTopRated,
  })

  const { data: upcoming, isLoading: loadingUpcoming } = useQuery({
    queryKey: ['upcoming'],
    queryFn: getUpcoming,
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

  if (loadingNowPlaying || loadingTopRated || loadingUpcoming) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-screen">
          <div className="text-xl">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
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

      <section className="mb-12">
        <MovieSlider 
          title="Now Playing"
          movies={filteredNowPlaying}
          isDarkMode={isDarkMode}
        />
      </section>

      <section className="mb-12">
        <MovieSlider 
          title="Top Rated"
          movies={filteredTopRated}
          isDarkMode={isDarkMode}
        />
      </section>

      <section className="mb-12">
        <MovieSlider 
          title="Upcoming"
          movies={filteredUpcoming}
          isDarkMode={isDarkMode}
        />
      </section>
    </div>
  )
}

export default HomePage









