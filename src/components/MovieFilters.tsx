import { useQuery } from '@tanstack/react-query'
import { getGenres } from '../services/tmdb'

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
  const { data: genres } = useQuery<GenresResponse>({
    queryKey: ['genres'],
    queryFn: getGenres,
  })

  return (
    <div className="space-y-4">
      {/* Search and Sort Bar */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search movies..."
          onChange={(e) => onSearchChange(e.target.value)}
          className={`
            flex-1 px-4 h-10 rounded-xl text-sm
            ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-100'}
            focus:outline-none
          `}
        />
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className={`
            h-10 px-3 rounded-xl text-sm
            ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-100'}
            focus:outline-none
          `}
        >
          <option value="title">A-Z</option>
          <option value="title-desc">Z-A</option>
          <option value="rating">Top Rated</option>
          <option value="rating-asc">Lowest Rated</option>
        </select>
      </div>

      {/* Genre Pills */}
      <div className="flex flex-wrap gap-2">
        {genres?.genres.map(genre => (
          <button
            key={genre.id}
            onClick={() => onGenreChange(genre.id)}
            className={`
              px-4 h-8 rounded-lg text-sm font-medium
              transition-all duration-200 ease-out
              ${selectedGenres.includes(genre.id)
                ? isDarkMode
                  ? 'bg-white text-black'
                  : 'bg-black text-white'
                : isDarkMode
                  ? 'bg-gray-800/50 text-white hover:bg-gray-700/50'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
          >
            {genre.name}
          </button>
        ))}
      </div>
    </div>
  )
}

export default MovieFilters





