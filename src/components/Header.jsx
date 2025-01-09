import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import useAuthStore from "../store/authStore"
import { getPuzzleCreateCount } from "../api/api-user"

export default function Header() {
  const token = useAuthStore((state) => state.token)
  const clearToken = useAuthStore((state) => state.clearToken)
  const isAdmin = useAuthStore((state) => state.isAdmin())
  const [dark, setDark] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const puzzleCreateCount = useAuthStore((state) => state.puzzleCreateCount);
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
            <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white hidden md:block">
              Matchstick Puzzle
            </span>
            <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white md:hidden">
              Puzzle
            </span>
          </Link>
          
          <nav className="flex items-center gap-3">
            <Link
              to="/puzzle"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium dark:text-gray-300 dark:hover:text-white"
            >
              검색
            </Link>
            <Link
              to="/leaderboard"
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
                  <svg 
                    className={`w-4 h-4 ml-1 transition-transform duration-200 ${
                      isProfileMenuOpen ? 'transform rotate-180' : ''
                    }`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M19 9l-7 7-7-7" 
                    />
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
                      <div className="flex flex-row items-center">
                        <Link
                          to="/account/create"
                          className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-slate-600"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                        퍼즐 만들기
                        </Link>
                        <div className="absolute right-2 text-xs font-bold text-gray-500 px-2 rounded-full bg-yellow-100 p-1">
                          {puzzleCreateCount || 0} left
                        </div>
                      </div>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-slate-600"
                        >
                          관리
                        </Link>
                      )}
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