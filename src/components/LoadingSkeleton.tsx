import { useThemeStore } from '../store/themeStore'

interface LoadingSkeletonProps {
  type?: 'hero' | 'movieGrid' | 'movieSlider' | 'movieCard' | 'stats'
  count?: number
}

function LoadingSkeleton({ type = 'movieCard', count = 1 }: LoadingSkeletonProps) {
  const { isDarkMode } = useThemeStore()
  
  const skeletonClass = `animate-pulse ${
    isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
  }`

  const containerClass = `${
    isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
  }`

  if (type === 'hero') {
    return (
      <div className={`min-h-screen ${containerClass} flex items-center justify-center`}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            {/* Title skeleton */}
            <div className="space-y-4 mb-8">
              <div className={`h-4 ${skeletonClass} rounded w-48`}></div>
              <div className={`h-12 ${skeletonClass} rounded w-96`}></div>
              <div className={`h-12 ${skeletonClass} rounded w-80`}></div>
              <div className={`h-6 ${skeletonClass} rounded w-64`}></div>
            </div>
            
            {/* Stats skeleton */}
            <div className="flex gap-6 mb-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={`w-8 h-8 ${skeletonClass} rounded`}></div>
                  <div className={`h-4 ${skeletonClass} rounded w-20`}></div>
                </div>
              ))}
            </div>
            
            {/* Buttons skeleton */}
            <div className="flex gap-4 mb-8">
              <div className={`h-12 ${skeletonClass} rounded-xl w-40`}></div>
              <div className={`h-12 ${skeletonClass} rounded-xl w-40`}></div>
            </div>
            
            {/* Featured movie info skeleton */}
            <div className={`${containerClass} rounded-2xl p-6 max-w-md`}>
              <div className="flex items-center gap-4 mb-3">
                <div className={`h-6 ${skeletonClass} rounded-full w-20`}></div>
                <div className={`h-6 ${skeletonClass} rounded w-16`}></div>
              </div>
              <div className={`h-6 ${skeletonClass} rounded w-48 mb-2`}></div>
              <div className={`h-4 ${skeletonClass} rounded w-full mb-1`}></div>
              <div className={`h-4 ${skeletonClass} rounded w-3/4`}></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (type === 'movieGrid') {
    return (
      <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 gap-3 sm:gap-4 md:gap-6">
        {Array.from({ length: count }).map((_, index) => (
          <MovieCardSkeleton key={index} isDarkMode={isDarkMode} />
        ))}
      </div>
    )
  }

  if (type === 'movieSlider') {
    return (
      <div className="space-y-4">
        <div className={`h-8 ${skeletonClass} rounded w-48 mb-4`}></div>
        <div className="flex gap-3 sm:gap-4 md:gap-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex-none w-[calc(20%-15px)]">
              <MovieCardSkeleton isDarkMode={isDarkMode} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (type === 'stats') {
    return (
      <div className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          {/* Header skeleton */}
          <div className="text-center mb-12">
            <div className={`h-10 ${skeletonClass} rounded w-64 mx-auto mb-4`}></div>
            <div className={`h-6 ${skeletonClass} rounded w-96 mx-auto`}></div>
          </div>

          {/* Stats grid skeleton */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className={`${containerClass} rounded-2xl p-4 sm:p-6 border ${
                  isDarkMode ? 'border-gray-700' : 'border-gray-200'
                }`}
              >
                <div className="text-center">
                  <div className={`w-12 h-12 ${skeletonClass} rounded mx-auto mb-2`}></div>
                  <div className={`h-8 ${skeletonClass} rounded w-16 mx-auto mb-1`}></div>
                  <div className={`h-4 ${skeletonClass} rounded w-20 mx-auto`}></div>
                </div>
              </div>
            ))}
          </div>

          {/* Engagement and genres skeleton */}
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            <div className={`${containerClass} rounded-2xl p-6 sm:p-8 border ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="text-center">
                <div className={`h-6 ${skeletonClass} rounded w-48 mx-auto mb-4`}></div>
                <div className={`w-32 h-32 ${skeletonClass} rounded-full mx-auto mb-4`}></div>
                <div className={`h-4 ${skeletonClass} rounded w-56 mx-auto`}></div>
              </div>
            </div>
            
            <div className={`${containerClass} rounded-2xl p-6 sm:p-8 border ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className={`h-6 ${skeletonClass} rounded w-40 mb-6`}></div>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className={`h-4 ${skeletonClass} rounded w-24`}></div>
                      <div className={`h-4 ${skeletonClass} rounded w-16`}></div>
                    </div>
                    <div className={`h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full`}>
                      <div className={`h-2 ${skeletonClass} rounded-full w-3/4`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Default movie card skeleton
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, index) => (
        <MovieCardSkeleton key={index} isDarkMode={isDarkMode} />
      ))}
    </div>
  )
}

function MovieCardSkeleton({ isDarkMode }: { isDarkMode: boolean }) {
  const skeletonClass = `animate-pulse ${
    isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
  }`
  
  const containerClass = `${
    isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
  }`

  return (
    <div className={`${containerClass} rounded-xl overflow-hidden shadow-lg`}>
      <div className={`w-full aspect-[2/3] ${skeletonClass}`}></div>
      <div className="p-2 sm:p-3">
        <div className={`h-4 ${skeletonClass} rounded w-full mb-2`}></div>
        <div className={`h-3 ${skeletonClass} rounded w-3/4 mb-1`}></div>
        <div className={`h-3 ${skeletonClass} rounded w-1/2`}></div>
      </div>
    </div>
  )
}

export default LoadingSkeleton
