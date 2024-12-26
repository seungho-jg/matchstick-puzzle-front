import {jwtDecode} from "jwt-decode";
import useAuthStore from "../../store/authStore";
import { Link } from "react-router-dom";

export default function Profile() {
  const token = useAuthStore((state) => state.token); // 토큰 상태 가져오기
  const clearToken = useAuthStore((state) => state.clearToken); // 로그아웃 함수
  const decodedToken = token ? jwtDecode(token) : null; // 토큰 디코딩
  const username = decodedToken?.username; // 디코딩된 토큰에서 username 추출

  const handleLogout = () => {
    clearToken(); // 토큰 초기화
    alert("로그아웃 되었습니다.");
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-row gap-3 items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          {username || "알 수 없음"}
        </h1>
        <Link to="/">
        <button
          onClick={handleLogout}
          className=" right-0 text-white bg-orange-600 px-1 py-1 rounded-md text-xs font-medium"
        >
          로그아웃
        </button>
        </Link>
        </div>
    </div>
  );
}