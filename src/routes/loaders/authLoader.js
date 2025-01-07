import { redirect } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { jwtDecode } from "jwt-decode";

const validateAndDecodeToken = async () => {
  const token = useAuthStore.getState().token;
  if (!token) {
    return null;
  }

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    
    if (decoded.exp < currentTime) {  
      useAuthStore.getState().clearAuth();
      return null;
    }

    // 토큰이 유효하면 사용자 정보 업데이트
    useAuthStore.getState().setUserInfo({
      id: decoded.sub,
      email: decoded.email,
      username: decoded.username,
      role: decoded.role,
      puzzleCreateCount: decoded.puzzleCreateCount
    });

    return decoded;
  } catch (error) {
    useAuthStore.getState().clearAuth();
    return null;
  }
};

export async function authLoader() {
  const decoded = await validateAndDecodeToken();
  if (!decoded) {
    return redirect("/login");
  }
  return decoded;
}