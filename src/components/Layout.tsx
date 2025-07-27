import { Link, Outlet, useLocation } from 'react-router-dom'
import { useThemeStore } from '../store/themeStore'
import { useState, useEffect } from 'react'
import { useScrollToTop } from '../hooks/useScrollToTop'

function Layout() {
  const { isDarkMode, toggleTheme } = useThemeStore()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  // Scroll to top on route changes
  useScrollToTop()

  const closeMenu = () => setIsMenuOpen(false)

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('menu-open')
    } else {
      document.body.classList.remove('menu-open')
    }
    return () => document.body.classList.remove('menu-open')
  }, [isMenuOpen])

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <nav className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md py-3 sm:py-4 sticky top-0 z-50`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <span className="text-2xl">🎬</span>
              <span className="hidden xs:inline">MovieDB</span>
              <span className="xs:hidden">Movie</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="sm:hidden p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Menu"
            >
              <div className="w-6 flex flex-col gap-1.5">
                <span className={`block h-0.5 w-full ${isDarkMode ? 'bg-white' : 'bg-black'} transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                <span className={`block h-0.5 w-full ${isDarkMode ? 'bg-white' : 'bg-black'} transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`block h-0.5 w-full ${isDarkMode ? 'bg-white' : 'bg-black'} transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
              </div>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden sm:flex items-center space-x-6">
              <div className="flex space-x-1">
                <Link
                  to="/"
                  className={`nav-link px-4 py-2 rounded-lg transition-all duration-200 ${
                    location.pathname === '/'
                      ? 'bg-blue-500 text-white'
                      : isDarkMode
                        ? 'hover:bg-gray-700 text-gray-300'
                        : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  🏠 Home
                </Link>
                <Link
                  to="/search"
                  className={`nav-link px-4 py-2 rounded-lg transition-all duration-200 ${
                    location.pathname === '/search'
                      ? 'bg-blue-500 text-white'
                      : isDarkMode
                        ? 'hover:bg-gray-700 text-gray-300'
                        : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  🔍 Search
                </Link>
                <Link
                  to="/lists"
                  className={`nav-link px-4 py-2 rounded-lg transition-all duration-200 ${
                    location.pathname === '/lists'
                      ? 'bg-blue-500 text-white'
                      : isDarkMode
                        ? 'hover:bg-gray-700 text-gray-300'
                        : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  📝 My Lists
                </Link>
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                className={`p-3 rounded-lg transition-all duration-200 ${
                  isDarkMode
                    ? 'hover:bg-gray-700 text-gray-300'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
                aria-label="Toggle theme"
              >
                <span className="text-xl">{isDarkMode ? '🌞' : '🌙'}</span>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div
            className={`
              sm:hidden
              overflow-hidden
              transition-all duration-300 ease-in-out
              ${isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}
            `}
          >
            <div className="pt-4 pb-2 space-y-1">
              <Link
                to="/"
                className={`nav-link flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  location.pathname === '/'
                    ? 'bg-blue-500 text-white'
                    : isDarkMode
                      ? 'hover:bg-gray-700 text-gray-300'
                      : 'hover:bg-gray-100 text-gray-700'
                }`}
                onClick={closeMenu}
              >
                <span className="text-lg">🏠</span>
                <span>Home</span>
              </Link>
              <Link
                to="/search"
                className={`nav-link flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  location.pathname === '/search'
                    ? 'bg-blue-500 text-white'
                    : isDarkMode
                      ? 'hover:bg-gray-700 text-gray-300'
                      : 'hover:bg-gray-100 text-gray-700'
                }`}
                onClick={closeMenu}
              >
                <span className="text-lg">🔍</span>
                <span>Search</span>
              </Link>
              <Link
                to="/lists"
                className={`nav-link flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  location.pathname === '/lists'
                    ? 'bg-blue-500 text-white'
                    : isDarkMode
                      ? 'hover:bg-gray-700 text-gray-300'
                      : 'hover:bg-gray-100 text-gray-700'
                }`}
                onClick={closeMenu}
              >
                <span className="text-lg">📝</span>
                <span>My Lists</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  toggleTheme()
                  closeMenu()
                }}
                className={`nav-link w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isDarkMode
                    ? 'hover:bg-gray-700 text-gray-300'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <span className="text-lg">{isDarkMode ? '🌞' : '🌙'}</span>
                <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md py-4 mt-auto`}>
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 MovieDB By Roaa Ayman</p>
        </div>
      </footer>
    </div>
  )
}

export default Layout






