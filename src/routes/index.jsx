import { createBrowserRouter, RouterProvider } from 'react-router-dom'

// 페이지 및 레이아웃 컴포넌트 import
import Root from './layouts/root'
import Home from './pages/home'
import ErrorPage from './pages/error'
import PuzzleDetail from './pages/puzzle-detail'
import Profile from './pages/profile'
import PuzzleLayout from './layouts/puzzleLayout'
import AuthLayout from './layouts/authLayout'
import NotFound from './pages/notfound'
import RegisterPage from './pages/register'
import LoginPage from './pages/login'
import { authLoader } from './loaders/authLoader'
import LeaderboardPage from './pages/leaderboard'
import CreatePuzzleCanvas from '../components/CreatePuzzleCanvas'
import PuzzleListPage from './pages/puzzleList'
import SupportPage from './pages/support'
import LoadingFallback from '../components/LoadingFallback'
import AdminDashboard from './pages/admin-dashboard'
import { adminLoader } from './loaders/adminLoader'
import AdminUsers from './pages/admin-users'
import AdminLayout from './layouts/AdminLayout'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: "register",
        element: <RegisterPage />
      },
      {
        path: "login",
        element: <LoginPage />
      },
      {
        path: "leaderboard",
        element: <LeaderboardPage />
      },
      {
        path: "support",
        element: <SupportPage />
      },
      // 기본
      {
        path: "puzzle",
        element: <PuzzleLayout />,
        children: [
          {
            index: true,
            element: <PuzzleListPage /> 
          },
          {
            path: ":puzzleId",
            element: <PuzzleDetail />
          }
        ]
      },
      // 인증 필요한 라우터 관리
      {
        path: "account",
        element: <AuthLayout />,
        errorElement: <ErrorPage />,
        loader: authLoader,
        children: [
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "create",
            element: <CreatePuzzleCanvas />
          }
        ]
      },
      {
        path: "admin",
        element: <AdminLayout />,
        errorElement: <ErrorPage />,
        loader: adminLoader,
        children: [
          {
            index: true,
            element: <AdminDashboard />
          },
          {
            path: "users",
            element: <AdminUsers />
          }
        ]
      },
      // 404 페이지
      {
        path: "*",
        element: <NotFound />
      }
    ]
  }
],
)


export default function Router() {
  return <RouterProvider 
    router={router}
    fallbackElement={<LoadingFallback />}
  />
}