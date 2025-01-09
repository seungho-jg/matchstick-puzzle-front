import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <Link to="/admin/users" className="text-blue-500 hover:text-blue-700">사용자 관리</Link>
    </div>
  );
}
