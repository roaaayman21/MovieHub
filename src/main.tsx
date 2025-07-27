import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import ErrorBoundary from './components/ErrorBoundary'
import './index.css'
import App from './App'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache for 15 minutes by default
      staleTime: 1000 * 60 * 15,
      // Keep in memory for 1 hour
      gcTime: 1000 * 60 * 60,
      // Don't refetch on window focus (better UX)
      refetchOnWindowFocus: false,
      // Refetch when reconnecting to internet
      refetchOnReconnect: true,
      // Refetch on mount only if data is stale
      refetchOnMount: true,
      // Smart retry logic
      retry: (failureCount, error: unknown) => {
        // Don't retry on 4xx client errors
        const errorWithResponse = error as { response?: { status?: number } }
        if (errorWithResponse?.response?.status &&
            errorWithResponse.response.status >= 400 &&
            errorWithResponse.response.status < 500) {
          return false
        }
        // Don't retry more than 3 times
        if (failureCount >= 3) {
          return false
        }
        // Retry on network errors and 5xx server errors
        return true
      },
      // Exponential backoff with jitter
      retryDelay: (attemptIndex) => {
        const baseDelay = Math.min(1000 * 2 ** attemptIndex, 30000)
        // Add jitter to prevent thundering herd
        const jitter = Math.random() * 0.1 * baseDelay
        return baseDelay + jitter
      },
      // Network mode for better offline handling
      networkMode: 'online',
    },
    mutations: {
      // Retry mutations once on failure
      retry: 1,
      retryDelay: 1000,
      // Network mode for mutations
      networkMode: 'online',
    },
  },
})

// Add global error handlers after creating the client
queryClient.getQueryCache().subscribe((event) => {
  if (event.query?.state.error) {
    console.error('Query error:', event.query.state.error)
    // You could add toast notifications here
  }
})

queryClient.getMutationCache().subscribe((event) => {
  if (event.mutation?.state.error) {
    console.error('Mutation error:', event.mutation.state.error)
    // You could add toast notifications here
  }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <App />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
)


