import useAuthStore from "../../store/authStore";

export async function adminLoader() {
  const isAdmin = useAuthStore.getState().isAdmin()
  if (!isAdmin) {
    throw new Error('관리자 권한이 필요합니다');
  }
  return null;
}