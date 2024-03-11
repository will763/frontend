import { ChakraProvider } from '@chakra-ui/react'
import { AuthProvider } from './contexts/Auth/AuthProvider'
import { AppRoutes } from './routes/routes'
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'

const queryClient = new QueryClient()

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ChakraProvider>
          <AppRoutes />
        </ChakraProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
