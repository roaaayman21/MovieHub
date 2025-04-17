import { Link, Outlet, useLocation } from 'react-router-dom'
import { useThemeStore } from '../store/themeStore'
import { useState } from 'react'

function Layout() {
  const { isDarkMode, toggleTheme } = useThemeStore()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <nav className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md py-4 sticky top-0 z-50`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="text-2xl font-bold">
              MovieDB
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="sm:hidden p-2"
              aria-label="Menu"
            >
              <div className="w-6 flex flex-col gap-1">
                <span className={`block h-0.5 w-full ${isDarkMode ? 'bg-white' : 'bg-black'} transition-transform duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                <span className={`block h-0.5 w-full ${isDarkMode ? 'bg-white' : 'bg-black'} transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`block h-0.5 w-full ${isDarkMode ? 'bg-white' : 'bg-black'} transition-transform duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
              </div>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden sm:flex items-center space-x-6">
              <div className="flex space-x-4">
                <Link 
                  to="/" 
                  className={`hover:text-gray-300 ${location.pathname === '/' ? 'text-blue-500' : ''}`}
                >
                  Home
                </Link>
                <Link 
                  to="/search" 
                  className={`hover:text-gray-300 ${location.pathname === '/search' ? 'text-blue-500' : ''}`}
                >
                  Search
                </Link>
                <Link 
                  to="/lists" 
                  className={`hover:text-gray-300 ${location.pathname === '/lists' ? 'text-blue-500' : ''}`}
                >
                  My Lists
                </Link>
              </div>
              <button
                onClick={toggleTheme}
                className="p-2"
                aria-label="Toggle theme"
              >
                {isDarkMode ? '🌞' : '🌙'}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div
            className={`
              sm:hidden 
              overflow-hidden 
              transition-[max-height] duration-300 ease-in-out
              ${isMenuOpen ? 'max-h-48' : 'max-h-0'}
            `}
          >
            <div className="pt-4 pb-2 space-y-2">
              <Link
                to="/"
                className={`block py-2 ${location.pathname === '/' ? 'text-blue-500' : ''}`}
                onClick={closeMenu}
              >
                Home
              </Link>
              <Link
                to="/search"
                className={`block py-2 ${location.pathname === '/search' ? 'text-blue-500' : ''}`}
                onClick={closeMenu}
              >
                Search
              </Link>
              <Link
                to="/lists"
                className={`block py-2 ${location.pathname === '/lists' ? 'text-blue-500' : ''}`}
                onClick={closeMenu}
              >
                My Lists
              </Link>
              <button
                onClick={toggleTheme}
                className="w-full text-left py-2"
              >
                {isDarkMode ? 'Light Mode 🌞' : 'Dark Mode 🌙'}
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






