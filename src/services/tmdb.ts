import axios from 'axios'

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'

export interface Movie {
  id: number
  title: string
  poster_path: string
  backdrop_path: string
  overview: string
  release_date: string
  vote_average: number
  genre_ids: number[]
}

interface TMDBResponse {
  results: Movie[]
  page: number
  total_pages: number
  total_results: number
}

interface Cast {
  id: number
  name: string
  character: string
  profile_path: string | null
}

interface Crew {
  id: number
  name: string
  job: string
  profile_path: string | null
}

interface MovieDetails extends Movie {
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
    cast: Cast[]
    crew: Crew[]
  }
}

export const imageUrls = {
  poster: (path: string) => `${IMAGE_BASE_URL}/w500${path}`,
  backdrop: (path: string) => `${IMAGE_BASE_URL}/original${path}`,
  profile: (path: string) => `${IMAGE_BASE_URL}/w185${path}`,
}

const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
    language: 'en-US',
  },
})

export const getNowPlaying = async () => {
  const response = await tmdbApi.get<TMDBResponse>('/movie/now_playing')
  return response.data
}

export const getTopRated = async () => {
  const response = await tmdbApi.get<TMDBResponse>('/movie/top_rated')
  return response.data
}

export const getUpcoming = async () => {
  const response = await tmdbApi.get<TMDBResponse>('/movie/upcoming')
  return response.data
}

export const searchMovies = async (query: string) => {
  const response = await tmdbApi.get<TMDBResponse>('/search/movie', {
    params: {
      query,
    },
  })
  return response.data
}

export const getMovieDetails = async (movieId: string): Promise<MovieDetails> => {
  const response = await tmdbApi.get<MovieDetails>(`/movie/${movieId}`, {
    params: {
      append_to_response: 'videos,credits'
    }
  })
  return response.data
}

export const getGenres = async () => {
  const response = await fetch(
    `${BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`
  )
  return response.json()
}

export const getSimilarMovies = async (movieId: string) => {
  const response = await tmdbApi.get<TMDBResponse>(`/movie/${movieId}/similar`)
  return response.data
}

export const getTrending = async (timeWindow: 'day' | 'week' = 'week') => {
  const response = await tmdbApi.get<TMDBResponse>(`/trending/movie/${timeWindow}`)
  return response.data
}

export const getPopular = async () => {
  const response = await tmdbApi.get<TMDBResponse>('/movie/popular')
  return response.data
}

// Get movies currently in theaters (different from now_playing)
export const getInTheaters = async () => {
  const response = await tmdbApi.get<TMDBResponse>('/discover/movie', {
    params: {
      'primary_release_date.gte': new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Last 30 days
      'primary_release_date.lte': new Date().toISOString().split('T')[0], // Today
      sort_by: 'popularity.desc',
      page: 1
    }
  })
  return response.data
}

// Get highly rated recent movies
export const getHighlyRated = async () => {
  const response = await tmdbApi.get<TMDBResponse>('/discover/movie', {
    params: {
      'primary_release_date.gte': new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Last year
      'vote_average.gte': 7.5,
      'vote_count.gte': 100,
      sort_by: 'vote_average.desc',
      page: 1
    }
  })
  return response.data
}

// Get action movies specifically
export const getActionMovies = async () => {
  const response = await tmdbApi.get<TMDBResponse>('/discover/movie', {
    params: {
      with_genres: 28, // Action genre ID
      sort_by: 'popularity.desc',
      'vote_average.gte': 6.0,
      page: 1
    }
  })
  return response.data
}

// Get movies with high revenue (blockbusters)
export const getBlockbusters = async () => {
  const response = await tmdbApi.get<TMDBResponse>('/discover/movie', {
    params: {
      sort_by: 'revenue.desc',
      'vote_average.gte': 6.0,
      'primary_release_date.gte': '2020-01-01',
      page: 1
    }
  })
  return response.data
}

// Get award-winning movies (high vote count + high rating)
export const getAwardWinners = async () => {
  const response = await tmdbApi.get<TMDBResponse>('/discover/movie', {
    params: {
      sort_by: 'vote_count.desc',
      'vote_average.gte': 8.0,
      'vote_count.gte': 1000,
      page: 1
    }
  })
  return response.data
}

export const getMoviesByGenre = async (genreId: number, page: number = 1) => {
  const response = await tmdbApi.get<TMDBResponse>('/discover/movie', {
    params: {
      with_genres: genreId,
      page,
      sort_by: 'popularity.desc'
    }
  })
  return response.data
}

export const getMovieRecommendations = async (movieId: string) => {
  const response = await tmdbApi.get<TMDBResponse>(`/movie/${movieId}/recommendations`)
  return response.data
}

export const getMovieVideos = async (movieId: string) => {
  const response = await tmdbApi.get(`/movie/${movieId}/videos`)
  return response.data
}

export const getPersonDetails = async (personId: number) => {
  const response = await tmdbApi.get(`/person/${personId}`, {
    params: {
      append_to_response: 'movie_credits'
    }
  })
  return response.data
}

// Enhanced image URLs with different sizes
export const enhancedImageUrls = {
  poster: {
    small: (path: string) => `${IMAGE_BASE_URL}/w185${path}`,
    medium: (path: string) => `${IMAGE_BASE_URL}/w342${path}`,
    large: (path: string) => `${IMAGE_BASE_URL}/w500${path}`,
    xlarge: (path: string) => `${IMAGE_BASE_URL}/w780${path}`,
  },
  backdrop: {
    small: (path: string) => `${IMAGE_BASE_URL}/w300${path}`,
    medium: (path: string) => `${IMAGE_BASE_URL}/w780${path}`,
    large: (path: string) => `${IMAGE_BASE_URL}/w1280${path}`,
    original: (path: string) => `${IMAGE_BASE_URL}/original${path}`,
  },
  profile: {
    small: (path: string) => `${IMAGE_BASE_URL}/w45${path}`,
    medium: (path: string) => `${IMAGE_BASE_URL}/w185${path}`,
    large: (path: string) => `${IMAGE_BASE_URL}/h632${path}`,
  }
}




