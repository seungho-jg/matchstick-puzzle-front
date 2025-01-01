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

// 로딩 컴포넌트 생성
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-lg">로딩중...</div>
  </div>
);

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
      // 기본
      {
        path: "puzzle",
        element: <PuzzleLayout />,
        children: [
          {
            index: true,
            element: <Home /> // 임시
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