import { useState, useEffect } from 'react'
import { useThemeStore } from '../store/themeStore'

interface ScrollToTopButtonProps {
  /** Scroll threshold in pixels before button appears */
  threshold?: number
  /** Custom className for styling */
  className?: string
}

function ScrollToTopButton({ threshold = 300, className = '' }: ScrollToTopButtonProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const { isDarkMode } = useThemeStore()

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const documentHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight

      // Calculate scroll progress (0-100)
      const progress = documentHeight > 0 ? (scrollTop / documentHeight) * 100 : 0
      setScrollProgress(progress)

      // Show/hide button based on scroll position
      setIsVisible(scrollTop > threshold)

      // Add scrolling state for animation
      setIsScrolling(true)
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false)
      }, 150)
    }

    // Add scroll event listener with throttling for better performance
    let ticking = false
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', throttledHandleScroll, { passive: true })

    // Check initial scroll position
    handleScroll()

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [threshold])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Progress ring background */}
      <div className="relative">
        <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
          {/* Background circle */}
          <path
            className={isDarkMode ? "stroke-gray-600" : "stroke-gray-200"}
            strokeWidth="2.5"
            fill="transparent"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          {/* Progress circle with gradient effect */}
          <path
            className={isDarkMode ? "stroke-blue-400" : "stroke-blue-500"}
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="transparent"
            strokeDasharray={`${scrollProgress}, 100`}
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />

        </svg>

        {/* Button */}
        <button
          type="button"
          onClick={scrollToTop}
          className={`
            absolute inset-0
            w-12 h-12 rounded-full
            flex items-center justify-center
            transition-all duration-300 ease-in-out
            transform hover:scale-110 active:scale-95
            ${isScrolling ? 'scale-95' : 'scale-100'}
            ${isDarkMode
              ? 'bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white shadow-lg shadow-gray-900/50 border border-gray-600'
              : 'bg-gradient-to-br from-white to-gray-50 hover:from-gray-50 hover:to-gray-100 text-gray-700 shadow-lg shadow-gray-500/25 border border-gray-200'
            }
            ${className}
          `}
          aria-label={`Scroll to top (${Math.round(scrollProgress)}% scrolled)`}
          title={`Back to top (${Math.round(scrollProgress)}% scrolled)`}
        >
          <svg
            className={`w-5 h-5 transition-all duration-200 ${
              isDarkMode ? 'text-blue-400' : 'text-blue-500'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default ScrollToTopButton
