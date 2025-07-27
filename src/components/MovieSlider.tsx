import { useState, useEffect } from 'react'
import { Movie, imageUrls } from '../services/tmdb'
import { Link } from 'react-router-dom'

interface MovieSliderProps {
  title: string
  movies: Movie[]
  isDarkMode: boolean
}

function MovieSlider({ title, movies, isDarkMode }: MovieSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(4)

  // Responsive items per page
  useEffect(() => {
    const updateItemsPerPage = () => {
      const width = window.innerWidth
      if (width < 640) { // sm
        setItemsPerPage(2)
      } else if (width < 768) { // md
        setItemsPerPage(3)
      } else if (width < 1024) { // lg
        setItemsPerPage(4)
      } else {
        setItemsPerPage(5)
      }
    }

    updateItemsPerPage()
    window.addEventListener('resize', updateItemsPerPage)
    return () => window.removeEventListener('resize', updateItemsPerPage)
  }, [])

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
      <div className="flex items-center justify-between">
        <h2 className="text-2xl sm:text-3xl font-bold">{title}</h2>

        {/* Mobile Navigation Dots */}
        <div className="flex sm:hidden items-center gap-2">
          {Array.from({ length: Math.ceil(movies.length / itemsPerPage) }).map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentIndex(index * itemsPerPage)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                Math.floor(currentIndex / itemsPerPage) === index
                  ? 'bg-blue-500 w-4'
                  : isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
              }`}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="relative group">
        {/* Previous Button - Hidden on mobile, visible on hover for desktop */}
        {showPrevious && (
          <button
            type="button"
            onClick={handlePrevious}
            className="hidden sm:block absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 p-3 rounded-full bg-black/50 hover:bg-black/75 transition-all duration-200 z-10 opacity-0 group-hover:opacity-100 backdrop-blur-sm"
            aria-label="Previous movies"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Movie Cards */}
        <div className="flex gap-3 sm:gap-4 md:gap-6 overflow-hidden">
          {movies.slice(currentIndex, currentIndex + itemsPerPage).map((movie) => (
            <Link
              to={`/movie/${movie.id}`}
              key={movie.id}
              className={`flex-none ${
                itemsPerPage === 2 ? 'w-[calc(50%-6px)]' :
                itemsPerPage === 3 ? 'w-[calc(33.333%-8px)]' :
                itemsPerPage === 4 ? 'w-[calc(25%-12px)]' :
                'w-[calc(20%-15px)]'
              }`}
            >
              <div className={`
                rounded-xl overflow-hidden shadow-lg
                ${isDarkMode ? 'bg-gray-800' : 'bg-white'}
                transform hover:scale-105 active:scale-95 transition-all duration-300
                hover:shadow-2xl
              `}>
                <div className="aspect-[2/3] relative overflow-hidden">
                  {movie.poster_path ? (
                    <img
                      src={imageUrls.poster(movie.poster_path)}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">No Image</span>
                    </div>
                  )}
                </div>
                <div className="p-2 sm:p-3 md:p-4">
                  <h3 className="font-bold text-sm sm:text-base md:text-lg truncate">{movie.title}</h3>
                  <div className="flex items-center mt-1 sm:mt-2">
                    <span className="text-yellow-400 text-sm sm:text-base">★</span>
                    <span className="ml-1 text-xs sm:text-sm">{movie.vote_average.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Next Button - Hidden on mobile, visible on hover for desktop */}
        {showNext && (
          <button
            type="button"
            onClick={handleNext}
            className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 p-3 rounded-full bg-black/50 hover:bg-black/75 transition-all duration-200 z-10 opacity-0 group-hover:opacity-100 backdrop-blur-sm"
            aria-label="Next movies"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* Mobile Navigation Buttons */}
      <div className="flex sm:hidden justify-center gap-4 mt-4">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={!showPrevious}
          className={`px-4 py-2 rounded-lg transition-all duration-200 ${
            showPrevious
              ? isDarkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              : 'bg-gray-500 text-gray-400 cursor-not-allowed'
          }`}
          aria-label="Previous movies"
        >
          ← Previous
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!showNext}
          className={`px-4 py-2 rounded-lg transition-all duration-200 ${
            showNext
              ? isDarkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              : 'bg-gray-500 text-gray-400 cursor-not-allowed'
          }`}
          aria-label="Next movies"
        >
          Next →
        </button>
      </div>
    </div>
  )
}

export default MovieSlider


