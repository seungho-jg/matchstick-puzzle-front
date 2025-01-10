import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Router from './routes/index'
import "./index.css"
import { Toaster } from 'react-hot-toast'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5분
      gcTime: 60 * 60 * 1000, // 1시간
      retry: 2, // 2번 재시도
      refetchOnWindowFocus: false, // 페이지 이동 시 데이터 재요청 방지
    }
  },
})

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            theme: {
              primary: '#4aed88',
            },
          },
          error: {
            duration: 4000,
          },
        }}
      />
      <Router />
    </QueryClientProvider>
  </React.StrictMode>
)