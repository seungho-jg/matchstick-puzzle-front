import { Link } from "react-router-dom";
import { useState } from "react";

export default function Header() {
  const [dark, setDark] = useState(false)

  const darkModeHandler = () => {
    setDark(!dark);
    document.body.classList.toggle("dark")
  }

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
              Matchstick
              Puzzle
            </span>
          </Link>
          
          <nav className="flex items-center space-x-4">
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
            <Link
              to="/account/profile"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              로그인
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}