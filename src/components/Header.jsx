import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center">
            <img
              src="/logo2.webp"
              alt="Matchstick Puzzle"
              className="h-8 w-auto"
            />
            <span className="ml-2 text-xl font-bold text-gray-900">
              Matchstick Puzzle
            </span>
          </Link>
          
          <nav className="flex items-center space-x-4">
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              퍼즐 목록
            </Link>
            <Link
              to="/profile"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              프로필
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}