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




