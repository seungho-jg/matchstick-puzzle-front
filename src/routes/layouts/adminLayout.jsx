import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
      <div className="container mx-auto py-5">
        <Outlet />
      </div>
  );
};