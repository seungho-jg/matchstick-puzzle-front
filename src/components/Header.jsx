import { Link } from "react-router-dom"
import { useState } from "react"
import useAuthStore from "../store/authStore"

export default function Header() {
  const token = useAuthStore((state) => state.token); // 토큰 상태 가져오기
  const clearToken = useAuthStore((state) => state.clearToken); // 로그아웃 함수

  const [dark, setDark] = useState(false)

  const darkModeHandler = () => {
    setDark(!dark);
    document.body.classList.toggle("dark")
  }

  const handleLogout = () => {
    clearToken(); // 토큰 초기화
    alert("로그아웃 되었습니다.");
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
            {/* <div>
              <button onClick={() => darkModeHandler()}>
                {dark ? "☀︎" : "☾"}
              </button>
            </div> */}
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              퍼즐 목록
            </Link>
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              랭킹
            </Link>
            {token ? (
              <div className="flex flex-col">
                <Link
                  to="/account/profile"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  마이페이지
                </Link>
                {/* <button
                  onClick={handleLogout}
                  className="relative scale-75 -mt-3 right-0 text-white bg-orange-300 px-1 py-1 rounded-md text-xs font-medium"
                >
                  로그아웃
                </button> */}
              </div>
            ) : (
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
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