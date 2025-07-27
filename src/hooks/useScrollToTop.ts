import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Custom hook to scroll to top when route changes
 * This ensures pages start from the top instead of maintaining scroll position
 */
export function useScrollToTop() {
  const location = useLocation()

  useEffect(() => {
    // Scroll to top with smooth behavior
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    })
  }, [location.pathname])
}

/**
 * Hook to scroll to top immediately (without smooth behavior)
 * Useful for immediate scroll on component mount
 */
export function useScrollToTopImmediate(dependency?: any) {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [dependency])
}
