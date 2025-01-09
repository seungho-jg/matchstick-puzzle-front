import { Outlet, Navigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

export default function AdminLayout() {
  const { user } = useAuthStore();

  // 관리자가 아닌 경우 홈으로 리다이렉트
  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-6 sm:px-0">
        <Outlet />
      </div>
    </div>
  );
}