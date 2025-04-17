import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getMovieDetails, imageUrls, getSimilarMovies } from '../services/tmdb'
import { useThemeStore } from '../store/themeStore'
import { useMovieListsStore } from '../store/movieListsStore'
import MovieSlider from '../components/MovieSlider'
import { useState } from 'react'
import { Link } from 'react-router-dom'

// Add type definition for movie
interface MovieDetailsResponse {
  id: number
  title: string
  poster_path: string
  backdrop_path: string
  overview: string
  release_date: string
  vote_average: number
  runtime: number
  genres: { id: number; name: string }[]
  videos: {
    results: {
      id: string
      key: string
      site: string
      type: string
    }[]
  }
  credits: {
    cast: {
      id: number
      name: string
      character: string
      profile_path: string | null
    }[]
  }
}

interface ActorModalProps {
  actorId: number
  name: string
  onClose: () => void
  isDarkMode: boolean
}

interface ActorMovie {
  id: number;
  title: string;
  poster_path: string;
  character: string;
  release_date: string;
  popularity: number;
}

function ActorModal({ actorId, name, onClose, isDarkMode }: ActorModalProps) {
  const { data: actorMovies } = useQuery({
    queryKey: ['actor', actorId],
    queryFn: async () => {
      const response = await fetch(
        `https://api.themoviedb.org/3/person/${actorId}/movie_credits?api_key=${import.meta.env.VITE_TMDB_API_KEY}`
      );
      return response.json();
    },
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`
        relative w-full max-w-2xl rounded-2xl p-4 sm:p-6 
        ${isDarkMode ? 'bg-gray-800' : 'bg-white'}
        max-h-[90vh] flex flex-col
      `}>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 p-2 rounded-full hover:bg-gray-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-xl sm:text-2xl font-bold mb-4">{name}'s Filmography</h2>
        
        <div className="flex-1 overflow-y-auto">
          {actorMovies?.cast?.sort((a: ActorMovie, b: ActorMovie) => b.popularity - a.popularity).map((movie: ActorMovie) => (
            <Link
              to={`/movie/${movie.id}`}
              key={movie.id}
              className={`block p-3 sm:p-4 mb-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              onClick={onClose}
            >
              <div className="flex items-center gap-3 sm:gap-4">
                {movie.poster_path ? (
                  <img
                    src={imageUrls.poster(movie.poster_path)}
                    alt={movie.title}
                    className="w-12 sm:w-16 h-18 sm:h-24 object-cover rounded"
                  />
                ) : (
                  <div className="w-12 sm:w-16 h-18 sm:h-24 bg-gray-700 rounded flex items-center justify-center">
                    <span className="text-xs sm:text-sm text-gray-400">No image</span>
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-base sm:text-lg">{movie.title}</h3>
                  <p className="text-xs sm:text-sm opacity-75">as {movie.character}</p>
                  <p className="text-xs sm:text-sm">{movie.release_date?.split('-')[0] || 'TBA'}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function MovieDetailsPage() {
  const { movieId } = useParams<{ movieId: string }>()
  const { isDarkMode } = useThemeStore()
  const { isFavorite, isInWatchlist, toggleFavorite, toggleWatchlist } = useMovieListsStore()
  const [selectedActor, setSelectedActor] = useState<{ id: number; name: string } | null>(null)
  const [showTrailer, setShowTrailer] = useState(false)

  const { data: movie, isLoading } = useQuery<MovieDetailsResponse>({
    queryKey: ['movie', movieId],
    queryFn: () => getMovieDetails(movieId!),
    enabled: !!movieId,
  })

  const { data: similarMovies } = useQuery({
    queryKey: ['similar', movieId],
    queryFn: () => getSimilarMovies(movieId!),
    enabled: !!movieId,
  })

  // Add null check
  if (!movie || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <div className="animate-bounce text-2xl">Loading...</div>
      </div>
    )
  }

  // Add null check and type safety for trailer
  const trailer = movie.videos?.results?.find(
    (video) => video.type === 'Trailer' && video.site === 'YouTube'
  ) ?? null

  return (
    <div>
      {/* Hero Section with Backdrop */}
      <div className="relative min-h-[40vh] sm:min-h-[60vh] flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${imageUrls.backdrop(movie.backdrop_path)})`,
            backgroundPosition: 'center 20%'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
        </div>
        
        <div className="relative container mx-auto px-4 py-8 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start md:items-center">
            {/* Poster */}
            <div className="md:col-span-4 lg:col-span-3 animate-scale-in">
              <img
                src={imageUrls.poster(movie.poster_path)}
                alt={movie.title}
                className="w-full rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Movie Info */}
            <div className="md:col-span-8 lg:col-span-9 space-y-4 sm:space-y-6 animate-slide-up">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                {movie.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <div className="flex items-center bg-yellow-400 rounded-full px-3 sm:px-4 py-1.5 sm:py-2">
                  <span className="text-black text-xl sm:text-2xl">★</span>
                  <span className="ml-1 sm:ml-2 text-lg sm:text-xl font-bold text-black">
                    {movie.vote_average.toFixed(1)}
                  </span>
                </div>
                <div className="text-white/90 text-base sm:text-lg">
                  {movie.release_date.split('-')[0]} • {movie.runtime} min
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className={`
                      px-4 py-2 rounded-lg text-sm font-medium
                      transition-all duration-300 
                      ${isDarkMode 
                        ? 'bg-gray-800 text-white hover:bg-gray-700' 
                        : 'bg-white text-gray-800 hover:bg-gray-100'
                      }
                      border-2 border-transparent hover:border-blue-500
                      cursor-pointer
                      shadow-sm hover:shadow-md
                      transform hover:scale-105
                      flex items-center gap-2
                    `}
                  >
                    {getGenreIcon(genre.name)}
                    {genre.name}
                  </span>
                ))}
              </div>

              <p className="text-base sm:text-lg lg:text-xl text-white/80 leading-relaxed max-w-3xl">
                {movie.overview}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => toggleFavorite(movie.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                    ${isFavorite(movie.id)
                      ? 'bg-pink-600 hover:bg-pink-700 text-white'
                      : 'bg-white/10 hover:bg-white/20 text-white'}
                  `}
                >
                  {isFavorite(movie.id) ? '❤️' : '🤍'} Favorite
                </button>
                <button
                  onClick={() => toggleWatchlist(movie.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                    ${isInWatchlist(movie.id)
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-white/10 hover:bg-white/20 text-white'}
                  `}
                >
                  {isInWatchlist(movie.id) ? '✓' : '+'} Watchlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} py-8 sm:py-16`}>
        <div className="container mx-auto px-4 space-y-8 sm:space-y-16">
          {/* Trailer Section */}
          {trailer && (
            <section className="animate-fade-in">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8">Trailer</h2>
              <div className="aspect-w-16 aspect-h-9 rounded-2xl overflow-hidden shadow-2xl">
                <iframe
                  src={`https://www.youtube.com/embed/${trailer.key}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </section>
          )}

          {/* Cast Section */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8">Cast</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
              {movie.credits.cast.slice(0, 6).map((person, index) => (
                <div
                  key={person.id}
                  className={`animate-scale-in rounded-xl overflow-hidden shadow-lg 
                    ${isDarkMode ? 'bg-gray-800' : 'bg-white'} 
                    cursor-pointer transform hover:scale-105 transition-transform duration-300`}
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => setSelectedActor({ id: person.id, name: person.name })}
                >
                  {person.profile_path ? (
                    <img
                      src={imageUrls.profile(person.profile_path)}
                      alt={person.name}
                      className="w-full h-auto aspect-[2/3] object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full aspect-[2/3] bg-gray-700 flex items-center justify-center">
                      <span className="text-sm text-gray-400">No image</span>
                    </div>
                  )}
                  <div className="p-3 sm:p-4">
                    <p className="font-bold text-base sm:text-lg truncate">{person.name}</p>
                    <p className="text-xs sm:text-sm opacity-75 truncate">{person.character}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Similar Movies Section */}
          {similarMovies && similarMovies.results.length > 0 && (
            <section className="animate-fade-in">
              <MovieSlider 
                title="Similar Movies"
                movies={similarMovies.results}
                isDarkMode={isDarkMode}
              />
            </section>
          )}
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailer && trailer && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-5xl">
            {/* Close button */}
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute -top-12 right-0 p-2 text-white hover:text-gray-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Video Container */}
            <div className="relative pt-[56.25%]">
              <iframe
                className="absolute inset-0 w-full h-full rounded-xl"
                src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* Actor Modal */}
      {selectedActor && (
        <ActorModal
          actorId={selectedActor.id}
          name={selectedActor.name}
          onClose={() => setSelectedActor(null)}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  )
}

export default MovieDetailsPage

const getGenreIcon = (genreName: string): string => {
  const icons: { [key: string]: string } = {
    'Action': '💥',
    'Adventure': '🗺️',
    'Animation': '🎨',
    'Comedy': '😂',
    'Crime': '🚔',
    'Documentary': '📹',
    'Drama': '🎭',
    'Family': '👨‍👩‍👧‍👦',
    'Fantasy': '🐉',
    'History': '📚',
    'Horror': '👻',
    'Music': '🎵',
    'Mystery': '🔍',
    'Romance': '❤️',
    'Science Fiction': '🚀',
    'TV Movie': '📺',
    'Thriller': '😱',
    'War': '⚔️',
    'Western': '🤠'
  }
  
  return icons[genreName] || '🎬' // Default icon if genre not found
}






