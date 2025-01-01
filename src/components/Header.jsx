import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import useAuthStore from "../store/authStore"

export default function Header() {
  const token = useAuthStore((state) => state.token)
  const clearToken = useAuthStore((state) => state.clearToken)
  const [dark, setDark] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const navigate = useNavigate()

  const darkModeHandler = () => {
    setDark(!dark)
    document.body.classList.toggle("dark");
  };

  const handleLogout = () => {
    clearToken()
    setIsProfileMenuOpen(false)
    alert("로그아웃 되었습니다.")
    navigate('/')
  };

  return (
    <header className="bg-white shadow-sm fixed w-full dark:bg-slate-800 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center">
            <img
              src="/logo2.webp"
              alt="Matchstick Puzzle"
              className="h-8 w-auto"
            />
            <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
              Matchstick Puzzle
            </span>
          </Link>
          
          <nav className="flex items-center gap-3">
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium dark:text-gray-300 dark:hover:text-white"
            >
              퍼즐 목록
            </Link>
            <Link
              to="/ranking"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium dark:text-gray-300 dark:hover:text-white"
            >
              랭킹
            </Link>
            
            {token ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium dark:text-gray-300 dark:hover:text-white"
                >
                  <span>프로필</span>
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-slate-700">
                    <div className="py-1">
                      <Link
                        to="/account/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-slate-600"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        마이페이지
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-slate-600"
                      >
                        로그아웃
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium dark:text-gray-300 dark:hover:text-white"
              >
                로그인
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}