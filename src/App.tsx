
import './App.css'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'
import MovieDetailsPage from './pages/MovieDetailsPage'
import ListsPage from './pages/ListsPage'

function AppContent() {
  const navigate = useNavigate();

  useEffect(() => {
    // Handle redirect from 404.html for GitHub Pages SPA routing
    const redirectData = sessionStorage.getItem('spa-redirect');
    if (redirectData) {
      try {
        const { pathname, search, hash } = JSON.parse(redirectData);
        sessionStorage.removeItem('spa-redirect');

        // Navigate to the intended route
        if (pathname && pathname !== '/') {
          const fullPath = pathname + (search || '') + (hash || '');
          navigate(fullPath, { replace: true });
        }
      } catch (error) {
        console.error('Error parsing redirect data:', error);
        sessionStorage.removeItem('spa-redirect');
      }
    }

    // Also handle legacy redirectPath for backward compatibility
    const legacyRedirectPath = sessionStorage.getItem('redirectPath');
    if (legacyRedirectPath) {
      sessionStorage.removeItem('redirectPath');
      const cleanPath = legacyRedirectPath.replace('/MovieHub', '');
      if (cleanPath && cleanPath !== '/') {
        navigate(cleanPath, { replace: true });
      }
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="movie/:movieId" element={<MovieDetailsPage />} />
        <Route path="lists" element={<ListsPage />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    // Change BrowserRouter to handle the base URL
    <BrowserRouter basename="/MovieHub">
      <AppContent />
    </BrowserRouter>
  )
}

export default App