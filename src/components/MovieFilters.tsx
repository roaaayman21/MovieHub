import { useQuery } from '@tanstack/react-query'
import { getGenres } from '../services/tmdb'
import { useState } from 'react'

interface GenresResponse {
  genres: {
    id: number;
    name: string;
  }[];
}

interface MovieFiltersProps {
  sortBy: string
  selectedGenres: number[]
  onSortChange: (value: string) => void
  onSearchChange: (value: string) => void
  onGenreChange: (genreId: number) => void
  isDarkMode: boolean
}

function MovieFilters({
  sortBy,
  selectedGenres,
  onSortChange,
  onSearchChange,
  onGenreChange,
  isDarkMode,
}: MovieFiltersProps) {
  const [showAllGenres, setShowAllGenres] = useState(false)
  const { data: genres } = useQuery<GenresResponse>({
    queryKey: ['genres'],
    queryFn: getGenres,
  })

  const displayedGenres = showAllGenres ? genres?.genres : genres?.genres.slice(0, 8)

  return (
    <div className="space-y-4">
      {/* Search and Sort Bar */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search movies..."
            onChange={(e) => onSearchChange(e.target.value)}
            className={`
              w-full pl-10 pr-4 h-12 sm:h-10 rounded-xl text-sm
              ${isDarkMode ? 'bg-gray-800/50 text-white placeholder-gray-400' : 'bg-gray-100 text-gray-900 placeholder-gray-500'}
              focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all
            `}
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className={`
            h-12 sm:h-10 px-4 rounded-xl text-sm min-w-[140px]
            ${isDarkMode ? 'bg-gray-800/50 text-white' : 'bg-gray-100 text-gray-900'}
            focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all
          `}
        >
          <option value="title">🔤 A-Z</option>
          <option value="title-desc">🔤 Z-A</option>
          <option value="rating">⭐ Top Rated</option>
          <option value="rating-asc">⭐ Lowest Rated</option>
        </select>
      </div>

      {/* Genre Pills */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium opacity-75">Filter by Genre</h3>
          {genres && genres.genres.length > 8 && (
            <button
              type="button"
              onClick={() => setShowAllGenres(!showAllGenres)}
              className={`text-xs px-3 py-1 rounded-full transition-colors ${
                isDarkMode
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              {showAllGenres ? 'Show Less' : 'Show All'}
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {displayedGenres?.map(genre => (
            <button
              key={genre.id}
              type="button"
              onClick={() => onGenreChange(genre.id)}
              className={`
                px-4 py-2 h-10 rounded-lg text-sm font-medium
                transition-all duration-200 ease-out transform active:scale-95
                ${selectedGenres.includes(genre.id)
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30 scale-105'
                  : isDarkMode
                    ? 'bg-gray-800/50 text-white hover:bg-gray-700/50 hover:scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                }
              `}
            >
              {genre.name}
            </button>
          ))}
        </div>

        {/* Selected genres count */}
        {selectedGenres.length > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <span className="opacity-75">
              {selectedGenres.length} genre{selectedGenres.length !== 1 ? 's' : ''} selected
            </span>
            <button
              type="button"
              onClick={() => selectedGenres.forEach(id => onGenreChange(id))}
              className={`text-xs px-2 py-1 rounded transition-colors ${
                isDarkMode
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              Clear all
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default MovieFilters





