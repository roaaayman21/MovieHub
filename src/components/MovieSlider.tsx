import { useState } from 'react'
import { Movie, imageUrls } from '../services/tmdb'
import { Link } from 'react-router-dom'

interface MovieSliderProps {
  title: string
  movies: Movie[]
  isDarkMode: boolean
}

function MovieSlider({ title, movies, isDarkMode }: MovieSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsPerPage = 4

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - itemsPerPage))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(movies.length - itemsPerPage, prev + itemsPerPage))
  }

  const showPrevious = currentIndex > 0
  const showNext = currentIndex + itemsPerPage < movies.length

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold">{title}</h2>
      
      <div className="relative group">
        {/* Previous Button */}
        {showPrevious && (
          <button
            onClick={handlePrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 p-2 rounded-full bg-black/50 hover:bg-black/75 transition-colors z-10 opacity-0 group-hover:opacity-100"
            aria-label="Previous movies"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Movie Cards */}
        <div className="flex gap-6 overflow-hidden">
          {movies.slice(currentIndex, currentIndex + itemsPerPage).map((movie) => (
            <Link 
              to={`/movie/${movie.id}`} 
              key={movie.id} 
              className="flex-none w-1/4"
            >
              <div className={`
                rounded-xl overflow-hidden shadow-lg 
                ${isDarkMode ? 'bg-gray-800' : 'bg-white'}
                transform hover:scale-105 transition-all duration-300
                hover:shadow-2xl
              `}>
                <div className="aspect-[2/3] relative overflow-hidden">
                  <img
                    src={imageUrls.poster(movie.poster_path)}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg truncate">{movie.title}</h3>
                  <div className="flex items-center mt-2">
                    <span className="text-yellow-400">★</span>
                    <span className="ml-1">{movie.vote_average.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Next Button */}
        {showNext && (
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 p-2 rounded-full bg-black/50 hover:bg-black/75 transition-colors z-10 opacity-0 group-hover:opacity-100"
            aria-label="Next movies"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

export default MovieSlider


