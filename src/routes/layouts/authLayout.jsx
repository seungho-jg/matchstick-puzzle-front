import { Outlet, useLoaderData } from 'react-router-dom';

export default function AuthLayout() {
  const loaderData = useLoaderData()
  return (
    <div className="container mx-auto px-4 py-8">
      <Outlet context={loaderData} />
    </div>
  );
}