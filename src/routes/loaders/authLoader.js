import { redirect } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { jwtDecode } from "jwt-decode";

const getUserToken = async () => {
  const token = useAuthStore.getState().token;
  if (!token) {
    return redirect("/login");
  }
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    
    if (decoded.exp < currentTime) {  
      useAuthStore.getState().clearToken();
      throw redirect("/login");
    }
    return { username: decoded.username };
  } catch (error) {
    return redirect("/login");
  }
};

export async function authLoader() {
  const user = await getUserToken();
  if (!user) {
    console.log("user is null");
    return redirect("/login");
  }
  return user;
}